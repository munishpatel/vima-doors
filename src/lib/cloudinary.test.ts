import { describe, it, expect } from 'vitest';
import { mediaUrl, posterUrl } from './cloudinary';

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
