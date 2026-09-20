import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="home">
      <h1>Tool Hub</h1>
      <p>A collection of focused tools.</p>
      <ul className="tool-list">
        <li>
          <Link className="tool-card" to="/countdown">
            <span className="tool-card-title">Countdown Timer</span>
            <span className="tool-card-description">
              Count down to a Target Time on a readable display.
            </span>
          </Link>
        </li>
      </ul>
    </main>
  )
}
