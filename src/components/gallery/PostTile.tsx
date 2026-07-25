import { motion } from 'motion/react';
import { Clapperboard, Play, ZoomIn } from 'lucide-react';
import { GalleryPost } from '@/data/gallery';
import { mediaUrl, posterUrl, GRID_IMAGE_TRANSFORM } from '@/lib/cloudinary';

export default function PostTile({
  post,
  index,
  onOpen,
}: {
  post: GalleryPost;
  index: number;
  onOpen: () => void;
}) {
  const thumb =
    post.type === 'video'
      ? posterUrl(post.src)
      : mediaUrl(post.src, GRID_IMAGE_TRANSFORM);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: (index % 3) * 0.06 }}
      className="group relative block aspect-square w-full overflow-hidden bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={`Open post: ${post.alt}`}
    >
      <img
        src={thumb}
        alt={post.alt}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />

      {/* Video badge, top-right, like IG reels */}
      {post.type === 'video' && (
        <span className="absolute right-2.5 top-2.5 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
          <Clapperboard size={16} className="fill-white/20" />
        </span>
      )}

      {/* Hover scrim (desktop): play affordance for video, zoom for images */}
      <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/45 group-hover:opacity-100 group-focus-visible:bg-black/45 group-focus-visible:opacity-100">
        <span className="flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
          {post.type === 'video' ? (
            <Play size={18} className="ml-0.5 fill-white text-white" />
          ) : (
            <ZoomIn size={18} className="text-white" />
          )}
        </span>
      </span>
    </motion.button>
  );
}
