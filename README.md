# Vima Doors

Website for Vima Doors — a doors manufacturer showcasing their product catalog, brand story, and gallery. Built with Vite, React, and TypeScript.

## 🚀 Features

- **⚡ Lightning Fast**: Vite for instant hot module replacement and optimized builds
- **🎯 Type Safe**: Full TypeScript coverage
- **🎨 Beautiful UI**: shadcn/ui components with Tailwind CSS
- **🎬 Animated**: Motion (Framer Motion) for scroll effects and page transitions
- **📱 Responsive**: Mobile-first design with modern CSS
- **🔧 Developer Experience**: Hot reload, linting, formatting, and testing setup

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks and concurrent features
- **TypeScript 5** - Full type safety across the application
- **Vite 6** - Fast build tool and dev server with HMR
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** + **Radix UI** - Accessible component primitives
- **React Router DOM 7** - Client-side routing
- **Motion** - Scroll effects and animations
- **React Hook Form + Zod** - Form handling and validation
- **TanStack Query** / **Zustand** - Data fetching and state management

### Development Tools

- **ESLint 9** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Fast unit testing

## 📁 Project Structure

```
vima-doors/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui base components
│   │   ├── gallery/      # Gallery-specific components
│   │   └── Spinner.tsx
│   ├── layouts/          # Layout systems
│   │   ├── RootLayout.tsx    # Centralized layout wrapper
│   │   ├── Website.tsx       # Structural container
│   │   ├── Dashboard.tsx     # Dashboard layout
│   │   └── parts/            # Header, Footer
│   ├── pages/            # Page components
│   │   ├── index.tsx     # Homepage
│   │   ├── about.tsx     # About page
│   │   ├── gallery.tsx   # Door catalog / gallery
│   │   ├── contact.tsx   # Contact page
│   │   └── _404.tsx      # 404 page
│   ├── data/             # Static content (e.g. gallery.ts)
│   ├── lib/              # Utilities and API client
│   ├── styles/           # Global styles
│   ├── App.tsx           # Root application component + router
│   ├── main.tsx          # Application entry point
│   └── routes.tsx        # Route definitions
├── public/               # Static assets
└── md_files/             # Notes / working docs
```

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run Vitest unit tests
- `npm run test:ui` - Run Vitest with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` / `npm run lint:fix` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format source files with Prettier
- `npm run clean` / `npm run reset` - Clean build artifacts / reinstall dependencies

## 🔧 Configuration

Copy `env.example` to `.env` and configure:

```env
VITE_APP_NAME=Vima Doors
VITE_PUBLIC_URL=http://localhost:5173
VITE_API_URL=http://localhost:5173/api
NODE_ENV=development
PORT=5173
```

Door imagery is served from Cloudinary (`res.cloudinary.com/vimadoors`); update sources in `src/data/gallery.ts` and `src/pages/index.tsx` as the catalog changes.

## 🗃️ Pages & Layout

- **Home** (`/`) - Hero, trust badges, door showcase, testimonials
- **About** (`/about`) - Brand story
- **Gallery** (`/gallery`) - Full door catalog
- **Contact** (`/contact`) - Contact form/details

Header and footer are configured once via `RootLayout` in `App.tsx` and applied to every page — pages only contain content, not layout concerns. See `src/layouts/*.md` for layout details.

## 🧪 Testing

```bash
npm run test
```

Uses **Vitest** with **React Testing Library** and **Jest DOM** matchers.

## 📦 Deployment

```bash
npm run build
```

Outputs a static build in `dist/`, deployable to any static host (Vercel, Netlify, etc.).

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request

## 📄 License

MIT License
