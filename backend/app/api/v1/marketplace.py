from fastapi import APIRouter, Depends, Query, Path
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User, Category, Product
from app.schemas import ProductResponse, CategoryResponse

router = APIRouter(prefix="/api/v1/marketplace", tags=["Marketplace"])


@router.get("/categories")
def list_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all product categories."""
    categories = db.query(Category).filter(Category.is_active == True).all()

    return {
        "status": "success",
        "message": "Categories retrieved successfully",
        "data": [
            {
                "id": c.id,
                "uid": c.uid,
                "name": c.name,
                "description": c.description,
                "icon": c.icon,
            }
            for c in categories
        ],
    }


@router.get("/products/featured")
def get_featured_products(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get featured products."""
    products = db.query(Product).filter(
        Product.is_active == True,
        Product.is_featured == True,
    ).order_by(Product.rating.desc()).limit(10).all()

    return {
        "status": "success",
        "message": "Featured products retrieved successfully",
        "data": [
            {
                "id": p.id,
                "uid": p.uid,
                "category_id": p.category_id,
                "name": p.name,
                "description": p.description,
                "price": p.price,
                "discount_price": p.discount_price,
                "image_url": p.image_url,
                "stock": p.stock,
                "is_featured": p.is_featured,
                "rating": p.rating,
                "review_count": p.review_count,
            }
            for p in products
        ],
    }


@router.get("/products")
def list_products(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category_id: Optional[int] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query(None, description="price_asc/price_desc/rating/newest"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List products with filters and sorting."""
    query = db.query(Product).filter(Product.is_active == True)

    if category_id:
        query = query.filter(Product.category_id == category_id)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) |
            (Product.description.ilike(f"%{search}%"))
        )

    if sort_by == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort_by == "rating":
        query = query.order_by(Product.rating.desc())
    elif sort_by == "newest":
        query = query.order_by(Product.created_at.desc())
    else:
        query = query.order_by(Product.created_at.desc())

    total = query.count()
    products = query.offset((page - 1) * per_page).limit(per_page).all()

    return {
        "status": "success",
        "message": "Products retrieved successfully",
        "data": [
            {
                "id": p.id,
                "uid": p.uid,
                "category_id": p.category_id,
                "name": p.name,
                "description": p.description,
                "price": p.price,
                "discount_price": p.discount_price,
                "image_url": p.image_url,
                "stock": p.stock,
                "is_featured": p.is_featured,
                "rating": p.rating,
                "review_count": p.review_count,
            }
            for p in products
        ],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/products/{product_id}")
def get_product(
    product_id: int = Path(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get product detail with reviews."""
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if not product:
        from app.core.exceptions import NotFoundException
        raise NotFoundException(detail="Product not found")

    return {
        "status": "success",
        "message": "Product retrieved successfully",
        "data": {
            "id": product.id,
            "uid": product.uid,
            "category_id": product.category_id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "discount_price": product.discount_price,
            "image_url": product.image_url,
            "stock": product.stock,
            "is_featured": product.is_featured,
            "rating": product.rating,
            "review_count": product.review_count,
            "created_at": product.created_at.isoformat() if product.created_at else None,
            "reviews": [],
        },
    }
