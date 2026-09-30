from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CommunityBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None


class CommunityResponse(CommunityBase):
    id: int
    uid: str
    member_count: int = 0
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class ChannelBase(BaseModel):
    community_id: int
    name: str
    description: Optional[str] = None
    type: str = "text"


class ChannelResponse(ChannelBase):
    id: int
    uid: str
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class PostBase(BaseModel):
    channel_id: int
    title: str
    content: Optional[str] = None
    type: str = "text"
    file_url: Optional[str] = None


class PostResponse(PostBase):
    id: int
    uid: str
    is_pinned: bool = False
    is_active: bool = True
    author_name: str = ""
    comment_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class CommentBase(BaseModel):
    post_id: int
    content: str


class CommentResponse(CommentBase):
    id: int
    uid: str
    author_name: str = ""
    created_at: datetime

    class Config:
        from_attributes = True


class MessageBase(BaseModel):
    receiver_id: int
    conversation_id: Optional[str] = None
    content: str


class MessageResponse(MessageBase):
    id: int
    uid: str
    sender_id: int
    is_read: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationBase(BaseModel):
    title: str
    body: Optional[str] = None
    type: Optional[str] = None
    reference_type: Optional[str] = None
    reference_id: Optional[int] = None


class NotificationResponse(NotificationBase):
    id: int
    uid: str
    is_read: bool = False
    created_at: datetime

    class Config:
        from_attributes = True
