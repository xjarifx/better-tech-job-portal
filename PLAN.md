# Better Tech Job Portal — Architecture Plan

## Overview

A single-page job discovery portal. Instead of hosting job listings, it helps users **find where to apply** by providing a searchable, filterable directory of tech companies and job platforms. Each entry is a company or portal with rich tags. The primary action takes users to a Google search for `"{name} jobs"`, which reliably surfaces the company's actual career page.

**Key idea:** We don't link to career pages directly (too many URL patterns). We don't link to homepages (many don't surface careers). Instead, we link to a Google search that always returns the career page as the first result.

---

## Data Model

```typescript
interface LinkEntry {
  name: string       // Company or portal name — e.g. "OpenAI"
  domain: string     // Domain for favicon — e.g. "openai.com"
  tags: string[]     // Tags from the taxonomy — e.g. ["AI/ML", "Remote", "Startup"]
}
```

Three fields only. No description, no homepage URL, no type flag. The `domain` is used solely for fetching a favicon via Google's favicon API; it is also shown as subtle secondary text on the card.

---

## URL Strategy

Every entry's primary action links to:

```
https://www.google.com/search?q={name}+jobs
```

This is the core of the portal: Google always surfaces the company's actual career/jobs page as the first result for this query. Zero maintenance, works for every company, no broken links.

The `domain` is displayed as secondary text (non-clickable) on the card for reference.

---

## Tag Taxonomy

All tags are organized into 5 groups. Tags within a group use OR logic; tags across groups use AND logic (faceted search).

### Role
`AI/ML`, `Frontend`, `Backend`, `Full Stack`, `DevOps`, `Data`, `Mobile`, `Security`, `Design`, `Product`, `Hardware`, `Research`, `QA`

### Location
`Remote`, `On-site`, `Hybrid`, `US Only`, `Global`, `EU`

### Stage
`Startup`, `Mid-size`, `Big Tech`, `Public`

### Industry
`Fintech`, `Health`, `Gaming`, `E-commerce`, `Social`, `SaaS`, `Infrastructure`, `Security`, `Biotech`, `EdTech`, `Climate`, `Media`, `Enterprise`, `Telecom`, `Consulting`, `Portal`

### Program
`Internship`, `New Grad`, `Visa Sponsorship`, `Relocation`

A `data/taxonomy.ts` file defines these groups and validation logic.

---

## Filtering Logic — Faceted Search

### State shape
```typescript
// Instead of one flat Set<string>, each tag group tracks its own selection
type GroupKey = 'role' | 'location' | 'stage' | 'industry' | 'program'
selectedTagsByGroup: Record<GroupKey, Set<string>>
```

### Filter algorithm
```
FOR each entry:
  FOR each tag group:
    IF group has selected tags:
      IF entry has NO tags from this group's selection → REJECT
  PASS
```

**OR within a group:** selecting `Remote` + `Hybrid` under Location shows entries tagged with either.
**AND across groups:** also selecting `AI/ML` under Role narrows to entries that match both conditions.

### UI: Grouped tag sections

```
Search bar: [___________________________]

Role:
  [AI/ML] [Frontend] [Backend] [Full Stack] [DevOps] [Data] [Mobile] [Security] [Design]
  [Product] [Hardware] [Research] [QA]

Location:
  [Remote] [On-site] [Hybrid] [US Only] [Global] [EU]

Stage:
  [Startup] [Mid-size] [Big Tech] [Public]

Industry:
  [Fintech] [Health] [Gaming] [E-commerce] [Social] [SaaS] [Infrastructure] [Security]
  [Biotech] [EdTech] [Climate] [Media] [Enterprise] [Telecom] [Consulting] [Portal]

Program:
  [Internship] [New Grad] [Visa Sponsorship] [Relocation]

[Grid] [List] [Compact]  |  Clear filters  |  Showing N entries
```

Each group has a section header. Tags are toggle chips — indigo when active, gray when inactive. "Clear filters" resets all selections.

---

## Data Pipeline

### Source files: `data/companies/*.json` and `data/portals/*.json`

Category JSON files containing arrays of `LinkEntry` objects. Split by category for maintainability:

```
data/
  taxonomy.ts                                  ← Tag groups, valid tags, validation logic
  build.ts                                     ← Node.js script, merge + validate + output index.json
  index.json                                   ← Generated: unified array consumed by the app
  companies/
    big-tech.json                              ← Google, Meta, Apple, Microsoft, Amazon, Netflix, Adobe, Salesforce, Oracle, IBM, SAP, ServiceNow, Workday, AMD, Intel, Cisco, Dell, HP, Qualcomm, Broadcom, Texas Instruments, Micron, Applied Materials, ASML, Uber, Lyft, Twitter/X, Pinterest, Snap, Reddit, Dropbox, Box, Zendesk, Twilio, Atlassian
    ai-ml.json                                 ← OpenAI, Anthropic, Cohere, Mistral, Midjourney, Stability AI, Hugging Face, Replicate, Runway, Perplexity, Glean, Harvey, Jasper, Writer, Typeface, Adept, Inflection, CoreWeave, Lambda, Together, Fireworks, Scale AI, Labelbox, Snorkel, Weights & Biases, MLflow, Comet, Neptune, Valohai, H2O, Dataiku, DataRobot, C3 AI
    fintech.json                               ← Stripe, Plaid, Brex, Ramp, Chime, Robinhood, Affirm, SoFi, Wise, Revolut, Monzo, Nubank, Klarna, Block/Square, PayPal, Venmo, Marqeta, Bill.com, Mercury, Brex, Pipe, Clearco, Dealroom, Carta, Secfi, Pulley, LTSE
    dev-tools.json                             ← Vercel, Netlify, Railway, Render, Fly, PlanetScale, Neon, Supabase, MongoDB, Elastic, Redis, Cockroach Labs, Timescale, InfluxData, Confluent, DataStax, Neo4j, Docker, HashiCorp, Pulumi, Crossplane, GitLab, CircleCI, Sentry, Datadog, New Relic, Grafana, Prometheus, Honeycomb, Lightstep, Chronosphere, Snyk, Sonatype, Aqua, JFrog, Postman, Insomnia, Bruno, Apollo, Hasura, Prisma, Turborepo, Nx, Bazel, Earthly
    gaming.json                                ← Riot Games, Epic Games, Blizzard, Unity, Roblox, Electronic Arts, Activision, Take-Two, Ubisoft, Nintendo, Sony Interactive, Valve, CD Projekt, Bungie, Respawn, Naughty Dog, Insomniac, Supercell, King, Zynga, Niantic, AppLovin, Playrix, Moon Active, Tripledot, Mythical Games, Sky Mavis, Immutable, The Sandbox, Decentraland
    ecommerce-social.json                      ← Shopify, BigCommerce, WooCommerce, Squarespace, Wix, Webflow, Framer, Etsy, Amazon, Mercado Libre, Flipkart, Rakuten, Zalando, ASOS, Farfetch, StockX, GOAT, Depop, Poshmark, ThredUp, The RealReal, Facebook/Meta, Instagram, TikTok/ByteDance, Twitter/X, Pinterest, Snap, Discord, Reddit, Telegram, Signal, Nextdoor, Meetup, BeReal, Clubhouse
    security.json                              ← Cloudflare, CrowdStrike, Palo Alto, Fortinet, Zscaler, Okta, Auth0, Duo, 1Password, Bitwarden, Dashlane, Nord Security, Wiz, Lacework, Orca, Aqua, Sysdig, SentinelOne, Darktrace, Cybereason, Arctic Wolf, Tanium, BeyondTrust, CyberArk, ForgeRock, Ping Identity, Verkada, Egress, Illumio, Cato Networks
    infrastructure-cloud.json                  ← AWS/Amazon, Google Cloud, Microsoft Azure, DigitalOcean, Linode, Vultr, Hetzner, OVH, Equinix, Cloudflare, Fastly, Akamai, CloudFront, Netlify, Vercel, Railway, Render, Fly, Fly.io, Kubernetes/CNCF, CoreOS/Red Hat, VMware, Nutanix, Pure Storage, NetApp, Snowflake, Databricks, Confluent, HashiCorp, Chef, Puppet, Ansible, Salt, Terraform, Pulumi, Crossplane
    health-biotech.json                        ← 23andMe, Ancestry, Illumina, GRAIL, Verily, Calico, Recursion, Insitro, Benchling, Zymergen, Ginkgo Bioworks, Mammoth, Twist, 10x Genomics, Pacific Biosciences, Guardant, Exact Sciences, Tempus, Flatiron, Oak Street, One Medical, Ro, Hims & Hers, Noom, MyFitnessPal, Strava, Whoop, Oura, Headspace, Calm
    enterprise-saas.json                       ← Salesforce, ServiceNow, Workday, SAP, Oracle, IBM, Adobe, Microsoft, Atlassian, Zendesk, Freshworks, HubSpot, Salesforce, SAP Concur, Coupa, Ariba, DocuSign, HelloSign, Dropbox Sign, Box, Egnyte, Miro, Notion, Coda, Airtable, Smartsheet, Monday, Asana, ClickUp, Basecamp, Linear, Height, Plane
    media-entertainment.json                   ← Netflix, Spotify, Disney, Warner Bros, Paramount, NBCUniversal, Sony, Apple Music, YouTube/Google, Twitch/Amazon, Patreon, Substack, Medium, Ghost, Vimeo, Dailymotion, TED, MasterClass, Coursera, Udemy, Udacity, Khan Academy, Duolingo, Quizlet, Chegg, Skillshare, Brilliant, Codecademy, DataCamp, Pluralsight
    edtech.json                                ← Coursera, Udemy, Udacity, Khan Academy, Duolingo, Quizlet, Chegg, Skillshare, Brilliant, Codecademy, DataCamp, Pluralsight, MasterClass, Outschool, VIPKid, Byju's, Age of Learning, Homer, Prodigy, Quizlet, Photomath, Study.com, GoStudent, Brainly, Pearson, Blackboard, Canvas/Instructure, Schoology, Nearpod, Kami
    climate-energy.json                        ← Tesla, Rivian, Lucid, Fisker, Proterra, ChargePoint, EVgo, Redwood, Northvolt, QuantumScape, Solid Power, Enphase, Sunrun, SunPower, NextEra, Octopus Energy, Ovo, Bulb, Aurora, Anduril, Shield AI, Skydio, Joby, Archer, Beta, Lilium, Volocopter, ZeroAvia, Heart Aerospace
    consulting.json                            ← McKinsey, BCG, Bain, Deloitte, Accenture, PwC, EY, KPMG, Capgemini, Infosys, TCS, Wipro, HCL, Cognizant, Booz Allen, Slalom, Thoughtworks, Globant, EPAM, Perficient, Appirio, Wipro Digital, Publicis Sapient, BCG X, McKinsey Digital, Deloitte Digital, Accenture Song
    telecom.json                               ← T-Mobile, Verizon, AT&T, Comcast, Charter, Altice, Vodafone, Telefonica, Deutsche Telekom, BT, Orange, NTT, KDDI, Singtel, Telstra, Reliance Jio, Airtel, China Mobile, Huawei, Ericsson, Nokia, Samsung Networks, Qualcomm, MediaTek, Broadcom, Ciena, Juniper, Arista, Ubiquiti, Cisco, Calix, Adtran
  portals/
    job-portals.json                           ← Indeed, Glassdoor, LinkedIn Jobs, Google Jobs, SimplyHired, Monster, CareerBuilder, ZipRecruiter, Dice, TechCareers, Crunchboard, AngelList/Wellfound, We Work Remotely, Remote OK, Remote.co, FlexJobs, Working Nomads, Jobspresso, Remotive, Hacker News Jobs, Otta, Levels.fyi, Blind, Fishbowl, Built In, Breakout List, Workatastartup, Y Combinator Jobs, Arc.dev, Toptal, Hired, Vettery, Underdog.io, Braintrust, Turing, Gun.io, Authentic Jobs, Smashing Jobs, Dribbble, Behance, Coroflot, Krop, 99designs, Upwork, Fiverr, Freelancer, PeoplePerHour, Malt, Coworkies, We Work Remotely, SkipTheDrive, Virtual Vocations, Pangian, Dynamite Jobs, Remote Women, Women Who Code, Tech Ladies, Out in Tech, Powertofly, Jopwell
```

Each JSON file contains an array:
```json
[
  { "name": "OpenAI", "domain": "openai.com", "tags": ["AI/ML", "Remote", "Startup"] },
  { "name": "Google", "domain": "google.com", "tags": ["Full Stack", "AI/ML", "Remote", "On-site", "Hybrid", "Big Tech"] }
]
```

### Build script: `data/build.ts`

A Node.js script that:

1. Reads `taxonomy.ts` to get the list of valid tags
2. Reads all JSON files from `data/companies/` and `data/portals/`
3. **Validates** every entry's tags against the taxonomy (warns on unknown tags)
4. **Deduplicates** by `name` (first occurrence wins, warns on duplicates)
5. **Removes** entries with missing `name` or `domain`
6. **Sorts** entries alphabetically
7. **Outputs** `data/index.json`

Invoked via `npm run build:data` and automatically runs before `next build`.

---

## Visual / Layout

### Page structure (top to bottom, no tabs)

```
┌─────────────────────────────────────────────────────┐
│  Better Tech Job Portal                              │
│  Tech company and job portal directory               │
├─────────────────────────────────────────────────────┤
│  🔍 Search companies or portals...                   │
├─────────────────────────────────────────────────────┤
│  Role:                                               │
│  [AI/ML] [Frontend] [Backend] [Full Stack] [DevOps]  │
│  [Data] [Mobile] [Security] [Design] [Product] ...   │
│                                                     │
│  Location:                                           │
│  [Remote] [On-site] [Hybrid] [US Only] [Global] [EU] │
│                                                     │
│  Stage:                                              │
│  [Startup] [Mid-size] [Big Tech] [Public]            │
│                                                     │
│  Industry:                                           │
│  [Fintech] [Health] [Gaming] ...                     │
│                                                     │
│  Program:                                            │
│  [Internship] [New Grad] [Visa Sponsorship] [Reloc]  │
├─────────────────────────────────────────────────────┤
│  Showing 42 companies  │ Clear filters  [⊞] [☰] [—] │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ 🖼️ Co A  │ │ 🖼️ Co B  │ │ 🖼️ Co C  │             │
│  │ openai.com│ │ google.. │ │ stripe.. │             │
│  │ [AI/ML]   │ │ [Full]   │ │ [Fintech]│             │
│  │ [Remote]  │ │ [Remote] │ │ [Remote] │             │
│  │ Search →  │ │ Search → │ │ Search → │             │
│  └──────────┘ └──────────┘ └──────────┘             │
│                                                     │
│  or (list view):                                     │
│  🖼️ Co A  openai.com  [AI/ML] [Remote]  Search jobs │
│  🖼️ Co B  google.com  [Full Stack] [ML] Search jobs │
│                                                     │
│  or (compact view):                                  │
│  Co A  [AI/ML] [Remote]                             │
│  Co B  [Full Stack] [ML] [Big Tech]                 │
└─────────────────────────────────────────────────────┘
```

### Card (grid view)

- **Left:** Favicon (Google favicon API) with colored-initials fallback
- **Heading:** Company name (bold) + domain below it (small, gray)
- **Body:** Tag chips showing all tags
- **Action:** "Search jobs on Google" button → opens Google search in new tab

### List item

- Same layout horizontally: favicon → name + domain → tag chips (max 3 shown, overflow with `+N`) → "Search jobs" button

### Compact

- Minimal: name → inline tags → external link icon (whole row is clickable → Google search)

---

## Component Tree

```
app/page.tsx                          ← Server component, renders <JobBoard />
  app/components/job-board.tsx        ← Client component, owns all state
    SearchBar                         ← inline (within job-board.tsx)
    TagGroup × 5                      ← one section per tag group
    ViewToggle                        ← inline (within job-board.tsx)
    ResultGrid / ResultList / ResultCompact
      LinkCard                        ← card (grid view)
      LinkListItem                    ← row (list view)
      LinkCompact                     ← row (compact view)
    EmptyState                        ← shown when no results
```

### File list

| File | Status | Notes |
|---|---|---|
| `data/taxonomy.ts` | **Create** | Tag groups, valid tags, group lookup map |
| `data/companies/*.json` | **Create** | ~15 category files targeting ~500+ entries |
| `data/portals/*.json` | **Create** | 1 portals file |
| `data/build.ts` | **Create** | Node.js merge + validate + output index.json |
| `data/index.json` | **Generated** | Single array consumed by the app |
| `data/links.ts` | **Delete** | Replaced by JSON pipeline |
| `app/components/job-board.tsx` | **Rewrite** | Grouped tag sections, faceted filter logic, no tabs, import index.json |
| `app/components/link-card.tsx` | **Rewrite** | Accept new data shape (name, domain, tags), Google search URL, no description/url fields |
| `app/components/link-list-item.tsx` | **Rewrite** | Same structural changes |
| `app/components/link-compact.tsx` | **Rewrite** | Same structural changes |
| `app/components/logo-utils.ts` | **Keep** | No changes needed |
| `app/components/empty-state.tsx` | **Keep** | No changes needed |
| `app/page.tsx` | **Update** | Subtitle text |
| `app/layout.tsx` | **Keep** | No changes needed |
| `app/globals.css` | **Keep** | No changes needed |
| `eslint.config.mjs` | **Keep** | No changes needed |
| `next.config.ts` | **Keep** | No changes needed |
| `package.json` | **Update** | Add `build:data` script, add `prebuild` hook |
| `tsconfig.json` | **Keep** | `resolveJsonModule: true` already set — can import .json |

---

## Scaling to 2000+

### Phase 1 — Manual curation (~500 entries)

Category JSON files with hand-picked companies. Each file is ~20–50 entries. This ensures quality tagging and accurate domains for the initial set.

### Phase 2 — Bulk addition (+1500 entries)

Use a generation script that ingests from public sources:
- **YC company directory** → ~200 entries with domains + categories
- **Crunchbase unicorns** → filter tech sector → ~800 entries
- **Forbes Cloud 100 / Fortune 500 tech** → ~200 entries
- **Wikipedia category lists** → ~300 entries

The generation script produces JSON in the correct format:
- `name` → from the source
- `domain` → derived (lowercased name + `.com`), with manual overrides for exceptions
- `tags` → assigned based on the source category file + company description analysis

### Validation

The `build.ts` script catches:
- Unknown tags (not in taxonomy)
- Duplicate names
- Missing fields
- Entries with no tags

---

## Implementation Order

1. `data/taxonomy.ts` — define all tag groups and valid tags
2. `data/companies/*.json` — create all category JSON files with seed entries
3. `data/portals/job-portals.json` — portal entries
4. `data/build.ts` — validation + merge script
5. Generate `data/index.json` via `npm run build:data`
6. Update `package.json` — add scripts
7. `app/components/link-card.tsx` — rewrite for new data model
8. `app/components/link-list-item.tsx` — rewrite for new data model
9. `app/components/link-compact.tsx` — rewrite for new data model
10. `app/components/job-board.tsx` — complete rewrite: grouped filter UI, faceted logic, no tabs
11. `app/page.tsx` — update subtitle
12. Delete `data/links.ts`
13. Build + lint — verify everything compiles
