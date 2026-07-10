from pydantic import BaseModel


class DashboardResponse(BaseModel):
    total_users: int
    total_farmers: int
    total_admins: int
    total_sessions: int
    total_messages: int