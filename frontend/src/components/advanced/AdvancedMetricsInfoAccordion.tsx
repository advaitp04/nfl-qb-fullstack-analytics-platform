import { useState } from "react";

function AdvancedMetricsInfoAccordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className={`info-accordion${isOpen ? " info-accordion--open" : ""}`}>
      <button
        type="button"
        className="info-accordion__header"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="advanced-metrics-info"
      >
        <span>What do these Advanced QB Metrics measure?</span>
        <span className="info-accordion__icon" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div
        id="advanced-metrics-info"
        className="info-accordion__panel"
        aria-hidden={!isOpen}
      >
        <div className="info-accordion__body">
          <h3>How the Advanced Metrics Work</h3>

          <p>
            <strong>
              Advanced QB metrics describe how often a quarterback creates
              efficient offense, avoids unstable plays, and converts high-value
              situations.
            </strong>
          </p>

          <p>
            These views are meant to explain the drivers behind a QB&apos;s
            stabilized cortisol rating, especially the balance between
            volatility and efficiency.
          </p>

          <hr />

          <h4>Key metrics shown on this page</h4>

          <ul>
            <li>
              <strong>Negative EPA Rate:</strong> The share of dropbacks where
              the offense loses expected points.
            </li>
            <li>
              <strong>Panic Play Rate:</strong> The share of difficult late-down
              plays that become major negative outcomes.
            </li>
            <li>
              <strong>Redzone TD Rate:</strong> How often redzone passing
              opportunities turn into touchdowns.
            </li>
            <li>
              <strong>Third Down Conversion Rate:</strong> How often a QB keeps
              drives alive on third down.
            </li>
            <li>
              <strong>Third and Long Conversion Rate:</strong> How often a QB
              converts high-pressure third-and-long situations.
            </li>
          </ul>

          <hr />

          <p>
            Higher conversion and redzone rates usually indicate stronger
            offensive execution, while higher negative EPA and panic play rates
            indicate more volatility.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AdvancedMetricsInfoAccordion;
