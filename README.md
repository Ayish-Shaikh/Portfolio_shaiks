# 🌐 Ayish Shaikh — Portfolio

> Personal portfolio website for **Ayish Shaikh**, a Java Full Stack Developer based in Kolkata, India.  
> Built with SvelteKit, styled with TailwindCSS, and deployed via GitHub Pages.

[![GitHub](https://img.shields.io/badge/GitHub-Ayish--Shaikh-181717?style=flat-square&logo=github)](https://github.com/Ayish-Shaikh)

---

## 🚀 Tech Stack

### 🧠 Languages
| Language | Usage |
|---|---|
| ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | App logic, components, config |
| ![HTML5](https://img.shields.io/badge/HTML5-5-E34F26?style=flat-square&logo=html5&logoColor=white) | Markup, `app.html`, templates |
| ![CSS3](https://img.shields.io/badge/CSS3-3-1572B6?style=flat-square&logo=css3&logoColor=white) | Styling, animations, themes |
| ![Markdown](https://img.shields.io/badge/Markdown-.md-000000?style=flat-square&logo=markdown&logoColor=white) | Blog posts via MDsveX |

### 🛠️ Frameworks & Libraries
| Package | Version | Purpose |
|---|---|---|
| ⚡ **Svelte** | `^5.46.0` | UI component framework |
| 🧰 **SvelteKit** | `^2.49.2` | Full-stack app framework + routing |
| ⚡ **Vite** | `^7.2.7` | Build tool & dev server |
| 🎨 **TailwindCSS** | `^3.4.0` | Utility-first CSS |
| 📝 **MDsveX** | `^0.12.6` | Markdown + Svelte for blog posts |
| 🎬 **Anime.js** | `^4.2.2` | Animations |
| 🗺️ **Leaflet** | `^1.9.4` | Interactive map |
| 🔣 **Lucide Svelte** | `^0.562.0` | Icon library |
| ⏱️ **reading-time** | `^1.5.0` | Blog post read time estimates |
| 📊 **web-vitals** | `^5.1.0` | Core Web Vitals monitoring |
| 🐛 **Sentry SvelteKit** | `^10.32.1` | Error tracking |
| 🖼️ **Shiki** | `^3.21.0` | Syntax highlighting (Catppuccin theme) |
| 🖼️ **vite-imagetools** | `^9.0.3` | Responsive image optimization (WebP) |
| 📦 **adapter-static** | `^3.0.10` | Static site output for GitHub Pages |

---

## 📁 Project Structure

```
portfolio/
├── 📁 src/
│   ├── 📁 lib/
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   └── 📁 blog/         # Blog-specific components
│   │   ├── 📁 config/           # Site metadata (site.js)
│   │   ├── 📁 data/             # Projects data
│   │   ├── 📁 stores/           # Svelte stores
│   │   └── 📁 utils/            # Utility functions
│   ├── 📁 routes/               # SvelteKit file-based routes
│   │   ├── 📄 +page.svelte      # Home / Hero
│   │   ├── 📁 about/            # About page
│   │   ├── 📁 projects/         # Projects page
│   │   ├── 📁 connect/          # Contact / socials page
│   │   ├── 📁 atom.xml/         # Atom feed endpoint
│   │   ├── 📁 rss.xml/          # RSS feed endpoint
│   │   └── 📁 sitemap.xml/      # Sitemap endpoint
│   ├── 🎨 app.css               # Global styles & Catppuccin theme
│   ├── 🌐 app.html              # HTML shell
│   ├── ⚙️ hooks.client.js       # Client hooks (Sentry)
│   └── ⚙️ hooks.server.js       # Server hooks (Sentry)
├── 📁 static/                   # Static assets (fonts, favicon, images)
├── 📁 docs/                     # Built output → GitHub Pages
├── 📁 build-script/             # Image optimization script
├── ⚙️ svelte.config.js
├── ⚙️ vite.config.js
├── ⚙️ tailwind.config.js
├── ⚙️ postcss.config.js
└── 📄 package.json
```

---

## ✨ Features

- 🎨 **Catppuccin Mocha** dark theme with a theme switcher
- 📱 Fully **responsive** layout
- 📝 **MDsveX blog** with syntax highlighting, table of contents, reading time, and RSS/Atom feeds
- 🗺️ Interactive **Leaflet map** widget
- ⚡ **Lazy-loaded** widgets and components for performance
- 🔍 **SEO optimized** — Open Graph, Twitter cards, structured JSON-LD, sitemap
- 🛡️ **Sentry** error tracking in production
- 📊 **Google Analytics** (GA4) in production
- 🖼️ Automatic **WebP image optimization** at build time
- 🔒 **CSP headers**, security meta tags
- 📡 **RSS + Atom feeds** for blog
- 🌐 **Service Worker** ready

---

## 🏃 Getting Started

### Prerequisites
- **Node.js** `>=18`
- **npm** `>=9`

### Install & Run

```bash
# Clone the repo
git clone https://github.com/Ayish-Shaikh/Ayish-Shaikh.github.io.git
cd Ayish-Shaikh.github.io

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The static output is generated in the `docs/` folder, which is used by GitHub Pages.

### Preview Production Build

```bash
npm run preview
```

---

## 🔧 Environment Variables

Create a `.env` file at the root (see `.env.example`):

```env
# Sentry DSN (optional — leave empty to disable error tracking)
PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
```

Google Analytics is configured directly in `src/routes/+layout.svelte`.

---

## 📦 Deployment

This site uses **`@sveltejs/adapter-static`** and outputs to the `docs/` folder.

**GitHub Pages:**
1. Run `npm run build`
2. Push `docs/` to your repo
3. In GitHub repo settings → Pages → set source to `docs/` folder on `main` branch


---

## 📄 License

© 2026 **Ayish Shaikh**. All rights reserved.
