import { SiteChrome } from "@/components/SiteChrome";
import { loadFavoriteIds, saveFavoriteIds } from "@/favoritesStorage";
import { isEditableTarget } from "@/lib/isEditableTarget";
import { CATEGORY_FILTERS, TOOL_CATALOG, TOOL_COUNT, filterCatalog, type CatalogTool, type CategoryFilter } from "@/tools/catalog";
import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function HomePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [starredView, setStarredView] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadFavoriteIds());
  const searchRef = useRef<HTMLInputElement>(null);
  const searchId = useId();

  const favoriteIdSet = new Set(favoriteIds);
  const filteredTools = starredView
    ? TOOL_CATALOG.filter((tool) => favoriteIdSet.has(tool.id))
    : filterCatalog(TOOL_CATALOG, { query, category });
  const resultCount = filteredTools.length;
  const resultCountLabel = `${resultCount} ${resultCount === 1 ? "tool" : "tools"}`;
  const emptyStarred = starredView && favoriteIds.length === 0;

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

  function toggleFavorite(toolId: string) {
    setFavoriteIds((current) => {
      const next = current.includes(toolId) ? current.filter((id) => id !== toolId) : [...current, toolId];
      saveFavoriteIds(next);
      return next;
    });
  }

  function selectCategory(next: CategoryFilter) {
    setStarredView(false);
    setCategory(next);
  }

  function showStarredView() {
    setStarredView(true);
    setQuery("");
  }

  function browseAllTools() {
    setStarredView(false);
    setCategory("all");
    setQuery("");
  }

  return (
    <SiteChrome>
      <main className="page-canvas home">
        <div className="home-glow" aria-hidden="true" />

        <section className="home-hero" aria-labelledby="home-intro-heading">
          <h1 id="home-intro-heading" className="home-headline">
            Precision tools for everyday focus.
          </h1>
          <p className="home-intro">Focused tools for everyday work. Open Countdown Timer when you need a clear Target Time display.</p>

          <div className="tool-discovery" role="search" aria-label="Tool discovery">
            <label className="tool-search-label" htmlFor={searchId}>
              Search tools
            </label>
            <div className="tool-search-field">
              <SearchIcon />
              <input
                ref={searchRef}
                id={searchId}
                type="text"
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

            <div className="category-filters" role="group" aria-label="Filter by category">
              {CATEGORY_FILTERS.map((filter) => {
                const pressed = !starredView && category === filter.id;
                const label = filter.id === "all" ? `All (${TOOL_COUNT})` : filter.label;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    className={pressed ? "category-pill category-pill--active" : "category-pill"}
                    aria-pressed={pressed}
                    onClick={() => selectCategory(filter.id)}
                  >
                    {label}
                  </button>
                );
              })}
              <button
                type="button"
                className={starredView ? "category-pill category-pill--active" : "category-pill"}
                aria-pressed={starredView}
                onClick={showStarredView}
              >
                Starred
              </button>
            </div>
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

          {emptyStarred ? (
            <div className="tool-empty" role="status">
              <h3 className="tool-empty-title">No starred tools yet</h3>
              <p className="tool-empty-copy">Star tools from the directory to collect them here. Available and Coming soon tools can both be starred.</p>
              <button type="button" className="tool-empty-clear" onClick={browseAllTools}>
                Browse all tools
              </button>
            </div>
          ) : resultCount === 0 ? (
            <div className="tool-empty" role="status">
              <h3 className="tool-empty-title">No matching tools found</h3>
              <p className="tool-empty-copy">
                Try searching for generic terms like &quot;time&quot;, &quot;format&quot;, &quot;encode&quot;, or &quot;date&quot;.
              </p>
              <button type="button" className="tool-empty-clear" onClick={() => setQuery("")}>
                Clear search query
              </button>
            </div>
          ) : (
            <ul className="tool-grid" aria-label="Tools">
              {filteredTools.map((tool) => (
                <li key={tool.id}>
                  <ToolCard
                    tool={tool}
                    starred={favoriteIdSet.has(tool.id)}
                    onToggleStar={() => toggleFavorite(tool.id)}
                  />
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

function ToolCard({
  tool,
  starred,
  onToggleStar,
}: {
  tool: CatalogTool;
  starred: boolean;
  onToggleStar: () => void;
}) {
  const starLabel = starred ? `Unstar ${tool.name}` : `Star ${tool.name}`;
  const available = tool.availability === "available" && tool.href;

  const body = (
    <>
      <h3 className="tool-card-title">{tool.name}</h3>
      <p className="tool-card-description">{tool.description}</p>
      <div className="tool-card-footer">
        <span className="tool-card-footer-label">{available ? "Open tool" : "Not available yet"}</span>
        {available ? (
          <span className="tool-card-footer-arrow" aria-hidden="true">
            →
          </span>
        ) : null}
      </div>
    </>
  );

  return (
    <div className={available ? "tool-card tool-card--available" : "tool-card tool-card--soon"} {...(available ? {} : { "aria-disabled": true })}>
      <div className="tool-card-top">
        <span className="tool-card-badge">{available ? "Available" : "Coming soon"}</span>
        <button type="button" className={starred ? "tool-card-star tool-card-star--active" : "tool-card-star"} aria-label={starLabel} aria-pressed={starred} onClick={onToggleStar}>
          <StarIcon filled={starred} />
        </button>
      </div>
      {available ? (
        <Link className="tool-card-main" to={tool.href!}>
          {body}
        </Link>
      ) : (
        <div className="tool-card-main">{body}</div>
      )}
    </div>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="tool-card-star-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round">
      <path d="M12 3.5 14.6 9l6 .5-4.6 4 1.4 5.8L12 16.8 6.6 19.3 8 13.5 3.4 9.5l6-.5L12 3.5Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="tool-search-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
