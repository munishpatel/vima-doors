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
  stats: { posts: 12, followers: 46, following: 16 },
  bio: [
    '🚪 Exclusive Doors showroom',
    'Manufacture Of All Types Of Doors',
    '📍 HYDERABAD, TELANGANA',
  ],
};

export type Highlight = {
  id: string;
  label: string;
  cover: string;
  stories: string[]; // full-frame story image URLs, shown in order
};

export const HIGHLIGHTS: Highlight[] = [
  {
    id: 'cnc-cutting',
    label: 'CNC Cutting',
    // Cover: Om-sunburst CNC cut on white marble.
    cover: '/assets/cnc-cutting-highlight.png',
    stories: [
      'https://res.cloudinary.com/vimadoors/image/upload/v1784675623/highlight1_chf6a8.jpg',
      'https://res.cloudinary.com/vimadoors/image/upload/v1784675624/highlight2_c0ez5w.jpg',
      'https://res.cloudinary.com/vimadoors/image/upload/v1784675623/highlight3_xbq4hg.jpg',
      'https://res.cloudinary.com/vimadoors/image/upload/v1784675624/highlight4_dwbxpj.jpg',
      'https://res.cloudinary.com/vimadoors/image/upload/v1784675624/highlight5_rtvhj2.jpg',
    ],
  },
];

export const POSTS: GalleryPost[] = [
  {
    id: 'post-11',
    type: 'video',
    src: 'https://res.cloudinary.com/vimadoors/video/upload/v1784675623/highlight_luyhqq.mp4',
    caption:
      'Precision in every pass. ⚙️ Watch our CNC router carve intricate designs into premium teak — where modern technology meets timeless craftsmanship. #vimadoors #cnc #cncrouter #cnccutting #woodworking #doordesign #teakwood #customdoors #interiordesign #hyderabad',
    alt: 'CNC router machine carving decorative designs into a teak wood door panel',
  },
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
  {
    id: 'post-12',
    type: 'image',
    src: 'https://res.cloudinary.com/vimadoors/image/upload/v1784675624/img5_gqryba.jpg',
    caption:
      'Step inside our showroom. 🚪 A world of doors under one roof — teak, laminate, veneer & designer panels, each crafted to make an impression. Visit us in Hyderabad! #vimadoors #showroom #doorshowroom #doors #teakwood #laminatedoor #veneerdoors #doordesign #interiordesign #hyderabad',
    alt: 'Rows of display doors in various designs inside the Vima Doors showroom',
  },
];
