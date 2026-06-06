import { useState } from "react";

function InfoAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="info-accordion">
      <button
        className="info-accordion-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>What is the NFL QB Cortisol Index?</span>
        <span>{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div className="info-accordion-body">
          <h3>How the Cortisol Model Works</h3>

          <p>
            The NFL QB Cortisol Index measures how stressful an NFL
            quarterback&apos;s playstyle is for their own team.
          </p>

          <p>
            Quarterbacks that avoid game-killing mistakes while generating
            efficient offensive success have higher Cortisol scores.
          </p>

          <h4>The score is calculated using three normalized components:</h4>

          <ul>
            <li>
              <strong>Turnover Score:</strong> Measures how well a QB avoids
              interceptions, sacks, and lost fumbles.
            </li>
            <li>
              <strong>Drive Score:</strong> Measures a QB&apos;s ability to
              consistently sustain drives.
            </li>
            <li>
              <strong>Success Score:</strong> Measures offensive productivity
              using yards per attempt, EPA per dropback, and touchdown rate.
            </li>
          </ul>

          <p>
            The Cortisol Score is the average of these three subscores. The
            Stabilized Cortisol Score adjusts for total dropbacks to reduce
            small-sample noise.
          </p>
        </div>
      )}
    </section>
  );
}

export default InfoAccordion;