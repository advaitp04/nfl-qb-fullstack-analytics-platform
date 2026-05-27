# NFL QB Cortisol Index: Evaluating Quarterback Stability Using NFL Data

## Introduction

This project is an end-to-end sports analytics platform that ranks NFL quarterbacks using a custom QB Cortisol Index, designed to measure offensive stability and stress-inducing mistakes. The index is built using engineered metrics derived from NFL player statistics and play-by-play data across the last five seasons.

The project combines sports analytics, backend software engineering, API development, automated testing, and containerized services into a modular cloud-ready analytics platform.

The analysis and dashboard were developed using Python, Pandas, Plotly, Altair, Streamlit, FastAPI, Docker, and GitHub Actions.

[![Streamlit App](https://img.shields.io/badge/Live%20Dashboard-Streamlit-green)](https://advait-patil-nfl-qb-cortisol-analytics.streamlit.app/)

---

# Software Engineering Upgrade

The project has been expanded from a standalone analytics dashboard into a modular, cloud-ready analytics platform with backend APIs, automated testing, CI workflows, and containerized services.

New engineering-focused additions include:

- FastAPI backend service for REST API endpoints
- Modular service-layer architecture for analytics logic
- Automated API testing with Pytest
- GitHub Actions CI pipeline for continuous integration
- Dockerized backend and dashboard services
- Backend preprocessing and serialization handling for missing NFL metrics

These upgrades make the platform easier to test, extend, deploy, and integrate with future full-stack or cloud-native applications.

---

# Cortisol Index Methodology

The QB Cortisol Index is designed to measure how consistently a quarterback keeps an offense productive while minimizing stress-inducing plays such as turnovers or drive-killing mistakes.

The index is calculated using normalized performance metrics grouped into three key categories.

## Drive Sustainability

Measures how effectively a quarterback keeps offensive drives alive.

- First Down Rate
- Completion Percentage

## Turnover Risk

Captures plays that typically increase fan stress and negatively impact offensive momentum.

- Interception Rate
- Fumble Lost Rate
- Sack Rate

## Offensive Success

Measures overall offensive productivity and efficiency.

- EPA per Dropback
- Yards per Attempt
- Touchdown Rate

All metrics are normalized and inverted when necessary so that higher values represent more stable quarterback performance.

The final Cortisol Index score combines these metrics into a composite score used to rank quarterbacks across the last five NFL seasons.

---

# Dashboard Preview

![QB Cortisol Dashboard](images/nflcortisoldashboard1.png)

![QB Advanced Metrics](images/nflcortisoldashboard2.png)

---

# Technologies Used

## Programming Languages

- Python
- SQL

## Backend Development

- FastAPI

## Frontend / Dashboard

- Streamlit

## Data Processing

- Pandas

## Visualization Libraries

- Plotly
- Altair

## Testing / CI

- Pytest
- GitHub Actions

## Containerization

- Docker
- Docker Compose

## Version Control

- Git
- GitHub

---

# System Architecture

The project is structured as a modular analytics platform consisting of multiple components.

```text
Streamlit Dashboard
       ↓
FastAPI Backend API
       ↓
Python Analytics Services
       ↓
Processed NFL Dataset
```

## Repository Structure

```text
nfl-qb-cortisol-analytics/
│
├── app/                     # Streamlit frontend dashboard
├── backend/                 # FastAPI backend service
│   ├── services/            # Analytics and data access layer
│   └── main.py              # API routes
├── scripts/                 # Data pipeline scripts
├── tests/                   # Automated API tests
├── .github/workflows/       # CI workflows
├── data/processed/          # Generated datasets
├── Dockerfile.api           # Backend API container
├── dockerfile               # Streamlit dashboard container
├── docker-compose.yml       # Multi-container configuration
└── README.md
```

---

# Data Source

nflreadpy is a Python library that provides easy access to NFL play-by-play and player statistics data from the nflverse data repository for analysis and modeling.

## More Info about nflreadpy

1. Installation Details  
   https://www.piwheels.org/project/nflreadpy/

2. Official Documentation  
   https://nflreadr.nflverse.com/index.html

---

# Data Pipeline

1. Extract NFL Player Data (`scripts/extract_data.py`)
2. Aggregate Data and Compute QB Metrics (`scripts/build_qb_metrics.py`)
3. Calculate QB Cortisol Scores (`scripts/cortisol_calculation.py`)
4. Extract Play-By-Play Data and Compute Advanced Metrics (`scripts/build_advanced_metrics.py`)
5. Run Data Pipeline and Build Master CSV (`scripts/run_pipeline.py`)

The pipeline processes multiple NFL datasets and generates a unified quarterback analytics dataset used by both the dashboard and API services.

---

# REST API

The project includes a FastAPI backend that exposes quarterback analytics through REST API endpoints.

## Available Endpoints

| Endpoint | Description |
|---|---|
| `GET /` | API status check |
| `GET /api/health` | Backend health check |
| `GET /api/qbs` | Retrieve quarterback records |
| `GET /api/qbs/{name}` | Retrieve a specific quarterback |
| `GET /api/rankings/cortisol` | Retrieve top QB Cortisol rankings |
| `GET /api/rankings/cortisol/{season}` | Retrieve rankings filtered by season |

## Run API Locally

```bash
uvicorn backend.main:app --reload
```

Interactive API documentation:

```text
http://localhost:8000/docs
```

---

# Running the NFL QB Cortisol Index Project Locally

This guide explains how to run the full NFL QB Cortisol Index platform locally, including generating the dataset, launching the API backend, and running the Streamlit dashboard.

---

# 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/nfl-qb-cortisol-analytics.git
cd nfl-qb-cortisol-analytics
```

---

# 2. Create a Python Virtual Environment (Recommended)

```bash
python -m venv venv
```

Activate the environment.

Mac/Linux:

```bash
source venv/bin/activate
```

Windows:

```bash
venv/scripts/activate
```

---

# 3. Install Required Dependencies

```bash
pip install -r requirements.txt
```

---

# 4. Run the Data Pipeline

```bash
python scripts/run_pipeline.py
```

This script performs the following steps:

1. Extract NFL player statistics using nflreadpy
2. Extract play-by-play data
3. Engineer QB performance metrics
4. Compute advanced metrics
5. Calculate QB Cortisol scores
6. Export the final master dataset CSV

The final dataset is saved in:

```bash
data/processed/qb_master.csv
```

---

# 5. Launch the FastAPI Backend

```bash
uvicorn backend.main:app --reload
```

Open:

```text
http://localhost:8000/docs
```

---

# 6. Launch the Streamlit Dashboard

```bash
streamlit run app/Home.py
```

If it does not automatically open in your browser, navigate to:

```text
http://localhost:8501
```

---

# 7. Using the Dashboard

The dashboard allows users to explore the QB Cortisol Index across multiple seasons.

Features include:

- QB Cortisol Index rankings
- Advanced QB performance metrics
- Interactive filters for season selection
- Data visualizations built with Plotly and Altair
- Situational quarterback analytics
- Season-by-season comparisons

---

# 8. Testing and Continuous Integration

The project includes automated API tests using Pytest.

Run tests locally:

```bash
python -m pytest
```

GitHub Actions CI workflows automatically execute tests on pushes and pull requests to help ensure backend reliability and API stability.

---

# 9. Containerization

The project supports containerized deployment for both the backend API and Streamlit dashboard using Docker.

## Backend API Container

```bash
docker build -f Dockerfile.api -t nfl-cortisol-api .
docker run -p 8000:8000 nfl-cortisol-api
```

## Streamlit Dashboard Container

```bash
docker build -f dockerfile -t nfl-cortisol-dashboard .
docker run -p 7860:7860 nfl-cortisol-dashboard
```

## Docker Compose

Run both services together:

```bash
docker compose up
```

---

# 10. Troubleshooting

If you encounter dependency issues, try reinstalling the following packages:

```bash
pip install --upgrade pandas plotly altair streamlit nflreadpy fastapi uvicorn pytest
```

---

# Future Roadmap

Planned future enhancements include:

- React frontend migration for a modern full-stack architecture
- PostgreSQL integration for persistent analytics storage
- Cloud deployment using AWS services
- API caching and performance optimization
- AI/LLM-powered quarterback insight generation
- Expanded advanced analytics and situational metrics

---

# Summary

This project combines:

- Sports analytics
- Data engineering
- Backend API development
- Automated testing
- CI/CD workflows
- Containerized services
- Interactive dashboarding

to create a modular NFL quarterback analytics platform capable of supporting future cloud-native and full-stack software engineering enhancements.
