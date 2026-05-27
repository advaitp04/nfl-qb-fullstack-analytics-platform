from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_qbs_endpoint():
    response = client.get("/api/qbs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_cortisol_rankings_endpoint():
    response = client.get("/api/rankings/cortisol")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_cortisol_rankings_by_season_endpoint():
    response = client.get("/api/rankings/cortisol/2023")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"