from fastapi import APIRouter, Query
from backend.services.qb_service import get_cortisol_rankings_by_season
from backend.models.schemas import QBListResponse

router = APIRouter(prefix="/api/rankings", tags=["Rankings"])

@router.get("/cortisol", response_model=QBListResponse)
def cortisol_rankings(
    season: int | None = None,
    season_type: str | None = None,
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0)
):
    results =  get_cortisol_rankings_by_season(season=season, season_type=season_type, limit=limit, offset=offset)
    return {
        "count": len(results),
        "results": results
    }