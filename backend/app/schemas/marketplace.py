from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int
    uid: str
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    category_id: int
    name: str
    description: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    discount_percent: float = 0
    image_url: Optional[str] = None
    images: Optional[list] = None
    stock: int = 0
    seller_name: Optional[str] = None
    specifications: Optional[dict] = None


class ProductResponse(ProductBase):
    id: int
    uid: str
    rating: float = 0.0
    review_count: int = 0
    is_featured: bool = False
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str = ""
    product_image: Optional[str] = None
    price: float = 0.0
    quantity: int = 1
    total: float = 0.0


class CartResponse(BaseModel):
    id: int
    uid: str
    items: List[CartItemResponse] = []
    total_amount: float = 0.0


class OrderBase(BaseModel):
    shipping_address: str
    payment_method: str
    coupon_code: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str = ""
    price: float = 0.0
    quantity: int = 1
    total: float = 0.0


class OrderResponse(BaseModel):
    id: int
    uid: str
    order_date: datetime
    total_amount: float = 0.0
    status: str = "pending"
    final_amount: float = 0.0
    items: List[OrderItemResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True


class CouponBase(BaseModel):
    code: str
    description: Optional[str] = None
    discount_percent: float
    max_discount: Optional[float] = None
    min_order_amount: float = 0


class CouponResponse(CouponBase):
    id: int
    uid: str
    is_active: bool = True
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None

    class Config:
        from_attributes = True


class CouponValidateResponse(BaseModel):
    valid: bool
    discount_percent: float = 0.0
    discount_amount: float = 0.0
    message: str = ""
