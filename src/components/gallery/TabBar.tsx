import { Grid3x3, Clapperboard, SquareUser } from 'lucide-react';

export type GalleryTab = 'posts' | 'reels' | 'tagged';

const TABS: { id: GalleryTab; label: string; icon: typeof Grid3x3 }[] = [
  { id: 'posts', label: 'Posts', icon: Grid3x3 },
  { id: 'reels', label: 'Reels', icon: Clapperboard },
  { id: 'tagged', label: 'Tagged', icon: SquareUser },
];

export default function TabBar({
  active,
  onChange,
}: {
  active: GalleryTab;
  onChange: (tab: GalleryTab) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Gallery views"
      className="flex items-center justify-center gap-10 border-t border-border md:gap-16"
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`-mt-px flex items-center gap-2 border-t py-4 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
              isActive
                ? 'border-foreground text-foreground'
                : 'border-transparent text-muted-foreground/70 hover:text-foreground'
            }`}
          >
            <Icon size={13} strokeWidth={isActive ? 2.25 : 1.75} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
