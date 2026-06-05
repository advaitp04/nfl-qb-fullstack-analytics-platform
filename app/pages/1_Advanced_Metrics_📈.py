from pathlib import Path
from api_client import fetch_advanced_metrics
import streamlit as st
import pandas as pd 
import random
import altair as alt
import plotly.express as px
import plotly.graph_objects as go


project_root = Path(__file__).resolve().parents[2]
data_path = project_root / "data" / "processed" / "qb_master.csv"

st.set_page_config(page_title="QB Advanced Metrics", page_icon="📈", layout="wide")

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

/* Sidebar text color */
[data-testid="stSidebar"] * {
    color: white;
}
            
/* Top header bar */
[data-testid="stHeader"] {
    background: transparent;
    box-shadow: none;
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

def show_shared_filters(df):
    # Row 1: season + season type
    col1, col2 = st.columns(2)

    with col1:
        season_list = sorted(df["season"].unique())
        selected_season = st.selectbox(
            "Season",
            season_list,
            index=len(season_list) - 1
        )

    with col2:
        season_type_map = {
            "Regular Season": "REG",
            "Playoffs": "POST"
        }

        game_type_label = st.selectbox(
            "Season Type",
            list(season_type_map.keys()),
            index=0
        )
        game_type = season_type_map[game_type_label]

    # Filter to season + season type first
    filtered_df = df[
        (df["season"] == selected_season) &
        (df["season_type"] == game_type)
    ].copy()

    st.markdown("<div style='margin-bottom: 8px;'></div>", unsafe_allow_html=True)

    # Row 2: min dropbacks + top n
    col3, col4 = st.columns(2)

    with col3:
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

        min_dropbacks = st.slider(
            "Minimum Dropbacks",
            min_value=min_db_min,
            max_value=current_max_dropbacks,
            value=min(min_db_default, current_max_dropbacks),
            step=min_db_step
        )

    with col4:
        top_n = st.slider(
            "Top N QBs",
            min_value=5,
            max_value=20,
            value=10,
            step=1
        )

    # Apply dropback filter
    filtered_df = filtered_df[filtered_df["total_dropbacks"] >= min_dropbacks].copy()

    return filtered_df, top_n

def show_epa_panic_play_plot(df):
    with st.expander("What do these Advanced QB Metrics measure?"):
        st.markdown("### What are these Advanced QB Metrics?")
        st.markdown(""" 
        **The Advanced QB Metrics measure the rate at which NFL QBs make both successful offensive plays and critical, stress-inducing mistakes for their team.**
        
        ---
                    
        ### The Advanced QB Metrics calculated are:
        
        • **Negative EPA Rate**  
        Measures the percent of total dropbacks where QBs record an **EPA (Expected Points Added) < 0**, indicating offensive instability.
        
        • **Panic Play Rate**  
        Measures the percent of total dropbacks where QBs face **3rd or 4th down with ≥ 7 yards to go and record an EPA < -1**. These represent drive-killing sacks, interceptions, or huge negative plays.
        
        • **Third Down Conversion Rate**  
        Measures the percent of third downs in which a QB successfully gains enough yards for a first down.
        
        • **Third and Long Conversion Rate**  
        Measures the percent of **3rd down situations with ≥ 7 yards to go** that result in a first down.
        
        • **Redzone TD Rate**  
        Measures the percent of redzone situations (**inside the opponent's 20 yard line**) that result in a touchdown.
        
        Together, these metrics help explain why certain quarterbacks produce more stable offenses while others generate volatility and stress for their team.
""")

    st.header("QB Volatility vs. Efficiency")

    df = df.copy()

    df = df.rename(columns={
        "player_display_name": "QB Name",
        "team": "Team",
        "negative_epa_rate": "Negative EPA Rate",
        "panic_play_rate": "Panic Play Rate",
        "adjusted_cortisol_score": "Stabilized Cortisol Rating"
    })

    df['Negative EPA Rate'] = 100 * df['Negative EPA Rate']
    df['Panic Play Rate'] = 100 * df['Panic Play Rate']
    df['Stabilized Cortisol Rating'] = 100 * df['Stabilized Cortisol Rating']

    fig = px.scatter(df, x="Negative EPA Rate", y="Panic Play Rate", size="Stabilized Cortisol Rating",color="Stabilized Cortisol Rating", hover_data=['QB Name', 'Team'], color_continuous_scale="Viridis")
    
    #Add titles
    fig.update_layout(
        xaxis_title="Negative EPA Rate (%)",
        yaxis_title="Panic Play Rate (%)",
        title="QB Volatility vs Efficiency (Panic Rate vs Negative EPA)",
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        height=600,
        legend=dict(
            title=dict(
                text="Stabilized Cortisol Rating (0-100)" # Set the legend title here
            )
        )
    )

    #Add gridlines
    fig.update_xaxes(showgrid=True, gridcolor="rgba(255,255,255,0.3)")
    fig.update_yaxes(showgrid=True, gridcolor="rgba(255,255,255,0.3)")

    #Mean of both negative_epa_rate and panic_play_rate
    mean_epa = df["Negative EPA Rate"].mean()
    mean_panic = df["Panic Play Rate"].mean()   

    #improve opacity and prevent overlapping markers from blending together 
    fig.update_traces(marker=dict(opacity=0.85))
    fig.update_traces(
        marker=dict(
            line=dict(width=1.5, color="white")
        )
    )   

    #Create quadrant labels to group QBs based on their position in the scatterplot
    fig.add_annotation(
    x=mean_epa * 0.8,
    y=mean_panic * 1.25,
    text="Volatile QBs",
    showarrow=False
)

    fig.add_annotation(
        x=mean_epa * 1.2,
        y=mean_panic * 1.25,
        text="Aggressive Risk Takers",
        showarrow=False
    )   

    fig.add_annotation(
        x=mean_epa * 0.8,
        y=mean_panic * 0.75,
        text="Efficient & Composed",
        showarrow=False
    )

    fig.add_annotation(
        x=mean_epa * 1.2,
        y=mean_panic * 0.75,
        text="Safe but Conservative",
        showarrow=False
    )   

    #Additional reference lines
    fig.add_vline(x=mean_epa)
    fig.add_hline(y=mean_panic)

    #Plot chart
    st.plotly_chart(fig, width="stretch", config={"displayModeBar": False})

def show_advanced_qb_comparison(filtered_df, qb1, qb2): 
    #edge case if dropback filter is set to the max and only one QB shows up on the volatility v. efficiency chart
    if filtered_df.shape[0] < 2:
        st.info("Only one QB matches the current filters, so the volatility scatterplot is hidden.")
        return
    
    qb1_data = filtered_df[filtered_df['player_display_name'] == qb1].iloc[0].copy()
    qb2_data = filtered_df[filtered_df['player_display_name'] == qb2].iloc[0].copy()

    #transform negative_epa_rate and panic_play_rate to match the direction of the cortisol score metric
    qb1_data['negative_epa_rate'] = 1 - qb1_data['negative_epa_rate'] 
    qb2_data['negative_epa_rate'] = 1 - qb2_data['negative_epa_rate']
    qb1_data['panic_play_rate'] = 1 - qb1_data['panic_play_rate']
    qb2_data['panic_play_rate'] = 1 - qb2_data['panic_play_rate']
    
    #Make cortisol score out of 100 
    qb1_data['adjusted_cortisol_score'] = 100 * qb1_data['adjusted_cortisol_score']
    qb2_data['adjusted_cortisol_score'] = 100 * qb2_data['adjusted_cortisol_score']

    #compute deltas for each comparison metric
    cortisol_score_delta_1 = qb1_data['adjusted_cortisol_score'] - qb2_data['adjusted_cortisol_score']
    cortisol_score_delta_2 = qb2_data['adjusted_cortisol_score'] - qb1_data['adjusted_cortisol_score']

    left,right = st.columns(2)

    with left: 
        st.markdown(f"### {qb1_data['player_display_name']} ({qb1_data['team']})")
        st.metric(
            "Stabilized Cortisol Rating",
            f"{qb1_data['adjusted_cortisol_score']:.1f}",
            delta=f"{cortisol_score_delta_1:.1f}"
        )
        st.metric("Stabilized Rank", int(qb1_data['adjusted_cortisol_rank']))
        st.metric("Dropbacks", int(qb1_data['total_dropbacks']))

    with right:
        st.markdown(f"### {qb2_data['player_display_name']} ({qb2_data['team']})")
        st.metric(
            "Stabilized Cortisol Rating",
            f"{qb2_data['adjusted_cortisol_score']:.1f}",
            delta=f"{cortisol_score_delta_2:.1f}"
        )
        st.metric("Stabilized Rank", int(qb2_data['adjusted_cortisol_rank']))
        st.metric("Dropbacks", int(qb2_data['total_dropbacks']))

def show_advanced_metrics_chart(filtered_df, qb1, qb2):
    qb1_data = filtered_df[filtered_df['player_display_name'] == qb1].iloc[0].copy()
    qb2_data = filtered_df[filtered_df['player_display_name'] == qb2].iloc[0].copy()

    #transform negative_epa_rate and panic_play_rate so that "higher rates are better", making it consistent with cortisol scores
    qb1_data['negative_epa_rate'] = 1 - qb1_data['negative_epa_rate']
    qb2_data['negative_epa_rate'] = 1 - qb2_data['negative_epa_rate']
    qb1_data['panic_play_rate'] = 1 - qb1_data['panic_play_rate']
    qb2_data['panic_play_rate'] = 1 - qb2_data['panic_play_rate']

    #make every metric out of 100
    qb1_data['negative_epa_rate'] = 100 * qb1_data['negative_epa_rate'] 
    qb1_data['panic_play_rate'] = 100 * qb1_data['panic_play_rate'] 
    qb1_data['third_down_conversion_rate'] = 100 * qb1_data['third_down_conversion_rate'] 
    qb1_data['third_and_long_conversion_rate'] = 100 * qb1_data['third_and_long_conversion_rate']
    qb1_data['redzone_td_rate'] = 100 * qb1_data['redzone_td_rate']

    qb2_data['negative_epa_rate'] = 100 * qb2_data['negative_epa_rate'] 
    qb2_data['panic_play_rate'] = 100 * qb2_data['panic_play_rate'] 
    qb2_data['third_down_conversion_rate'] = 100 * qb2_data['third_down_conversion_rate'] 
    qb2_data['third_and_long_conversion_rate'] = 100 * qb2_data['third_and_long_conversion_rate']
    qb2_data['redzone_td_rate'] = 100 * qb2_data['redzone_td_rate']

    chart_df = pd.DataFrame({
        "Metric": ["Down-to-Down Sustainability", "Pressure Composure", "Third Down Execution","Third and Long Execution",  "Redzone TD Rate", "Down-to-Down Sustainability", "Pressure Composure", "Third Down Execution","Third and Long Execution",  "Redzone TD Rate"],
        "QB": [qb1, qb1, qb1, qb1, qb1, qb2, qb2, qb2, qb2, qb2],
        "Score": [
            qb1_data["negative_epa_rate"],
            qb1_data["panic_play_rate"],
            qb1_data["third_down_conversion_rate"],
            qb1_data["third_and_long_conversion_rate"],
            qb1_data["redzone_td_rate"],
            qb2_data["negative_epa_rate"],
            qb2_data["panic_play_rate"],
            qb2_data["third_down_conversion_rate"],
            qb2_data["third_and_long_conversion_rate"],
            qb2_data["redzone_td_rate"]
        ]
    })

    bars = alt.Chart(chart_df).mark_bar(size=34).encode(
        x=alt.X(
            "Metric:N",
            title="Advanced Metrics",
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
        height=450
    ).configure(
        background="transparent"
    ).configure_view(
        fill="transparent",
        stroke=None
    )

    st.altair_chart(chart, use_container_width=True)

def show_redzone_td_chart(filtered_df: pd.DataFrame, top_n:int) -> None:
    #configure and sort dataframe
    df = filtered_df.rename(columns={
        "player_display_name": "QB Name",
        "team": "Team",
        "redzone_td_rate": "Redzone Passing TD Rate",
        "total_dropbacks": "Dropbacks"
    })
    df = df[["QB Name", "Team", "Dropbacks", "Redzone Passing TD Rate"]]

    df['Redzone Passing TD Rate'] = df['Redzone Passing TD Rate'] * 100

    st.subheader("Red Zone Passing TD Leaders")

    chart_df = (
        df.sort_values("Redzone Passing TD Rate", ascending=False)
          .head(top_n)
          .copy()
    )

    fig = px.bar(
        chart_df,
        x="Redzone Passing TD Rate",
        y="QB Name",
        orientation="h",
        hover_data={
            "QB Name": True,
            "Redzone Passing TD Rate": ":.3f",
            "Dropbacks": True
        },
        height=550
    )

    fig.update_traces(
        marker=dict(
            color="#0b3d91",
            line=dict(color="white", width=1)
        )
    )

    fig.update_layout(
        bargap=0.30,
        yaxis_title="",
        xaxis_title="Redzone Passing TD Rate (%)",
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        font=dict(color="white"),
        margin=dict(l=140, r=30, t=0, b=40),
        showlegend=False,
        autosize=True
    )

    fig.update_xaxes(showgrid=False, range=[0,100],gridcolor="rgba(255,255,255,0.25)")
    fig.update_yaxes(
        categoryorder="array",
        categoryarray=chart_df["QB Name"][::-1],
        showgrid=False
    )

    st.plotly_chart(fig, width="stretch", config={"displayModeBar": False})

def show_3rd_down_conversion_chart(filtered_df:pd.DataFrame, top_n: int) -> None:
    df = filtered_df.rename(columns={
        "player_display_name": "QB Name",
        "team": "Team",
        "total_dropbacks": "Dropbacks",
        "third_down_regular_conversion_rate": "Regular 3rd Down Conversion Rate",
        "third_and_long_conversion_rate": "Third and Long Conversion Rate"
    })

    st.subheader("3rd Down Performance Leaders")

    df = df[["QB Name", "Team",
        "Dropbacks",
        "Regular 3rd Down Conversion Rate",
        "Third and Long Conversion Rate"
    ]]

    df['Regular 3rd Down Conversion Rate'] = 100 * df['Regular 3rd Down Conversion Rate']

    df['Third and Long Conversion Rate'] = 100 * df['Third and Long Conversion Rate']

    chart_df = (
        df.sort_values("Regular 3rd Down Conversion Rate", ascending=False)
          .head(top_n)
          .copy()
    )

    fig = px.bar(
        chart_df,
        x="Regular 3rd Down Conversion Rate",
        y="QB Name",
        orientation="h",
        hover_data={
            "QB Name": True,
            "Dropbacks": True,
            "Regular 3rd Down Conversion Rate": ":.3f",
            "Third and Long Conversion Rate": ":.3f"
        },
        height=550
    )

    fig.update_traces(
        name="Regular 3rd Down Conversion Rate",
        marker=dict(
            color="#9bd1ff",
            line=dict(color="white", width=1)
        ),
        width=0.6
    )

    fig.add_bar(
        x=chart_df["Third and Long Conversion Rate"],
        y=chart_df["QB Name"],
        orientation="h",
        name="Third and Long Conversion Rate",
        marker=dict(
            color="#0b3d91",
            line=dict(color="white", width=1)
        ),
        width=0.6,
        hovertemplate=(
            "<b>%{y}</b><br>"
            "3rd & Long Conversion Rate: %{x:.3f}<extra></extra>"
        )
    )

    fig.update_layout(
        barmode="overlay",
        bargap=0.30,
        yaxis_title="",
        xaxis_title="Conversion Rate (%)",
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        font=dict(color="white"),
        legend=dict(
            title="",
            orientation="h",
            x=0.5,
            y=1.02,
            xanchor="center",
            yanchor="bottom",
            bgcolor="rgba(0,0,0,0)",
            font=dict(color="white")
        ),
        margin=dict(l=140, r=30, t=0, b=40),
        autosize=True
    )

    fig.update_xaxes(showgrid=False, range=[0,100], gridcolor="rgba(255,255,255,0.25)")
    fig.update_yaxes(
        categoryorder="array",
        categoryarray=chart_df["QB Name"][::-1],
        showgrid=False
    )

    st.plotly_chart(fig, width="stretch", config={"displayModeBar": False})

def generate_qb_pressure_profile_desc(qb_data, percentile_cols):
    #Convert percentile slice to numeric type before calling nlargest and nsmallest
    qb_data = pd.to_numeric(qb_data[percentile_cols], errors="coerce")
    #Create top two strengths and biggest weakness
    top_two_strengths = qb_data.nlargest(2)
    strength_1 = top_two_strengths.index[0].replace("_pct", "")
    strength_2 = top_two_strengths.index[1].replace("_pct", "")
    strength_1_val = top_two_strengths.iloc[0]
    strength_2_val = top_two_strengths.iloc[1]

    biggest_weakness = qb_data.nsmallest(1)
    weakness_1 = biggest_weakness.index[0].replace("_pct", "")
    weakness_1_val = biggest_weakness.iloc[0]

    #Quantify percentiles
    def percentile_to_adj(val):
        if val >= 90:
            return "Elite"
        elif val >= 80:
            return "Excellent"
        elif val >= 70:
            return "Strong"
        elif val >= 55:
            return "Above-average"
        elif val >= 45:
            return "Average"
        elif val >= 30:
            return "Below Average"
        else:
            return "Weak"
    
    #Convert values to adjectives and build description
    adj_1 = percentile_to_adj(strength_1_val)
    adj_2 = percentile_to_adj(strength_2_val)
    adj_3 = percentile_to_adj(weakness_1_val)


    templates = [
        f"{adj_1.capitalize()} {strength_1.lower()} and {adj_2} {strength_2.lower()}, but {adj_3} {weakness_1.lower()}.",

        f"Shows {adj_1} {strength_1.lower()} and {adj_2} {strength_2.lower()}, though {weakness_1.lower()} is {adj_3.lower()}.",

        f"Excels in {strength_1.lower()} and {strength_2.lower()}, but {weakness_1.lower()} remains {adj_3.lower()}.",

        f"{strength_1.capitalize()} and {strength_2.lower()} stand out as strengths, though {weakness_1.lower()} is {adj_3.lower()}.",

        f"A {adj_1} performer in {strength_1.lower()} with {adj_2} {strength_2.lower()}, but {weakness_1.lower()} is {adj_3.lower()}."
    ]

    qb_description = random.choice(templates)
    return qb_description

def show_qb_pressure_profile(filtered_df):
    st.subheader("QB Pressure Profile")

    df= filtered_df.rename(columns={
        "player_display_name":"QB Name",
        "season": "Season",
        "team": "Team",
        "turnover_score": "Ball Security",
        "drive_score": "Drive Sustainability",
        "success_score": "Play Success",
        "negative_epa_rate": "Down-to-Down Sustainability",
        "panic_play_rate": "Pressure Composure",
        "third_down_conversion_rate": "Third Down Execution",
        "third_and_long_conversion_rate": "Third and Long Execution",
        "third_down_regular_conversion_rate": "Standard Third Down Execution",
        "redzone_td_rate": "Red Zone Finishing"
    })

    df = df[['QB Name', 'Season', 'Team', 'Ball Security', 'Drive Sustainability', 'Play Success', 'Down-to-Down Sustainability', 'Pressure Composure', 'Third Down Execution', 'Third and Long Execution', 'Standard Third Down Execution', 'Red Zone Finishing']]
    #transform negative columns so that higher values are better, just like the other metrics 
    df['Down-to-Down Sustainability'] = 1 - df['Down-to-Down Sustainability']
    df['Pressure Composure'] = 1 - df['Pressure Composure']
    percentile_cols = ['Ball Security', 'Drive Sustainability', 'Play Success', 'Down-to-Down Sustainability', 'Pressure Composure', 'Third Down Execution', 'Third and Long Execution', 'Standard Third Down Execution', 'Red Zone Finishing']
    for percentile_col in percentile_cols:
        df[percentile_col+"_pct"] = 100*df[percentile_col].rank(pct=True)
    
    qb_list = df['QB Name'].sort_values().unique()
    qb = st.selectbox("Select QB for Pressure Profile", qb_list)
    qb_data = df[df['QB Name'] == qb].iloc[0].copy()
    percentile_pct_cols = [col + "_pct" for col in percentile_cols]
    qb_description = generate_qb_pressure_profile_desc(qb_data, percentile_pct_cols)
    qb_data['QB Description'] = qb_description

    #make copy of df that will be used for the pressure profile and tidy df 
    profile_df = qb_data[percentile_pct_cols].to_frame(name="Percentile").reset_index()
    profile_df = profile_df.rename(columns={
        "index":"Trait"
    })
    profile_df["Trait"] = profile_df["Trait"].str.replace("_pct", "", regex=False)
    profile_df["Percentile"] = pd.to_numeric(profile_df["Percentile"], errors="coerce")
    profile_df = profile_df.dropna(subset=["Percentile"]).copy()
    profile_df["Percentile"] = profile_df["Percentile"].round(0).astype(int)
    profile_df = profile_df.sort_values(by="Percentile",ascending=False)

    st.markdown(f"### {qb_data['QB Name']} ({qb_data['Team']})")
    st.markdown("**Description**")
    st.markdown(f"*{qb_data['QB Description']}*")

    fig = px.bar(
        profile_df,
        x= "Percentile",
        y= "Trait",
        orientation="h"
    )

    fig.update_xaxes(range=[0,100])
    fig.update_yaxes(autorange="reversed")

    fig.update_layout(
        barmode="overlay",
        bargap=0.30,
        plot_bgcolor="rgba(0,0,0,0)",
        paper_bgcolor="rgba(0,0,0,0)",
        font=dict(color="white"),
        autosize=True,
        showlegend=False
    )

    fig.add_trace(go.Bar(
        x=profile_df['Percentile'],
        y=profile_df['Trait'],
        text=profile_df['Percentile'],
        marker=dict(
            color=profile_df['Percentile'], # Color based on the y value
            colorscale='Blues', # Use a built-in continuous color scale
            showscale=False # Hide the color scale if not needed
        ),
        orientation="h"
    ))

    #reduces hover clutter
    fig.update_traces(hovertemplate="%{y}: %{x}th percentile<extra></extra>")

    st.plotly_chart(fig, width="stretch", config={"displayModeBar": False})

    st.caption("Traits represent percentile rankings relative to other qualified QBs in the selected season.")


@st.cache_data
def load_data():
    return fetch_advanced_metrics()

def main():
    #Set up title 
    st.title("📈 QB Advanced Metrics")

    #Load data
    df = load_data()
    left, right = st.columns([3.7,1.3], gap="large")

    with right:
        #global filters
        st.markdown('<div class="filter-card">', unsafe_allow_html=True)
        st.markdown('<div class="filter-title">Filters</div>', unsafe_allow_html=True)
        filtered_df, top_n = show_shared_filters(df)
        st.markdown('</div>', unsafe_allow_html=True)

        if filtered_df.empty:
            st.warning("No quarterbacks meet the current filter criteria. Try lowering the minimum dropbacks.")
            st.stop()
    with left:
        #Show scatterplot at the top of the webpage
        show_epa_panic_play_plot(filtered_df)

        st.subheader("Advanced QB Comparison")

        qb_list = filtered_df['player_display_name'].sort_values().unique()
        if len(qb_list) < 2:
            st.info("Only one QB matches the current filters. Lower the minimum dropbacks to compare multiple QBs.")
        else:
            qb1 = st.selectbox("Select QB1 for comparison", qb_list)
            qb2 = st.selectbox("Select QB2 for comparison", qb_list, index=1)

            show_advanced_qb_comparison(filtered_df, qb1, qb2)
            show_advanced_metrics_chart(filtered_df, qb1, qb2)

            show_redzone_td_chart(filtered_df, top_n)
            show_3rd_down_conversion_chart(filtered_df, top_n)

            show_qb_pressure_profile(filtered_df)
if __name__ == "__main__":
    main()