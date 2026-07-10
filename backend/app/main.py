from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import *
from app.api.admin.routes import router as admin_router
from app.api.auth.routes import router as auth_router
from app.api.chatbot.routes import router as chatbot_router
from app.api.documents.routes import router as documents_router
from app.api.farmer.routes import router as farmer_router
from app.api.market.routes import router as market_router
from app.database.base import Base
from app.database.session import engine
from app.api.voice import router as voice_router
from fastapi.staticfiles import StaticFiles
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title='KisanBot API',
    description='AI-powered agricultural chatbot backend for farmers and administrators.',
    version='0.1.0',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(auth_router, prefix='/api/auth', tags=['auth'])
app.include_router(chatbot_router, prefix='/api/chatbot', tags=['chatbot'])
app.include_router(
    voice_router,
    prefix="/api",
    tags=["voice"],
)
app.include_router(documents_router, prefix='/api/documents', tags=['documents'])
app.include_router(farmer_router, prefix='/api/farmer', tags=['farmer'])
app.include_router(admin_router, prefix='/api/admin', tags=['admin'])
app.include_router(market_router, prefix='/api/market', tags=['market'])
os.makedirs("audio", exist_ok=True)
app.mount(
    "/audio",
    StaticFiles(directory="audio"),
    name="audio",
)
