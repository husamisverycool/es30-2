# Lectern: where every design decision comes from

The brief for this MVP was to copy nothing from taste and everything from products people already use and trust. Four research passes produced the evidence; the full reports, with a source link beside every value, are in [`research/`](research/):

| Report | What it covers |
|---|---|
| [`a-ai-agent-consoles.md`](research/a-ai-agent-consoles.md) | Admin consoles for AI agents built on your own content: Intercom Fin, the GPT builder, Claude Projects, Decagon, Sierra, Zendesk, Ada, plus the open-source Chatwoot Captain, Dify and Harvard Kennedy School's PingPong. Education tools: SchoolAI, Khanmigo, MagicSchool, Cogniti, Ed Bots++. |
| [`b-tutor-chat.md`](research/b-tutor-chat.md) | Source-grounded and learning chat: NotebookLM (now Gemini Notebook), Perplexity, ChatGPT Study Mode, Claude Learning mode, the CS50 Duck, Khanmigo, Oak's Aila. |
| [`c-visual-language.md`](research/c-visual-language.md) | Measured tokens from Linear, Notion, Granola, ChatGPT's design system, Cal.com, Vercel Geist, Raycast, Attio, Cursor, Radix, Primer, Material 3, Apple HIG, and a catalogue of looks that now read as AI-generated. |
| [`d-academic-vernacular.md`](research/d-academic-vernacular.md) | Ed Discussion's interface and real announcement posts, lecture-capture conventions, intro chemistry syllabi and AI policies, CS50's tutor policy, and 2024–2026 faculty surveys. |

Firecrawl had no credits and several product sites were blocked from the research sandbox, so values come from open-source code, published design systems, real screenshots hosted on GitHub, help-center text and third-party CSS extractions. Each report marks values as observed, observed via a third party, or inferred.

## Product structure

| Decision | Reference |
|---|---|
| Console nav as verbs in order: Overview, Sources, Rules, Preview, Questions, Go live | Intercom Fin's Train / Test / Deploy / Analyze navigation, recast for a professor (report A §8.1) |
| One global switch with words first ("Tutor is off"), in the sidebar footer, plus an off-state banner that says the consequence | Education tools put pause where you can see it (SchoolAI "Pause / End", Khanmigo focus mode); Fin hides it and users ask how to turn it off. Banner wording follows Captain's "This assistant isn't connected to any inbox yet, so it won't respond" (A §8.2) |
| Turning on asks once; turning off never asks | Zendesk's confirmed "Publish AI agent" step; safe direction is instant (A §8.3) |
| "Pause for a set time", including a pause during Midterm 1 | Khanmigo "Set focus mode" up to 4 hours; MagicSchool "pause, lock, or resume" (A §6) |
| Every source starts "Needs review", with a recommendation, an Approve / Leave out pair, then a switch once decided | Captain's pending-until-approved FAQs; Dify's per-row enable toggle; Ada's "Active" toggle (A §8.7–8.8) |
| Status as a dot plus a word, never a filled pill | Captain `DocumentSyncStatus`, Dify "Available / Disabled" (A §5.1–5.2) |
| Floating bulk bar at the bottom: "N selected · Approve · Leave out · Cancel" | Dify's documents table (screenshot in report A) |
| "Used in N answers" column | Dify "Retrieval count", Captain "Used in {n} conversations" (A §5) |
| Coverage strip: "18 of 34 reviewed · 16 approved" | Claude Projects' capacity bar, Captain's "Knowledge coverage {pct}% approved" (A §8.12) |
| Open problem sets are "Recognize only": used to spot questions, never quoted | Intercom's private-source documents ("customers will not see any link references"); Fin's scheduled availability for content released later (A §8.10, §8.13) |
| Rules are short separate rows grouped by purpose, with "Try it" and an "Always on" lock for the two promises in the offer | Fin Guidance categories and best practices (one objective per rule, when-then); Captain `RuleCard` (A §8.14–8.16) |
| Preview: a question bank from her Ed history beside a test chat, "Sounds right / Not how I'd say it", and a "Why this answer" disclosure | Fin batch test and Preview event log; Captain "Run details · Handled by"; Dify annotations (A §8.18–8.21) |
| Corrections replace the tutor's answer for that question and close variants | Dify "Annotation reply" returns pre-written answers "instead of generating new responses"; Fin "Improve answer" (A §8.24) |
| Questions page: a written weekly digest, topics ranked by volume, then the full log; students shown as numbers | PingPong weekly Activity Summaries; Fin unresolved-question clusters; Cogniti de-identified history; PingPong "(anonymized)" (A §8.23–8.27) |
| Ed announcement drafted in her voice with a preview of how it reads on Ed | SchoolAI "Preview & Launch" then sharing instructions; real Ed announcements: "Hi everyone,", bold lead-ins, bullets, 120–250 words, signed with a name (A §8.29, D §1.4, §6) |

## Student tutor

| Decision | Reference |
|---|---|
| One centred reading column, 720px, with the composer docked under it | Notion's 720px measure; ChatGPT's thread and composer share one column (B §7.2, C §4.1) |
| User messages in a tinted bubble on the right; tutor answers as plain prose with no avatar | NotebookLM, ChatGPT, Aila (B §7.4) |
| Numbered grey citation chips after each claim; hover shows the passage, the source and "Approved by Prof. Marsh"; click opens the transcript at the timestamp with the passage highlighted | NotebookLM `citation-marker` chips, hover card and highlighted source viewer; Perplexity's trust labels (B §1.5, §7.6–7.10) |
| A sources row under each answer: "① Lecture 11 · 12:40" | Perplexity's sources row with publisher-first labels (B §7.7) |
| The empty state is a course overview: title, what it was built from, a short summary | NotebookLM's notebook overview (B §1.3, §7.12) |
| The first message says staff can read the questions; it returns after "Clear chat" | The CS50 Duck's first message ends "Conversations are logged." and is re-added on reset; Claude for Education is private by default, so students expect privacy unless told (B §4.2, §3.2) |
| A locked "Hints, not solutions" chip inside the composer | ChatGPT's "Study" chip and Claude's "Learning" style chip, locked because the professor set it (B §7.15) |
| Suggested questions inside the composer, refreshed from the last topic | NotebookLM's in-composer suggestions (B §1.7) |
| Problem-set refusals: one policy line, then where the idea is taught, then office hours; marked by a slim amber callout, never red | ChatGPT Study prompt ("DO NOT SOLVE IT"), Khanmigo, PingPong's worked-example refusal; Aila's moderation styling `#FFF7CC` / `#FBD60E` (B §7.19–7.22) |
| "Not in the approved materials" says so and offers "Copy for Ed" | NotebookLM's "Based on the sources provided, there is no information about…" (B §7.21) |
| Permanent footer: approved materials only · staff can see questions · can be wrong | NotebookLM, Khanmigo and Aila disclaimers (B §7.17) |
| Loading line names what it is reading ("Reading Lecture 11, Slides · Lecture 11…"), then "Read 2 lectures, 1 slide deck" under the answer | NotebookLM's rotating loading phrases; Perplexity's collapsed research steps (B §7.24) |
| No regenerate button | NotebookLM omits it; regenerating fishes for an answer (B §7.23) |

## Visual tokens

All values from report C §4 unless noted.

| Token | Value | Drawn from |
|---|---|---|
| UI face | Inter (variable, `cv01`, `ss03`, optical sizing) | Linear, Attio, Cal.com, Raycast |
| Reading face | Literata, for answers, transcripts and the digest | Stands in for Notion's Lyon Text; serif reading text echoes Granola |
| Ed preview face | Open Sans | Ed Discussion's humanist sans (D §1.3) |
| Type scale | 12/16, 13/18, 14/20 UI, 16/24–26 reading, 16 and 18 headings, 24/28 page titles, 28/36 empty states | ChatGPT, Radix, Notion |
| Light neutrals | `#FFFFFF` canvas, `#F9F9FB` sidebar, `#E8E8EC` selected, `#E0E1E6` border, `#1C2024` / `#60646C` text | Radix Slate, matched to Notion, ChatGPT, Cal.com and Linear's 2026 dimmer sidebar |
| Dark neutrals | `#212225` canvas (not `#111`), `#18191B` sidebar, `#272A2D` raised, `#363A3F` border | ChatGPT dark, Linear app screenshot |
| Primary button | Near-black `#1C2024`, inverted in dark | ChatGPT, Vercel, Cal.com, Granola |
| Accent | Blue `#0169CC` for links and focus only | ChatGPT; also Primer, Vercel, Notion |
| Live | Green `#00A240`, only on the tutor switch and its status | Apple HIG switch; ChatGPT success |
| Switches | 44×24 master, 32×19 per rule; off track `#8B8D98` to pass 3:1 | Cal.com, ChatGPT; contrast fix computed in C §4.4 |
| Radii | 4 badges, 6 controls, 8 panels, 12 menus and dialogs, 16 composer | Linear, Vercel, Primer, ChatGPT |
| Surfaces | Flat; shadows only on popovers, panels and dialogs | ChatGPT elevation scale, Linear |
| Data tables | Flush rows inside one bordered 8px panel | Linear; avoids the "card kit" look |
| Focus | 2px accent ring, 2px offset | ChatGPT, Primer, Vercel |
| Motion | 150ms micro, 250ms toggles on `cubic-bezier(0.65,0,0.35,1)`, enter on `cubic-bezier(0.19,1,0.22,1)`; nothing bounces; reduced motion respected | ChatGPT, Primer, Material |
| Charts | One series per chart; the peak or top bar in the accent, the rest in grey; hairline grid; 4px rounded bar ends; hover tooltips and a hidden table twin | The dataviz method used for this build; colours checked with its validator |

## Looks deliberately avoided

From Anthropic's frontend guidance and the public "AI design tells" catalogue summarised in report C §3.4: no purple gradients, no Inter-only typography, no centred hero with three icon cards, no cream-and-terracotta "Claude look", no near-black `#111` canvas, no all-caps eyebrow labels (sidebar labels are sentence case, unlike Cal.com), no sparkle icon for AI, no icon-in-a-tinted-square feature tiles, no coloured left-border cards, no stock Lucide set (the icons are drawn for this app), no bounce or scroll-triggered fades.
