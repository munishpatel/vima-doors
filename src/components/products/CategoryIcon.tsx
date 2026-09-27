import type { ReactElement } from 'react';

import type { PlaceholderMotif } from '@/data/products';

/** The detail inside the door outline that tells each collection apart. */
const DETAIL: Record<PlaceholderMotif, ReactElement> = {
  flute: <path d="M6 4v16M9 4v16M12 4v16" />,
  inlay: <rect x="5.5" y="4.5" width="9" height="15" />,
  highlight: <path d="M7 4v9l5 4v3" />,
  'cut-paste': <path d="M4 10h8v10M12 10V2" />,
  system: <path d="M6 7h8M6 11h8M6 15h8" />,
  heritage: <path d="M6 4.5h8v6H6zM6 13.5h8v6H6z" />,
  grain: <path d="M7 3c1.5 4-1.5 7 0 11s-1 5 0 7M12 3c-1.5 4 1.5 7 0 11s1 5 0 7" />,
  'book-match': <path d="M10 2v20M6 7l4 3 4-3M6 13l4 3 4-3" />,
  jaali: <path d="M6 12V8a4 4 0 0 1 8 0v4zM8 16h4" />,
};

/** A small line drawing of a door in the collection's design language. */
export default function CategoryIcon({
  motif,
  className,
}: {
  motif: PlaceholderMotif;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 20 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect x="2" y="2" width="16" height="20" rx="0.5" />
      <g strokeWidth="0.9">{DETAIL[motif]}</g>
      <circle cx="15.5" cy="12" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
