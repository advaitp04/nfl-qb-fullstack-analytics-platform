from fastapi import APIRouter, Query
from backend.services.qb_service import get_cortisol_rankings_by_season
from backend.models.schemas import QBRecord

router = APIRouter(prefix="/api/rankings", tags=["Rankings"])

@router.get("/cortisol", response_model=list[QBRecord])
def cortisol_rankings(
    season: int | None = None,
    limit: int = Query(50, ge=1, le=500)
):
    return get_cortisol_rankings_by_season(season=season, limit=limit)