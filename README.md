# Pocket Monster Database

A [Next.js](https://nextjs.org) application that serves as a browsable directory for every Pokémon in the [PokéAPI](https://pokeapi.co/) database. Built with the Next.js 15 App Router and Static Site Generation (SSG), it pre-renders a dedicated page for every Pokémon at build time so each detail page loads instantly with no API call from the browser.

This was originally built as a coursework assignment (CMPSC 421 — Spring 2025, Homework 6) and is shared here as a public reference for anyone learning Next.js, SSG, or the App Router.

## What This App Does

The homepage displays a grid of 1,000+ Pokémon cards, each showing the Pokémon's official artwork, name, and National Pokédex number. Clicking any card takes you to a dedicated detail page for that Pokémon.

Each detail page presents:

- **Official artwork** as the main image, plus shiny and back-view sprites when available
- **Type badges**, color-coded according to the standard Pokémon type palette (fire is orange, water is blue, grass is green, etc.)
- **Physical attributes** — height (in meters), weight (in kilograms), and base experience
- **Abilities**, with a clear marker on any hidden ability
- **Base stats** (HP, Attack, Defense, Special Attack, Special Defense, Speed) visualized as horizontal bars
- **Previous / Next navigation** so you can flip through the Pokédex one entry at a time without going back to the index
- **Dynamic theming** — the entire card's accent color shifts to match the Pokémon's primary type, driven by a CSS custom property

The "Back to Pokémon List" button at the top of every detail page returns you to the index.

## Features

- Full directory of all 1,000+ Pokémon, fetched from the live PokéAPI
- Per-Pokémon detail pages at `/monsters/[id]` with comprehensive stats and artwork
- Type-colored UI that adapts to each Pokémon's primary type
- Stat bars for at-a-glance comparisons
- Built-in Previous / Next navigation between consecutive Pokédex entries
- 100% static — every page is pre-rendered at build time using `generateStaticParams`, so production loads are extremely fast

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router) with Turbopack for dev
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com) via PostCSS
- CSS Modules for the detail page styling
- [PokéAPI](https://pokeapi.co/) as the data source (no API key required)

## Project Structure

```
pokemon/
├── src/
│   └── app/
│       ├── layout.js                          # Root layout and <head> metadata
│       ├── page.js                            # Index route — fetches and lists all Pokémon
│       ├── globals.css                        # Global styles + Tailwind imports
│       └── monsters/
│           └── [id]/
│               ├── page.js                    # Dynamic detail page (SSG via generateStaticParams)
│               └── pokemon-detail.module.css  # Scoped styles for the detail page
├── public/                                    # Static assets (favicon, etc.)
├── next.config.mjs                            # Remote image patterns for PokéAPI sprites
├── package.json
└── jsconfig.json
```

## Routes

| Route | Description |
| --- | --- |
| `/` | Index page — a grid of clickable cards listing every Pokémon |
| `/monsters/[id]` | Detail page for the Pokémon with the matching National Pokédex ID (e.g., `/monsters/25` for Pikachu) |

## How Static Site Generation Works Here

Both the index and detail routes are statically generated:

- The index page loops through Pokémon IDs 1–1000 at build time and fetches each one from `https://pokeapi.co/api/v2/pokemon/{id}`.
- The detail page exports `generateStaticParams`, which returns an array of all IDs from 1 to 1000. Next.js then pre-renders one HTML page per ID.

When you run `npm run build`, the output includes a separately rendered page for every Pokémon (you'll see them listed in the build summary). At runtime, no API requests are made from the user's browser — everything is already baked in.

## Getting Started

### Prerequisites

- **Node.js 18.17 or later** — check with `node --version`. If you don't have it, install from [nodejs.org](https://nodejs.org).
- **npm** (comes with Node) — or use yarn / pnpm / bun if you prefer.

### Installation

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

`npm install` will pull down all dependencies into `node_modules/`. The first install takes a minute or two.

### Running the App

> **⚠️ Important — please read this before running.**
>
> This app fetches data for 1,000+ Pokémon from the PokéAPI. In **dev mode** (`npm run dev`), every page load triggers fresh API calls, which makes the homepage **extremely slow to load** (often a minute or more on first visit).
>
> **For the best experience, always build the app first and then start the production server:**
>
> ```bash
> npm run build
> npm start
> ```
>
> The `npm run build` step pre-renders every page once, so when you `npm start` the site loads instantly with no API calls. This is also what demonstrates the SSG behavior the project is built around.
>
> The build itself takes several minutes (it's making 1,000+ API requests to pre-render every Pokémon), so **let it finish completely** before opening the site.

### The Two Run Modes

**Production mode (recommended):**

```bash
npm run build   # one-time, takes several minutes
npm start       # starts the server — site loads instantly
```

Then open [http://localhost:3000](http://localhost:3000).

**Development mode (only if you're editing code):**

```bash
npm run dev
```

Use this only when actively making changes — hot reload is nice for development, but the homepage will be very slow because Next.js refetches data on every request.

## How It Works Internally

The index page (`src/app/page.js`) is an async server component that loops through IDs 1–1000, fetches each Pokémon from PokéAPI, and renders a grid of `<Link>` components pointing to `/monsters/{id}`.

The detail page (`src/app/monsters/[id]/page.js`) receives the ID from the URL, fetches the full Pokémon record, and renders types, abilities, stats, and sprites. The primary type drives a dynamic accent color used throughout the card via a CSS custom property (`--type-color`), set inline on the card element. A lookup table maps each of the 18 Pokémon types to its standard color.

Remote images from `raw.githubusercontent.com/PokeAPI/sprites/...` are allow-listed in `next.config.mjs` so Next.js will serve them.

## Troubleshooting

**The homepage is taking forever to load in dev mode.** That's expected — see the warning above. Run `npm run build` then `npm start` instead.

**`npm run build` is taking forever.** Also expected — it's making 1,000+ HTTP requests to PokéAPI to pre-render every page. Be patient; it will finish.

**Build fails with a fetch error.** PokéAPI may be temporarily down or rate-limiting you. Wait a minute and try again.

**Images don't load.** Make sure `next.config.mjs` is present and includes the `remotePatterns` for `raw.githubusercontent.com`.

## Credits

- Data and sprites: [PokéAPI](https://pokeapi.co/) and the [PokeAPI/sprites](https://github.com/PokeAPI/sprites) repository
- Pokémon and Pokémon character names are trademarks of Nintendo

## License

This project is provided for educational purposes. Pokémon-related assets retrieved via PokéAPI remain the property of their respective owners.
