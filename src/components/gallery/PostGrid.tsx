import { GalleryPost } from '@/data/gallery';
import PostTile from './PostTile';

export default function PostGrid({
  posts,
  onOpen,
}: {
  posts: GalleryPost[];
  onOpen: (index: number) => void;
}) {
  if (posts.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-muted-foreground">
        No posts to show here yet.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-1.5">
      {posts.map((post, i) => (
        <PostTile key={post.id} post={post} index={i} onOpen={() => onOpen(i)} />
      ))}
    </div>
  );
}
