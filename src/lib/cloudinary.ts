/**
 * Cloudinary URL helpers.
 *
 * Assets are stored as full delivery URLs (copy-paste friendly, version-safe).
 * These helpers inject a transformation segment right after `/upload/` so the
 * CDN serves right-sized, modern-format bytes per device.
 */

const UPLOAD_SEGMENT = '/upload/';

/**
 * Inject a transformation string into a Cloudinary delivery URL.
 *
 * mediaUrl('https://res.cloudinary.com/demo/image/upload/v1/pic.jpg', 'f_auto,q_auto,w_800')
 *   -> 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/v1/pic.jpg'
 */
export function mediaUrl(url: string, transform: string): string {
  const index = url.indexOf(UPLOAD_SEGMENT);
  if (index === -1 || !transform) return url;
  const insertAt = index + UPLOAD_SEGMENT.length;
  return `${url.slice(0, insertAt)}${transform}/${url.slice(insertAt)}`;
}

/**
 * Append a transformation after any already in the URL (right before the
 * `/v<version>/` segment), so it runs last. Use this instead of `mediaUrl`
 * when the URL carries its own transforms that must apply first, such as a
 * crop out of a PDF page.
 *
 * appendTransform('.../upload/pg_2,c_crop,w_500/v1/cat.jpg', 'w_600')
 *   -> '.../upload/pg_2,c_crop,w_500/w_600/v1/cat.jpg'
 */
export function appendTransform(url: string, transform: string): string {
  const version = url.match(/\/v\d+\//);
  if (!version || version.index === undefined || !transform) return mediaUrl(url, transform);
  return `${url.slice(0, version.index)}/${transform}${url.slice(version.index)}`;
}

/**
 * Derive a poster-frame JPG from a Cloudinary video URL (frame at 0s).
 *
 * posterUrl('.../video/upload/v1/clip.mp4')
 *   -> '.../video/upload/so_0,f_auto,q_auto,w_800/v1/clip.jpg'
 */
export function posterUrl(
  url: string,
  transform = 'so_0,f_auto,q_auto,c_fill,ar_1:1,w_800',
): string {
  return mediaUrl(url, transform).replace(/\.[a-z0-9]+(\?.*)?$/i, '.jpg$1');
}

/** Square grid-tile transform for images (~600px, modern format). */
export const GRID_IMAGE_TRANSFORM = 'f_auto,q_auto,c_fill,ar_1:1,w_600';

/** Full-size modal transform for images. */
export const MODAL_IMAGE_TRANSFORM = 'f_auto,q_auto,w_1080';

const CLOUD_NAME = 'vimadoors';

interface ListedResource {
  public_id: string;
  version: number;
  format: string;
}

/**
 * Delivery URLs of every image carrying `tag`, via Cloudinary's public
 * resource list (no API key needed), ordered by the numbers in their names:
 * Lam_1, Lam_2 … Lam_23. A tag with no images yet comes back as `[]`.
 */
export async function listByTag(tag: string, signal?: AbortSignal): Promise<string[]> {
  const res = await fetch(
    `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${encodeURIComponent(tag)}.json`,
    { signal },
  );
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Cloudinary list for "${tag}" failed: ${res.status}`);

  const { resources } = (await res.json()) as { resources: ListedResource[] };
  return resources
    .slice()
    .sort((a, b) => a.public_id.localeCompare(b.public_id, undefined, { numeric: true }))
    .map(
      (r) =>
        `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v${r.version}/${r.public_id}.${r.format}`,
    );
}
