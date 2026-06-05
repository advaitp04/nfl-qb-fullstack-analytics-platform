from fastapi import APIRouter, Query
from typing import Literal
from backend.services.qb_service import get_cortisol_rankings_by_season, build_response
from backend.models.schemas import QBListResponse

router = APIRouter(prefix="/api/rankings", tags=["Rankings"])

@router.get("/cortisol", response_model=QBListResponse)
def cortisol_rankings(
    season: int | None = Query(None, description="Filter by NFL season"),
    season_type: Literal["REG", "POST"] | None=Query(None, description="Filter by regular season or postseason"),
    limit: int = Query(50, ge=1, le=500, description="Maximum number of QB records to return"),
    offset: int = Query(0, ge=0)
):
    results =  get_cortisol_rankings_by_season(season=season, season_type=season_type, limit=limit, offset=offset)
    return build_response(results)