import { useState } from "react";

function InfoAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={`info-accordion${isOpen ? " info-accordion--open" : ""}`}>
      <button
        type="button"
        className="info-accordion__header"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="cortisol-index-info"
      >
        <span>What is the NFL QB Cortisol Index?</span>
        <span className="info-accordion__icon" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div
        id="cortisol-index-info"
        className="info-accordion__panel"
        aria-hidden={!isOpen}
      >
        <div className="info-accordion__body">
          <h3>How the Cortisol Model Works</h3>

          <p>
            <strong>
              The NFL QB Cortisol Index measures how stressful an NFL
              quarterback&apos;s playstyle is for their own team.
            </strong>
          </p>

          <p>
            Quarterbacks that routinely avoid game-killing mistakes while
            generating efficient and stable offensive success have higher
            Cortisol scores.
          </p>

          <p>
            Quarterbacks that commit frequent turnovers or fail to generate
            reliable offensive production are more volatile and have lower
            Cortisol scores.
          </p>

          <hr />

          <h4>The Cortisol Score is calculated using three normalized components</h4>

          <ul>
            <li>
              <strong>Turnover Score:</strong> Measures how well a QB avoids
              game-killing mistakes such as interceptions, sacks, and lost
              fumbles.
            </li>
            <li>
              <strong>Drive Score:</strong> Measures a QB&apos;s ability to
              consistently sustain drives and avoid offensive mistakes.
            </li>
            <li>
              <strong>Success Score:</strong> Measures offensive productivity
              using efficiency metrics such as yards per attempt, EPA per
              dropback, and touchdown rate.
            </li>
          </ul>

          <hr />

          <p>
            The <strong>Cortisol Score</strong> is the average of these three
            subscores.
          </p>

          <p>
            Because quarterbacks with small sample sizes can produce misleading
            results, the model includes a{" "}
            <strong>Stabilized Cortisol Score</strong>, which adjusts the score
            based on total dropbacks during the season.
          </p>
        </div>
      </div>
    </section>
  );
}

export default InfoAccordion;
