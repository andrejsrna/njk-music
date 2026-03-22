# NJK Music

Projekt pre web `njkmusic.com` – label kolektív + katalóg releasov a článkov. Projekt je postavený na Next.js (App Router) a obsah je primárne lokálny markdown v `content/`.

Tento README je “session summary” a orientácia pre ďalšiu prácu (čo sme riešili a kde to je v kóde).

## Tech stack

- Next.js App Router (Next 16) + React 19
- Tailwind CSS + `@tailwindcss/typography`
- shadcn/ui + Radix + react-icons
- Markdown obsah v `content/` (bez Strapi počas runtime)
- Cloudflare R2 (S3 kompatibilné) pre persistenciu newsletter signupov

## Lokálny vývoj

Požiadavky: Node `>=20.19.0 <21`, npm `10.x`.

```bash
npm install
npm run dev
```

Ďalšie príkazy:

```bash
npm run lint
npm run build
```

## Environment variables

- `NEXT_PUBLIC_SITE_URL` – base URL pre canonical/OG linky (fallback je `https://njkmusic.com`)
- `.env.local` – lokálne secrets (R2/Strapi); necommitovať

## Ako je projekt postavený

### Routing (hlavné stránky)

- `/` – homepage
- `/music` – prehliadač releasov (dropdown filtre + paging 12/page)
- `/music/[slug]` – detail release (single music)
- `/labels` a `/labels/[slug]` – labely a ich releasy (paging 12/page na detaile labelu)
- `/news` a `/news/[slug]` – články
- `/help`, `/contact`, `/about` – info stránky

### Dizajn (dark neon/glass)

- Väčšina “hlavných” stránok používa tmavý neon/glass štýl s layout-level backdropom.
- Sticky header je “transparentný” a spolieha sa na backdrop z layoutu (aby nevznikal biely blok za headrom).
- Backdrop routing je v `app/components/RouteBackdrop.tsx`.
- Logo ikonka vedľa title v headri: `public/njk.jpg` + `app/components/Header.tsx`.

### Obsah (markdown)

- Music releasy: `content/music/*.md` (JSON frontmatter `---json ... ---`)
- News/posts: `content/posts/*.md`
- Obrázky: `public/images/music` a `public/images/posts`

Obsahové pravidlá, ktoré sme upravovali:

- Odstránené emoji z článkov.
- Opravy interných linkov v článkoch: preferuj interné cesty typu `/music`, `/labels/<slug>`, `/news/<slug>` (nie staré, neexistujúce odkazy).
- “Spotlight tracks” zobrazujú cover v štvorcovom formáte a len releasy, ktoré majú obrázok.

### Labels (konfigurácia)

- Label dáta sú v `lib/site.ts` (názvy, popisy, social links).
- Z card komponentov sme odstránili “launch year” a podobné meta callouts.
- Na detail stránke labelu: ak label má obrázok, zobrazuje sa ako ikonka vľavo pri názve.

## Migrácia obsahu zo Strapi (jednorazovo)

Aj keď runtime je lokálny markdown, je tu export script:

```bash
NEXT_PUBLIC_API_URL="https://your-strapi-instance" \
NEXT_PUBLIC_STRAPI_API_TOKEN="your-token" \
npm run export:content
```

Script `scripts/strapi-to-markdown.js`:

- stiahne music + posts do `content/music` a `content/posts`
- stiahne obrázky do `public/images/music` a `public/images/posts`
- uloží metadáta do JSON frontmatter (Strapi-like tvar, aby fungoval existujúci rendering)

## Newsletter (footer “Stay loop”) – persist do Cloudflare R2

Form v footri posiela request na `POST /api/newsletters`.

Implementácia:

- Endpoint: `app/api/newsletters/route.ts`
- Primárne ukladanie: Cloudflare R2 object v bucket-e (default `newsletter-subscribers.json`)
- Fallback: lokálny `data/newsletter-subscribers.json` (gitignored), ak chýbajú R2 env vars

Env vars (nedávaj do Gitu; používaj `.env.local`):

- `R2_ENDPOINT`
- `R2_BUCKET`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- voliteľné: `R2_NEWSLETTER_OBJECT_KEY` (default `newsletter-subscribers.json`)

Poznámka: zápis do R2 používa S3 preconditions (`IfMatch`/`IfNoneMatch`) + retry, aby bol odolnejší voči paralelným subscribom.

## Ako pridať obrázok (cover) pre release + R2 upload

V praxi robíme 2 veci:

1) lokálna kópia pre web (Next public assets)  
2) voliteľne upload do R2 (archív/asset storage)

### 1) Ulož cover lokálne

- Ulož súbor do `public/images/music/<slug>.<ext>`
- V `content/music/<slug>.md` nastav `Cover` v frontmatter (Strapi-like objekt), napr.:

```json
"Cover": {
  "url": "/images/music/jazz-kung-fu.webp",
  "formats": { "large": { "url": "/images/music/jazz-kung-fu.webp" } }
}
```

### 2) Upload do R2 (voliteľné)

Odporúčaný key pattern: `images/music/<slug>.<ext>`.

Ak máš AWS CLI:

```bash
aws s3 cp public/images/music/jazz-kung-fu.webp s3://$R2_BUCKET/images/music/jazz-kung-fu.webp \
  --endpoint-url "$R2_ENDPOINT"
```

Alternatívne je v repozitári jednoduchý upload script (nižšie).

## Utility script: R2 upload (voliteľné)

`scripts/r2-upload.js` umožní nahrať ľubovoľný lokálny súbor do R2 cez S3 API:

```bash
node scripts/r2-upload.js public/images/music/jazz-kung-fu.webp images/music/jazz-kung-fu.webp
```

Používa rovnaké env vars ako newsletter.

## Kľúčové súbory (orientácia)

- Header + logo: `app/components/Header.tsx`
- Backdrops (dark routes): `app/components/RouteBackdrop.tsx`
- Music listing (dropdown filtre + paging 12/page): `app/music/MusicBrowser.tsx`
- Label releases paging (12/page): `app/labels/[slug]/LabelReleasesGrid.tsx`
- Single music page: `app/music/[slug]/page.tsx` + komponenty v `app/music/[slug]/*Section.tsx`
- Newsletter API (R2 persist): `app/api/newsletters/route.ts`
