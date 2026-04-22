<p align="center">
  <img src="./public/shteflogo.svg" width="88" alt="ShtefAI logo" />
</p>

<h1 align="center">Umjetna Inteligencija Blog by ShtefAI</h1>

<p align="center">
  Dnevne AI vijesti, analize i kontekst za Hrvatsku i regiju.<br />
  Statički Next.js 16 + MDX blog pripremljen za Cloudflare Pages.
</p>

<p align="center">
  <a href="https://umjetnainteligencijablog.pages.dev"><img src="https://img.shields.io/badge/Live%20site-umjetnainteligencijablog.pages.dev-d40c1a?style=for-the-badge" alt="Live site" /></a>
  <a href="https://github.com/administrakt0r/shtefAIhr"><img src="https://img.shields.io/badge/GitHub-administrakt0r%2FshtefAIhr-111111?style=for-the-badge&logo=github" alt="GitHub repo" /></a>
  <a href="https://developers.cloudflare.com/pages/get-started/git-integration/"><img src="https://img.shields.io/badge/Cloudflare%20Pages-Postavi%20svoju%20kopiju-f38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Pages setup" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-0f766e?style=for-the-badge" alt="MIT license" /></a>
</p>

## Što je ovo

`shtefAIhr` je open-source hrvatski AI blog koji kombinira:

- statički Next.js 16 export za Cloudflare Pages
- MDX objave u `src/content/`
- generiranje derived asseta tijekom builda
- GitHub Actions guardraile za svakodnevne bot objave

Projekt je javni kod za portal [umjetnainteligencijablog.pages.dev](https://umjetnainteligencijablog.pages.dev/), a održava ga [`administrakt0r`](https://github.com/administrakt0r) / [administraktor.com](https://administraktor.com/).

## Stack

- `Next.js 16` App Router
- `React 19`
- `Tailwind CSS v4`
- `MDX`
- `sharp` za generiranje OG i runtime slika
- `pnpm@10.32.1`
- Cloudflare Pages static export u `out/`

## Lokalna instalacija

Preporučeno okruženje:

- `Node.js 22`
- `pnpm@10.32.1`

Kloniranje i pokretanje:

```bash
git clone https://github.com/administrakt0r/shtefAIhr.git
cd shtefAIhr
pnpm install
pnpm build
```

Korisne skripte:

```bash
pnpm dev
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

`pnpm build` automatski:

- generira `public/images/posts/*.webp`
- generira `public/images/posts/*.png`
- generira `public/images/og-image.png`
- generira `public/rss.xml`
- izvozi statički site u `out/`

## Cloudflare Pages deploy vlastite kopije

Repo je namijenjen za **Cloudflare Pages Git deployment**, bez prelaska na Workers.

1. Forkaj ili kloniraj repo u svoj GitHub account.
2. U Cloudflare dashboardu otvori `Workers & Pages` > `Create application` > `Pages` > `Connect to Git`.
3. Spoji svoj fork repozitorija.
4. Postavi build:
   - Build command: `pnpm build`
   - Build output directory: `out`
   - Production branch: `main`
   - Root directory: `/`
   - Node version: `22`
5. Dodaj environment varijablu:
   - `NEXT_PUBLIC_APP_URL=https://tvoj-projekt.pages.dev`
6. Spremi i deployaj.

Za službeni Cloudflare vodič koristi:
[Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)

## Generated artifacts

Sljedeće datoteke su **build artefakti** i ne committaju se u repo:

- `public/images/posts/*.webp`
- `public/images/posts/*.png`
- `public/images/og-image.png`
- `public/rss.xml`

To je posebno važno za content PR-ove i za dnevni publishing flow.

## GitHub Actions i dnevne objave

Repo ima tri workflowa:

- `PR Checks`
- `Auto Merge PR`
- `Manual Cloudflare Pages Fallback Deploy`

Bot PR guardrails ostaju namjerno strogi:

- dopuštene bot izmjene su `src/content/*.mdx`
- `src/assets/data/blog-posts.ts`
- `published-log.json` samo za news grane
- auto-merge vrijedi samo za grane `post/*` i `opinion/*`

`PR Checks` pokreće:

- `pnpm validate:bot-pr`
- `pnpm lint`
- `pnpm check-types`
- `pnpm test`
- `pnpm build`

Manual fallback deploy preko Wranglera postoji samo kao ručna rezerva i traži GitHub secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Krediti

- Koncept, brand i portal: `ShtefAI`
- Održavanje repoa, infrastruktura i public publish priprema: [`administrakt0r`](https://github.com/administrakt0r)
- Infrastrukturni i urednički nadzor: [administraktor.com](https://administraktor.com/)

## Licenca

Projekt je objavljen pod [MIT licencom](./LICENSE).
