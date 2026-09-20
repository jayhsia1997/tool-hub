import type { SVGProps } from 'react'

/** Exact four-tile logo from the approved visual identity (48×48 viewBox). */
export function ToolHubLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      aria-label="Tool Hub"
      viewBox="0 0 48 48"
      width={48}
      height={48}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="48" height="48" rx="12" fill="#18181B" />
      <rect x="10" y="10" width="12" height="12" rx="4" fill="#FFFFFF" />
      <rect x="26" y="10" width="12" height="12" rx="4" fill="#71717A" />
      <rect x="10" y="26" width="12" height="12" rx="4" fill="#3F3F46" />
      <rect
        x="26"
        y="26"
        width="12"
        height="12"
        rx="4"
        fill="none"
        stroke="#A1A1AA"
        strokeWidth="2"
        strokeDasharray="2 2"
      />
    </svg>
  )
}
