from pydantic import BaseModel 
from typing import Optional 

class QBRecord(BaseModel):
    player_display_name: Optional[str] = None
    season: Optional[int] = None 
    season_type: Optional[str] = None
    team: Optional[str] = None 
    adjusted_cortisol_score: Optional[float] = None 
    adjusted_cortisol_rank: Optional[int] = None 

class AdvancedMetricsRecord(BaseModel):
    player_display_name: Optional[str] = None 
    season: Optional[int] = None 
    season_type: Optional[str] = None
    team: Optional[str] = None 
    epa_per_dropback: Optional[float] = None 
    redzone_td_rate: Optional[float] = None 
    third_down_conversion_rate: Optional[float] = None
    third_down_regular_conversion_rate: Optional[float] = None
    third_and_long_conversion_rate: Optional[float] = None
    adjusted_cortisol_score: Optional[float] = None
    adjusted_cortisol_rank: Optional[int] = None

class HealthResponse(BaseModel):
    status: str
    service: str