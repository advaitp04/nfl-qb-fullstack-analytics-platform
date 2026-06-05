from pathlib import Path
from api_client import fetch_qbs
import streamlit as st
import pandas as pd 
import altair as alt 
import requests

project_root = Path(__file__).resolve().parents[1]
data_path = project_root / "data" / "processed" / "qb_master.csv"
icon_path = project_root / "assets" / "icon.png"

st.set_page_config(
    page_title="NFL Cortisol Analytics Page",
    page_icon=str(icon_path),
    layout="wide"
)

st.markdown("""
<style>

.filter-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    line-height: 1.1;
    margin-bottom: 18px;
}
</style>
""", unsafe_allow_html=True)

st.markdown("""
<style>
            
/* Sidebar background */
[data-testid="stSidebar"] {
    background: linear-gradient(
        180deg,
        #0b3d91 0%,
        #1e5fbf 60%,
        #4fa3e3 100%
    );
}

[data-testid="stSidebar"] > div:first-child {
    padding-top: 1rem;
}
            
/* Top header bar */
[data-testid="stHeader"] {
    background: transparent;
    box-shadow: none;
}
            
[data-testid="stHeader"] {
    height: 55px;
}

/* Sidebar text color */
[data-testid="stSidebar"] * {
    color: white;
}

/* Sidebar navigation buttons */
[data-testid="stSidebarNav"] a {
    border-radius: 8px;
    padding: 6px 10px;
}

/* Hover effect */
[data-testid="stSidebarNav"] a:hover {
    background-color: rgba(255,255,255,0.15);
}

/* Active page highlight */
[data-testid="stSidebarNav"] a[aria-current="page"] {
    background-color: rgba(255,255,255,0.25);
}

</style>
""", unsafe_allow_html=True)

st.markdown("""
    <style>

/* Expander container */
div[data-testid="stExpander"] {
    background-color: rgba(255,255,255,0.92);
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

/* Expander title */
div[data-testid="stExpander"] summary {
    color: #0b3d91 !important;
    font-weight: 600;
    font-size: 16px;
}

/* Expander text */
div[data-testid="stExpander"] p,
div[data-testid="stExpander"] li,
div[data-testid="stExpander"] strong {
    color: #1f2937 !important;
}

/* Bullet lists */
div[data-testid="stExpander"] ul {
    color: #1f2937 !important;
}

/* All text inside expander body */
div[data-testid="stExpander"] p,
div[data-testid="stExpander"] li,
div[data-testid="stExpander"] span,
div[data-testid="stExpander"] div,
div[data-testid="stExpander"] strong,
div[data-testid="stExpander"] em,
div[data-testid="stExpander"] label,
div[data-testid="stExpander"] h1,
div[data-testid="stExpander"] h2,
div[data-testid="stExpander"] h3,
div[data-testid="stExpander"] h4,
div[data-testid="stExpander"] h5,
div[data-testid="stExpander"] h6 {
    color: #1f2937 !important;
}

</style>
""", unsafe_allow_html=True)

st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

    html, body, p, label, h1, h2, h3, h4, h5, h6 {
        font-family: 'Inter', sans-serif !important;
    }   
    </style>
""", unsafe_allow_html=True)

st.markdown(
    """
    <style>
    .stApp {
        background: linear-gradient(
            to top,
            #d6f0ff,
            #7ec8ff,
            #1e88e5
        );
    }
    </style>
    """,
    unsafe_allow_html=True
)

@st.cache_data
def load_data():
    return fetch_qbs()

def show_shared_filters(df):
    col1, col2 = st.columns(2)
    with col1:
        season_list = df['season'].sort_values().unique()
        season_label = st.selectbox("Season", season_list, index=4)
    with col2:
        game_list = df['season_type'].sort_values().unique()
        season_type_map = {
            "Regular Season": "REG",
            "Playoffs": "POST"
        }
        game_type_label = st.selectbox("Season Type", list(season_type_map.keys()), index=0)
        game_type = season_type_map[game_type_label]

    # Filter to season + season type first
    filtered_df = df[
        (df["season"] == season_label) &
        (df["season_type"] == game_type)
    ].copy()

    if game_type == "REG":
        min_db_default = 200
        min_db_min = 50
        min_db_step = 10
    else:
        min_db_default = 30
        min_db_min = 1
        min_db_step = 5

    current_max_dropbacks = int(filtered_df["total_dropbacks"].max()) if not filtered_df.empty else min_db_default
    current_max_dropbacks = max(current_max_dropbacks, min_db_default)

    st.markdown("<div style='margin-bottom: 8px;'></div>", unsafe_allow_html=True)

    min_dropbacks = st.slider(
        "Minimum Dropbacks",
        min_value=min_db_min,
        max_value=current_max_dropbacks,
        value=min(min_db_default, current_max_dropbacks),
        step=min_db_step
    )
    # Apply dropback filter
    filtered_df = filtered_df[filtered_df["total_dropbacks"] >= min_dropbacks].copy()

    return filtered_df

def show_leaderboard(filtered_df):
    with st.expander("What is the NFL QB Cortisol Index?"):
        st.markdown("### How the Cortisol Model Works")
        st.markdown("""
        **The NFL QB Cortisol Index measures how stressful an NFL quarterback's playstyle is for their own team.**

        Quarterbacks that routinely avoid game-killing mistakes while generating efficient and stable offensive success have higher Cortisol scores.

        Quarterbacks that commit frequent turnovers or fail to generate reliable offensive production are more volatile and have lower Cortisol scores.

        ---

        ### The Cortisol Score is calculated using three normalized components

        • **Turnover Score**  
        Measures how well a QB avoids game-killing mistakes such as interceptions, sacks, and lost fumbles.

        • **Drive Score**  
        Measures a QB's ability to consistently sustain drives and avoid offensive mistakes.

        • **Success Score**  
        Measures offensive productivity using efficiency metrics such as yards per attempt, EPA per dropback, and touchdown rate.

        ---

        The **Cortisol Score** is the average of these three subscores.

        Because quarterbacks with small sample sizes can produce misleading results, the model includes a **Stabilized Cortisol Score**, which adjusts the score based on total dropbacks during the season.
""")

    st.header("NFL QB Cortisol Index Leaderboard")

    df = filtered_df.rename(columns={
    "adjusted_cortisol_rank": "Stabilized Rank",
    "player_display_name": "QB Name",
    "team": "Team",
    "adjusted_cortisol_score": "Stabilized Cortisol Score",
    "turnover_score": "Turnover Score",
    "drive_score": "Drive Score",
    "success_score": "Success Score",
    "cortisol_score": "Cortisol Score",
    "cortisol_rank": "Rank",
    "total_dropbacks": "Dropbacks"
    })

    df = df[
        [
            "Stabilized Rank",
            "QB Name",
            "Team",
            "Stabilized Cortisol Score",
            "Cortisol Score",
            "Dropbacks",
            "Turnover Score",
            "Drive Score",
            "Success Score",
            "Rank"
        ]
    ]

    df = df.round({
    "Turnover Score": 3,
    "Drive Score": 3,
    "Success Score": 3,
    "Stabilized Cortisol Score": 3
    })

    df['Dropbacks'] = df['Dropbacks'].astype(int)
    df['Stabilized Rank'] = df['Stabilized Rank'].astype(int)
    df['Rank'] = df['Rank'].astype(int)
    df['Stabilized Cortisol Score'] = 100 * df['Stabilized Cortisol Score']
    df['Cortisol Score'] = 100 * df['Cortisol Score']
    df['Turnover Score'] = 100 * df['Turnover Score']
    df['Drive Score'] = 100 * df['Drive Score']
    df['Success Score'] = 100 * df['Success Score']
    df = df.sort_values("Stabilized Rank")

    styled = (
        df.style
        .background_gradient(subset=["Stabilized Cortisol Score"], cmap="RdYlGn")
        .background_gradient(subset=["Turnover Score", "Drive Score", "Success Score"], cmap="Blues")
    )

    st.dataframe(styled, use_container_width=True, hide_index=True, column_config={
        "QB Name": st.column_config.TextColumn(help="Quarterback Name"),
        "Team": st.column_config.TextColumn(help="Team of Quarterback"),
        "Stabilized Rank": st.column_config.NumberColumn(width="small", help="Rank based on the adjusted Cortisol Score, which accounts for total dropbacks during the regular season"),
        "Rank": st.column_config.NumberColumn(width="small", help="Rank based on the Cortisol Score, which is calculated based on the average of the turnover, drive, & success scores"),
        "Dropbacks": st.column_config.NumberColumn(width="small", help="Total number of plays designed as a pass for a QB during the regular season"),
        "Stabilized Cortisol Score": st.column_config.NumberColumn(format="%.1f", help="Adjusted Cortisol Score, which accounts for total dropbacks during the regular season"),
        "Cortisol Score": st.column_config.NumberColumn(format="%.1f", help="Cortisol Score calculated based on the average of the turnover, drive, & success scores"),
        "Turnover Score": st.column_config.NumberColumn(format="%.3f", help="Average of normalized turnover/drive-killer factors: INT rate, fumble-lost rate, sack rate, and sack-yards-per-sack"),
        "Drive Score": st.column_config.NumberColumn(format="%.3f", help="Average of normalized drive-sustainability factors: first-down rate and completion rate"),
        "Success Score": st.column_config.NumberColumn(format="%.3f", help="Average of normalized offensive-success factors: TD per attempt, EPA per dropback, and yards per attempt")
    })

def show_qb_comparison(filtered_df, qb1, qb2):
    #edge case if dropback filter is set to the max and only one QB shows up on the leaderboard
    if filtered_df.shape[0] < 2:
        st.info("Only one QB matches the current filters, so the volatility scatterplot is hidden.")
        return
    
    qb1_data = filtered_df[filtered_df['player_display_name'] == qb1].iloc[0].copy()
    qb2_data = filtered_df[filtered_df['player_display_name'] == qb2].iloc[0].copy()

    qb1_data['adjusted_cortisol_score'] = 100 * qb1_data['adjusted_cortisol_score']
    qb2_data['adjusted_cortisol_score'] = 100 * qb2_data['adjusted_cortisol_score']

    score_delta_1 = qb1_data['adjusted_cortisol_score'] - qb2_data['adjusted_cortisol_score']
    score_delta_2 = qb2_data['adjusted_cortisol_score'] - qb1_data['adjusted_cortisol_score']

    left,right = st.columns(2)

    with left: 
        st.markdown(f"### {qb1_data['player_display_name']} ({qb1_data['team']})")
        st.metric(
            "Stabilized Score",
            f"{qb1_data['adjusted_cortisol_score']:.1f}",
            delta=f"{score_delta_1:.1f}"
        )
        st.metric("Stabilized Rank", int(qb1_data['adjusted_cortisol_rank']))
        st.metric("Dropbacks", int(qb1_data['total_dropbacks']))

    with right:
        st.markdown(f"### {qb2_data['player_display_name']} ({qb2_data['team']})")
        st.metric(
            "Stabilized Score",
            f"{qb2_data['adjusted_cortisol_score']:.1f}",
            delta=f"{score_delta_2:.1f}"
        )
        st.metric("Stabilized Rank", int(qb2_data['adjusted_cortisol_rank']))
        st.metric("Dropbacks", int(qb2_data['total_dropbacks']))

def show_qb_chart(filtered_df, qb1, qb2):
    qb1_data = filtered_df[filtered_df['player_display_name'] == qb1].iloc[0].copy()
    qb2_data = filtered_df[filtered_df['player_display_name'] == qb2].iloc[0].copy()

    qb1_data['adjusted_cortisol_score'] = 100 * qb1_data['adjusted_cortisol_score']
    qb2_data['adjusted_cortisol_score'] = 100 * qb2_data['adjusted_cortisol_score']

    qb1_data['turnover_score'] = 100 * qb1_data['turnover_score']
    qb2_data['turnover_score'] = 100 * qb2_data['turnover_score']

    qb1_data['drive_score'] = 100 * qb1_data['drive_score']
    qb2_data['drive_score'] = 100 * qb2_data['drive_score']

    qb1_data['success_score'] = 100 * qb1_data['success_score']
    qb2_data['success_score'] = 100 * qb2_data['success_score']

    chart_df = pd.DataFrame({
        "Metric": ["Turnover", "Drive", "Success", "Turnover", "Drive", "Success"],
        "QB": [qb1, qb1, qb1, qb2, qb2, qb2],
        "Score": [
            qb1_data["turnover_score"],
            qb1_data["drive_score"],
            qb1_data["success_score"],
            qb2_data["turnover_score"],
            qb2_data["drive_score"],
            qb2_data["success_score"],
        ]
    })

    bars = alt.Chart(chart_df).mark_bar(size=34).encode(
        x=alt.X(
            "Metric:N",
            title=None,
            axis=alt.Axis(
                labelAngle=0,
                labelFontSize=13,
                labelPadding=10,
                labelColor="white",
                domain=False,
                tickColor="rgba(255,255,255,0.35)"
            )
        ),
        y=alt.Y(
            "Score:Q",
            title=None,
            scale=alt.Scale(domain=[0, 100]),
            axis=alt.Axis(
                format=".2f",
                labelFontSize=12,
                labelColor="white",
                domain=False,
                tickColor="rgba(255,255,255,0.35)",
                grid=True,
                gridColor="rgba(255,255,255,0.25)",
                gridWidth=1
            )
        ),
        color=alt.Color(
            "QB:N",
            scale=alt.Scale(range=["#d6f0ff", "#0b3d91"]),
            legend=alt.Legend(
                title="QB",
                titleColor="white",
                labelColor="white",
                orient="top"
            )
        ),
        xOffset="QB:N",
        tooltip=[
            alt.Tooltip("QB:N"),
            alt.Tooltip("Metric:N"),
            alt.Tooltip("Score:Q", format=".3f")
        ]
    )

    labels = alt.Chart(chart_df).mark_text(
        dy=-8,
        fontSize=12,
        color="white"
    ).encode(
        x=alt.X("Metric:N"),
        y=alt.Y("Score:Q"),
        text=alt.Text("Score:Q", format=".3f"),
        xOffset="QB:N"
    )

    chart = (bars + labels).properties(
        height=420
    ).configure(
        background="transparent"
    ).configure_view(
        fill="transparent",
        stroke=None
    )

    st.altair_chart(chart, use_container_width=True)


def main():
    #Set up Title and webpage
    header_col1, header_col2 = st.columns([0.08, 0.92])

    with header_col1:
        st.image(str(icon_path), width=70)

    with header_col2:
        st.title("NFL QB Cortisol Index Analytics")

    #load data
    df = load_data()

    left, right = st.columns([3.7,1.3], gap="large")

    with right:
        #global filters
        st.markdown('<div class="filter-card">', unsafe_allow_html=True)
        st.markdown('<div class="filter-title">Filters</div>', unsafe_allow_html=True)
        filtered_df = show_shared_filters(df)
        st.markdown('</div>', unsafe_allow_html=True)

        if filtered_df.empty:
            st.warning("No quarterbacks meet the current filter criteria. Try lowering the minimum dropbacks.")
            st.stop()
    with left:
        #Leaderboard at the top
        show_leaderboard(filtered_df)
        st.subheader("QB Comparison")

        qb_list = filtered_df["player_display_name"].sort_values().unique()
        if len(qb_list) < 2:
            st.info("Only one QB matches the current filters. Lower the minimum dropbacks to compare multiple QBs.")
        else:
            qb1 = st.selectbox("Select QB 1 for chart", qb_list)
            qb2 = st.selectbox("Select QB 2 for chart", qb_list, index=1)

            #Two columns for organizing the webpage
            #col1, col2 = st.columns([1,1.3])

            #with col1:
            show_qb_comparison(filtered_df, qb1, qb2)
            #with col2:
            show_qb_chart(filtered_df, qb1, qb2)

if __name__ == "__main__":
    main()