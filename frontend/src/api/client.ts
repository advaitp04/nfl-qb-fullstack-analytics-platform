const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type QBRecord = {
    player_display_name: string,
    season: number, 
    season_type: string, 
    team: string, 
    total_dropbacks: number, 
    adjusted_cortisol_score: number,
    adjusted_cortisol_rank: number 
};

export type QBListResponse = {
    count: number,
    records: QBRecord[]
};

export async function fetchQbs(params: {
    season?: number;
    season_type?: "REG" | "POST";
    limit?: number;
    offset?: number;
    sort_by?: string;
    sort_order?: "asc" | "desc";
} = {}): Promise<QBListResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value != undefined && value != null) {
            searchParams.append(key, String(value))
        }
    });

    const response = await fetch (
        `${API_BASE_URL}/api/qbs?${searchParams}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch QB data");
    }

    return response.json();
}



