# SuryaOS Web Foundation Architecture

## Folder Structure

```txt
frontend/
  app/                      # Next.js app router shell only
  components/
    layout/                 # layout primitives
    typography/             # typography system
    ui/                     # base shadcn-style components
  lib/
    api/                    # typed API client + endpoints + OpenAPI accessor
    cms/                    # content consumption layer
    seo/                    # metadata architecture
    motion/                 # animation presets
    query/                  # TanStack Query setup
    routes/                 # route architecture map
  src/contracts/            # OpenAPI + DTO contracts synced from backend
  scripts/                  # contract sync scripts
```

## Design Tokens
- Color tokens defined with CSS variables in `app/globals.css`.
- Structural tokens in `lib/design-tokens.ts`.
- Tailwind maps these tokens for consistent usage.

## Typography Scale
- Display XL/LG for hero/editorial headings
- Heading MD/SM for sections
- Body LG/MD/SM for readable long-form content
- All tuned for whitespace-heavy editorial layouts

## Layout Primitives
- `Container`: max width + responsive horizontal gutters
- `Section`: consistent vertical rhythm
- `Stack`: vertical spacing abstraction
- `SiteShell`: landmark scaffolding + skip link for accessibility

## API + CMS Layer
- `lib/api/client.ts`: typed request envelope (`ApiSuccess` / `ApiError`)
- `lib/api/endpoints.ts`: backend endpoint wrappers
- `lib/cms/content.ts`: curated consumption for case-studies/insights/settings
- `src/contracts/types.ts`: backend DTO source
- `src/contracts/openapi.json`: backend OpenAPI source

## SEO Architecture
- `lib/seo/metadata.ts`: centralized metadata builder
- `app/robots.ts` + `app/sitemap.ts`: crawl/indexing baseline
- Route map drives canonical planning

## Route Architecture
- Centralized map in `lib/routes/map.ts`
- Planned routes:
  - `/`
  - `/company`
  - `/case-studies`
  - `/case-studies/[slug]`
  - `/insights`
  - `/insights/[slug]`
  - `/contact`
  - `/legal/privacy`
  - `/legal/terms`

## Animation Guidelines
- Subtle motion only, no decorative visual noise
- Use `fadeUp` and `staggerContainer` presets from `lib/motion/presets.ts`
- Motion intent: hierarchy and readability, not spectacle

## Accessibility Guidelines
- Skip links and semantic landmarks by default
- Keep contrast and focus states explicit
- Keep interactive components keyboard-first

## Integration Workflow
1. Backend updates OpenAPI and generated DTOs
2. Run `npm run sync:contracts`
3. Typed frontend API layer immediately reflects backend contracts
