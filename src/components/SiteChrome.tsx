import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ToolHubLogo } from "@/components/ToolHubLogo";

const GITHUB_URL = "https://github.com/jayhsia1997/tool-hub";

type SiteChromeProps = {
  children: React.ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="site-brand">
            <ToolHubLogo className="brand-logo" width={32} height={32} />
            <span className="brand-copy">
              <span className="brand-title">Tool Hub</span>
              <span className="brand-tagline">A collection of focused tools</span>
            </span>
          </Link>

          <div className="site-header-actions">
            <a
              className="site-icon-link"
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
            >
              <GitHubIcon />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {children}

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p className="site-footer-copy">
            © {new Date().getFullYear()} Tool Hub. Built for everyday utility.
          </p>
          <a
            className="site-footer-link"
            href="https://github.com/jayhsia1997/tool-hub/issues"
            target="_blank"
            rel="noreferrer"
          >
            Feedback
          </a>
        </div>
      </footer>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 7.5c.85 0 1.71.12 2.51.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}
