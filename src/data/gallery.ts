import { posterUrl } from '@/lib/cloudinary';

/**
 * Curated gallery content mirroring the live @vimadoors Instagram profile.
 * Adding a future post = paste one more Cloudinary URL + caption here.
 */

export type GalleryPost = {
  id: string;
  type: 'image' | 'video';
  src: string;
  caption: string;
  alt: string;
};

export const PROFILE = {
  handle: 'vimadoors',
  name: 'Shree Shankar Vijay Traders (Vima doors)',
  // The white-circle ViMa Doors avatar is composed of the door mark +
  // wordmark, the same pairing used in the site Header.
  avatar: { mark: '/assets/title-logo.png', wordmark: '/assets/logo.png' },
  url: 'https://instagram.com/vimadoors',
  stats: { posts: 11, followers: 46, following: 16 },
  bio: [
    '🚪 Exclusive Doors showroom',
    'Manufacture Of All Types Of Doors',
    '📍 HYDERABAD, TELANGANA',
  ],
};

export const HIGHLIGHTS = [
  {
    id: 'cnc-cutting',
    label: 'CNC Cutting',
    // Stand-in cover: poster frame of the teak-carving reel. Swap for a
    // dedicated cover URL when available.
    cover: posterUrl(
      'https://res.cloudinary.com/vimadoors/video/upload/v1784416657/video1_kjmwix.mp4',
      'so_0,f_auto,q_auto,c_fill,ar_1:1,w_160',
    ),
  },
];

export const POSTS: GalleryPost[] = [
  {
    id: 'post-1',
    type: 'video',
    src: 'https://res.cloudinary.com/vimadoors/video/upload/v1784416657/video1_kjmwix.mp4',
    caption:
      'Where craftsmanship meets legacy. 👑 Pure teak. Pure art. Pure legacy. #teakwood #woodcarving #luxuryhomes #hyderabad #trendingreels',
    alt: 'Hand-carved pure teak wood door being crafted',
  },
  {
    id: 'post-2',
    type: 'video',
    src: 'https://res.cloudinary.com/vimadoors/video/upload/v1784416658/video2_ysrknk.mp4',
    caption:
      'Crafted with precision, designed with passion. This premium wooden door brings together timeless beauty and modern detailing for the perfect first impression. 🌟 #vimadoors #doors #luxurydoors #hyderabad #interiordesign #doordesign #luxuryhomes #moderndesign #luxurydesign #luxuryinterior #homeupgrade #wood #woodworking #homedecor #trending',
    alt: 'Premium wooden door with modern detailing',
  },
  {
    id: 'post-3',
    type: 'image',
    src: 'https://res.cloudinary.com/vimadoors/image/upload/v1784417740/img1_gew173.jpg',
    caption:
      'Redefining elegance with craftsmanship. A perfect blend of modern design and timeless woodwork – built to make an impression every time you open the door. 🚪🌟 🔹 Premium Quality 🔹 Elegant Design 🔹 Long-lasting Finish 📩 DM us today to customize your dream door! #vimadoors #tranding #InteriorDesign #luxurydoors #Woodwork #HomeDecor #CustomDesign #modernlivingroom #doorsondoors #doors #doordecor #door #hyderabad',
    alt: 'Elegant modern wooden door with timeless woodwork finish',
  },
  {
    id: 'post-4',
    type: 'video',
    src: 'https://res.cloudinary.com/vimadoors/video/upload/v1784416656/video3_pikgrp.mp4',
    caption:
      'Grooved Door 🚪 #vimadoors #door #mdf #mdfdesign #mdfdoors #doordesign #interiordoors #interior #interiordesigns #wood #groove #groovedesign #groovedoors #hyderabad',
    alt: 'Grooved MDF door design',
  },
  {
    id: 'post-5',
    type: 'video',
    src: 'https://res.cloudinary.com/vimadoors/video/upload/v1784416657/video4_nq1t9v.mp4',
    caption:
      'Teak Wood Pooja Door 🚪 (Indian Teak A+ Grade Full Colour) #vimadoors #teakwood #poojadoor #poojadoordesign #doordesign #doors #interiordesign #interior #hyderabad',
    alt: 'Indian teak A+ grade pooja room door',
  },
  {
    id: 'post-6',
    type: 'image',
    src: 'https://res.cloudinary.com/vimadoors/image/upload/v1784417741/img2_crqut8.jpg',
    caption: 'Gold Patti Premium Door (highest quality standards)',
    alt: 'Gold patti premium door',
  },
  {
    id: 'post-7',
    type: 'video',
    src: 'https://res.cloudinary.com/vimadoors/video/upload/v1784416658/video5_wvfht8.mp4',
    caption:
      'Golden T Patti Laminate Door 🚪 #vimadoors #laminatedoor #doors #goldtpatti #laminates #doordesign #doorfittings #plywood #flashdoor #hyderabad',
    alt: 'Golden T patti laminate door',
  },
  {
    id: 'post-8',
    type: 'video',
    src: 'https://res.cloudinary.com/vimadoors/video/upload/v1784416658/video6_pectco.mp4',
    caption: 'Laminate Door 🚪 #vimadoors #laminatedoor #maindoordesign',
    alt: 'Laminate main door design',
  },
  {
    id: 'post-9',
    type: 'image',
    src: 'https://res.cloudinary.com/vimadoors/image/upload/v1784417741/img3_c85oeo.jpg',
    caption: 'New Laminate with Highlighter Door #vimadoors',
    alt: 'New laminate door with highlighter panel',
  },
  {
    id: 'post-10',
    type: 'image',
    src: 'https://res.cloudinary.com/vimadoors/image/upload/v1784417742/img4_gac1h3.jpg',
    caption: 'Work Place and workshop',
    alt: 'The Vima Doors workshop and work place',
  },
];
