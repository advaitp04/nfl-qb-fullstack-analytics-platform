from fastapi import APIRouter
from backend.models.schemas import HealthResponse

router = APIRouter(prefix="/api/health", tags=["Health"])

@router.get("", response_model=HealthResponse)
def health_check():
    return {
        "status": "healthy",
        "service": "nfl-qb-cortisol-api"
    }