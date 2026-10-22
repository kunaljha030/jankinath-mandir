# Samadhi – Meditation Center Template

React (Vite) frontend + Node/Express backend, styled after the Samadhi "Home 3" layout.

## Run

```bash
npm run install:all   # first time only
npm run dev           # starts API (port 5000) + React app (port 5173, or next free port)
```

## Structure

```
client/                     React app (Vite)
  src/
    components/
      layout/               Header, OffcanvasMenu, Footer, SocialLinks, BackToTop
      home/                 One component per homepage section (+ its CSS)
      ui/                   Reusable pieces: Button, SectionTitle, Reveal, VideoModal, Icons, Loader
    context/SiteContext.jsx Global site data (menu, socials, addresses)
    hooks/                  useFetch, useReveal
    pages/                  Home, NotFound (add About, Events, Shop... here)
    services/api.js         All API calls in one place
    styles/                 variables.css (colors, fonts, sizes) + global.css
server/                     Express API
  src/
    routes/                 URL -> controller mapping
    controllers/            Request handling
    data/*.json             Content (edit text/images here)
    utils/jsonStore.js      JSON file storage (swap for a database later)
```

## API

| Method | URL                  | Description                        |
|--------|----------------------|------------------------------------|
| GET    | /api/site            | Logo, menu, socials, addresses     |
| GET    | /api/home            | Homepage section content           |
| GET    | /api/products        | Books (`?limit=4`)                 |
| GET    | /api/posts           | Posts (`?category=news&limit=2`)   |
| GET    | /api/posts/:slug     | Single post                        |
| GET    | /api/gallery         | Photos (`?limit=6`)                |
| POST   | /api/newsletter      | `{ email, consent }` – subscribe   |

## Customising

- Colors and fonts: `client/src/styles/variables.css`
- Text and images: `server/src/data/*.json`
- Images are placeholders from picsum.photos — replace with your own.
