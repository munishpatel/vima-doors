import { afterEach, describe, it, expect, vi } from 'vitest';
import { appendTransform, listByTag, mediaUrl, posterUrl } from './cloudinary';

const IMAGE_URL =
  'https://res.cloudinary.com/vimadoors/image/upload/v1784417740/img1_gew173.jpg';
const VIDEO_URL =
  'https://res.cloudinary.com/vimadoors/video/upload/v1784416657/video1_kjmwix.mp4';

describe('mediaUrl', () => {
  it('injects the transform after /upload/ for image URLs', () => {
    expect(mediaUrl(IMAGE_URL, 'f_auto,q_auto,w_800')).toBe(
      'https://res.cloudinary.com/vimadoors/image/upload/f_auto,q_auto,w_800/v1784417740/img1_gew173.jpg',
    );
  });

  it('injects the transform after /upload/ for video URLs', () => {
    expect(mediaUrl(VIDEO_URL, 'f_auto,q_auto')).toBe(
      'https://res.cloudinary.com/vimadoors/video/upload/f_auto,q_auto/v1784416657/video1_kjmwix.mp4',
    );
  });

  it('returns the URL unchanged when /upload/ is absent', () => {
    expect(mediaUrl('https://example.com/img.jpg', 'w_800')).toBe(
      'https://example.com/img.jpg',
    );
  });

  it('returns the URL unchanged when the transform is empty', () => {
    expect(mediaUrl(IMAGE_URL, '')).toBe(IMAGE_URL);
  });
});

describe('appendTransform', () => {
  it('matches mediaUrl when the URL has no transforms yet', () => {
    expect(appendTransform(IMAGE_URL, 'w_800')).toBe(mediaUrl(IMAGE_URL, 'w_800'));
  });

  it('chains after existing transforms so they run first', () => {
    expect(
      appendTransform(
        'https://res.cloudinary.com/vimadoors/image/upload/pg_2,c_crop,w_500/v1790527649/cat.jpg',
        'f_auto,w_600',
      ),
    ).toBe(
      'https://res.cloudinary.com/vimadoors/image/upload/pg_2,c_crop,w_500/f_auto,w_600/v1790527649/cat.jpg',
    );
  });
});

describe('posterUrl', () => {
  it('derives a transformed JPG frame from a video URL', () => {
    expect(posterUrl(VIDEO_URL)).toBe(
      'https://res.cloudinary.com/vimadoors/video/upload/so_0,f_auto,q_auto,c_fill,ar_1:1,w_800/v1784416657/video1_kjmwix.jpg',
    );
  });

  it('accepts a custom transform', () => {
    expect(posterUrl(VIDEO_URL, 'so_0,w_1080')).toBe(
      'https://res.cloudinary.com/vimadoors/video/upload/so_0,w_1080/v1784416657/video1_kjmwix.jpg',
    );
  });
});

describe('listByTag', () => {
  afterEach(() => vi.unstubAllGlobals());

  const stubFetch = (status: number, body?: unknown) => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    });
    vi.stubGlobal('fetch', fetchMock);
    return fetchMock;
  };

  it('reads the tag list and orders designs by the numbers in their names', async () => {
    const fetchMock = stubFetch(200, {
      resources: [
        { public_id: 'Lam_1_s7aeoi', version: 3, format: 'jpg' },
        { public_id: 'Lam_10_yhkyiw', version: 2, format: 'jpg' },
        { public_id: 'Lam_2_qvnryq', version: 1, format: 'webp' },
      ],
    });

    expect(await listByTag('Laminate Cut Paste')).toEqual([
      'https://res.cloudinary.com/vimadoors/image/upload/v3/Lam_1_s7aeoi.jpg',
      'https://res.cloudinary.com/vimadoors/image/upload/v1/Lam_2_qvnryq.webp',
      'https://res.cloudinary.com/vimadoors/image/upload/v2/Lam_10_yhkyiw.jpg',
    ]);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://res.cloudinary.com/vimadoors/image/list/Laminate%20Cut%20Paste.json',
    );
  });

  it('treats a tag with no images as an empty list', async () => {
    stubFetch(404);
    expect(await listByTag('Teak')).toEqual([]);
  });

  it('throws on any other failure', async () => {
    stubFetch(401);
    await expect(listByTag('Fluted')).rejects.toThrow('401');
  });
});
