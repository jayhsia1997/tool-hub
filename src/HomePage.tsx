import { Link } from "react-router-dom";
import { SiteChrome } from "@/components/SiteChrome";
import { TOOL_CATALOG, TOOL_COUNT, type CatalogTool } from "@/tools/catalog";

export function HomePage() {
  return (
    <SiteChrome>
      <main className="page-canvas home">
        <div className="home-glow" aria-hidden="true" />

        <section className="home-hero" aria-labelledby="home-intro-heading">
          <h1 id="home-intro-heading" className="home-headline">
            Precision tools for everyday focus.
          </h1>
          <p className="home-intro">
            Focused tools for everyday work. Open Countdown Timer when you need a clear Target
            Time display.
          </p>
        </section>

        <section className="tool-directory" aria-labelledby="tool-directory-heading">
          <div className="tool-directory-header">
            <div>
              <h2 id="tool-directory-heading" className="tool-directory-title">
                Utility Suite
              </h2>
              <p className="tool-directory-subtitle">
                Single-purpose tools for focused tasks. {TOOL_COUNT} tools in the catalog.
              </p>
            </div>
            <p className="tool-directory-count">{TOOL_COUNT} tools</p>
          </div>

          <ul className="tool-grid" aria-label="Tools">
            {TOOL_CATALOG.map((tool) => (
              <li key={tool.id}>
                <ToolCard tool={tool} />
              </li>
            ))}
          </ul>
        </section>

        <section className="home-info" aria-labelledby="home-info-heading">
          <h2 id="home-info-heading" className="home-info-title">
            Built for focused work
          </h2>
          <p className="home-info-copy">
            Browse the directory, open available tools, and keep configuration on this device.
          </p>
        </section>
      </main>
    </SiteChrome>
  );
}

function ToolCard({ tool }: { tool: CatalogTool }) {
  const body = (
    <>
      <div className="tool-card-top">
        <span className="tool-card-badge">
          {tool.availability === "available" ? "Available" : "Coming soon"}
        </span>
      </div>
      <h3 className="tool-card-title">{tool.name}</h3>
      <p className="tool-card-description">{tool.description}</p>
      <div className="tool-card-footer">
        <span className="tool-card-footer-label">
          {tool.availability === "available" ? "Open tool" : "Not available yet"}
        </span>
        {tool.availability === "available" ? (
          <span className="tool-card-footer-arrow" aria-hidden="true">
            →
          </span>
        ) : null}
      </div>
    </>
  );

  if (tool.availability === "available" && tool.href) {
    return (
      <Link className="tool-card tool-card--available" to={tool.href}>
        {body}
      </Link>
    );
  }

  return (
    <div className="tool-card tool-card--soon" aria-disabled="true">
      {body}
    </div>
  );
}
