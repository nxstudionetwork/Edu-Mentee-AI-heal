from fastapi import APIRouter, Depends, Query, Path, Body
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import User, Order, OrderItem, Cart, CartItem, Product, Coupon
from app.schemas import OrderCreate, OrderResponse
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/orders", tags=["Orders"])


@router.post("/checkout")
def checkout(
    data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create order from cart. Validate stock, calculate total, apply coupon, clear cart."""
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise BadRequestException(detail="Cart is empty")

    if not cart.items:
        raise BadRequestException(detail="Cart is empty")

    total_amount = 0.0
    order_items = []

    for cart_item in cart.items:
        product = db.query(Product).filter(Product.id == cart_item.product_id, Product.is_active == True).first()
        if not product:
            raise BadRequestException(detail=f"Product not found: {cart_item.product_id}")

        if product.stock < cart_item.quantity:
            raise BadRequestException(detail=f"Insufficient stock for {product.name}")

        price = product.discount_price if product.discount_price else product.price
        item_total = price * cart_item.quantity
        total_amount += item_total

        order_items.append({
            "product_id": product.id,
            "product_name": product.name,
            "quantity": cart_item.quantity,
            "unit_price": price,
            "total_price": item_total,
        })

        product.stock -= cart_item.quantity

    discount = cart.discount_amount or 0.0
    final_amount = max(total_amount - discount, 0)

    order = Order(
        uid=generate_id("ORD"),
        user_id=current_user.id,
        total_amount=total_amount,
        discount_amount=discount,
        final_amount=final_amount,
        coupon_code=cart.coupon_code,
        status="confirmed",
        shipping_address=data.shipping_address,
    )
    db.add(order)
    db.flush()

    for item_data in order_items:
        order_item = OrderItem(
            uid=generate_id("OITM"),
            order_id=order.id,
            product_id=item_data["product_id"],
            product_name=item_data["product_name"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            total_price=item_data["total_price"],
        )
        db.add(order_item)

    if cart.coupon_code:
        coupon = db.query(Coupon).filter(Coupon.code == cart.coupon_code).first()
        if coupon:
            coupon.used_count += 1

    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    cart.coupon_code = None
    cart.discount_amount = 0.0

    db.commit()
    db.refresh(order)

    return {
        "status": "success",
        "message": "Order placed successfully",
        "data": {
            "id": order.id,
            "uid": order.uid,
            "total_amount": order.total_amount,
            "discount_amount": order.discount_amount,
            "final_amount": order.final_amount,
            "status": order.status,
            "items": order_items,
            "created_at": order.created_at.isoformat() if order.created_at else None,
        },
    }


@router.get("/")
def list_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List user's orders."""
    query = db.query(Order).filter(Order.user_id == current_user.id)
    total = query.count()
    orders = query.order_by(Order.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Orders retrieved successfully",
        "data": [
            {
                "id": o.id,
                "uid": o.uid,
                "total_amount": o.total_amount,
                "discount_amount": o.discount_amount,
                "final_amount": o.final_amount,
                "status": o.status,
                "created_at": o.created_at.isoformat() if o.created_at else None,
            }
            for o in orders
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{order_id}")
def get_order(
    order_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get order detail with items."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id,
    ).first()
    if not order:
        raise NotFoundException(detail="Order not found")

    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()

    return {
        "status": "success",
        "message": "Order retrieved successfully",
        "data": {
            "id": order.id,
            "uid": order.uid,
            "total_amount": order.total_amount,
            "discount_amount": order.discount_amount,
            "final_amount": order.final_amount,
            "coupon_code": order.coupon_code,
            "status": order.status,
            "shipping_address": order.shipping_address,
            "tracking_number": order.tracking_number,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "items": [
                {
                    "id": i.id,
                    "uid": i.uid,
                    "product_name": i.product_name,
                    "quantity": i.quantity,
                    "unit_price": i.unit_price,
                    "total_price": i.total_price,
                }
                for i in items
            ],
        },
    }


@router.put("/{order_id}/cancel")
def cancel_order(
    order_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel an order."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id,
    ).first()
    if not order:
        raise NotFoundException(detail="Order not found")

    if order.status not in ("pending", "confirmed"):
        raise BadRequestException(detail="Cannot cancel order in current status")

    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    for item in items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.stock += item.quantity

    order.status = "cancelled"
    order.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Order cancelled successfully",
        "data": {
            "id": order.id,
            "uid": order.uid,
            "status": order.status,
        },
    }


@router.get("/{order_id}/track")
def track_order(
    order_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get order tracking timeline."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == current_user.id,
    ).first()
    if not order:
        raise NotFoundException(detail="Order not found")

    timeline = [
        {"status": "Order Placed", "timestamp": order.created_at.isoformat() if order.created_at else None, "completed": True},
        {"status": "Confirmed", "timestamp": order.created_at.isoformat() if order.created_at else None, "completed": order.status != "cancelled"},
        {"status": "Shipped", "timestamp": None, "completed": order.status in ("shipped", "delivered")},
        {"status": "Out for Delivery", "timestamp": None, "completed": order.status == "delivered"},
        {"status": "Delivered", "timestamp": None, "completed": order.status == "delivered"},
    ]

    return {
        "status": "success",
        "message": "Order tracking retrieved",
        "data": {
            "order_uid": order.uid,
            "status": order.status,
            "tracking_number": order.tracking_number,
            "timeline": timeline,
        },
    }
