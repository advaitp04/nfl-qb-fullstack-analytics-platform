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

def test_qbs_with_query_params():
    response = client.get("/api/qbs?season=2023&limit=10")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) <= 10


def test_cortisol_rankings_with_query_params():
    response = client.get("/api/rankings/cortisol?season=2023&limit=10")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) <= 10


def test_qb_by_name():
    response = client.get("/api/qbs/mahomes")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_invalid_qb_name():
    response = client.get("/api/qbs/thisqbdoesnotexist")
    assert response.status_code == 404

def test_advanced_metrics_endpoint():
    response = client.get("/api/advanced-metrics?season=2023&limit=10")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) <= 10

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_qbs_with_team_filter():
    response = client.get("/api/qbs?season=2023&team=KC&limit=10")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) <= 10

def test_qbs_with_pagination():
    response = client.get("/api/qbs?limit=5&offset=5")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) <= 5


def test_qbs_invalid_limit():
    response = client.get("/api/qbs?limit=1000")
    assert response.status_code == 422