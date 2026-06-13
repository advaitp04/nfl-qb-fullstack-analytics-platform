from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_cortisol_rankings_with_query_params():
    response = client.get("/api/rankings/cortisol?season=2023&limit=10")
    assert response.status_code == 200

    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)
    assert data["count"] <= 10
    assert len(data["results"]) <= 10


def test_qb_by_name():
    response = client.get("/api/qbs/mahomes")
    assert response.status_code == 200

    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)
    assert data["count"] == len(data["results"])

def test_invalid_qb_name():
    response = client.get("/api/qbs/thisqbdoesnotexist")
    assert response.status_code == 404

def test_advanced_metrics_endpoint():
    response = client.get("/api/advanced-metrics?season=2023&limit=10")
    assert response.status_code == 200

    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)
    assert data["count"] <= 10
    assert len(data["results"]) <= 10

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_qbs_with_team_filter():
    response = client.get("/api/qbs?season=2023&team=KC&limit=10")
    assert response.status_code == 200

    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)
    assert data["count"] <= 10
    assert len(data["results"]) <= 10

def test_qbs_with_pagination():
    response = client.get("/api/qbs?limit=5&offset=5")
    assert response.status_code == 200

    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)
    assert data["count"] <= 5
    assert len(data["results"]) <= 5


def test_qbs_invalid_limit():
    response = client.get("/api/qbs?limit=1000")
    assert response.status_code == 422

def test_qbs_endpoint():
    response = client.get("/api/qbs")
    assert response.status_code == 200
    data = response.json()
    assert "count" in data
    assert "results" in data
    assert isinstance(data["results"], list)

def test_qbs_with_query_params():
    response = client.get("/api/qbs?season=2023&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] <= 10
    assert len(data["results"]) <= 10

def test_qbs_with_season_type():
    response = client.get("/api/qbs?season_type=REG&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data 
    for qb in data["results"]:
        assert qb["season_type"] == "REG"

def test_qbs_offset_changes_results():
    response1 = client.get("/api/qbs?limit=5&offset=0")
    response2 = client.get("/api/qbs?limit=5&offset=5")
    data1 = response1.json()
    data2 = response2.json()
    assert data1["results"] != data2["results"]

def test_empty_team_filter():
    response = client.get("/api/qbs?team=FAKETEAM")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 0
    assert data["results"] == []

def test_qbs_sorting_by_dropbacks():
    response = client.get("/api/qbs?season=2023&season_type=REG&sort_by=total_dropbacks&sort_order=desc&limit=10")
    assert response.status_code == 200
    data = response.json()
    results = data["results"]
    dropbacks = [qb["total_dropbacks"] for qb in results]
    assert dropbacks == sorted(dropbacks, reverse=True)
