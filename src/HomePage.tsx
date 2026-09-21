import { SiteChrome } from "@/components/SiteChrome";
import { isEditableTarget } from "@/lib/isEditableTarget";
import {
  CATEGORY_FILTERS,
  TOOL_CATALOG,
  TOOL_COUNT,
  filterCatalog,
  type CatalogTool,
  type CategoryFilter,
} from "@/tools/catalog";
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const searchRef = useRef<HTMLInputElement>(null);
  const searchId = useId();

  const filteredTools = filterCatalog(TOOL_CATALOG, { query, category });
  const resultCount = filteredTools.length;
  const resultCountLabel = `${resultCount} ${resultCount === 1 ? "tool" : "tools"}`;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const search = searchRef.current;
      if (!search) {
        return;
      }

      if (event.key === "Escape" && document.activeElement === search) {
        event.preventDefault();
        setQuery("");
        search.blur();
        return;
      }

      const isSlash = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;
      const isCommandK = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey) && !event.altKey;
      if (!isSlash && !isCommandK) {
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();
      search.focus();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <SiteChrome>
      <main className="page-canvas home">
        <div className="home-glow" aria-hidden="true" />

        <section className="home-hero" aria-labelledby="home-intro-heading">
          <h1 id="home-intro-heading" className="home-headline">
            Precision tools for everyday focus.
          </h1>
          <p className="home-intro">Focused tools for everyday work. Open Countdown Timer when you need a clear Target Time display.</p>
        </section>

        <section className="tool-discovery" aria-label="Tool discovery">
          <div className="tool-search">
            <label className="tool-search-label" htmlFor={searchId}>
              Search tools
            </label>
            <div className="tool-search-field">
              <span className="tool-search-icon" aria-hidden="true">
                ⌕
              </span>
              <input
                ref={searchRef}
                id={searchId}
                type="search"
                role="searchbox"
                className="tool-search-input"
                placeholder={`Search ${TOOL_COUNT} tools by name, description, or tag...`}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <span className="tool-search-hint" aria-hidden="true">
                <kbd>⌘</kbd>
                <kbd>K</kbd>
              </span>
            </div>
          </div>

          <div className="category-filters" role="group" aria-label="Filter by category">
            {CATEGORY_FILTERS.map((filter) => {
              const pressed = category === filter.id;
              const label = filter.id === "all" ? `All (${TOOL_COUNT})` : filter.label;
              return (
                <button
                  key={filter.id}
                  type="button"
                  className={pressed ? "category-pill category-pill--active" : "category-pill"}
                  aria-pressed={pressed}
                  onClick={() => setCategory(filter.id)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="tool-directory" aria-labelledby="tool-directory-heading">
          <div className="tool-directory-header">
            <div>
              <h2 id="tool-directory-heading" className="tool-directory-title">
                Utility Suite
              </h2>
              <p className="tool-directory-subtitle">Single-purpose tools for focused tasks. {TOOL_COUNT} tools in the catalog.</p>
            </div>
            <p className="tool-directory-count">{resultCountLabel}</p>
          </div>

          {resultCount === 0 ? (
            <div className="tool-empty" role="status">
              <h3 className="tool-empty-title">No matching tools found</h3>
              <p className="tool-empty-copy">Try searching for generic terms like &quot;time&quot;, &quot;format&quot;, &quot;encode&quot;, or &quot;date&quot;.</p>
              <button type="button" className="tool-empty-clear" onClick={() => setQuery("")}>
                Clear search query
              </button>
            </div>
          ) : (
            <ul className="tool-grid" aria-label="Tools">
              {filteredTools.map((tool) => (
                <li key={tool.id}>
                  <ToolCard tool={tool} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="home-info" aria-labelledby="home-info-heading">
          <h2 id="home-info-heading" className="home-info-title">
            Built for focused work
          </h2>
          <p className="home-info-copy">Browse the directory, open available tools, and keep configuration on this device.</p>
        </section>
      </main>
    </SiteChrome>
  );
}

function ToolCard({ tool }: { tool: CatalogTool }) {
  const body = (
    <>
      <div className="tool-card-top">
        <span className="tool-card-badge">{tool.availability === "available" ? "Available" : "Coming soon"}</span>
      </div>
      <h3 className="tool-card-title">{tool.name}</h3>
      <p className="tool-card-description">{tool.description}</p>
      <div className="tool-card-footer">
        <span className="tool-card-footer-label">{tool.availability === "available" ? "Open tool" : "Not available yet"}</span>
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
