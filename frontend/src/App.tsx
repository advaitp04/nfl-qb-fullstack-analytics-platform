import { useState } from "react";
import AdvancedMetricsPage from "./pages/AdvancedMetricsPage";
import HomePage from "./pages/HomePage";
import "./App.css";

function App() {
  const [page, setPage] = useState<"home" | "advanced">("home");

  return (
    <>
      <nav className="app-nav" aria-label="Primary navigation">
        <button
          type="button"
          className={page === "home" ? "app-nav__button app-nav__button--active" : "app-nav__button"}
          onClick={() => setPage("home")}
        >
          Leaderboard
        </button>
        <button
          type="button"
          className={page === "advanced" ? "app-nav__button app-nav__button--active" : "app-nav__button"}
          onClick={() => setPage("advanced")}
        >
          Advanced Metrics
        </button>
      </nav>
      {page === "home" ? <HomePage /> : <AdvancedMetricsPage />}
    </>
  );
}

export default App;
