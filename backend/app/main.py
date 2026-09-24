from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.app.core.config import settings
from backend.app.core.database import engine, Base
from backend.app.api.auth import router as auth_router
from backend.app.api.students import router as students_router
from backend.app.api.applications import router as applications_router
from backend.app.api.documents import router as documents_router
from backend.app.api.verification import router as verification_router
from backend.app.api.officer import router as officer_router
from backend.app.api.analytics import router as analytics_router
from backend.app.api.chat import router as chat_router
from backend.app.api.public import router as public_router

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MargDarshan API",
    description="Unified Scholarship Guidance and Verification Platform — Ministry of Tribal Affairs (MoTA) | Team GravityX",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.STORAGE_DIR), name="uploads")

# Global Exception Handler (Section 62: Human-readable error messages)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Processing Notice",
            "message": "Something went wrong. Your information is safe. Please try again.",
            "detail": str(exc) if settings.DEMO_MODE else None
        }
    )

# Include Routers
app.include_router(public_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(students_router, prefix=settings.API_V1_STR)
app.include_router(applications_router, prefix=settings.API_V1_STR)
app.include_router(documents_router, prefix=settings.API_V1_STR)
app.include_router(verification_router, prefix=settings.API_V1_STR)
app.include_router(officer_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "product": "MargDarshan",
        "tagline": "One platform. Every scholarship journey.",
        "ai_companion": "SAATHI",
        "ministry": "Ministry of Tribal Affairs (MoTA)",
        "team": "GravityX",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
