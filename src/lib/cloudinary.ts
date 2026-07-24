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
