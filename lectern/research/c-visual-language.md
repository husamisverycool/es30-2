# Lectern: visual-language reference base

Research date: 2026-10-03. Prepared for the Lectern MVP (professor console with sources, rules, test chat, question log and an on/off switch, plus a student chat tutor). Persona: a senior chemistry lecturer who wants calm and control.

Every value below is tagged:

- **observed**: read directly this session from a product's own published source code or token files, from a published design system, or measured from the pixels of a real product screenshot.
- **observed-3P**: read from a third-party extraction of the product's live CSS (VoltAgent `awesome-design-md` or educlopez `design-bites`, both on GitHub). These are real CSS values but I did not see the CSS myself. Treat them as one step weaker than observed.
- **inferred**: taken from press, blogs or search-result snippets I could not open, from my own arithmetic, or from my judgment (for example, choosing a Google Fonts stand-in).

---

## 0. Method and evidence limits (read first)

The brief asked for Firecrawl `branding` and `screenshot` scrapes of live product sites. That route failed, and the evidence base had to be rebuilt:

1. **Firecrawl had no credits.** Every call returned HTTP 402 "Insufficient credits". The account owner needs to add credits.
2. **The network allowlist blocked product sites.** `curl`, `WebFetch` and a headless Chromium (Playwright at `/opt/pw-browsers`) all hit `EGRESS_BLOCKED` / `ERR_TUNNEL_CONNECTION_FAILED` on linear.app, vercel.com, notion.com, granola.ai, raycast.com, cursor.com, a16z.com, apps.apple.com and others. Reachable hosts were github.com (git), raw.githubusercontent.com, registry.npmjs.org, developer.apple.com, fonts.googleapis.com and fonts.gstatic.com. So I could not capture live screenshots of the marketing sites.
3. **WebSearch hit its 200-call session cap partway through.** After that I could not run further searches (for example on Perplexity, Things 3, Craft, Mercury, Ramp or Arc/Dia). Those products are marked "not confirmed this session".

**How the evidence was rebuilt:**

- **Official source code and tokens, cloned with git.** OpenAI's ChatGPT design system (`openai/apps-sdk-ui`), Cal.com (`calcom/cal.com`), shadcn/ui (the v0/Lovable default), Radix Colors and Radix Themes, GitHub Primer (`@primer/primitives` from npm), Material 3 (`material-components/material-web`) and Raycast's ray.so.
- **Apple Human Interface Guidelines** as JSON from developer.apple.com.
- **Mirrors of Notion's CSS** in `notion-enhancer` and `react-notion-x`.
- **Real product screenshots hosted on GitHub, opened and pixel-sampled:**
  - Linear's own repository: a settings modal.
  - Raycast's extension store screenshots: the real Raycast window.
  - notion-enhancer screenshots: the Notion app.
  - Bolt and Vercel social images.
- **Third-party live-CSS extractions** (observed-3P) for Linear, Vercel, Granola, Attio, Claude, Cursor, Raycast, Notion and Superhuman marketing sites.

Clones are in `scratchpad/research/repos/`. Screenshots are in `scratchpad/research/shots/c-*`.

---

## 1. Step 1: Which products, and why

| Product | Popularity or growth evidence | Design-admiration evidence | Status |
|---|---|---|---|
| **Linear** | Widely copied "Linear style" ([LogRocket](https://blog.logrocket.com/ux-design/linear-design/)). Linear's own design system "Orbiter" is a Radix case study ([Radix](https://www.radix-ui.com/primitives/case-studies/linear)). | Big UI redesign in March 2024 ([changelog](https://linear.app/changelog/2024-03-20-new-linear-ui), [part II blog](https://linear.app/now/how-we-redesigned-the-linear-ui)). A "calmer interface" refresh on 2026-03-12 ([changelog](https://linear.app/changelog/2026-03-12-ui-refresh), [essay](https://linear.app/now/behind-the-latest-design-refresh)). Mobile redesign in October 2025 ([changelog](https://linear.app/changelog/2025-10-16-mobile-app-redesign)). All inferred from search snippets. | **Measured** |
| **Notion** | Joined a16z's Top 100 in the 6th edition (March 2026) as an "AI-enhanced" consumer app ([The Neuron summary](https://www.theneuron.ai/explainer-articles/a16z-just-ranked-the-100-most-popular-ai-apps-heres-the-full-list-and-what-it-tells-us-/), [Rundown](https://www.threads.com/@therundownai/post/DVw8RlhArzz/a-z-has-released-the-sixth-edition-of-its-top-gen-ai-consumer-apps-report)). Notion Sites won the 2024 Golden Kitty No-Code award ([Product Hunt hall of fame](https://www.producthunt.com/golden-kitty-awards/hall-of-fame)). | The reference text-heavy workspace. Its CSS is mirrored in open source. | **Measured** |
| **Granola** | Valued at $250M in May 2025 ([TechCrunch](https://techcrunch.com/2025/05/14/ai-note-taking-app-granola-raises-43m-at-250m-valuation-launches-collaborative-features)) and $1.5B in 2026 ([Founded](https://www.founded.com/granola-ai-note-taking-app-valuation/), [Forbes](https://www.forbes.com/sites/iainmartin/2026/01/30/vcs-favorite-note-taking-app-granola-in-talks-to-hit-1-billion-valuation/)). | 2026 rebrand and product redesign by Ragged Edge, positioned against "tech slop" ([Design Week](https://www.designweek.co.uk/issues/21-27-july-2026/ragged-edge-rejects-tech-slop-with-human-centric-granola-rebrand/), [Creative Boom](https://www.creativeboom.com/news/ragged-edge-rebrands-ai-notepad-granola-with-a-co-founders-handwriting-and-a-deliberately-imperfect-logo/), [BP&O](https://bpando.org/2026/09/25/ragged-edge-branding-identity-design-granola/), [Granola blog](https://www.granola.ai/blog/a-new-look-for-granola)). Its interface chooses "calm over busyness" (inferred, press summary). | **Measured** (observed-3P) |
| **ChatGPT** | About 900M weekly users, per a16z's 6th edition ([summary](https://www.theneuron.ai/explainer-articles/a16z-just-ranked-the-100-most-popular-ai-apps-heres-the-full-list-and-what-it-tells-us-/)). | OpenAI published ChatGPT's own design tokens as the Apps SDK UI ([repo](https://github.com/openai/apps-sdk-ui)). This is the best primary evidence of the set. | **Measured** (observed) |
| **Claude** | Fastest proportional growth. Web traffic share rose from about 2% to about 9% between June 2025 and May 2026 ([PPC Land](https://ppc.land/chatgpt-drops-to-52-7-as-claude-triples-its-ai-traffic-share/), [ALM](https://almcorp.com/news/claude-fastest-growing-ai-traffic-source-2026/)). Paid subscriptions grew more than 200% (a16z 6th edition). | Its cream, coral and serif look is now the most-copied "AI aesthetic". That makes it a reference for what Lectern should **not** reuse ([Northeast Times](https://northeasttimes.com/2026/07/31/ai-design-tools-are-making-every-website-look-the-same/), [Anthropic frontend-design skill](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/frontend-design/SKILL.md)). | **Measured** (observed-3P, as an anti-reference) |
| **Cursor** | Fastest B2B company to $1B ARR ([Stripe CRO interview](https://cloud.substack.com/p/stripes-ai-cro-on-the-fastest-growing), [ARR leaderboard](https://clinkbill.com/arr-leaderboard)). 2024 Golden Kitty Product of the Year ([PH](https://www.producthunt.com/golden-kitty-awards/hall-of-fame)). Among the fastest-growing vendors on Ramp in April 2025 ([Ramp](https://ramp.com/blog/top-saas-vendors-on-ramp-apr-2025)). | Included in the curated design collection [awesome-design-md](https://github.com/VoltAgent/awesome-design-md). | **Measured** (observed-3P) |
| **Raycast** | No growth data gathered this session. | Included in awesome-design-md. Real app screenshots are published in its extension store repo. | **Measured** (screenshots observed) |
| **Vercel (Geist)** | Among the fastest-growing vendors on Ramp, alongside Netlify and Lovable (inferred, search snippet of [Ramp's vendor reports](https://ramp.com/leading-indicators/ai-native-software-climbing-ranks)). | Public Geist design system ([materials](https://vercel.com/geist/materials), [typography](https://vercel.com/geist/typography)). | **Measured** (observed-3P plus snippets) |
| **Cal.com** | No growth data gathered this session. | Open-source app, so the design is fully inspectable. Included in awesome-design-md. | **Measured** (observed) |
| **Attio** | No growth data gathered this session. | Included in the design-bites curated collection ([repo](https://github.com/educlopez/design-bites)). | **Measured** (observed-3P) |
| **Superhuman** | No growth data gathered this session. | Included in awesome-design-md. Readwise quotes its founder on design quality (below). | Measured lightly (observed-3P) |
| **Lovable / Bolt / v0** | Lovable reached $100M ARR in 8 months ([Stripe CRO](https://cloud.substack.com/p/stripes-ai-cro-on-the-fastest-growing)) and ranked #22 on a16z's 5th edition ([a16z](https://a16z.com/100-gen-ai-apps-5/)). | Their generated output defaults to shadcn/ui, which is now the #1 "AI-made" tell ([avoid-ai-design](https://github.com/funboy322/avoid-ai-design)). | **Measured** through shadcn/ui and Bolt's source, as the *generic baseline* |
| **Readwise Reader** | No growth data gathered this session. | Its design is praised. Superhuman's founder called it "the Superhuman of reading" ([Lazer case study](https://www.lazertechnologies.com/case-studies/readwise), [guide](https://blakecrosley.com/guides/design/readwise-reader)). | Not measured: no inspectable source was reachable. Inferred only. |
| Perplexity | Traffic share is falling, about 1.3% in May 2026 ([Similarweb](https://aisearch.similarweb.com/blog/chatgpt-vs-gemini-vs-claude-vs-perplexity/)). | Not established. | Dropped |
| Figma, Framer | Present in awesome-design-md. | These are design tools and less relevant to Lectern's persona. | Not measured |
| Arc/Dia, Things 3, Craft, Mercury, Ramp (app) | Could not confirm this session because the search cap was reached. | Things 3 and Craft are past Apple Design Award winners (inferred from memory, **not re-verified**). | Not used |

**Context signals that did not help:**

- **Apple Design Awards 2025** went to CapWords, Speechify, Watch Duty and others. None are in Lectern's category ([Apple Newsroom](https://www.apple.com/newsroom/2025/06/apple-unveils-winners-and-finalists-of-the-2025-apple-design-awards/)).
- **Product Hunt retired the Golden Kitty awards** in November 2025. The new quarterly "Orbit Awards" started with AI dictation apps, such as Wispr Flow ([PH](https://www.producthunt.com/stories/introducing-the-orbit-awards), [winners](https://www.producthunt.com/p/producthunt/meet-the-winners-of-the-2025-orbit-awards-for-ai-dictation-apps)).

---

## 2. Step 2: Measurements by product

### 2.1 ChatGPT: OpenAI Apps SDK UI (observed)

The source is [openai/apps-sdk-ui @0f00143](https://github.com/openai/apps-sdk-ui/tree/0f00143c7a639906f1621fe58e1b6be7b5bea46d), committed 2026-05-05. It is described as "a … design system for building … ChatGPT apps … consistent experiences inside ChatGPT". It is the design system for apps inside ChatGPT, so it mirrors ChatGPT's own surfaces.

All values in this section come from [variables-primitive.css](https://github.com/openai/apps-sdk-ui/blob/0f00143c7a639906f1621fe58e1b6be7b5bea46d/src/styles/variables-primitive.css), [variables-semantic.css](https://github.com/openai/apps-sdk-ui/blob/0f00143c7a639906f1621fe58e1b6be7b5bea46d/src/styles/variables-semantic.css) and [variables-components.css](https://github.com/openai/apps-sdk-ui/blob/0f00143c7a639906f1621fe58e1b6be7b5bea46d/src/styles/variables-components.css), unless noted.

**Fonts (observed)**
- UI uses the system stack: `ui-sans-serif, -apple-system, system-ui, "Segoe UI", "Noto Sans", Helvetica, Arial, …`.
- Code uses `ui-monospace, "SFMono-Regular", "SF Mono", Menlo, …`.
- KaTeX CSS is bundled, at `src/styles/katex.min.css`.
- Weights are 400, 500, 600 and 700. Tracking is 0 at every size.

**Type scale (observed)**

| Style | Size / line height |
|---|---|
| text-2xs | 10/14 |
| text-xs | 12/18 |
| text-sm | 14/20 |
| text-md | 16/24 |
| text-lg | 18/29 |
| heading-xs | 16/24 |
| heading-sm | 18/26 |
| heading-md | 20/26 |
| heading-lg | 24/28 |
| heading-xl | 32/38 |
| heading-2xl | 36/42 |
| heading-3xl | 48/48 |

All headings are weight 600.

**Neutrals (observed; light / dark)**
- **Text:** #0D0D0D / #FFFFFF. Secondary #5D5D5D / #AFAFAF. Tertiary #8F8F8F in both themes.
- **Surfaces:** #FFFFFF / **#212121**. Secondary #F9F9F9 / #181818. Tertiary #F3F3F3 / #131313. Elevated #FFFFFF / #303030.
- **Borders:** subtle 5% / 6%, default 10% / 12%, strong 15% / 20%. These are alpha values of #0D0D0D in light mode and of white in dark mode.
- **Hairline:** 1px, dropping to 0.5px at ≥1.5 dppx. Colour is rgb(0 0 0 / 8%), or 10% on high-density screens, in light mode, and rgb(255 255 255 / 10%) or 12% in dark mode.

**Accent and semantic colours (observed)**
- **Focus ring:** blue-500 #0169CC (light) and blue-400 #0285FF (dark).
- **Links:** #0169CC (light) and blue-300 #339CFF (dark).
- **Success:** text #00692A / #04B84C. Solid #00A240 / #008635. Soft background #D9F4E4.
- **Warning:** text #923B0F / #E25507. Solid #E25507. Soft background #FFE7D9.
- **Danger:** text #911E1B / #E02E2A. Solid #E02E2A. Soft background #FFD9D9.
- **Caution:** text #916F00 / #E0AC00.
- A purple "discovery" colour is also defined.

**Radii (observed)**
- The scale is 2, 4, 6, 8, 10, 12, 16, 20, 24px and full.
- Control radii are sm 6, md 8, lg 10 and xl 12.
- Menus, popovers and alerts use 12px.
- The chat composer uses **24px**.
- Buttons default to a **pill** shape ([Button.tsx L118-120](https://github.com/openai/apps-sdk-ui/blob/0f00143c7a639906f1621fe58e1b6be7b5bea46d/src/components/Button/Button.tsx#L118-L120)).

**Control sizes (observed)**
- Heights are 22, 24, 26, **28 (sm), 32 (md, the default), 36 (lg)**, 40, 44 and 48px.
- Horizontal gutters are 6 to 16px; md is 12px.
- Control font sizes are sm 12px, md 14px and lg 16px. Button weight is 500.
- Icon sizes are 14 to 24px.

**Components (observed)**

| Component | Values |
|---|---|
| Badge | Heights sm 20, md 22, lg 24. Radius 4, 4 and 6. Font 12px (sm) or 14px (md, lg), weight 600 |
| Avatar | 28px |
| Menu | Padding 6px. Item padding 6px 8px. Text 14/20. Hover background 8% (light) or 10% (dark) |
| Dialog | Width 250 to 450px. Padding 20px. Backdrop rgba(0,0,0,.30) light, .50 dark |
| Chat | Max width **800px**. User message background 5% (light) or 8% (dark) |

**Switch (observed)** ([Switch.module.css](https://github.com/openai/apps-sdk-ui/blob/0f00143c7a639906f1621fe58e1b6be7b5bea46d/src/components/Switch/Switch.module.css), [tokens L201+](https://github.com/openai/apps-sdk-ui/blob/0f00143c7a639906f1621fe58e1b6be7b5bea46d/src/styles/variables-components.css#L201))
- Track **32×19**. Thumb **13px**, set 3px in from the edge.
- Off track: #DFDFDF (light) / #414141 (dark).
- On track: #181818 (light, near-black) / #0285FF (dark).
- Thumb shadow: `0 1px 2px rgb(0 0 0/20%)`.
- Transition: 250ms, `cubic-bezier(0.65,0,0.35,1)`.
- Focus: `outline: 2px solid ring; offset 2px`.

**Shadows (observed)**

| Level | Geometry | Alpha (light / dark) |
|---|---|---|
| 100 | `0 1px 2px -1px` | .08 / .2 |
| 200 | `0 2px 4px -1px` | .08 / .2 |
| 300 | `0 4px 8px -2px` | .10 / .36 |
| 400 | `0 8px 16px -4px` | .12 / .30 |

**Motion and spacing (observed)**
- Basic transitions are **150ms ease**.
- Enter curve: `cubic-bezier(0.19,1,0.22,1)`. Exit curve: `cubic-bezier(0.8,0,0.4,1)`. Move curve: `cubic-bezier(0.65,0,0.35,1)`.
- Spacing unit is 4px.

### 2.2 Cal.com (observed, open-source app code)

The source is [calcom/cal.com @54343aa](https://github.com/calcom/cal.com/tree/54343aa685ae8f33159d2f485ec4a57bad5c574a), committed 2026-09-20.

**Fonts (observed)** ([layout.tsx L17-20](https://github.com/calcom/cal.com/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/apps/web/app/layout.tsx#L17-L20))
- UI is **Inter**, loaded from Google Fonts via `next/font/google`.
- Display is **Cal Sans SemiBold** (`--font-cal`). Cal Sans is also on Google Fonts, but it is on the "tasteful free font" tell list.

**Colours (observed; HSL converted to hex)** ([tokens.css](https://github.com/calcom/cal.com/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/packages/config/theme/tokens.css))

| Role | Light | Dark |
|---|---|---|
| Background | #FFFFFF | #0F0F0F |
| Muted (sidebar) | #F6F7F9 | #171717 |
| Subtle | #EEEFF2 | #262626 |
| Emphasis | #E5E7EB | #404040 |
| Border | #D1D5DB | #4C4C4C |
| Border, subtle | #E5E7EB | #262626 |
| Border, emphasis | #9CA3B0 | #737373 |
| Text, emphasis | #070A0D | #FAFAFA |
| Text | #3C3E44 | #D4D4D4 |
| Text, subtle | #6B7280 | #A3A3A3 |
| Brand / primary | #111827 (near-black) | #FFFFFF |

**Radii (observed)**
- The scale is 2, 4, 6, 8, 12, 16 and 24px.
- **Buttons use 10px** ([Button.tsx L43](https://github.com/calcom/cal.com/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/packages/ui/components/button/Button.tsx#L43)).
- Nav items use rounded-md, which is 6px.

**Buttons (observed)** ([L152-155](https://github.com/calcom/cal.com/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/packages/ui/components/button/Button.tsx#L152-L155))
- xs is 24px and sm is 28px.
- base is `px-2.5 py-2`, with 14px text and leading-none. That works out to about 32px with a 1px border (my arithmetic, so inferred).
- lg works out to about 36px (inferred).
- Text is 14px, weight 500.

**Switch (observed)** ([Switch.tsx L57-67](https://github.com/calcom/cal.com/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/packages/ui/components/form/switch/Switch.tsx#L57-L67))
- Default track **44×24** with a **20px** thumb. Small track 28×16 with a 12px thumb.
- Checked uses the brand colour (near-black). Unchecked uses #E5E7EB.
- Focus is `ring-2 ring-offset-2`.
- Thumb shadow is `0 .8px .8px rgba(0,0,0,.10), 0 .8px 3.2px rgba(0,0,0,.08)`.

**Sidebar (observed)**
- Width `lg:w-56`, which is **224px**. Background is the muted colour, with a right border ([SideBar.tsx L63](https://github.com/calcom/cal.com/blob/54343aa685ae8f33159d2f485ec4a57bad5c574a/apps/web/modules/shell/SideBar.tsx#L63)).
- Nav items are `px-2 py-1.5 text-sm font-medium rounded-md`. That is about **32px** tall (14px text on a 20px line-height plus 12px padding).
- Section labels are uppercase with wide tracking. This is a pattern Lectern should avoid (see §4.4).

**Shadows and motion (observed)**
- Dropdown shadow: `0 5px 20px rgba(0,0,0,.10), 0 10px 40px rgba(0,0,0,.03)`.
- Default ring: `rgb(59 130 246 / .5)`.
- Drawer animation: 150ms, `cubic-bezier(0.16,1,0.3,1)`.

### 2.3 shadcn/ui: the v0, Lovable and Bolt default, used as the generic baseline (observed)

The source is [shadcn-ui/ui @295a1f1](https://github.com/shadcn-ui/ui/tree/295a1f114a138f23b5dfee0e0c6812394dfeb90c), committed 2026-10-02.

- **Base radius:** `--radius: 0.625rem` (10px) ([globals.css L100](https://github.com/shadcn-ui/ui/blob/295a1f114a138f23b5dfee0e0c6812394dfeb90c/apps/v4/app/globals.css#L100)).
- **Sidebar:** **16rem (256px)**. Menu buttons are **h-8 (32px)** with `text-sm` ([sidebar.tsx L30, L486](https://github.com/shadcn-ui/ui/blob/295a1f114a138f23b5dfee0e0c6812394dfeb90c/apps/v4/registry/new-york-v4/ui/sidebar.tsx#L30)).
- **Buttons:** h-9 (36px) default, h-8 (32px) small, h-10 (40px) large. Text 14px, weight 500. Radius rounded-md, which is 8px.
- **Input:** h-9.
- **Switch:** **32×18.4** with a 16px thumb ([switch.tsx L19](https://github.com/shadcn-ui/ui/blob/295a1f114a138f23b5dfee0e0c6812394dfeb90c/apps/v4/registry/new-york-v4/ui/switch.tsx#L19)).
- **Badge:** fully rounded, 12px text, `px-2 py-0.5`.
- **Card:** rounded-xl with `shadow-sm`.
- **Focus:** a 3px ring at 50% opacity.
- **Legacy neutral palette:** foreground #0A0A0A, primary #171717, muted #F5F5F5, muted text #737373, border #E5E5E5. In dark mode the background is #0A0A0A and the border #262626.
- **Bolt** is built on the same family. Its README social image shows a black canvas, a blue glow and a glowing input card (screenshot `c-bolt-social-preview.jpg`, observed).

### 2.4 Linear (observed-3P plus a real-app screenshot plus blog snippets)

**Real-app screenshot (observed)**
- Image: `c-linear-settings-webhooks-new.png`, from [linear/linear docs/images @b37823b](https://github.com/linear/linear/blob/b37823be308a42f837277671f3ded66d33d92e6c/docs/images/webhooks/settings-webhooks-new.png). It shows a dark "Create webhook" modal.
- Pixel samples:

| Element | Colour |
|---|---|
| Page background | #1E1F22 |
| Modal surface | #27282B |
| Dividers and modal border | #303236 |
| Input background | #1E1F22 |
| Input border | #404144 |
| Primary button | **#5E6AD3** |
| Close icon | #60646C |

- The modal corners are lightly rounded, the input is recessed, and there is no gradient.

**Live CSS of linear.app (observed-3P)** ([design-bites linear.app/DESIGN.md](https://github.com/educlopez/design-bites/blob/55dac795fafe646c3397af080b41d7f9bf7b7ca9/design-mds/linear.app/DESIGN.md))
- **Fonts:** `"Inter Variable", "SF Pro Display", -apple-system, …` with **`cv01`, `ss03`** enabled globally. Code uses `"Berkeley Mono", ui-monospace, "SF Mono"`.
- **Weights:** **510** and **590**, which sit between the standard weights.
- **Type:** button 13px; paragraph 15/24 with -0.165px tracking; body 16/24; h3 20/26.6 at weight 590; h2 40/44 with -0.88px tracking.
- **Dark palette:** background #08090A. Text #F7F8F8, #D0D6E0 and #8A8F98. Accent #5E6AD2. Border rgba(255,255,255,.08).
- **Radii:** 2, 4, 5, 6 and 8px, plus pill. Buttons and inputs use 6px. Cards and dialogs use 8px.
- **Status colours:** red #EB5757, green #10B981.

**Conflicting extraction (observed-3P)**
- [VoltAgent linear.app/DESIGN.md @f696123](https://github.com/VoltAgent/awesome-design-md/blob/f6961238d5cddcf8042a74a70fc400ec67181abb/design-md/linear.app/DESIGN.md) names the faces "Linear Display / Linear Text". It also lists canvas #010102, surfaces #0F1011 to #191A1B, hairline #23252A, and buttons with `8px 14px` padding, 8px radius and 14px text at weight 500.
- This contradicts the Inter finding above. Linear may have introduced a custom face; that is **unverified**.

**Blog and press (inferred, search snippets)**
- The 2024 redesign moved theme generation to LCH colour and reduced it to **three variables: base, accent and contrast**. It uses Inter Display for headings ([part II](https://linear.app/now/how-we-redesigned-the-linear-ui)).
- The March 2026 refresh made the **sidebar dimmer so content leads**, used fewer and smaller icons, removed coloured team-icon backgrounds and made headers consistent ([changelog](https://linear.app/changelog/2026-03-12-ui-refresh), [essay](https://linear.app/now/behind-the-latest-design-refresh)).

**App metrics (inferred, third-party PR and claims)**
- Nav rows **28px**, 13px labels, 16px icons, sidebar **244px** ([Jovie PR #18569](https://github.com/JovieInc/Jovie/pull/18569)).
- Flat, sharp data surfaces, with radius and shadow only on floating layers ([marcus-skills reference](https://github.com/marcus/marcus-skills/blob/main/skills/linear-design-patterns/references/linear-design-system.md)).

### 2.5 Notion (observed via open-source mirrors of the app's CSS)

The sources are [notion-enhancer @dae9700 (dev, 2024-11-19)](https://github.com/notion-enhancer/notion-enhancer/blob/dae9700b0b762dfb63fc7f5f9b4d42d2b37f2ae1/src/core/variables.css) and [react-notion-x @03c5e88](https://github.com/NotionX/react-notion-x/blob/03c5e88ecd2fee40cf1dea35d082397c0b296619/packages/react-notion-x/src/styles.css).

**Fonts (observed)** ([fonts/client.css L10-17](https://github.com/notion-enhancer/notion-enhancer/blob/dae9700b0b762dfb63fc7f5f9b4d42d2b37f2ae1/src/extensions/fonts/client.css#L10-L17))

| Role | Stack |
|---|---|
| Sans | System stack: `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, …` |
| Serif page style | **`Lyon-Text, Georgia`** |
| Mono page style | `iawriter-mono, Nitti` |
| Code | SFMono |
| Math | **`KaTeX_Main`** |

**Light theme (observed)**
- Text rgb(55,53,47), which is **#37352F**. Secondary rgba(25,23,17,.6).
- Border **#E9E9E7**. Background white. Sidebar background **#FBFBFA**.
- Hover rgba(55,53,47,.08).
- Accent **#2383E2**, hovering to #0075D3.

**Dark theme (observed)**
- Background **#191919**. Secondary background #202020.
- Text rgba(255,255,255,.81). Secondary #9B9B9B.
- Border #2F2F2F. Hover rgba(255,255,255,.055).

**Layout (observed via react-notion-x)**
- Content max width **720px**. Header 45px. Corner radius 8px.
- Page title 40px, weight 600, line-height 1.2. h1 30px, h2 24px, h3 20px. Body 16px at 1.5.

**Screenshot (observed)**
- Image: `c-notion-simpler-databases.jpg`, an older dark theme.
- Table rows are spaced **33px** apart. Menu rows are **28px**. The toggle is about 30×18px.

**Marketing site (observed-3P)** ([VoltAgent notion](https://github.com/VoltAgent/awesome-design-md/blob/f6961238d5cddcf8042a74a70fc400ec67181abb/design-md/notion/DESIGN.md))
- Uses "Notion Sans", which is Inter-based, and a purple CTA #5645D4.
- Body 16px at 1.55. Caption 13px. Radii 4, 6, 8 and 12px.

### 2.6 Granola (observed-3P, live CSS)

The source is [design-bites granola.ai/DESIGN.md](https://github.com/educlopez/design-bites/blob/55dac795fafe646c3397af080b41d7f9bf7b7ca9/design-mds/granola.ai/DESIGN.md), "extracted from live CSS analysis".

**Colours (observed-3P)**
- Surfaces: **#F7F7F2** (warm off-white), #FFFFFF elevated, #F2F2EC sunken.
- Ink: #292929, #4E4D4B, #72726E and #ACADA8.
- Accent: olive **#5B6F00** for fills and #788C15 for text. Focus ring #B2C248. Danger #E95D3D.
- Hairline: #47432A33.

**Fonts and type (observed-3P)**
- **Quadrant** (display serif) paired with **Melange** (UI). Press confirms the pairing ([Granola blog](https://www.granola.ai/blog/a-new-look-for-granola), [Creative Boom](https://www.creativeboom.com/news/ragged-edge-rebrands-ai-notepad-granola-with-a-co-founders-handwriting-and-a-deliberately-imperfect-logo/)).
- H1 is 68/68 at weight 400 with -1.02px tracking. Body is 16px. Paragraphs are 14px at weight 500 with +0.14px tracking.

**Shape and depth (observed-3P)**
- Cards use an 8px radius; pills are fully rounded.
- Shadows: `0 0 0 1px rgba(0,0,0,.15)`, `0 0 36px rgba(0,0,0,.03)`, and an inset `0 0 2px rgba(0,0,0,.03)`.
- No dark mode.

**Google Fonts stand-ins (inferred)**
- Quadrant is a "slightly mechanical slab serif" → **Zilla Slab**.
- Melange is a "neutral but subtly characterful" grotesque → **Hanken Grotesk**.

### 2.7 Vercel / Geist (observed-3P plus snippets)

**Live CSS of vercel.com (observed-3P)** ([design-bites vercel.com/DESIGN.md](https://github.com/educlopez/design-bites/blob/55dac795fafe646c3397af080b41d7f9bf7b7ca9/design-mds/vercel.com/DESIGN.md))
- **Colours:** background #FAFAFA, elevated #FFFFFF, recessed #F2F2F2. Text #171717, #4D4D4D and #8F8F8F. Accent **#0072F5**.
- **Focus:** `0 0 0 2px bg, 0 0 0 4px #0072F5`.
- **Border drawn as a shadow:** `0 0 0 1px #00000014`.
- **Radii:** `--geist-radius: 6px`. Marketing components 8px, cards 12px.
- **Form heights:** **32/40/48**.
- **Spacing:** 4px base, scaling up to 256.
- **Layout:** page margin 24px, header 64px, sub-menu 46px.
- **Weights:** 400, 500 and 600 only.

**Geist materials (inferred, snippet of [vercel.com/geist/materials](https://vercel.com/geist/materials))**
- Base and small materials use 6px. Medium, large, menu and modal use 12px. Fullscreen uses 16px.

**Fonts (observed)**
- Geist and Geist Mono are on Google Fonts (fonts.googleapis.com returned 200 for both).

### 2.8 Raycast (observed from real-app screenshots plus open source)

**App screenshots (observed)**
- Images: `c-raycast-notion-1.png` and `c-raycast-linear-1.png` from [raycast/extensions @11b060e](https://github.com/raycast/extensions/tree/11b060ecbad725f70a91e077c7a4b65f640cb1f9/extensions/notion/metadata). Both are 2× captures.
- **List rows 40px.** Search header 56px. Action footer about 40px. The selection highlight is inset 8px from the window edge.
- Keyboard-shortcut chips appear in the footer.

**ray.so (observed)** ([globals.css](https://github.com/raycast/ray-so/blob/168f9aa9c2c4af1b8c6eaaac9158e00b20bfd9a7/app/globals.css))
- A Radix-style 12-step grey scale. Dark steps 1 to 3 are #0D0D0D, #181818 and #222222.
- Brand red hsl(0 100% 69%), which is #FF6161.

**Marketing site (observed-3P)** ([VoltAgent raycast](https://github.com/VoltAgent/awesome-design-md/blob/f6961238d5cddcf8042a74a70fc400ec67181abb/design-md/raycast/DESIGN.md))
- Inter. Radii 4, 6, 8, 10 and 16px. Canvas #07080A.

### 2.9 Attio, Claude, Cursor, Superhuman (observed-3P)

**Attio** ([design-bites](https://github.com/educlopez/design-bites/blob/55dac795fafe646c3397af080b41d7f9bf7b7ca9/design-mds/attio.com/DESIGN.md))
- Inter with `interDisplay`, and `ss03` enabled globally.
- Fully achromatic.
- H1 64/64 at weight 600 with -1.28px tracking. Body 16px at weight 500 with -0.16px tracking.

**Claude** ([VoltAgent claude](https://github.com/VoltAgent/awesome-design-md/blob/f6961238d5cddcf8042a74a70fc400ec67181abb/design-md/claude/DESIGN.md))
- Canvas **#FAF9F5**. Coral CTA **#CC785C**. Ink #141413.
- Display serif "Copernicus / Tiempos Headline". Body "StyreneB".
- Anthropic's own skill names **#D97757** as Claude's interaction accent ([SKILL.md](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/frontend-design/SKILL.md), observed).

**Cursor** ([VoltAgent cursor](https://github.com/VoltAgent/awesome-design-md/blob/f6961238d5cddcf8042a74a70fc400ec67181abb/design-md/cursor/DESIGN.md))
- Warm cream canvas **#F7F7F4**. Ink #26251E. Orange #F54E00.
- "CursorGothic" for text and **JetBrains Mono** for code.

**Superhuman** ([VoltAgent superhuman](https://github.com/VoltAgent/awesome-design-md/blob/f6961238d5cddcf8042a74a70fc400ec67181abb/design-md/superhuman/DESIGN.md))
- "Super Sans VF". Ink #292827. Hairline #E8E4DD. Primary #1B1938.

### 2.10 Published design systems (observed)

**Radix Colors** ([light.ts](https://github.com/radix-ui/colors/blob/dbdb85470547c7d34b9001f48fddb08ded335979/src/light.ts#L121), [dark.ts](https://github.com/radix-ui/colors/blob/dbdb85470547c7d34b9001f48fddb08ded335979/src/dark.ts#L121))

| Step | Slate (light) | Slate (dark) |
|---|---|---|
| 1 | #FCFCFD | #111113 |
| 2 | #F9F9FB | #18191B |
| 3 | #F0F0F3 | #212225 |
| 4 | #E8E8EC | #272A2D |
| 5 | #E0E1E6 | #2E3135 |
| 6 | #D9D9E0 | #363A3F |
| 7 | #CDCED6 | #43484E |
| 8 | #B9BBC6 | #5A6169 |
| 9 | #8B8D98 | #696E77 |
| 10 | #80838D | #777B84 |
| 11 | #60646C | #B0B4BA |
| 12 | #1C2024 | #EDEEF0 |

Blue step 9 is #0090FF and step 11 is #0D74CE.

**Radix Themes** ([typography.css](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/styles/tokens/typography.css), [space.css](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/styles/tokens/space.css), [radius.css](https://github.com/radix-ui/themes/blob/1faff10ac26ae17f09944d418c6949b93fc6b566/packages/radix-ui-themes/src/styles/tokens/radius.css))

| Step | Font size / line height | Letter-spacing |
|---|---|---|
| 1 | 12/16 | +.0025em |
| 2 | 14/20 | 0 |
| 3 | 16/24 | 0 |
| 4 | 18/26 | -.0025em |
| 5 | 20/28 | -.005em |
| 6 | 24/30 | -.00625em |
| 7 | 28/36 | -.0075em |
| 8 | 35/40 | -.01em |

- Space scale: 4, 8, 12, 16, 24, 32, 40, 48 and 64px.
- Radius scale: 3, 4, 6, 8, 12 and 16px.

**GitHub Primer** (`@primer/primitives` 11.10.0 from npm; [repo](https://github.com/primer/primitives/tree/f48bc063f7bc0fb3e447386a8c259650ce46dea8))
- **Control heights:** xsmall 24, small 28, **medium 32**, large 40. Horizontal padding is 12px at medium.
- **Radius:** small 3, **medium 6**, large 12.
- **Type:** body 14 / 1.5. Line-heights are 1.25, 1.375, 1.5, **1.625 (relaxed)** and 1.75.
- **Focus:** 2px outline.
- **Motion:** micro 100ms, short 200ms, medium 300ms. Ease-out `cubic-bezier(0.3,0.8,0.6,1)`.
- **Light colours:** text #1F2328, muted text #59636E, border #D1D9E0, muted background #F6F8FA, accent #0969DA. Dark background is #0D1117.
- The UI font stack now starts with **"Mona Sans VF"**.

**Material 3** ([switch](https://github.com/material-components/material-web/blob/a6b2d2640b336e5d9fc73133a317e9173827ba95/tokens/versions/latest/sass/_md-comp-switch.scss#L59-L63), [motion](https://github.com/material-components/material-web/blob/a6b2d2640b336e5d9fc73133a317e9173827ba95/tokens/versions/latest/sass/_md-sys-motion.scss))
- **Switch:** track **52×32**. Handle 16px off, 24px on, 28px pressed. 2px outline.
- **Motion:** short durations 50 to 200ms, medium 250 to 400ms. Standard easing `cubic-bezier(0.2,0,0,1)`.

**Apple HIG** (JSON from developer.apple.com, fetched 2026-10-03, for typography, accessibility and toggles)
- **macOS text styles:** Body **13/16**, Headline 13/16 bold, Title 3 15/20, Title 2 17/22, Title 1 22/26.
- **macOS text size:** default 13pt, minimum 10pt.
- **Contrast:** 4.5:1 for text up to 17pt; 3:1 at 18pt or for bold text.
- **Control size:** macOS default **28×28pt** (minimum 20). iOS **44×44pt**.
- **Switches:** "The default green color tends to work well in most cases". "Use a regular switch for the primary setting and mini switches for subordinate settings."

### 2.11 Screenshots reviewed

All are in `shots/`:

| File | What it shows | Used for |
|---|---|---|
| `c-linear-settings-webhooks-new.png` | Linear app modal | Colours, flat recessed input |
| `c-raycast-notion-1.png`, `c-raycast-linear-1.png` | Raycast app | Row, header and footer heights, selection inset, a form layout with labels on the left |
| `c-notion-simpler-databases.jpg`, `c-notion-view-scale.jpg` | Notion app, older dark theme | Row pitch, menu rows, toggle size |
| `c-bolt-social-preview.jpg` | Bolt marketing image | The dark "AI glow" trend |
| `c-vercel-ai-chatbot-og.png` | Vercel chatbot template | Black canvas and the ✨ sparkle-for-AI icon (a tell) |
| `c-rayso-og.png` | Raycast ray.so | Brand reference |
| `c-avoid-ai-design-before-after.png` | Before/after of a generic AI page | Purple gradient, centred hero, three emoji cards, and the calmer rewrite |

---

## 3. Step 3: Synthesis

### 3.1 Where the products converge

| Dimension | Consensus | Evidence |
|---|---|---|
| UI text | **13–14px** | ChatGPT controls 14 (O). Cal.com and shadcn `text-sm` 14 (O). Primer body 14 (O). Radix size-2 14/20 (O). Linear buttons 13 (O3). Apple macOS body 13pt (O). |
| Reading text | **15–16px**, line-height 1.5 | ChatGPT text-md 16/24 (O). Notion 16 × 1.5 (O). Radix default 16/24 (O). Linear paragraph 15/24 (O3). Granola 16 (O3). |
| Weights | **400 / 500 / 600**, rarely 700 | Vercel (O3). ChatGPT headings 600 (O). Cal.com buttons 500 (O). Linear uses 510 and 590 (O3). |
| Control radius | **6px** | Linear (O3). Vercel `--geist-radius` (O3). Primer medium (O). Radix-3 (O). |
| Card / panel radius | **8px** | Linear (O3). Notion (O). Granola (O3). ChatGPT md (O). |
| Floating layers (menu, popover, modal) | **12px** | ChatGPT (O). Vercel (inferred). Primer large (O). |
| Control heights | **28 / 32 / 36**, default 32 | ChatGPT (O). Primer (O). Cal.com (O, with inferred arithmetic). Apple 28pt (O). Geist starts at 32 (O3). shadcn 32/36/40 (O). |
| Sidebar width | **224–256px** | Cal.com 224 (O). Linear 244 (inferred). shadcn 256 (O). |
| Nav row height | **28–32px** | shadcn 32 (O). Cal.com ≈32 (O). Notion menu 28 (O). Linear 28 (inferred). |
| List / table rows | **33–40px** | Notion table 33 (O). Raycast 40 (O). |
| Borders | 1px, or 0.5px hairline on high-density screens; **8–10% black** (light) and **8–12% white** (dark) | ChatGPT (O). Vercel `#00000014` (O3). Linear rgba(255,255,255,.08) (O3). Notion #E9E9E7 (O). |
| Depth | Flat surfaces. Small layered shadows on floating layers only. | ChatGPT elevation scale (O). Cal.com dropdown (O). Granola (O3). Linear (inferred). |
| Focus | **2px solid accent ring, 2px offset** | ChatGPT (O). Primer 2px (O). Vercel double ring (O3). shadcn's 3px ring at 50% is the outlier (O). |
| Spacing | **4px grid** | ChatGPT, Radix, Geist, Primer. |
| Light neutrals | Content white. Secondary or sidebar at **97–98.5% lightness** (#F9F9F9, #FAFAFA, #FBFBFA, #F6F7F9). | ChatGPT, Vercel, Notion, Cal.com. |
| Primary button | **Near-black** in light mode, inverted in dark mode | ChatGPT #181818 (O). Vercel #171717 (O3). Cal.com #111827 (O). shadcn #171717 (O). Granola #292929 (O3). Linear (accent indigo) is the exception. |
| Interactive accent | **Blue** | ChatGPT #0169CC (O). Primer #0969DA (O). Vercel #0072F5 (O3). Notion #2383E2 (O). Exceptions: Linear indigo, Granola olive, Cursor orange, Claude coral. |
| Motion | 100–150ms for micro interactions. 200–250ms for toggles and expanding. About 300ms for overlays. | Primer (O). ChatGPT (O). Material (O). |
| Math rendering | **KaTeX** | ChatGPT bundles it (O). Notion's math font is KaTeX_Main (O). |

### 3.2 Where they differ

- **Temperature.** Warm neutrals: Notion (#37352F ink), Granola (#F7F7F2 canvas), Claude (#FAF9F5) and Cursor (#F7F7F4). Cool or pure neutrals: Linear, Cal.com (Tailwind grey), Vercel and ChatGPT.
- **Default mode.** Dark-first: Linear and Raycast. Light-first: Notion, Granola and Cal.com.
- **Button shape.** Pill: ChatGPT and shadcn badges. Rounded rectangle: Linear, Vercel, Primer and Cal.com (10px).
- **Density.** Dense: Linear (13px, 28px rows). Comfortable: Cal.com and shadcn (14px, 32px rows). Spacious reading: Notion (16px on a 720px column).
- **Type character.** Neutral grotesques: Inter at Linear, Attio, Cal.com and Raycast; the system stack at ChatGPT and Notion. Bespoke faces: Linear's possible custom face, Superhuman, Cursor. Serif pairings: Granola, Claude, and Notion's optional serif page style.

### 3.3 What the text-heavy professional tools share

These are Linear, Notion, Granola and Readwise:

1. **Content leads and chrome recedes.** Linear's 2026 refresh dimmed the sidebar (inferred). Notion's sidebar is #FBFBFA against white (O). Granola steps from white to warm off-white (O3).
2. **One quiet accent, with colour reserved for status.** Linear indigo with semantic status colours (O3). Granola olive (O3). Notion blue (O).
3. **A reading column of roughly 65–80 characters.** Notion's 720px (O). Readwise targets about 65 characters (inferred). Anthropic's guidance is under 80 characters (O).
4. **Hierarchy through weight and size, not colour or ornament.** Linear's 510/590 system (O3). Granola uses weight 400 even for display (O3).

### 3.4 Trends to avoid (they now read as generic AI output)

**First-order defaults** ([avoid-ai-design README and catalog](https://github.com/funboy322/avoid-ai-design), [Anthropic frontend-design skill](https://github.com/anthropics/skills/blob/8a1541c4a3ffa5a20a5a91de0dcf3f0bab1d1ef4/skills/frontend-design/SKILL.md), both observed; also [SmoothUI](https://smoothui.dev/blog/ai-design-slop), [925studios](https://www.925studios.co/blog/ai-slop-design-tells), [Kyle Chayka](https://kylechayka.substack.com/p/the-generic-style-of-ai-web-design), inferred)
- Purple or indigo-to-blue gradients, and gradient headline text.
- Inter (or the system stack) as the only face, with no pairing.
- Centred hero with three icon cards.
- `rounded-2xl shadow-lg` on everything, or a grey 1px border around every card.
- Reflexive glass and backdrop blur.
- Untouched shadcn tokens, including `--radius` at 0.5 or 0.625rem.
- Emoji as feature bullets or in the nav.
- The ✨ sparkle icon to mean "AI". This appears in the Vercel chatbot image (observed).
- Bounce easing, fade-up on every section, and motion that ignores reduced-motion.

**Second-order "tasteful" defaults** (Anthropic skill, observed)
1. Cream ground near #F4F1EA, a high-contrast serif display, and a terracotta accent near **#D97757**. This is "the Claude look". Granola and Cursor sit close to it as well (O3).
2. Near-black with a single acid-green or vermilion accent.
3. Broadsheet hairlines with zero radius.
4. The SaaS card kit: identical rounded cards, one radius everywhere, the same rgba(0,0,0,.1) shadow.
5. Template chrome: tracked ALL-CAPS eyebrow labels (Cal.com's sidebar does this, O); `A · B · C` metadata strings; `WORD — fragment` labels; **tinted near-black (#0B0B0B, #111) standing in for black**; mono for small data labels; `→` appended to links.
6. Also flagged: the "tasteful free font" set (Space Grotesk, **Geist**, Instrument Serif, Fraunces, **Cal Sans**), and the emerald accent as a fallback once purple is ruled out.

**Implications for Lectern**
- Do not use cream, terracotta or an editorial serif display. Do not use a #111 near-black canvas.
- Do not ship shadcn defaults or Geist untouched.
- Avoid all-caps eyebrows, sparkle-for-AI icons, gradients and glow.
- The product's own structure should carry the look: flat, flush, tabular data surfaces, as Linear does.

---

## 4. Recommended Lectern token set

**Selection rule.** Each value is either taken directly from, or sits inside, the observed consensus range. Where products disagree, the value comes from the tools closest to the persona: Linear, Notion, Granola and ChatGPT's reading surfaces. "O" is observed, "O3" is observed-3P, "I" is inferred.

**Design intent.**
- A cool-neutral, light-first console (Notion-, Cal.com- and ChatGPT-like) with a full dark theme.
- Content on white, with the sidebar one step dimmer (Linear 2026).
- Near-black primary actions, blue for links and focus only, green only for the "Tutor is live" state.
- Flat data surfaces, with radius and shadow only on floating layers.

### 4.1 Typography

| Token | Value | Drawn from |
|---|---|---|
| `--font-ui` | **"Inter"** from Google Fonts, variable: `opsz` 14–32, `wght` 400–600. `font-optical-sizing: auto` gives Inter's Display cut at large sizes. `font-feature-settings: "cv01","ss03"`. This is the real face, not a substitute. | Linear: Inter Variable with cv01/ss03 (O3); Inter Display headings (I). Attio: Inter and interDisplay with ss03 (O3). Cal.com: Inter from Google Fonts (O). Raycast: Inter (O3). |
| `--font-reading` (student answers and source excerpts only; optional) | **"Literata"**, Google Fonts, text sizes only. Never as a display face and never on cream. | Stands in for Notion's serif page style `Lyon-Text` (O). Literata is a sturdy, low-contrast screen-reading serif like Lyon Text (I). A serif in reading text echoes Granola's pairing (O3), and Anthropic's guidance allows two clearly distinct faces (O). |
| `--font-mono` (code, raw prompts, rule IDs only; not labels) | **"IBM Plex Mono"**, Google Fonts. Alternative: "JetBrains Mono". | Notion's mono `iawriter-mono` (O) is derived from IBM Plex Mono (I). Cursor uses JetBrains Mono (O3). Linear's Berkeley Mono is proprietary (O3). |
| `--font-fallback` | `ui-sans-serif, -apple-system, system-ui, "Segoe UI", sans-serif` | ChatGPT `--font-sans` (O). Notion sans stack (O). |
| Math and chemistry | KaTeX (with the mhchem extension for formulas) | ChatGPT bundles KaTeX (O). Notion math font KaTeX_Main (O). |
| Weights | 400 regular, 500 medium (UI emphasis, buttons, active nav), 600 semibold (headings). Never 700. | Vercel 400/500/600 only (O3). ChatGPT button 500 and headings 600 (O). Cal.com font-medium (O). |
| Numerals | `font-variant-numeric: tabular-nums` in the question log and other tables | Inter supports `tnum` (I). Avoids the "mono for data labels" tell (Anthropic, O). |

**Type scale** (size / line-height / weight / tracking)

| Token | Value | Drawn from |
|---|---|---|
| `caption` | 12 / 16 / 400 / 0 | Radix size-1 12/16 (O). Vercel small text 12/16 (O3). ChatGPT text-xs 12/18 (O). |
| `ui-sm` (dense metadata, kbd hints) | 13 / 18 / 400–500 / 0 | Linear 13px buttons (O3). Apple macOS body 13pt (O). Linear 13px nav (I). |
| `ui` (default UI text: nav, buttons, inputs, table cells) | **14 / 20** / 400; emphasis 500 / 0 | ChatGPT text-sm 14/20 (O). Radix size-2 (O). Cal.com and shadcn text-sm (O). Primer body 14 (O). |
| `reading` (chat answers, source text, sans) | **16 / 24** / 400 / 0 | ChatGPT text-md 16/24 (O). Notion 16 × 1.5 (O). Radix size-3 16/24 (O). |
| `reading-serif` (if used) | 16 / 26 / 400 / 0 | Primer relaxed line-height 1.625 (O). Anthropic: give serif body a little more line-height (O). |
| `heading-sm` | 16 / 24 / 600 / 0 | ChatGPT heading-xs (O). Linear h4 16/24 at 590 (O3). |
| `heading-md` | 18 / 26 / 600 / -0.0025em | ChatGPT heading-sm 18/26 (O). Radix size-4 (O). |
| `heading-lg` (section titles) | 20 / 26 / 600 / -0.005em | ChatGPT heading-md 20/26 (O). Notion h3 20px (O). Radix size-5 tracking (O). |
| `title` (page titles) | 24 / 28 / 600 / -0.00625em | ChatGPT heading-lg 24/28 (O). Notion h2 24px (O). Radix size-6 tracking (O). |
| `display` (rare; empty states) | 28 / 36 / 600 / -0.0075em | Radix size-7 28/36 (O). Notion h1 30px (O). |
| Reading measure | Max width **720px**; keep lines under 80 characters | Notion `--notion-max-width: 720px` (O). ChatGPT chat max 800px (O). Anthropic under 80 characters (O). |

### 4.2 Colour: light theme

| Token | Hex | Drawn from |
|---|---|---|
| `--bg` (content canvas) | **#FFFFFF** | ChatGPT surface (O). Notion (O). Cal.com (O). |
| `--bg-sidebar` (one step dimmer) | **#F9F9FB** (Radix slate-2) | Notion sidebar #FBFBFA (O). ChatGPT secondary #F9F9F9 (O). Vercel #FAFAFA (O3). Cal.com sidebar #F6F7F9 (O). Linear 2026 "dimmer sidebar" (I). |
| `--bg-inset` (code, recessed input, composer well) | #F0F0F3 (slate-3) | ChatGPT tertiary #F3F3F3 (O). Linear recessed input in screenshot (O). |
| `--bg-hover` | rgba(28,32,36,0.05) | ChatGPT 5% surface alpha (O). Notion hover 8% (O). |
| `--bg-selected` (active nav, selected row) | **#E8E8EC** (slate-4) | Cal.com active nav #E5E7EB (O). shadcn sidebar-accent (O). |
| `--border-subtle` (row dividers) | #E8E8EC (slate-4) | Notion #E9E9E7 (O). Cal.com border-subtle #E5E7EB (O). |
| `--border` (panels, cards, menus) | **#E0E1E6** (slate-5) | ChatGPT 10% border (O). shadcn #E5E5E5 (O). Vercel 8% black (O3). |
| `--border-strong` (inputs, checkboxes) | #CDCED6 (slate-7) | Cal.com #D1D5DB (O). Primer #D1D9E0 (O). |
| `--text` | **#1C2024** (slate-12), contrast 16.4:1 on white | Primer #1F2328 (O). Vercel #171717 (O3). ChatGPT #0D0D0D (O). Cal.com #070A0D (O). |
| `--text-secondary` | **#60646C** (slate-11), 5.9:1 on white, 5.65:1 on sidebar | Primer #59636E (O). Cal.com #6B7280 (O). ChatGPT #5D5D5D (O). |
| `--text-tertiary` (timestamps and non-essential only) | #80838D (slate-10), 3.8:1: **below AA for small text, so never use it for content** | ChatGPT tertiary #8F8F8F (O). Linear #8A8F98 (O3). Apple contrast rule (O). |

### 4.3 Colour: dark theme

| Token | Hex | Drawn from |
|---|---|---|
| `--bg-sidebar` (dimmer) | **#18191B** (slateDark-2) | ChatGPT dark secondary #181818 (O). Notion dark #191919 (O). |
| `--bg` (content canvas) | **#212225** (slateDark-3). Deliberately **not** #111: the near-black tell. | ChatGPT dark surface #212121 (O). Linear app page #1E1F22 (O, screenshot). Anthropic near-black tell (O). |
| `--bg-raised` (popover, modal) | **#272A2D** (slateDark-4) | Linear modal #27282B (O, screenshot). ChatGPT elevated #303030 (O). |
| `--bg-hover` | rgba(255,255,255,0.055) | Notion dark hover (O). ChatGPT 8% white (O). |
| `--bg-selected` | #2E3135 (slateDark-5) | Radix step for selected states (O). |
| `--border-subtle` | #2E3135 (slateDark-5) | Linear divider #303236 (O, screenshot). |
| `--border` | #363A3F (slateDark-6) | Notion dark #2F2F2F (O). Linear rgba(255,255,255,.08) (O3). |
| `--border-strong` | #43484E (slateDark-7) | Linear input border #404144 (O, screenshot). |
| `--text` | **#EDEEF0**, 13.7:1 on #212225 | Linear #F7F8F8 (O3). Notion 81% white (O). |
| `--text-secondary` | **#B0B4BA**, 7.6:1 | Linear #D0D6E0 / #8A8F98 (O3). Cal.com dark #A3A3A3 (O). |
| `--text-tertiary` | #777B84, 3.75:1, non-essential only | Linear #8A8F98 (O3). |

### 4.4 Accent, actions and semantic colours

| Token | Light | Dark | Drawn from |
|---|---|---|---|
| `--accent` (links, focus ring, selection outline, info) | **#0169CC** (5.4:1 on white) | links **#339CFF** (5.6:1 on #212225); ring **#0285FF** | ChatGPT blue-500 / blue-300 / blue-400 (O). Blue as the interactive accent also at Primer #0969DA (O), Vercel #0072F5 (O3), Notion #2383E2 (O). |
| `--accent-soft` (info background, selected-source tint) | #E5F3FF | rgba(2,133,255,.13) | ChatGPT blue-50 and blue-a50 (O). |
| `--primary-bg` / `--primary-fg` (main buttons such as "Save rules" and "Publish") | **#1C2024** / #FFFFFF; hover #2E3135 | **#EDEEF0** / #18191B | Near-black primary at ChatGPT (#181818, hover #303030), Vercel, Cal.com and Granola (O / O3). Hover values from the Radix slate scales (O). |
| `--success` (text / solid / soft) | #00692A / **#00A240** / #D9F4E4 | #04B84C / **#008635** / rgba(4,184,76,.15) | ChatGPT success tokens (O). |
| `--warning` (text / solid / soft) | #923B0F / #E25507 / #FFE7D9 | text #FF8549 (6.6:1) / #E25507 | ChatGPT orange tokens (O). The dark-text step is moved up one for contrast (I). |
| `--danger` (text / solid / soft) | #911E1B / #E02E2A / #FFD9D9 | text #FF6764 (5.6:1) / solid #E02E2A | ChatGPT red tokens (O). ChatGPT's dark #E02E2A is only 3.5:1 on #212225, so the text uses red-300 (I). |
| **"Tutor live" switch, on** | **#00A240** (3.36:1 against white, passes the 3:1 non-text rule) | **#008635** (3.38:1) | Apple HIG: a green switch is the default (O). ChatGPT success-solid (O). |
| Switch, off track | #8B8D98 (slate-9, 3.3:1) | #696E77 (slateDark-9, 3.1:1) | Radix scale (O). **Deliberately darker than ChatGPT's #DFDFDF (1.33:1) and Cal.com's #E5E7EB**, both of which fail WCAG 1.4.11 (I, computed). |

### 4.5 Radii

| Token | Value | Use | Drawn from |
|---|---|---|---|
| `--radius-xs` | **4px** | Chips, badges, checkboxes, kbd hints | ChatGPT badge 4px (O). Linear small 4px (O3). Radix-2 (O). |
| `--radius-sm` | **6px** | Buttons, inputs, nav items, menu items | Linear 6px (O3). Vercel `--geist-radius` 6px (O3). Primer medium 6px (O). Radix-3 (O). |
| `--radius-md` | **8px** | Cards, source panels, toasts, code blocks | Linear 8px (O3). Notion 8px (O). Granola 8px (O3). ChatGPT md 8px (O). |
| `--radius-lg` | **12px** | Menus, popovers, modals | ChatGPT menu, popover and alert 12px (O). Vercel menu and modal 12px (I). Primer large 12px (O). |
| `--radius-xl` | 16px | Student chat composer | Radix-6 16px (O). ChatGPT 2xl 16px (O). Vercel fullscreen 16px (I). ChatGPT's own composer uses 24px (O). |
| `--radius-full` | 9999px | Switch track and thumb, avatars | Universal. |
| Data surfaces (question log, rules table) | 0 inside a bordered 8px panel; rows separated by `--border-subtle` | | Linear flush, flat data surfaces (I). Avoids the "card kit" tell (Anthropic, O). |

### 4.6 Shadows and elevation

| Token | Light | Dark | Drawn from |
|---|---|---|---|
| `--shadow-none` | Flat surfaces: sidebar, tables, cards at rest | | Linear flat by default (I). Granola minimal (O3). |
| `--hairline` | `0 0 0 1px rgb(0 0 0 / 8%)` (0.5px at ≥1.5 dppx) | `0 0 0 1px rgb(255 255 255 / 10%)` | ChatGPT hairline (O). Vercel `#00000014` (O3). |
| `--shadow-pop` (menus, popovers) | `0 4px 8px -2px rgb(0 0 0 / .10)` plus hairline | same geometry at alpha .36 | ChatGPT shadow-300 (O). |
| `--shadow-modal` | `0 8px 16px -4px rgb(0 0 0 / .12)` plus hairline | alpha .30 | ChatGPT shadow-400 (O). Alternative: Cal.com dropdown `0 5px 20px rgba(0,0,0,.10), 0 10px 40px rgba(0,0,0,.03)` (O). |
| `--shadow-thumb` (switch) | `0 1px 2px rgb(0 0 0 / 20%)` | same | ChatGPT (O). |
| `--backdrop` | rgba(0,0,0,.30) | rgba(0,0,0,.50) | ChatGPT modal backdrop (O). |

### 4.7 Spacing and layout

| Token | Value | Drawn from |
|---|---|---|
| Spacing scale | 4, 8, 12, 16, 24, 32, 40, 48, 64px | Radix space 1–9 (O). ChatGPT 4px unit (O). Geist (O3). |
| Sidebar width | **240px**, collapsible | Inside the observed range: Cal.com 224 (O) to shadcn 256 (O). Linear 244 (I). |
| Top bar height | 48px | Notion header 45px (O). Vercel sub-menu 46px (O3). Rounded to the 4px grid (I). |
| Page gutter | 24px | Vercel page margin 24px (O3). Radix space-5 (O). |
| Chat and reading column | 720px max | Notion (O). Under ChatGPT's 800px (O). |
| Modal width | 450px for confirmations; wider for the source viewer | ChatGPT dialog max 450px with 20px padding (O). |

### 4.8 Control sizes

| Token | Value | Drawn from |
|---|---|---|
| Button height | sm **28** / md **32** (default) / lg **36** | ChatGPT 28/32/36 (O). Primer 28/32 (O). Cal.com 28/≈32/≈36 (O and I). Apple macOS 28pt (O). |
| Button padding and type | Horizontal padding 12px (md), 8px (sm). Icon gap 6px. Text 14px weight 500 (13px at sm). | Primer 12px padding (O). ChatGPT md gutter 12px and weight 500 (O). Cal.com text-sm font-medium (O). |
| Input | 32px high, 10–12px horizontal padding, 14px text, 1px `--border-strong`, 6px radius | ChatGPT input md 32px (O). Linear 6px input radius (O3). |
| Student-facing touch targets (mobile) | At least **44×44px** hit area | Apple iOS 44×44pt (O). |
| Nav item | **32px** high, 6px 8px padding, 14px text weight 500, 16px icon, 6px radius; active uses `--bg-selected` with no accent fill. A dense 28px/13px variant is allowed. | shadcn h-8 (O). Cal.com `py-1.5 text-sm font-medium` (O). Linear 28px / 13px / 16px icons (I). |
| Section labels in sidebar | 12px, weight 500, **sentence case** (not uppercase) | Anthropic all-caps tell (O). Departs from Cal.com's uppercase labels (O). |
| Question-log row | **40px** single-line; 32px compact (sources list) | Raycast list rows 40px (O). Notion table rows 33px (O). |
| Chip / badge (status: Answered, Refused, Flagged) | 20px high, 12px text weight 500, 0 6px padding, 4px radius, soft semantic background | ChatGPT badge sm 20px, 12px, radius 4px (O). shadcn badge 12px (O). |
| Master switch ("Tutor live for students") | **44×24 track, 20px thumb, 2px inset** | Cal.com default switch (O). Apple: a regular switch for the primary setting (O). |
| Secondary switches (per-rule toggles) | **32×19 track, 13px thumb, 3px inset** | ChatGPT switch (O). shadcn 32×18.4 (O). Apple mini switch for subordinate settings (O). |
| Checkbox / radio | 16px | ChatGPT radio indicator 16px (O). |
| Menu | 12px radius, 6px padding, items 6px 8px, 14/20 | ChatGPT menu (O). |
| Avatar | 28px | ChatGPT (O). |
| Focus ring | `outline: 2px solid var(--accent); outline-offset: 2px` | ChatGPT switch focus (O). Primer 2px (O). Vercel 2px ring (O3). |
| Composer (student chat) | Minimum 48px high, 16px radius, `--bg` with `--border`, send button 32px (44px hit area on mobile) | Radius and colour from above. ChatGPT composer tokens (O). Apple 44pt (O). |

### 4.9 Motion

| Token | Value | Drawn from |
|---|---|---|
| `--dur-micro` (hover, press, colour) | **150ms ease** | ChatGPT basic 150ms ease (O). Primer micro 100ms (O). |
| `--dur-toggle` (switch, expand, collapse) | **200–250ms**, `cubic-bezier(0.65,0,0.35,1)` | ChatGPT switch 250ms `cubic-move` (O). Primer short 200ms (O). Material medium1 250ms (O). |
| `--ease-enter` (popover, modal in) | 200ms, `cubic-bezier(0.19,1,0.22,1)` | ChatGPT `--cubic-enter` (O). Primer ease-out (O). |
| `--ease-exit` | 150ms, `cubic-bezier(0.8,0,0.4,1)` | ChatGPT `--cubic-exit` (O). |
| Rules | No bounce, no fade-up on scroll, no count-ups. Honour `prefers-reduced-motion`. Animate only in response to the user's actions. | Anthropic skill (O). avoid-ai-design M1, M4 and M6 (O). |

---

## 5. Gaps and caveats

- **No live CSS or screenshots of the marketing sites themselves.** Firecrawl had no credits and the allowlist blocked egress. The Linear, Granola, Vercel, Attio, Claude, Cursor, Superhuman and Raycast-web values are observed-3P. Spot-check them once egress or Firecrawl credits are available.
- **Linear's current typeface is ambiguous.** One extraction says Inter Variable; the other says "Linear Display / Linear Text". This does not change the Lectern recommendation, which uses Inter.
- **Linear's in-app sizes (244px, 28px, 13px) are third-party claims (inferred).** They were kept only as the dense end of a range anchored by observed code from Cal.com and shadcn.
- **The Notion mirror is from 2023–2024.** Notion has since adjusted its colours slightly, so treat the hex values as close but not current to the pixel.
- **Readwise Reader, Craft and Things 3 could not be measured** because the search cap was reached. Readwise appears only as inferred design principles.
- **Google Fonts stand-ins are judgment calls (inferred):** Literata for Lyon Text, IBM Plex Mono for iA Writer Mono, Zilla Slab for Quadrant, Hanken Grotesk for Melange. Inter, Geist, Mona Sans, Cal Sans, JetBrains Mono, IBM Plex Mono and Literata were all confirmed available on fonts.googleapis.com (HTTP 200), and Inter's `opsz` axis loads.
