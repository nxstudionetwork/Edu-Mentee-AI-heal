from fastapi import APIRouter, Depends, Path, Body
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import User, Cart, CartItem, Product, Coupon
from app.schemas import CartItemAdd, CartItemUpdate, CouponApply
from app.utils.id_generator import generate_id

router = APIRouter(prefix="/api/v1/cart", tags=["Cart"])


def _get_or_create_cart(user_id: int, db: Session) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(uid=generate_id("CRT"), user_id=user_id)
        db.add(cart)
        db.flush()
    return cart


def _calculate_cart_total(cart: Cart, db: Session) -> float:
    total = 0.0
    for item in cart.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            price = product.discount_price if product.discount_price else product.price
            total += price * item.quantity
    return total


@router.get("/")
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's cart with items."""
    cart = _get_or_create_cart(current_user.id, db)
    db.commit()
    db.refresh(cart)

    items = []
    for item in cart.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            price = product.discount_price if product.discount_price else product.price
            items.append({
                "id": item.id,
                "uid": item.uid,
                "product_id": item.product_id,
                "product_name": product.name,
                "product_image": product.image_url,
                "price": price,
                "original_price": product.price,
                "quantity": item.quantity,
                "subtotal": price * item.quantity,
            })

    total = sum(i["subtotal"] for i in items)
    discount = cart.discount_amount or 0

    return {
        "status": "success",
        "message": "Cart retrieved successfully",
        "data": {
            "id": cart.id,
            "uid": cart.uid,
            "items": items,
            "total": total,
            "discount_amount": discount,
            "final_amount": total - discount,
            "coupon_code": cart.coupon_code,
            "item_count": len(items),
        },
    }


@router.post("/add")
def add_to_cart(
    data: CartItemAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add an item to the cart."""
    product = db.query(Product).filter(Product.id == data.product_id, Product.is_active == True).first()
    if not product:
        raise NotFoundException(detail="Product not found")

    if product.stock < data.quantity:
        raise BadRequestException(detail="Insufficient stock")

    cart = _get_or_create_cart(current_user.id, db)

    existing_item = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == data.product_id,
    ).first()

    if existing_item:
        existing_item.quantity += data.quantity
        db.commit()
        db.refresh(existing_item)
        item = existing_item
    else:
        item = CartItem(
            uid=generate_id("CI"),
            cart_id=cart.id,
            product_id=data.product_id,
            quantity=data.quantity,
        )
        db.add(item)
        db.commit()
        db.refresh(item)

    return {
        "status": "success",
        "message": "Item added to cart",
        "data": {
            "id": item.id,
            "uid": item.uid,
            "product_id": item.product_id,
            "quantity": item.quantity,
        },
    }


@router.put("/{item_id}")
def update_cart_item(
    item_id: int = Path(...),
    data: CartItemUpdate = Body(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update cart item quantity."""
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise NotFoundException(detail="Cart not found")

    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id,
    ).first()
    if not item:
        raise NotFoundException(detail="Cart item not found")

    product = db.query(Product).filter(Product.id == item.product_id).first()
    if product and product.stock < data.quantity:
        raise BadRequestException(detail="Insufficient stock")

    item.quantity = data.quantity
    item.updated_at = datetime.utcnow()
    db.commit()

    return {
        "status": "success",
        "message": "Cart item updated",
        "data": {"id": item.id, "uid": item.uid, "quantity": item.quantity},
    }


@router.delete("/{item_id}")
def remove_from_cart(
    item_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove an item from the cart."""
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise NotFoundException(detail="Cart not found")

    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id,
    ).first()
    if not item:
        raise NotFoundException(detail="Cart item not found")

    db.delete(item)
    db.commit()

    return {
        "status": "success",
        "message": "Item removed from cart",
        "data": None,
    }


@router.post("/apply-coupon")
def apply_coupon(
    data: CouponApply,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Apply a coupon code and return discount."""
    coupon = db.query(Coupon).filter(
        Coupon.code == data.coupon_code,
        Coupon.is_active == True,
    ).first()
    if not coupon:
        raise BadRequestException(detail="Invalid coupon code")

    if coupon.expires_at and coupon.expires_at < datetime.utcnow():
        raise BadRequestException(detail="Coupon has expired")

    if coupon.max_uses and coupon.used_count >= coupon.max_uses:
        raise BadRequestException(detail="Coupon usage limit reached")

    cart = _get_or_create_cart(current_user.id, db)
    total = _calculate_cart_total(cart, db)

    if total < coupon.min_order_amount:
        raise BadRequestException(detail=f"Minimum order amount is {coupon.min_order_amount}")

    discount = 0.0
    if coupon.discount_percent:
        discount = total * (coupon.discount_percent / 100)
    elif coupon.discount_amount:
        discount = min(coupon.discount_amount, total)

    cart.coupon_code = coupon.code
    cart.discount_amount = discount
    db.commit()

    return {
        "status": "success",
        "message": "Coupon applied successfully",
        "data": {
            "coupon_code": coupon.code,
            "discount_amount": round(discount, 2),
            "total": round(total, 2),
            "final_amount": round(total - discount, 2),
        },
    }


@router.delete("/clear")
def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Clear all items from the cart."""
    cart = db.query(Cart).filter(Cart.user_id == current_user.id).first()
    if not cart:
        raise NotFoundException(detail="Cart not found")

    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    cart.coupon_code = None
    cart.discount_amount = 0.0
    db.commit()

    return {
        "status": "success",
        "message": "Cart cleared successfully",
        "data": None,
    }
