from fastapi import APIRouter, Query
from backend.services.qb_service import get_advanced_metrics
from backend.models.schemas import AdvancedMetricsListResponse

router = APIRouter(prefix="/api/advanced-metrics", tags=["AdvancedMetrics"])

@router.get("", response_model=AdvancedMetricsListResponse)
def advanced_metrics(season: int | None=None, season_type: str | None=None, limit: int = Query(100, ge=1, le=500), offset: int = Query(0, ge=0)):
    results = get_advanced_metrics(season=season, season_type=season_type, limit=limit, offset=offset)
    return {
        "count": len(results),
        "results": results
    }