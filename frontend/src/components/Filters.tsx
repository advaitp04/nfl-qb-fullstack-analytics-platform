type Props = {
    season: number;
    setSeason: React.Dispatch<React.SetStateAction<number>>;
  
    seasonType: "REG" | "POST";
    setSeasonType: React.Dispatch<
      React.SetStateAction<"REG" | "POST">
    >;
  };
  
  function Filters({
    season,
    setSeason,
    seasonType,
    setSeasonType,
  }: Props) {
    return (
      <div className="filters">
        <label>
          Season{" "}
          <select
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
          >
            {[
              2025, 2024, 2023, 2022, 2021, 2020,
              2019, 2018, 2017, 2016, 2015,
              2014, 2013, 2012, 2011, 2010,
            ].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
  
        <label>
          Season Type{" "}
          <select
            value={seasonType}
            onChange={(e) =>
              setSeasonType(e.target.value as "REG" | "POST")
            }
          >
            <option value="REG">Regular Season</option>
            <option value="POST">Playoffs</option>
          </select>
        </label>
      </div>
    );
  }
  
  export default Filters;