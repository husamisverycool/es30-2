# B. Tutor chat: how source-grounded and learning-focused AI chat products are designed

*Research for Lectern's student tutor screen. Compiled 2026-10-03.*

---

## 0. Method, constraints, and evidence labels

**What was possible this session.** The Firecrawl account had no credits left (HTTP 402 on the first call). The session's egress proxy blocked most primary hosts with a 403, and WebFetch went through the same proxy. Blocked hosts included blog.google, support.google.com, notebooklm.google, openai.com, help.openai.com, perplexity.ai, cs50.harvard.edu, cs.harvard.edu, arxiv.org, dl.acm.org, khanacademy.org, medium, substack and intercom CDN images. The shared WebSearch budget (200 calls across the session) ran out partway through.

These hosts **were** reachable: anthropic.com, claude.com, support.claude.com, fonts.googleapis.com, and public GitHub (git clone, gists, raw files).

**Workarounds.** Each product's evidence came from the best channel available:

- **NotebookLM screenshots.** Real UI screenshots of NotebookLM (mid-2025 build, with the Sources, Chat and Studio panels) were taken from a public GitHub repo that embeds them (`ramitdour/notebooklm-source-plus`), then cropped and measured.
- **NotebookLM DOM.** Live-DOM selectors come from automation projects that maintain them against the shipping NotebookLM app. `PleasePrompto/notebooklm-mcp` says it was "Last verified: 2026-05". The others are `roomi-fields/notebooklm-mcp` and the selector-contract test in `nicremo/notebookLM-citation`.
- **Copy of the NotebookLM help center.** A gist copy from September 2024 (`dazzaji/NotebookLM_Documentation.md`) supplied verbatim help text.
- **CS50 Duck.** The duck's shipping source (`cs50/ddb50.vsix`, last commit 2026-09-30) and CS50's own docs source (`cs50/cs50.readthedocs.io`) were read directly.
- **ChatGPT.** Class names and widths come from a userscript maintained against live ChatGPT (`alexchexes` gist, updated 2026-09-26). The Study Mode system prompt comes from a leaked-prompt gist.
- **Perplexity.** Screenshots of Perplexity threads come from the `pnd280/complexity` repo. These are dark mode and restyled by that extension, so only their structure is reliable.
- **Oak National Academy's Aila.** Its full open-source frontend was read (`oaknational/oak-ai-lesson-assistant`).
- **Anthropic.** anthropic.com, claude.com and support.claude.com pages were fetched directly.
- **Blocked primary pages.** Wording comes from search-engine excerpts of the cited URL.

**Evidence labels used on every value**

| Label | Meaning |
|---|---|
| **observed** | I saw it directly: in a screenshot I opened (file path given), in shipping source code or live-DOM selectors, or in primary page text I fetched. |
| **observed (excerpt)** | Wording from a search-engine excerpt of the cited URL. I could not open the page itself, so the wording is likely right but not verified word for word. |
| **inferred** | My estimate: pixel ratios from compressed screenshots, prior product knowledge not re-verified this session, or analogy. |

**Screenshots used** (all in `scratchpad/research/shots/`)

- `b-nlm-sourceplus-0.jpg`: NotebookLM default view. Shows the Sources list with "Select all sources", the chat empty state (notebook overview), the composer with suggested questions, and the disclaimer.
- `b-nlm-sourceplus-1.jpg`: NotebookLM answer with inline citation chips, the **citation hover card open**, the Studio panel, and the user bubble. The folder grouping in the left panel is the extension's addition, not native.
- `b-nlm-sourceplus-2.jpg`: NotebookLM "no information in sources" answer, the answer action row, and the source count changing 20 → 18.
- `b-nlm-crop-citation-hover.png`, `b-nlm-crop-composer.png`, `b-nlm-crop-notfound-actions.png`: full-resolution crops of the three above.
- `b-pplx-complexity-thread-dark.png`, `b-pplx-complexity-composer-dark.png`: Perplexity thread and composer from 2025, in dark mode and restyled by the Complexity extension.
- `b-cs50-ddb50-icon.png`: the CS50 Duck icon (cartoon yellow rubber duck, orange bill, "CS50" printed on the body).

---

## 1. Google NotebookLM (renamed "Gemini Notebook" in July 2026)

### 1.0 Current status (important for "what's current")

- **Rename.** NotebookLM was renamed **Gemini Notebook**, announced 2026-07-16, and the app moved to `notebook.google.com`; the old address redirects. Coverage describes a "new blue-purple logo" and a new code-execution "secure cloud computer" per notebook. Notebooks and features are otherwise the same product.
  - observed (excerpt): [blog.google/…/notebooklm-gemini-notebook](https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/) and [nlmtools.com](https://www.nlmtools.com/blog/notebooklm-is-now-gemini-notebook).
  - observed: the README of [nicremo/notebookLM-citation](https://github.com/nicremo/notebookLM-citation) says "Google renamed NotebookLM to Gemini Notebook in July 2026 and moved the app to `notebook.google.com`".
- **Three panes, no tabs.** A selector comment says "NotebookLM removed tabs in favour of a three-pane sidebar (2026 layout)" (observed, [notebooklm-mcp selectors.ts](https://github.com/PleasePrompto/notebooklm-mcp/blob/main/src/notebooklm/selectors.ts), "Last verified: 2026-05").
- **Stack.** The frontend is **Angular plus Angular Material (MDC)**, with **Material Symbols** ligature icons such as `more_horiz` and `mat-icon` text nodes. Observed in the same selectors.ts and in [selector-contract.js](https://github.com/nicremo/notebookLM-citation/blob/main/test/selector-contract.js).

### 1.1 Layout

- **Three panels** (observed in `b-nlm-sourceplus-1.jpg`): **Sources** on the left, **Chat** in the center, **Studio** on the right. Each is a white rounded card set on a tinted page background.
  - Google's December 2024 framing (observed (excerpt), [blog.google Dec 2024](https://blog.google/technology/google-labs/notebooklm-new-features-december-2024/)):
    - Sources "manages all the information central to your project".
    - Chat lets you "discuss your sources through a conversational AI interface with citations".
    - Studio lets you "create new things from your sources with a single click".
- **App bar** (observed, `b-nlm-sourceplus-0/1.jpg`): a round black NotebookLM mark plus the notebook title ("Data Eng. History and Intro"), set directly on the page tint. "Analytics" and share (lock) pills sit at the right; they are visible only in `-1.jpg`. Treating them as native is inferred, since NotebookLM ships notebook analytics for shared notebooks.
- **Panel headers** (observed): plain medium-weight labels. "Sources" has a collapse-panel icon. "Chat" has a *tune* icon (which opens chat configuration). "Studio" is a plain label. A "Refresh" pill appears only in the screenshots with the extension active (`-1/-2.jpg`), not in the default view (`-0.jpg`), so it is probably the extension's addition (inferred).
- **Column proportions:** roughly Sources 25–30%, Chat 45–55% and Studio 20–25% of the window, all collapsible (inferred from screenshot proportions; collapse icon observed).
- **Max message width:** the chat text fills the Chat card width minus about 24px of side padding. There is no separate centered column inside the card. Observed for the layout; the pixel values are inferred.
- **Separation:** cards have **no visible border and no strong shadow**; the tint difference between page and card does the work. The composer and chips use 1px borders, and the citation popover uses a shadow (observed).
- **Card radius:** about 16px (inferred). **Gutters:** about 12–16px (inferred).
- **Studio (2025):** a grid of tiles for Audio Overview, Video Overview, Mind Map and Reports, with multiple outputs allowed per type (observed (excerpt), [9to5google 2025-08-06](https://9to5google.com/2025/08/06/notebooklm-studio-redesign/)). Tiles have pastel tinted fills: lavender for Audio and pink for Mind Map, which samples at about `#F0E6EE` (observed, `b-nlm-sourceplus-1.jpg`; hex from a JPEG sample, so ±3).
- **Studio artifact types in 2026** (observed in the RPC builders, [roomi-fields studio-rpc.ts](https://github.com/roomi-fields/notebooklm-mcp/blob/main/src/rpc/studio-rpc.ts) and [i18n/en.json](https://github.com/roomi-fields/notebooklm-mcp/blob/main/src/i18n/en.json)):
  - audio overview
  - video, with styles "Classroom / Documentary / Animated / Corporate / Cinematic / Minimalist"
  - report, for example *Briefing Doc*, described as "Overview of your sources, with key facts and citations"
  - infographic
  - presentation / slides
  - data table
  - **flashcards**
  - **quiz**

### 1.2 Sources panel (checkboxes, "Select all sources", source guide)

- **Top actions** (observed, `b-nlm-sourceplus-0.jpg`): two outlined full-pill buttons side by side, "**+ Add**" and "**Discover**".
- **List** (observed):
  - The first row reads "**Select all sources**" with a checkbox **right-aligned**.
  - Each source row has a file-type glyph (a red "PDF" icon), the filename in about 13–14px regular, and a checkbox at the far right.
  - Checked boxes are grey filled (about `#909497` in this build; JPEG sample).
  - DOM: rows are `.single-source-container`, and the count is `.cover-subtitle-source-count` (observed, selectors.ts).
- **Scope behavior.** The help copy reads (observed, verbatim from the help-center copy in [gist dazzaji](https://gist.github.com/dazzaji/5abdc3e7befabdee508ed0b298bfe3d3)):
  > "check the box for the sources you'd like to use for your next query. The prompt bar keeps count of how many sources are being used for responses."

  The composer count reads "20 sources" and changes to "**18 sources**" after two are unchecked (observed, `b-nlm-sourceplus-2.jpg`).
- **Source guide.** "Source guides, including summaries and key topics, now appear at the top of each source in the source sidebar" (observed, gist changelog). Opening a source shows an auto summary at the top of the source viewer (observed (excerpt), [makeuseof / supademo summaries](https://supademo.com/blog/guides/how-to-search-within-sources-in-notebooklm/)).

### 1.3 Empty state / first run (the notebook overview)

Observed in `b-nlm-sourceplus-0.jpg`. The chat panel's "empty" state is **not blank**. From top to bottom:

1. A large auto-chosen emoji icon (a blue snowflake).
2. The **notebook title** at about 28–32px regular weight (size inferred).
3. "**20 sources**" in small grey text.
4. A **generated summary paragraph** of about 14px with a line-height of about 1.6. Key phrases are **bolded**, for example "**ten influential technologies**", "**database systems**", "**web servers**".
5. An action row: "📌 **Save to note**" as an outlined pill with a pin icon, plus a copy icon.
6. A row of three outlined pill buttons: "**Add note**", "**Audio Overview**", "**Mind Map**".
7. The composer, with **suggested questions** inside it.

Help history: "When you open a notebook with sources loaded, the app instantly generates a Notebook Guide that summarizes all source documents automatically" (observed, gist).

### 1.4 Message styling

- **User message** (observed, `b-nlm-sourceplus-1/2.jpg`): **right-aligned bubble** with a lavender-grey fill. It samples at `#ECEFF8`, the same tone family as the page background. Radius about 16–20px, padding about 12×16px, text about 14px. The fill is observed; the dimensions are inferred.
- **Assistant message** (observed):
  - **No bubble and no avatar**, left-aligned, full chat-card width.
  - Markdown with bolded key terms; top-level bullets "•" and nested hollow "◦".
  - Generous spacing: list items are about 1.4× the line pitch apart (inferred).
  - DOM: `.to-user-container .message-text-content`, with paragraphs as `.paragraph` (observed, selectors.ts).
- **Spacing between turns:** about 32–48px (inferred).
- **Action row under each answer** (observed, `b-nlm-crop-notfound-actions.png`): at the left, a "**📌 Save to note**" outlined pill. At the right, three outline grey icons: **copy**, **thumbs up**, **thumbs down**. There is no regenerate button. A thumbs down can be reported as "Offensive/unsafe" (observed, gist).
- **Loading state.** Rotating phrases appear in the answer slot. The automation code lists them (lowercased) as: "getting the context", "getting the gist", "looking for clues", "reading full chapters", "examining the specifics", "checking the scope", "opening your notes", "analyzing your files", "searching your docs", "scanning sources", "reviewing content", "parsing the data", "gathering the facts", "thinking" (observed, [notebooklm-mcp chat.ts PLACEHOLDER_SNIPPETS](https://github.com/PleasePrompto/notebooklm-mcp/blob/main/src/notebooklm/chat.ts)). The on-screen casing is inferred.

### 1.5 Citation design (the core reference)

- **Inline marker** (observed, `b-nlm-crop-citation-hover.png`):
  - A **small grey filled chip containing the number**, placed after the claim, after a space, and **before** the sentence's period: "…created by **Salvatore Sanfilippo in 2009** ⓵."
  - Fill samples at about `#E9E8ED`. The number is mid-grey (about `#5F6368`, inferred), with **no border**. It is circular to slightly pill-shaped for one digit.
  - Size: measured in the crop, the chip is 35px tall × 40px wide while the body cap height is 18px. That makes the chip about **1.35× the body font size**, so **about 18–20px tall at a 14px body** (inferred from pixel ratio).
- **Implementation** (observed, [roomi citation-extractor.ts](https://github.com/roomi-fields/notebooklm-mcp/blob/main/src/utils/citation-extractor.ts) and selectors.ts):
  - `button.citation-marker` (also `button.xap-inline-dialog.citation-marker`).
  - `textContent` is the number.
  - A child `span[aria-label="N: Source Name.pdf"]` gives screen readers the source name.
- **Collapsed citations.** When there are many, the overflow collapses into an **ellipsis chip**. It renders as a Material Symbols `more_horiz` button and expands in place to reveal the hidden numbers. Numbering is gapless (1…N) per answer after expansion. Observed in selector-contract.js checks C3/C4, and visible as a "(…)" chip next to "(1)" in `b-nlm-crop-notfound-actions.png`.
- **Hover card** (observed, `b-nlm-crop-citation-hover.png`):
  - A white popover with a soft drop shadow, radius about 8px (inferred), anchored beside the answer and roughly 1/3 of the chat width.
  - Contents, top to bottom:
    1. a **heading line** naming the passage's section, in medium weight: "A Short History of Redis"
    2. the **full quoted passage** at about 0.9× the chat text size, with a generous line-height of about 1.7 (inferred from pixel pitch)
    3. a hairline divider
    4. a footer with the **source filename**: "03_Redis_History.pdf"
  - Help copy: "You can hover over a citation to see the complete text quoted." (observed, gist)
- **Click behavior.** Help copy: "click on any one citation to have the source viewer auto-scroll to the location of the quoted text in the sources" (observed, gist).
  - The source opens in the panel with the cited spans wrapped in **`.highlighted`** inside `.paragraph` elements.
  - **Escape** dismisses it.
  - Observed in citation-extractor.ts, which clicks the chip, waits for `.highlighted`, then presses Escape.
- **History** (observed, gist changelog):
  - "Answers in the chat will now have the citations added inline (instead of in a tray at the bottom)".
  - "Citations can map to text or images".
  - "When chat responses are saved as notes, it retains the original citations."

### 1.6 Composer

Observed in `b-nlm-crop-composer.png`.

- **Container:** one white rounded rectangle with radius about 16–20px (inferred) and a 1px light grey border (about `#C4C7C5`, inferred). It sits about 16px above the panel's bottom edge.
- **Placeholder (verbatim):** "**Start typing...**"
- **Inside right:** the scope count "**20 sources**" in about 12px grey text, then a **circular send button** about 36–40px across. The button is a periwinkle fill (`#9DACFE` sampled; probably the disabled/empty state) with a white paper-plane/arrow glyph.
- **DOM:** `textarea.query-box-input`, and the submit button is `button.submit-button` with aria-label "Send" (observed, selectors.ts).
- **Suggested questions inside the composer:** below the input line sits a horizontally scrolling row of chips with a "›" scroll button at the right edge. Chips are rounded-rect pills (radius about 8–12px), 1px border, about 13–14px text.
- **Disclaimer (verbatim, observed):** centered below the composer on the page tint, in about 11–12px grey text: "**NotebookLM can be inaccurate; please double check its responses.**"

### 1.7 Suggested questions / starter prompts

- **Behavior:** "NotebookLM now automatically suggests followup questions for you, based on your recent conversation history and the content of your sources." (observed, gist)
- **Observed examples (verbatim):**
  - "How did Apache HTTP Server begin?"
  - "When was Apache Spark created?"
  - "Who created Apache Airflow?"
  - "What are the foundational principles and historical evolution of these data engineering tools?"
  - "When was Apache Spark founded?"
  - "Who founded Snowflake?"
  - "What is a Docker comma[nd]…"
- **Form:** short, specific, factual questions, mostly under 45 characters, always phrased as questions, with no emoji (observed).

### 1.8 Refusal and out-of-scope patterns

- **Answer not in the sources** (observed, verbatim, `b-nlm-crop-notfound-actions.png`):
  > "Based on the sources provided, there is **no information about Redis**. The sources discuss the history and getting started guides for technologies such as SQL, Apache HTTP Server, Apache Kafka, Apache Spark, PostgreSQL, Docker, Kubernetes, Apache Airflow, and Snowflake ⓵ (…)."

  The pattern: state the gap in **bold**, then say what the sources *do* cover, and **cite that** too.
- **Older canned refusal** (observed, gist): "NotebookLM can't answer this question. Try rephrasing it, or ask a different question."
- **Grounding statement** (observed, gist): "chat responses only use data from your sources, unless you explicitly ask the model to do something more creative".

### 1.9 Learn/Study features (2025–26)

- **2025-09-08 student update:** **Flashcards**, **Quizzes**, redesigned Reports, and a "**Learning Guide**" conversational style (observed (excerpt), [9to5google 2025-09-08](https://9to5google.com/2025/09/08/notebooklm-flashcards-quizzes/) and [blog.google student features](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-student-features/)).
- **Learning Guide copy:** it "encourages participation with probing, open-ended questions … instead of just giving answers, it helps you break down problems step-by-step and adapts explanations to your needs" (observed (excerpt), same sources and [xda Learning Guide](https://www.xda-developers.com/notebooklm-learning-guide-feature/)).
- **Configure chat** opens from the tune icon in the Chat header (icon observed). Its options (observed (excerpt), [blog.google custom personas](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-custom-personas-engine-upgrade/) and [BC CDIL](https://cdil.bc.edu/resources/google-ai/adding-custom-instructions-in-notebooklm/)):
  - Conversational style: **Default / Learning Guide / Custom**, where custom instructions can run up to 10,000 characters.
  - Response length: **Shorter / Default / Longer**.
- **Caution:** XDA reported that "This NotebookLM feature can make the chatbot lie about its sources" (personas) (observed (excerpt), [xda](https://www.xda-developers.com/notebooklm-personas-can-lie-about-sources/)). The lesson: a persona or style must never override grounding.

### 1.10 Typography, color, radii

- **Font:** Google Sans / Google Sans Text (inferred from glyph shapes in the screenshots and Google product convention). **Google Sans, Google Sans Flex and Google Sans Code are all served by the public Google Fonts CSS API today.** Observed: `fonts.googleapis.com/css2?family=Google+Sans` returned `@font-face { font-family: 'Google Sans' … }`, and likewise for Flex and Code.
- **Colors** (JPEG samples, so ±3; observed as samples, the token names are inferred):

  | Element | Hex |
  |---|---|
  | Page / app bar | `#ECEFF8` |
  | Panel | `#FFFFFF` |
  | User bubble | about `#ECEFF8` |
  | Citation chip | `#E9E8ED` |
  | Send button (empty state) | `#9DACFE` |
  | Pink Studio tile | `#F0E6EE` |
  | Checkbox (checked, grey) | `#909497` |

- **Radii** (inferred): panels about 16px, composer about 16–20px, pills full radius, hover card about 8px, user bubble about 16–20px.

---

## 2. Perplexity

Primary pages were blocked, so this section relies on excerpts plus restyled 2025 screenshots.

- **Brand:** Offblack `#091717`, Paper White `#FBFAF4`, **True Turquoise `#20808D`** accent. Type is **FK Grotesk / FK Grotesk Neue**, with FK Display (observed (excerpt), [mobbin brand colors](https://mobbin.com/colors/brand/perplexity-ai-inc) and [oh-my-design](https://oh-my-design.kr/design-systems/perplexity)).
- **Turn structure** (observed, `b-pplx-complexity-thread-dark.png`; colors there come from a third-party theme):
  - The **user's query is shown as a large heading** of about 26–28px at the top of each turn ("make a meme diagram"), **not as a bubble**.
  - Below it comes an "**Answer**" label with the Perplexity mark, then answer prose at about 15–16px with headings, numbered lists and a horizontal divider between turns.
  - The answer column is about 600–680px wide (inferred).
- **Composer** (observed, `b-pplx-complexity-composer-dark.png` and `…thread-dark.png`):
  - A large rounded card (radius about 16px).
  - Placeholders: home "**Ask anything…**"; in a thread, "**Ask follow-up**".
  - Model chip at the bottom left; attach, mic and a filled accent voice/send square button at the right.
  - The composer is sticky at the bottom of the thread column (observed).
- **Tabs above the answer:** **Answer / Links / Images**, with more answer tabs since March 2025 (images, video, travel, shopping). Tabs let users "switch modality without re-querying" (observed (excerpt), [aiuxplayground Perplexity output](https://aiuxplayground.com/teardowns/perplexity/output/) and [Perplexity on X](https://x.com/perplexity_ai/status/1904566323201687848)).
- **Sources row:** "a sources row with a favicon stack plus '10 sources' beside share, copy, and rewrite actions … in the action bar, same elevation as copy and share". Historically, "Each answer opens with a row of source cards, and inline numbered markers point back to them." (Observed (excerpt), [aiuxplayground Perplexity citations](https://aiuxplayground.com/teardowns/perplexity/citations/).)
- **Inline citations in the current form:** **publisher-first domain chips**. "Rounded chips like `northjersey +3` and `foxsports +2` sit at the end of claims, showing publisher domain first … the +N communicates multiple sources for one claim." (Observed (excerpt), same source.)
- **Hover / click card:** "a popover appears showing the source detail in place with favicon, domain, headline, and excerpt before opening a new tab". Stacked sources can be browsed "using 1/2 source navigation without the full sidebar." (Observed (excerpt), same source.)
- **Research steps:** a collapsed "**Completed 2 steps**" disclosure with plain-language step names ("Searching the web"); "Steps collapse by default so the answer stays primary" (observed (excerpt), aiuxplayground output).
- **Related:** contextual follow-up suggestions below each answer (observed (excerpt)). They appear as full-width rows under a "Related" heading, each with a "+" affordance (inferred from prior knowledge).
- **Source trust labels (2026):** some citations carry "a small shield icon" for a reviewed domain, with labels **Government / Academic / Trusted**. "Perplexity rates the whole website … partnerships, payments, and other business arrangements do not affect a site's label." (Observed (excerpt), [Perplexity help: Understanding source labels](https://www.perplexity.ai/help-center/en/articles/20260806-understanding-source-labels).)

---

## 3. ChatGPT Study Mode, Claude Learning mode, and the core chat layouts

### 3.1 ChatGPT Study Mode

- **Launch:** 2025-07-29, described as "a learning experience that helps you work through problems step by step instead of just getting an answer". Components: "Socratic questioning, hints, and self-reflection prompts"; "**Scaffolded responses**"; "**Knowledge checks** — quizzes and open-ended questions"; and personalization to skill level and memory. (Observed (excerpt), [openai.com/index/chatgpt-study-mode](https://openai.com/index/chatgpt-study-mode/).)
- **Mode UI** (observed (excerpt), [help.openai.com 11780217](https://help.openai.com/en/articles/11780217-using-study-mode-in-chatgpt) and [BGR](https://www.bgr.com/1926772/how-to-use-chatgpt-study-mode/)):
  - Turn it on via **+ → "Study and learn"**, or type "/".
  - A **"Study" token/chip appears inside the composer**. Remove it with Backspace, or with × on layouts that show one.
  - "A Study chip appears by the prompt box when the feature is enabled, together with some suggestions to start your learning."
  - It is not available in Temporary Chats, GPTs or Projects.
- **The behavior spec.** Verbatim from the leaked system prompt (observed, [gist idcesares](https://gist.github.com/idcesares/c28c7a7189726dc3d8a89b6db92c1c8d)):
  > "**Guide users, don't just give answers.** Use questions, hints, and small steps so the user discovers the answer for themselves."
  >
  > "Above all: DO NOT DO THE USER'S WORK FOR THEM. Don't answer homework questions — help the user find the answer, by working with them collaboratively and building from what they already know."
  >
  > "**Help with homework:** Don't simply give answers! Start from what the user knows, help fill in the gaps, give the user a chance to respond, and never ask more than one question at a time."
  >
  > "**Quizzes & test prep:** Run practice quizzes. (One question at a time!) Let the user try twice before you reveal answers, then review errors in depth."
  >
  > "Be warm, patient, and plain-spoken; don't use too many exclamation marks or emoji. … be brief — don't ever send essay-length responses."
  >
  > "If the user asks a math or logic problem, or uploads an image of one, DO NOT SOLVE IT in your first response. Instead: **talk through** the problem with the user, one step at a time, asking a single question at each step…"
  >
  > "If you don't know their goals or grade level, ask the user before diving in. (Keep this lightweight!)"

### 3.2 Claude Learning mode / Claude for Education

- **Launch, 2025-04-02.** Learning mode works "within Projects". Verbatim behaviors (observed, [anthropic.com/news/introducing-claude-for-education](https://www.anthropic.com/news/introducing-claude-for-education)):
  > "Guiding rather than answering: Asking "How would you approach this problem?" instead of providing immediate solutions"
  >
  > "Using Socratic questioning: Prompting with "What evidence supports your conclusion?" to deepen understanding"
  >
  > "Emphasizing core concepts: Highlighting fundamental principles behind specific problems"
  >
  > "Providing useful templates: Offering structured formats for research papers, study guides, and outlines"
- **2025-08-14 rollout.** A "**Learning**" option appeared in the Claude.ai **style dropdown** for all users. Claude Code got "Explanatory" and "Learning" output styles (observed (excerpt), [Engadget](https://www.engadget.com/ai/anthropic-brings-claudes-learning-mode-to-regular-users-and-devs-170018471.html) and [Dataconomy](https://dataconomy.com/2025/08/15/anthropic-extends-claudes-learning-mode-to-all-users/)).
  - Claude Code's Learning style "asks you to write some of the code … marked with a `TODO(human)` comment" (observed (excerpt), [Claude Code output styles docs](https://docs.anthropic.com/en/docs/claude-code/output-styles)).
  - The mode is signaled by a style chip in the composer (observed (excerpt), [claudecode.jp](https://claudecode.jp/en/news/engineer/claude-learning-style-guide)).
- **Status in October 2026.** The personalization help article now lists Instructions, Project instructions and **Skills** ("Skills … can customize how Claude communicates"), with no Styles section (observed, [support.claude.com 10185728](https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features)). That suggests learning behaviour now lives in skills/projects (inferred).
- **Positioning copy:** "Claude's learning mode works like a good tutor: it asks questions that help you find the answers yourself." (observed, [claude.com/solutions/education](https://claude.com/solutions/education))
- **Student-facing integrity note:** "Important: Follow your university's academic integrity policies when using Claude. While Claude can help you understand material and improve your work, it should not be used to complete assignments that you're expected to do independently." (observed, [support.claude.com 11139144](https://support.claude.com/en/articles/11139144-use-claude-for-education-at-your-university))
- **Privacy stance,** which is the opposite of Lectern's: "Conversations are private by default and are excluded from AI training by default … we also require formal approval for institutional data requests and have limited self-serve data exports by default." (observed, [anthropic.com/news/advancing-claude-for-education](https://www.anthropic.com/news/advancing-claude-for-education)). Lectern's "the professor can see your questions" therefore has to be stated **louder** than a general assistant would state it, because students' default expectation is privacy.
- **Lecture sources precedent:** "users can reference lecture transcripts from Panopto" through MCP (observed, same post). This supports Lectern's lecture plus timestamp source type.
- **Why guardrails matter.** Anthropic's education report found "nearly half (~47%) of student-AI conversations were Direct — that is, seeking answers or content with minimal engagement". Its four patterns (Direct or Collaborative × Problem Solving or Output Creation) each appeared in 23–29% of conversations (observed, [Anthropic Education Report](https://www.anthropic.com/news/anthropic-education-report-how-university-students-use-claude)).

### 3.3 ChatGPT core layout

- **Thread column width:** the CSS variable **`--thread-content-max-width: 40rem` (640px)**, applied in containers at least 768px wide. The composer in `#thread-bottom-container` uses the same width, so the composer and messages share one column. Observed, [alexchexes ChatGPT UI fix](https://gist.github.com/alexchexes/d2ff0b9137aa3ac9de8b0448138125ce), updated 2026-09-26 after "OpenAI rewrote the whole UI markup". Wider breakpoints step up to 48rem (inferred, prior knowledge).
- **DOM:** turns are `[data-turn]`; messages carry `[data-message-author-role="user"]`; the user bubble uses `.user-message-bubble-color`; answers render in `.prose`; there is a "Previous response" control for regenerated variants (observed, same userscript).
- **User vs assistant:** the user gets a right-aligned rounded bubble (light grey, about `#F4F4F4` in light mode, about 70% max width, radius about 18–24px). The assistant gets plain prose with **no bubble and no avatar**. (Inferred from prior knowledge; consistent with the excerpt "the prompt gets the bubble styling … while the answer gets a prose column without background styling", [pretextjs](https://pretextjs.dev/blog/pretext-for-ai-chat-interfaces).)
- **Type:** body about **16px with a 28px line-height (1.75)** (inferred, prior knowledge). The code-block font had become "unreadable at 12.5px", and the userscript forces 14px (observed, changelog 2026-05-02). The typeface is **OpenAI Sans**, which replaced Söhne in 2025 (observed (excerpt), [ain.ua](https://en.ain.ua/2025/02/05/openai-updates-the-chatgpt-logo-font/)).
- **Composer:**
  - The textarea grows to **`max-h-[25dvh]`** (observed, userscript).
  - It is a near-pill rounded card, radius about 28px (inferred).
  - Placeholder "**Ask anything**" (observed (excerpt), [aiuxplayground ChatGPT composer](https://aiuxplayground.com/teardowns/chatgpt/composer)).
  - Tools live behind **+**, and "removable chips … show scope before sending" (same source).
- **Disclaimer:** a dedicated `[data-testid="thread-disclaimer"]` element under the composer (observed). Its wording, "ChatGPT can make mistakes. Check important info.", is inferred from prior knowledge.

### 3.4 Claude core layout

- **Conversation column:** `.max-w-3xl` (48rem = 768px). Observed (excerpt): userstyles target `.max-w-3xl` to widen Claude, per [userstyles "wide claude.ai"](https://userstyles.world/style/11348/wide-claude-ai) and [motgenror/claude-css](https://github.com/motgenror/claude-css). Separate CSS variables, **`--font-claude-message`** and **`--font-user-message`**, mean assistant and user text can use different fonts (observed (excerpt), same).
- **Chat font setting:** "Select from Default, Match System, and Dyslexic Friendly." (observed, [support.claude.com 8887527](https://support.claude.com/en/articles/8887527-customizing-your-appearance-settings))
- **Brand tokens** from a third-party extraction of the marketing site (observed, [awesome-design-md claude/DESIGN.md](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/claude/DESIGN.md)):
  - Colors: canvas `#FAF9F5`, coral primary `#CC785C`, ink `#141413`, body `#3D3D3A`, muted `#6C6A64`, hairline `#E6DFD8`, surface-card `#EFE9DE`.
  - Type: display serif "Copernicus / Tiempos Headline"; body "StyreneB" at 16px/1.55.
  - Radius: 8 / 12 / 16px.
  - The app interface uses the same cream canvas and coral family (inferred).
- **Composer:** "a calm card first, with a + menu on the left for attach, search, skills … and model and effort controls on the right rail" (observed (excerpt), [aiuxplayground Claude composer](https://aiuxplayground.com/teardowns/claude/composer/)). The placeholder "How can I help you today?" is inferred from prior knowledge.
- **Disclaimer:** "Claude can make mistakes. Please double-check responses." (observed (excerpt), search excerpt of the [Claude help article on incorrect responses](https://support.anthropic.com/en/articles/8525154-claude-is-providing-incorrect-or-misleading-responses-what-s-going-on)).
- **Messages:** the user gets a warm-grey rounded bubble; the assistant gets plain text with no bubble, serif by default (inferred, prior knowledge).

---

## 4. CS50.ai and the CS50 Duck (Harvard)

The closest analogue to Lectern: a course-specific tutor, explicitly sanctioned by the course and logged.

### 4.1 How it presents itself (verbatim, observed: [cs50.readthedocs.io source, cs50.ai.md](https://github.com/cs50/cs50.readthedocs.io/blob/main/cs50.ai.md))

> "CS50.ai is an adaptation of ChatGPT for students and teachers at cs50.ai; it's also built into Visual Studio Code for CS50 at cs50.dev. Otherwise known as the CS50 Duck, CS50.ai supports rubber duck debugging and is thus a "duck debugger," or `ddb` for short, an homage to GDB."
>
> "Whereas ChatGPT itself is all too helpful nowadays—all too willing to provide outright answers to problems—CS50.ai is designed to behave more like a good tutor, leading students toward answers rather than spoiling them outright. It aspires to provide students with "office hours" 24/7, approximating a 1:1 student-to-teacher (well, student-to-duck) ratio."
>
> "Across CS50's courses, it is unreasonable (i.e., academically dishonest) to use AI-based software other than CS50's own (e.g., ChatGPT, Claude, Copilot, Gemini, et al.) that suggests or completes answers to questions or lines of code, except when explicitly allowed by a course. But it is reasonable to use CS50's own AI-based software, including the CS50 Duck in cs50.ai and cs50.dev."

- **Persona:** a cartoon yellow rubber duck with an orange bill and "CS50" on its body (observed, `b-cs50-ddb50-icon.png`). The duck name ties the tool to an existing course ritual.

### 4.2 The first message is the disclaimer, including the logging notice

Verbatim, observed in [cs50/ddb50.vsix static/ddb.js](https://github.com/cs50/ddb50.vsix/blob/ai-duck/static/ddb.js). It is injected as the duck's first message and re-injected whenever history is cleared:

> "Quack. I am CS50's duck debugger (ddb), an experimental AI for rubberducking. Quack quack. My replies might not always be accurate, so always think critically and let me know if you think that I've erred. **Conversations are logged.** Quack quack quack."

### 4.3 UI (VS Code webview, observed in source)

Sources: [style.css](https://github.com/cs50/ddb50.vsix/blob/ai-duck/static/style.css) and [extension.ts](https://github.com/cs50/ddb50.vsix/blob/ai-duck/src/extension.ts).

- **Layout:** a sidebar view titled "**CS50 Duck Debugger**". Messages fill about 90% of the height; the input takes the remaining about 10%, below a 2px resize handle.
- **Messages:** full-width blocks with 10px padding and a 1px divider (`#e0e0e0` light / `#1d1d1d` dark).
  - Each block has a **bold author line, "ddb" or "you"**, and a **3px colored left border**: duck `#E0B63F` (light) / `#FFD45A` (dark); user `#9ABCED` (light) / `#D2E3FC` (dark).
  - Duck background `rgba(247,247,247,.7)` light / `rgb(68,70,83)` dark; user `#FFFFFF` light / `rgba(52,53,64,.7)` dark.
  - Paragraph line-height 1.5.
  - The duck renders markdown with highlight.js; user text is shown verbatim (pre-wrap).
- **Waiting state:** the duck's message shows "**...**" until streaming starts, and the textarea is disabled while streaming.
- **Placeholder (verbatim):** "**Ask a question**". The textarea is borderless and transparent.
- **Title-bar commands:** "**Download Chat History**", "**Clear Messages**".
- **Rate limit as "stamina":**
  - `INITIAL_DDB_ENERGY = 10` ("1 energy point == 1 half heart"), regenerating 1 point every 3 minutes.
  - A 14px Bootstrap progress bar turns green, then amber, then red.
  - When empty, the bar becomes striped and animated with the text "**CS50 Duck is restoring stamina, please wait...**".
  - Tired replies (verbatim): "Quack. I'm a little tired right now... zzz...", "zzz... *snore*", "What a... wonderful... zzz... question...", "I will be back soon! Just taking a short nap, zzz...".
  - "Failed exchanges do not cost energy."
- **Error hints in the chat itself** (verbatim):
  - "Your message is too long for me to handle. Please try again with a shorter message (under 10,000 characters)."
  - "You are sending messages too quickly or the service is busy. Please wait a bit and try again."
  - "Please try again. If the problem persists, share this message with CS50 staff."
- **Contextual entry point:** when a terminal command fails and `help50` doesn't recognize the error, "it offers a **help50** button atop your terminal window instead, which you can click to ask the CS50 Duck to explain the error." (observed, [help50.md](https://github.com/cs50/cs50.readthedocs.io/blob/main/help50.md)). The extension also exposes "Ask for Help / Dismiss" prompts that send a pre-filled question (observed, extension.ts).

### 4.4 Papers and guardrails

- **SIGCSE 2024**, Liu, Zenke, Liu, Holmes, Thornton, Malan, "Teaching CS50 with AI", pages 750–756 (citation observed in the docs source). The tools are "Explain Highlighted Code", style50 and the **CS50 Duck** (VS Code plus a web app), also integrated into **Ed**. The duck uses the same APIs as ChatGPT but with "**pedagogical guardrails**", and "oversized prompts led to 'instruction dilution'" (observed (excerpt), [paper PDF](https://cs.harvard.edu/malan/publications/V1fp0567-liu.pdf) and [ACM DL](https://dl.acm.org/doi/10.1145/3626252.3630938)).
- **System prompt opening:** "You are a friendly and supportive teaching assistant for CS50. You are also a rubber duck. Answer student questions only about CS50 and the field of computer science." (observed (excerpt); CS50 itself quoted the opening in its [April Fools 2024 post](https://x.com/cs50/status/1775551111732076982)).
- **Hearts:** "each student starts with 10 hearts and regains one heart every three minutes", "inspired by game mechanics … encouraging independent problem-solving". This matches the source above. (Observed (excerpt), [quovixi review](https://vicky.pika.page/posts/a-review-of-cs50ai) and the paper.)
- **SIGCSE TS 2025**, "Improving AI in CS50: Leveraging Human Feedback". It analyzed about 10M messages, found that about 22% of responses contained code blocks, and describes a TF feedback interface for reviewing duck answers (observed (excerpt), [paper PDF](https://cs.harvard.edu/malan/publications/fp0627-liu.pdf)). Reach: about 211,000 students and 10M queries by mid-November 2024; 94% of surveyed students found the tools helpful (observed (excerpt)).

---

## 5. Other learning tutors (brief)

- **Gemini Guided Learning** (2025-08-06, powered by **LearnLM**). It "breaks down the problem into smaller steps, asks students questions along the way, checks for understanding, and gradually builds toward the final answer", using diagrams, images, YouTube clips and interactive quizzes (observed (excerpt), [TechCrunch](https://techcrunch.com/2025/08/06/google-takes-on-chatgpts-study-mode-with-new-guided-learning-tool-in-gemini/)). LearnLM's published principles are inspire active learning, manage cognitive load, adapt to the learner, stimulate curiosity, and deepen metacognition (inferred, prior knowledge of the LearnLM tech report). The Gemini app disclaimer reads "Gemini can make mistakes, including about people, so double-check it. Your privacy & Gemini" (observed: visible in the Gemini app screenshot at `gh/ramitdour_notebooklm-source-plus/images/NotebookLM-images-3.jpg`, [repo](https://github.com/ramitdour/notebooklm-source-plus)).
- **Khanmigo (Khan Academy).** Observed (excerpt), [Khan support: chat history](https://support.khanacademy.org/hc/en-us/articles/15127248640525-How-do-I-view-my-students-Khanmigo-chat-history) and [moderation alerts](https://support.khanacademy.org/hc/en-us/articles/21943797567629-How-are-administrators-alerted-to-moderated-Khanmigo-chats):
  - Teachers see a "**Chat history**" tab per student.
  - "Any interactions that were flagged by the moderation system will have a **red disclaimer** under them", and teachers get an email.
  - "every child sees that their chat history may be visible to adults and school personnel".
  - A "makes mistakes" warning sits at the top of each page.
  - Refusal-redirect example: "**I want to help you figure this out yourself. Let's start with what you already know.**" (observed (excerpt), [kidsaitools review](https://www.kidsaitools.com/en/articles/khanmigo-review-parents-complete-2026)).
  - A cautionary result: "[Students didn't get answers from Khanmigo. They didn't want its questions, either](https://hechingerreport.org/proof-points-khanmigo-math-ai-tutor/)" (headline, observed (excerpt)). Relentless Socratic questioning drives disengagement.
- **Oak National Academy "Aila".** A teacher-facing lesson planner; its open-source frontend was read (observed, [oak-ai-lesson-assistant](https://github.com/oaknational/oak-ai-lesson-assistant)).
  - Message roles `user | aila | moderation | error`: user bubble `bg-teachersLilac` = `#C6D1EF`, `p-9`; Aila has **no background**; moderation `#FFF7CC` with a `#FBD60E` border; error `#FFECE0`; all `rounded-md` ([layout.tsx](https://github.com/oaknational/oak-ai-lesson-assistant/blob/main/apps/nextjs/src/components/AppComponents/Chat/chat-message/layout.tsx), [tailwind.config.cjs](https://github.com/oaknational/oak-ai-lesson-assistant/blob/main/apps/nextjs/tailwind.config.cjs)).
  - Disclaimer: "**AI can make mistakes. Review content before use.** Read our privacy policy and terms and conditions."
  - Quick actions "Retry / Report / Stop" in `#575757`.
  - Starter placeholder: "Type a subject, key stage and title"; example card "History • Key stage 2 • The end of Roman Britain".
  - Blocking moderation copy: "Aila is designed to create classroom-appropriate content. This lesson has been identified as potentially unsuitable…" and "Aila is not able to plan lessons on this topic."
  - A "Content guidance" banner with a "View content guidance" link.
- **Quizlet (Q-Chat), Brainly, StudyFetch (Spark.E), Knowt (Kai).** **Not verified this session**, because the search budget ran out before these could be checked. From prior knowledge (inferred): Quizlet retired its Q-Chat tutor in 2025. StudyFetch's "Spark.E" and Knowt's "Kai" are chat-with-your-uploaded-notes tutors that sit next to flashcard and quiz generators. None is a stronger design reference than NotebookLM or CS50 for Lectern's specific problems.

---

## 6. Cross-product comparison

| | NotebookLM | Perplexity | ChatGPT (Study) | Claude (Learning) | CS50 Duck |
|---|---|---|---|---|---|
| Where sources live | Left panel with checkboxes, plus a source viewer that opens on citation click (observed) | Sources row / Links tab plus popovers (observed (excerpt)) | n/a (web chips when searching) | Project knowledge | Course docs behind the system prompt; none shown |
| Inline citation | Grey numbered chip about 1.35em, before the period; "…" chip collapses overflow (observed) | Domain chip "site +N" (observed (excerpt)) | Publisher chip with 1/N popover (observed (excerpt)) | — | none |
| Hover | Card: passage heading, full quote, divider, filename (observed) | Favicon, domain, headline, excerpt; 1/N paging (observed (excerpt)) | Popover 1/N | — | — |
| Click | Opens source, scrolls to and highlights the passage; Esc closes (observed) | Opens the page | Sources sidebar | — | — |
| User message | Right bubble `#ECEFF8` (observed) | Large heading, no bubble (observed) | Right grey bubble (inferred) | Warm bubble (inferred) | Full-width block, blue left border (observed) |
| Assistant message | Plain, no avatar (observed) | Plain under an "Answer" label (observed) | Plain, no avatar (inferred) | Plain, serif (inferred) | Block, yellow left border, "ddb" label (observed) |
| Composer placeholder | "Start typing..." (observed) | "Ask anything…" / "Ask follow-up" (observed) | "Ask anything" (observed (excerpt)) | "How can I help you today?" (inferred) | "Ask a question" (observed) |
| Mode signal | Configure-chat "Learning Guide" behind the tune icon (observed (excerpt)) | — | "Study" chip in the composer (observed (excerpt)) | "Learning" style chip (observed (excerpt)) | The whole product is the mode |
| Trust / logging copy | "NotebookLM can be inaccurate; please double check its responses." (observed) | Shield labels (observed (excerpt)) | thread-disclaimer (observed element) | "Claude can make mistakes…" (observed (excerpt)) | "**Conversations are logged.**" as the first message (observed) |

---

## 7. Patterns Lectern's student tutor should adopt

Each decision names the reference it comes from. Hex values are starting points, so restyle them to Lectern's palette, but keep the relationships.

1. **Two-pane shell: chat plus a source panel that opens on demand.** Chat is the center column. A right-side **Source panel** (about 420–480px) slides open when a citation is clicked and closes on Esc. Course materials (a source list) sit in a collapsible left rail. This mirrors NotebookLM's Sources/Chat panes with a source viewer that opens and highlights on citation click (observed: [selectors.ts](https://github.com/PleasePrompto/notebooklm-mcp/blob/main/src/notebooklm/selectors.ts), [citation-extractor.ts](https://github.com/roomi-fields/notebooklm-mcp/blob/main/src/utils/citation-extractor.ts)). For an MVP, leave out Studio.

2. **Message column max 720px, shared with the composer.** Messages and composer sit in one centered column of 40–48rem (640–768px). This follows ChatGPT's `--thread-content-max-width: 40rem`, shared by the thread and `#thread-bottom-container` (observed, [alexchexes gist](https://gist.github.com/alexchexes/d2ff0b9137aa3ac9de8b0448138125ce)), and Claude's `.max-w-3xl` = 48rem (observed (excerpt), [motgenror/claude-css](https://github.com/motgenror/claude-css)).

3. **Tinted canvas, white surfaces, no panel borders.** Use a cool tinted page background (about `#ECEFF8`) behind white cards with a 16px radius. Separate them by tint, not borders or shadows; reserve shadows for popovers. Reference: NotebookLM page `#ECEFF8` and panels `#FFFFFF` (observed samples, `b-nlm-sourceplus-0.jpg`).

4. **User bubble right, tutor plain prose left, no avatars.**
   - User: right-aligned, tinted fill from the canvas family (about `#ECEFF8`), radius 18px, max width 75%, padding 10×16px.
   - Tutor: no background and no avatar, full column width.
   - References: NotebookLM user bubble and plain answer (observed, `b-nlm-sourceplus-1.jpg`); Aila user `#C6D1EF` with Aila unstyled (observed, [layout.tsx](https://github.com/oaknational/oak-ai-lesson-assistant/blob/main/apps/nextjs/src/components/AppComponents/Chat/chat-message/layout.tsx)); ChatGPT `.user-message-bubble-color` and prose answers (observed userscript).

5. **Typography: 16px body, 1.65 line-height, Google Sans Text/Flex or Inter.** Load **Google Sans Flex** from the Google Fonts CSS API, which is now publicly served (observed: the fonts.googleapis.com response). Use 16px/26px for tutor text, 15px for the user bubble, 14px for chips and cards, 12px for disclaimers. References: NotebookLM's Google Sans look (inferred) and ChatGPT's 16/28 (inferred). Keep code at 14px, never 12.5px (observed: alexchexes changelog complaint).

6. **Inline citations: numbered grey chips before the period.**
   - An 18px-tall circular/pill chip with fill `#E9E8ED`, a 12px medium number in `#5F6368`, and no border.
   - Place it after a space and before the sentence's period ("…the gradient points uphill ⓵.").
   - Make it a `<button>` with `aria-label="1: Lecture 9 · 14:32"`.
   - Reference: NotebookLM `button.citation-marker` with `span[aria-label="N: Source Name"]`, chip about 1.35em (observed, `b-nlm-crop-citation-hover.png`, [citation-extractor.ts](https://github.com/roomi-fields/notebooklm-mcp/blob/main/src/utils/citation-extractor.ts)).

7. **Give each answer a labelled sources row under the citation numbers.** Under each tutor answer, a compact row lists each cited source with **Lectern's human labels**: `① Lecture 9 · 14:32`, `② Slides 6, slide 12`, `③ Prof. Lee on Ed, #412`. Each item has a type glyph (play icon, slides icon, Ed icon). This combines NotebookLM's numbers (minimal in-line noise) with Perplexity's publisher-first labels and sources row, "favicon stack plus '10 sources' … same elevation as copy and share" (observed (excerpt), [aiuxplayground Perplexity citations](https://aiuxplayground.com/teardowns/perplexity/citations/)).

8. **Collapse citation overflow.** When a sentence has more than 3 citations, show the first and then a "…" chip that expands in place, keeping numbering gapless. Reference: NotebookLM's `more_horiz` collapsed-citation button and gapless numbering check (observed, [selector-contract.js](https://github.com/nicremo/notebookLM-citation/blob/main/test/selector-contract.js)).

9. **Hover card: label, quote, open action.**
   - On hover or focus, show a white card about 360px wide, radius 8px, with a shadow.
   - Header line: source label plus section, e.g. "**Lecture 9 · 14:32** — Gradient descent intuition".
   - Body: the exact transcript or slide passage at 14px/1.7.
   - Footer, after a hairline divider: source name, an **"Approved by Prof. X" shield**, and a "Play at 14:32 ▸" / "Open slide 12" action.
   - If a claim has several sources, page through them with "1/3" arrows.
   - References: NotebookLM hover card with heading, quote, divider and filename (observed, `b-nlm-crop-citation-hover.png`); Perplexity 1/N paging and shield labels (observed (excerpt), [Perplexity source labels](https://www.perplexity.ai/help-center/en/articles/20260806-understanding-source-labels)).

10. **Click opens the source at the exact spot, with the passage highlighted.**
    - Lecture: the source panel opens the transcript scrolled to 14:32 with the cited sentences highlighted (light amber `#FFF3C4`, inferred), plus a player cued to that timestamp.
    - Slides: the slide is shown with its text highlighted.
    - Esc closes the panel and returns focus to the chip.
    - Reference: NotebookLM's click behaviour, which auto-scrolls the source viewer to the location of the quoted text (`.highlighted` spans, Esc dismisses) (observed, [gist](https://gist.github.com/dazzaji/5abdc3e7befabdee508ed0b298bfe3d3), [citation-extractor.ts](https://github.com/roomi-fields/notebooklm-mcp/blob/main/src/utils/citation-extractor.ts)).

11. **Visible scope count with a source checklist.** The composer shows "**All course materials · 52**" right-aligned inside it. Clicking it opens a checklist grouped by type (Lectures, Slides, Syllabus, Past exams, Ed answers) with a top "**Select all sources**" row and right-aligned checkboxes. When the scope is narrowed, the count updates ("Lectures 8–10 · 3"). Reference: NotebookLM's "20 sources" in the prompt bar, which becomes 18 when two are unchecked, plus the "Select all sources" row (observed, `b-nlm-sourceplus-0/2.jpg`).

12. **The empty state is a course overview, not a blank greeting.**
    - A course glyph, the course title at 28px, and the line "Built from 24 lectures, 18 slide decks, syllabus, 6 past exams, 312 instructor answers on Ed · **approved by Prof. Lee**".
    - A two- to three-sentence generated overview of the course so far, with key topics bolded.
    - Starter chips below.
    - Reference: NotebookLM's notebook overview (emoji, title, "20 sources", bolded summary, action pills) (observed, `b-nlm-sourceplus-0.jpg`).

13. **Suggested questions live in the composer and refresh every turn.** Put a horizontally scrolling row of 2–4 pill chips inside the composer under the input, with a "›" overflow button. Keep each under about 50 characters, phrase them as questions, make them specific to the course, and regenerate them from the latest exchange (e.g. "Where did Lecture 9 derive the update rule?", "What's the intuition behind learning rate?"). Reference: NotebookLM's in-composer suggested questions, "based on your recent conversation history and the content of your sources" (observed, `b-nlm-crop-composer.png`, gist).

14. **Composer spec.**
    - One white card, radius 20px, 1px `#D9DCE3` border, auto-grow to at most 25dvh.
    - Placeholder: "**Ask about a lecture, a concept, or where you're stuck…**".
    - Inside right: the scope chip, then a 36px circular send button (accent fill; muted when empty).
    - Enter sends; Shift+Enter adds a new line.
    - References: NotebookLM's composer card with count and circular send (observed); ChatGPT's `max-h-[25dvh]` (observed userscript); the CS50 "Ask a question" placeholder (observed).

15. **A persistent mode chip the student cannot remove.** Show a "**Tutor mode · hints, not solutions**" chip at the left inside the composer, with an info popover that explains the policy in one sentence. It is not removable, because the professor set it. This follows ChatGPT's "Study" token in the composer (observed (excerpt), [help.openai.com](https://help.openai.com/en/articles/11780217-using-study-mode-in-chatgpt)) and Claude's "Learning" style chip (observed (excerpt), [Engadget](https://www.engadget.com/ai/anthropic-brings-claudes-learning-mode-to-regular-users-and-devs-170018471.html)). The difference: Lectern's chip is locked, as CS50's duck is a tutor by construction.

16. **The first tutor message carries the trust and logging notice, every session.** Open each new chat with a short message from the tutor:
    > "Hi — I'm the CS 101 tutor. I answer only from materials **Prof. Lee approved** (lectures, slides, syllabus, past exams, Ed answers) and show where every claim comes from. I'll help you get unstuck on problem sets, but I won't write solutions. **Prof. Lee and the course staff can read these conversations.** I can be wrong, so check the cited source."

    Re-insert it after "Clear chat". This is CS50's pattern of injecting the disclaimer, "…My replies might not always be accurate… **Conversations are logged.**", as the duck's first message and re-adding it on reset (observed, [ddb.js](https://github.com/cs50/ddb50.vsix/blob/ai-duck/static/ddb.js)). Claude for Education's private-by-default stance (observed, [anthropic.com](https://www.anthropic.com/news/advancing-claude-for-education)) is why this notice must be explicit.

17. **A permanent footer line under the composer.** Centered, 12px, grey: "**Answers use only Prof. Lee's approved materials · Course staff can see your questions · Tutor can be wrong — check the source.**" This follows NotebookLM's "NotebookLM can be inaccurate; please double check its responses." (observed), Khanmigo's "chat history may be visible to adults and school personnel" (observed (excerpt), [Khan support](https://support.khanacademy.org/hc/en-us/articles/15127248640525-How-do-I-view-my-students-Khanmigo-chat-history)), and Aila's "AI can make mistakes. Review content before use." (observed).

18. **An approval header in the top bar.** Course name, then "**Sources approved by Prof. Lee · updated Oct 2**", linking to the source list. Pair it with the shield on every hover card (decision 9). This follows Perplexity's shield source labels, "Government / Academic / Trusted" (observed (excerpt), [Perplexity help](https://www.perplexity.ai/help-center/en/articles/20260806-understanding-source-labels)), and NotebookLM's source count in the cover subtitle (observed).

19. **Problem-set refusal: brief policy line, then real help, then one question.** Write it as normal tutor prose, not as an error. Structure:
    1. A one-line acknowledgement plus the policy.
    2. The relevant concept, with citations.
    3. A pointer to the lecture timestamp.
    4. **A single guiding question.**

    Example copy:
    > "This looks like **Problem Set 3, Q2**, so I won't write the solution, but let's get you unstuck. The key idea is the chain rule applied layer by layer ⓵, which Prof. Lee walks through at **Lecture 9 · 14:32** ⓶. **Which layer's gradient do you already know how to compute?**"

    Sources for the pattern:
    - ChatGPT Study prompt: "DO NOT SOLVE IT in your first response … asking a single question at each step"; "never ask more than one question at a time" (observed, [gist](https://gist.github.com/idcesares/c28c7a7189726dc3d8a89b6db92c1c8d)).
    - Claude Learning: "How would you approach this problem?" (observed, [anthropic.com](https://www.anthropic.com/news/introducing-claude-for-education)).
    - Khanmigo: "I want to help you figure this out yourself. Let's start with what you already know." (observed (excerpt)).
    - CS50: "leading students toward answers rather than spoiling them outright" (observed).

20. **Explain before you question, and keep it short.** Every hint turn includes at least one concrete, cited piece of explanation before the question. Responses stay under about 150 words, with few exclamation marks and no emoji. The ChatGPT Study prompt says "be brief — don't ever send essay-length responses … don't use too many exclamation marks or emoji" (observed). The Hechinger finding that students "didn't want its questions, either" (observed (excerpt), [Hechinger](https://hechingerreport.org/proof-points-khanmigo-math-ai-tutor/)) warns against pure Socratic ping-pong.

21. **Out-of-sources answers name the gap and route to Ed.**
    > "The course materials don't cover **X**. They cover Y and Z ⓵ ⓶. Want to ask the course staff on Ed?"

    Add a one-click "Ask on Ed" button that pre-fills the question. This follows NotebookLM's "Based on the sources provided, there is **no information about Redis**. The sources discuss… ⓵" (observed, `b-nlm-crop-notfound-actions.png`).

22. **Policy callouts get their own subtle style; tutoring stays plain.** When the tutor detects an assignment request, a slim amber callout tops the answer: fill `#FFF7CC`, 1px `#FBD60E` border, radius 8px, text such as "Problem set detected: hints only". The tutoring prose follows unstyled. Reference: Aila's distinct `moderation` role styling (`#FFF7CC` with a `#FBD60E` border) next to an unstyled assistant (observed, [layout.tsx](https://github.com/oaknational/oak-ai-lesson-assistant/blob/main/apps/nextjs/src/components/AppComponents/Chat/chat-message/layout.tsx)), and Khanmigo's red disclaimer on flagged turns (observed (excerpt)). Never use red for a normal refusal.

23. **Action row under each answer.** At the left, a "**Save to notes**" outlined pill. At the right, grey outline icons for copy, 👍 and 👎; 👎 asks why (wrong source / too revealing / unhelpful) and goes to course staff. Reference: NotebookLM's "Save to note" pill plus copy and thumbs (observed, `b-nlm-crop-notfound-actions.png`). Feedback to staff mirrors CS50's TF feedback loop (observed (excerpt), [Improving AI in CS50](https://cs.harvard.edu/malan/publications/fp0627-liu.pdf)). Skip regenerate, as NotebookLM does, because regenerating fishes for an answer.

24. **Loading states that show grounding work.** While waiting, rotate source-aware phrases in the answer slot: "Searching lecture transcripts…", "Checking Slides 6…", "Reading Prof. Lee's Ed answers…". Afterwards, keep a collapsed "**Searched 3 lectures, 2 slide decks**" disclosure. References: NotebookLM's rotating loading phrases ("Getting the gist", "Scanning sources") (observed, [chat.ts](https://github.com/PleasePrompto/notebooklm-mcp/blob/main/src/notebooklm/chat.ts)) and Perplexity's collapsed "Completed 2 steps … Searching the web" (observed (excerpt), [aiuxplayground Perplexity output](https://aiuxplayground.com/teardowns/perplexity/output/)).

25. **Ask-about-this entry points from course material.** In the lecture player and slide viewer, an "**Ask the tutor about this**" button pre-fills "In Lecture 9 at 14:32, …" and scopes the chat to that source. This follows CS50's help50 button, which asks the Duck to explain the error, and "Explain Highlighted Code" (observed, [help50.md](https://github.com/cs50/cs50.readthedocs.io/blob/main/help50.md); observed (excerpt), SIGCSE 2024).

26. **No student-editable persona; response length is the only knob.** Don't expose custom personas. At most, offer a "Shorter / Default / Longer" response-length control in a settings popover. Reference: NotebookLM's Configure chat (Default / Learning Guide / Custom; Shorter / Default / Longer) (observed (excerpt), [blog.google](https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-custom-personas-engine-upgrade/)), and XDA's finding that personas "can make the chatbot lie about its sources" (observed (excerpt), [xda](https://www.xda-developers.com/notebooklm-personas-can-lie-about-sources/)).

27. **Transparency controls for a logged product.** Give students "**Download my chat history**" and "**Clear chat**" in the chat header overflow menu, and say clearly that clearing hides the chat for the student but does not delete the staff-visible log, if that is the policy. Reference: CS50 Duck's "Download Chat History" and "Clear Messages" title-bar commands (observed, [package.json](https://github.com/cs50/ddb50.vsix/blob/ai-duck/package.json)).

28. **Errors and rate limits speak in the tutor's voice.** If usage limits are needed, say so in the chat in plain words, e.g. "You've asked a lot in a short time; take a few minutes to try the next step yourself, then come back." Failed requests don't count against the limit, and you can add a slim stamina bar later if limits matter. Reference: CS50's in-chat hints ("You are sending messages too quickly…"), the 10-half-heart stamina bar that regenerates every 3 minutes, and "Failed exchanges do not cost energy" (observed, [ddb.js](https://github.com/cs50/ddb50.vsix/blob/ai-duck/static/ddb.js), [extension.ts](https://github.com/cs50/ddb50.vsix/blob/ai-duck/src/extension.ts)).

---

## Appendix: local evidence files

- Screenshots and crops: `scratchpad/research/shots/b-*`
- Cloned sources (for re-verification): `scratchpad/research/gh/`
  - `notebooklm-mcp/`, `roomi/`, `citext/`, `ramitdour_notebooklm-source-plus/`, `dazzaji/` (NotebookLM)
  - `ddb50.vsix/`, `cs50-ddb50/`, `cs50.readthedocs.io/` (CS50)
  - `alexchexes/`, `bitmunja/` (ChatGPT/Claude/Gemini userscripts)
  - `studymode/` (ChatGPT Study prompt)
  - `complexity/` (Perplexity)
  - `aila/` (Oak)
  - `awesome-design-md/` (Claude tokens)
- Fetched primary HTML (Anthropic / Claude): `scratchpad/research/html/`
