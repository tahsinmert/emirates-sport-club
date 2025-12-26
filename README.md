# Emirates Sport Club

Premium, video-centric football club website built with SvelteKit, TypeScript, and Tailwind CSS.

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Development](#development)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Key Features](#key-features)
- [Utilities](#utilities)

## 🎯 About

Emirates Sport Club is a premium football club website built with modern web technologies. It stands out with its video-centric design, smooth animations, and user-friendly interface.

The website consists of the following main sections:

- **Home**: Impressive first impression with video hero sections
- **Squad**: Player list, profiles, and statistics
- **Academy**: Youth development program and application form
- **News**: Club news, match reports, and transfer news
- **Store**: Official club products and collections

## ✨ Features

- 🎬 Impressive user experience with video-centric hero sections
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Advanced scroll animations with GSAP ScrollTrigger
- 🌊 Smooth scrolling with Lenis
- ⚡ Fast page transitions with SvelteKit
- 🎯 Type safety with TypeScript
- 🎭 Customizable cursor effects
- 🔄 Page transition animations
- 📊 Dynamic content management

## 🛠 Tech Stack

### Frameworks and Languages
- **[SvelteKit](https://kit.svelte.dev/)** (v2.49.1) - Modern web framework
- **[TypeScript](https://www.typescriptlang.org/)** (v5.9.3) - Type safety
- **[Svelte](https://svelte.dev/)** (v5.45.6) - Reactive UI framework

### Styling and Design
- **[Tailwind CSS](https://tailwindcss.com/)** (v4.1.18) - Utility-first CSS framework
- **[PostCSS](https://postcss.org/)** (v8.5.6) - CSS processing
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** (v10.4.23) - CSS vendor prefixes

### Animation and Interaction
- **[GSAP](https://greensock.com/gsap/)** (v3.14.2) - Advanced animation library
- **[Lenis](https://lenis.studiofreight.com/)** (v1.3.16) - Smooth scrolling
- **[Lucide Svelte](https://lucide.dev/)** (v0.562.0) - Icon library

### Development Tools
- **[Vite](https://vitejs.dev/)** (v7.2.6) - Build tool and development server
- **[Svelte Check](https://github.com/sveltejs/language-tools)** (v4.3.4) - TypeScript checking

## 📦 Requirements

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or **yarn**, **pnpm**)

## 🚀 Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd emirates-sport-club
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 💻 Development

### Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run TypeScript check
npm run check

# Run TypeScript check in watch mode
npm run check:watch
```

### Development Server

The development server runs on `http://localhost:5173` by default. You can modify the port settings in the `vite.config.ts` file.

### Build and Deployment

To create a production build:

```bash
npm run build
```

The build output will be saved to the `build/` folder. To test the build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
emirates-sport-club/
├── src/
│   ├── lib/
│   │   ├── components/          # Reusable Svelte components
│   │   │   ├── AcademyForm.svelte
│   │   │   ├── CustomCursor.svelte
│   │   │   ├── Footer.svelte
│   │   │   ├── Header.svelte
│   │   │   ├── Navbar.svelte
│   │   │   ├── PageTransition.svelte
│   │   │   ├── Preloader.svelte
│   │   │   └── VideoCard.svelte
│   │   ├── stores/              # Svelte stores
│   │   │   └── preloader.ts
│   │   ├── types/               # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── utils/               # Utility functions
│   │   │   ├── gsap.ts          # GSAP configuration
│   │   │   ├── lenis.ts         # Lenis configuration
│   │   │   └── index.ts
│   │   └── assets/              # Static assets
│   │       └── favicon.svg
│   ├── routes/                  # SvelteKit routes
│   │   ├── +layout.svelte       # Main layout
│   │   ├── +page.svelte         # Home page
│   │   ├── academy/             # Academy page
│   │   ├── news/                # News page
│   │   │   └── [slug]/          # Dynamic news detail page
│   │   ├── squad/               # Squad page
│   │   │   └── [id]/            # Dynamic player detail page
│   │   └── store/               # Store page
│   └── app.css                  # Global CSS
├── static/                      # Static files
│   ├── *.mp4                    # Video files
│   ├── favicon.svg
│   ├── manifest.json
│   └── robots.txt
├── package.json
├── svelte.config.js             # SvelteKit configuration
├── vite.config.ts               # Vite configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🎨 Design System

### Color Palette

- **Primary (Emirates Gold)**: `#D4AF37` - Main brand color
- **Secondary (Midnight Black)**: `#0A0A0A` - Background and accent
- **Accent (Pure White)**: `#FFFFFF` - Text and contrast

### Typography

- **Headlines**: **Oswald** (Google Fonts)
  - Uppercase, bold
  - Usage: Hero headlines, section titles

- **Body Text**: **Inter** (Google Fonts)
  - Clean, geometric sans-serif
  - Usage: Paragraphs, descriptions

### Spacing and Layout

The project uses Tailwind CSS's utility-first approach. The standard spacing scale (4px, 8px, 16px, 24px, etc.) is used.

## 🔑 Key Features

### Video Hero Sections

Full-screen video backgrounds are used for each section on the home page. Stacked pinning effect is applied with GSAP ScrollTrigger.

### Smooth Scrolling

Smooth scrolling is provided across the entire site using the Lenis library.

### Responsive Design

- **Desktop** (769px+): Full-featured animations and stacked pinning
- **Mobile** (≤768px): Optimized scroll and lighter animations

### Page Transitions

Custom animations are used for page transitions. Managed with the `PageTransition.svelte` component.

### Custom Cursor

Custom cursor effect is enabled in desktop view (`CustomCursor.svelte`).

## 🛠 Utilities

### GSAP

To import GSAP and ScrollTrigger:

```typescript
import { gsap, ScrollTrigger } from '$lib/utils/gsap';
```

### Lenis

To initialize smooth scrolling:

```typescript
import { initLenis, getLenis } from '$lib/utils/lenis';

// Initialize
initLenis();

// Get instance
const lenis = getLenis();
```

### Icons

To use Lucide Svelte icons:

```svelte
<script>
  import { Menu, X, Instagram } from 'lucide-svelte';
</script>

<Menu class="w-6 h-6" />
```

### Svelte Stores

To check preloader state:

```typescript
import { isPreloaderLoaded } from '$lib/stores/preloader';

const unsubscribe = isPreloaderLoaded.subscribe((loaded) => {
  if (loaded) {
    // Preloader completed
  }
});
```

## 📝 Notes

- Video files are stored in the `static/` folder and may be large in size
- Video files should be optimized in production builds
- Videos are played muted on mobile devices due to autoplay policies

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contact

For questions or suggestions, please open an issue or contact us.

---

**Emirates Sport Club © 2025** - Beyond The Game
