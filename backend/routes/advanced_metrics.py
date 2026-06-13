from fastapi import APIRouter, Query
from typing import Literal 
from backend.services.qb_service import get_advanced_metrics, build_response
from backend.models.schemas import AdvancedMetricsListResponse

router = APIRouter(prefix="/api/advanced-metrics", tags=["AdvancedMetrics"])

@router.get("", response_model=AdvancedMetricsListResponse)
def advanced_metrics(season: int | None=Query(None, description="Filter by NFL season"), season_type: Literal["REG", "POST"] | None=Query(None, description="Filter by regular season or postseason"), limit: int = Query(100, ge=1, le=500, description="Maximum number of QBs to return"), offset: int = Query(0, ge=0)):
    results = get_advanced_metrics(season=season, season_type=season_type, limit=limit, offset=offset)
    return build_response(results)