from app.database.base import Base
from app.database.session import engine

# Import the model so SQLAlchemy knows about it
from app.models.unanswered_query import UnansweredQuery

# Create only the missing table
Base.metadata.create_all(bind=engine)

print("✅ UnansweredQuery table created successfully!")