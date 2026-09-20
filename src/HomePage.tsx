import { Link } from 'react-router-dom'
import { ToolHubLogo } from './components/ToolHubLogo'

export function HomePage() {
  return (
    <main className="page-canvas home">
      <div className="home-glow" aria-hidden="true" />

      <header className="brand-header">
        <ToolHubLogo className="brand-logo" />
        <div className="brand-copy">
          <h1>Tool Hub</h1>
          <p className="brand-tagline">A collection of focused tools</p>
        </div>
      </header>

      <section className="home-hero" aria-labelledby="home-intro-heading">
        <h2 id="home-intro-heading" className="home-headline">
          Precision tools for everyday focus.
        </h2>
        <p className="home-intro">
          Focused tools for everyday work. Open Countdown Timer when you need a
          clear Target Time display.
        </p>
      </section>

      <section className="featured-section" aria-labelledby="featured-heading">
        <div className="featured-label-row">
          <span className="featured-label" id="featured-heading">
            Featured
          </span>
        </div>

        <ul className="tool-list" aria-label="Available tools">
          <li>
            <Link className="tool-card featured-card" to="/countdown">
              <span className="featured-accent" aria-hidden="true" />
              <span className="tool-card-body">
                <span className="tool-card-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="13" r="8" />
                    <path d="M12 9v4l2.5 1.5" />
                    <path d="M9 3h6" />
                  </svg>
                </span>
                <span className="tool-card-copy">
                  <span className="tool-card-title">Countdown Timer</span>
                  <span className="tool-card-meta">
                    Target Time · Optional message · Fullscreen
                  </span>
                  <span className="tool-card-description">
                    Count down to a Target Time on a readable display.
                  </span>
                </span>
              </span>
              <span className="tool-card-footer">
                <span className="tool-card-footer-label">Open tool</span>
                <span className="tool-card-footer-arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  )
}
