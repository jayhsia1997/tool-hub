export type ToolAvailability = "available" | "coming-soon";

export type ToolCategory = "time" | "converters" | "developer" | "text";

export type CatalogTool = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  categories: ToolCategory[];
  availability: ToolAvailability;
  href?: "/countdown";
};

export const TOOL_CATALOG: readonly CatalogTool[] = [
  {
    id: "countdown-timer",
    name: "Countdown Timer",
    description: "Count down to a Target Time on a readable display.",
    tags: ["countdown", "timer", "target time", "fullscreen"],
    categories: ["time"],
    availability: "available",
    href: "/countdown",
  },
  {
    id: "stopwatch-split-laps",
    name: "Stopwatch & Split Laps",
    description:
      "Millisecond precision stopwatch supporting rapid spacebar splits, persistent lap history, and CSV data export.",
    tags: ["stopwatch", "split", "lap", "timer", "clock", "precision", "ms"],
    categories: ["time"],
    availability: "coming-soon",
  },
  {
    id: "unix-timestamp-converter",
    name: "Unix Timestamp Converter",
    description:
      "Convert epoch seconds and milliseconds to human-readable local time, ISO 8601, and RFC 2822 instantaneously.",
    tags: ["unix", "epoch", "timestamp", "utc", "local", "date", "time", "convert", "format"],
    categories: ["time", "converters"],
    availability: "coming-soon",
  },
  {
    id: "json-formatter-validator",
    name: "JSON Formatter & Validator",
    description:
      "Clean, parse, and validate dense JSON payloads with error line highlighting, collapsible tree node view, and minification.",
    tags: ["json", "format", "parse", "validate", "tree", "view", "beautify", "lint"],
    categories: ["developer", "text"],
    availability: "coming-soon",
  },
  {
    id: "base64-url-encoder",
    name: "Base64 & URL Encoder",
    description:
      "Instant bidirectional encoding and decoding for raw strings, binary images, query parameters, and hex buffers.",
    tags: ["base64", "url", "encode", "decode", "hash", "string", "binary"],
    categories: ["converters", "developer"],
    availability: "coming-soon",
  },
  {
    id: "regex-tester-cheatsheet",
    name: "Regex Tester & Cheatsheet",
    description:
      "Live regular expression evaluator featuring capture group visualizer, match indexing, and common patterns cheatsheet.",
    tags: ["regex", "pattern", "match", "regular expression", "cheatsheet", "test"],
    categories: ["developer", "text"],
    availability: "coming-soon",
  },
  {
    id: "color-contrast-palette",
    name: "Color Contrast & Palette",
    description:
      "WCAG 2.1 AA/AAA compliance analyzer with real-time luminance ratio testing, hex converters, and palette tokens.",
    tags: ["color", "palette", "contrast", "checker", "wcag", "hex", "rgb", "hsl", "a11y"],
    categories: ["developer", "converters"],
    availability: "coming-soon",
  },
  {
    id: "markdown-live-preview",
    name: "Markdown Live Preview",
    description:
      "Split-screen GitHub-flavored markdown editor with synchronous scrolling, table builder, and raw HTML export.",
    tags: ["markdown", "md", "editor", "preview", "gfm", "writer", "notes", "live", "html", "export"],
    categories: ["text"],
    availability: "coming-soon",
  },
  {
    id: "uuid-ulid-generator",
    name: "UUID & ULID Generator",
    description:
      "Cryptographically secure bulk UUIDv4, UUIDv7, and sortable ULID generator with custom prefixes and case formats.",
    tags: ["uuid", "v4", "ulid", "guid", "unique", "id", "generate", "bulk", "crypto"],
    categories: ["developer"],
    availability: "coming-soon",
  },
  {
    id: "text-code-diff-checker",
    name: "Text & Code Diff Checker",
    description:
      "Side-by-side and inline character-level difference calculator. Detect additions, removals, and whitespace alterations.",
    tags: ["diff", "compare", "text", "changes", "side by side", "character", "line", "patch"],
    categories: ["text", "developer"],
    availability: "coming-soon",
  },
] as const;

export const TOOL_COUNT = TOOL_CATALOG.length;
