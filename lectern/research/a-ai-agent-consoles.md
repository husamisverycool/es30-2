# AI-agent admin consoles: reference study for Lectern

Prepared 2026-10-03. This study covers the screens Lectern's professor console needs: (1) source approval, (2) rules, (3) preview / test, (4) question log plus topic clusters, (5) on/off switch, (6) announcement. The references are Intercom Fin first, then the GPT builder, ChatGPT Projects and Claude Projects, then Decagon, Sierra, Zendesk, Ada and Kustomer, and finally education tools.

---

## 0. Method, evidence labels and what blocked the research

**Read this first.** The research environment limited what I could see, and that shapes how much each claim can be trusted.

- **Firecrawl** returned `402 Insufficient credits` on every search and scrape, so I could not get screenshots, page markdown or the "branding" format from it.
- **The egress proxy blocked direct fetches** (curl and WebFetch) of intercom.com, downloads.intercomcdn.com (where Intercom keeps help-center images), help.openai.com, chatgpt.com, decagon.ai, sierra.ai, support.zendesk.com, docs.ada.cx, kustomer.com, schoolai.com, khanacademy.org, magicschool.ai, cogniti.ai, help.canvas.yale.edu, saasframe, mobbin and the web archive. As a result **I could not download any Intercom, OpenAI, Decagon, Sierra, Zendesk or Ada screenshots**.
- **Hosts that were reachable:** github.com and raw.githubusercontent.com, claude.com, support.claude.com, s3 and storage.googleapis.
- **Vendor documentation text** came through the WebSearch tool. It returns search-engine excerpts of the pages, often verbatim. I used about 60 targeted queries until the session's search budget ran out (the budget is shared with other agents in this session).
- **Ground truth for pixel-level values (sizes, radii, colours):** I used three open-source products that copy these consoles closely, read their source code, and **opened their screenshots**:
  - **Chatwoot Captain**, an open-source Intercom Fin clone.
  - **Dify**, a GPT-builder-style app builder with a knowledge-document manager.
  - **PingPong**, Harvard Kennedy School's AI tutoring platform for courses. It is the closest real analog to Lectern.

**Evidence labels used throughout:**

| Label | Meaning |
|---|---|
| **[O-shot]** | Observed: I opened the screenshot and saw it (files in `shots/a-*`). |
| **[O-code]** | Observed: read in the product's public source code or CSS/Tailwind config. |
| **[O-doc]** | Observed text: taken from the vendor's own documentation, retrieved as a search-engine excerpt because the page itself was blocked. UI labels in quotes are as they appear in the excerpt; the excerpt may lightly normalise surrounding prose. |
| **[O-3p]** | Observed by a third party: a published CSS/token extraction of the vendor's marketing site (not the in-app console). |
| **[I]** | Inferred: my design judgement, or a widely known layout I could not re-verify this session. |

**Screenshots saved and inspected** (in `scratchpad/research/shots/`):
- `a-pingpong-edit_assistant_v2(-1600).png`: PingPong "Edit assistant" form.
- `a-pingpong-group_home_v2(-1600).png`: PingPong class home with assistant cards.
- `a-pingpong-chat_v2(-1600).png`: PingPong student chat with the moderation-visibility notice.
- `a-pingpong-homework_problems.png`: PingPong "AI Tutor" declining to solve the student's own homework problem.
- `a-dify-manage-knowledge-documents(-1600).png`: Dify knowledge document table with per-row toggles and a bulk bar.
- `a-dify-add-annotation-icon.png`: Dify hover actions on an AI answer ("Add annotation").
- `a-dify-multiple-model-debug.png`: Dify model/parameter popover beside the "Publish" button.

---

## 1. Cross-product matrix: who does each of Lectern's six screens, and how

| Lectern screen | Intercom Fin | GPT builder / Projects | Decagon / Sierra / Zendesk / Ada / Kustomer | OSS analogs (observed) | Education |
|---|---|---|---|---|---|
| **1. Approve or exclude sources** | Knowledge > Sources, "AI Agent" tab. Per-item Fin toggle in the Details panel. Bulk "Change AI Agent state". Scheduled on/off windows. Statuses Syncing / Live / Failed / Excluded. | GPT "Knowledge" upload list (up to 20 files). Projects "Files" panel with a capacity bar. No per-file toggle. | Ada: an "Active" toggle beside each article, bulk "Set as inactive / Set as active". Zendesk: multiple knowledge sources plus search rules. | Dify: a toggle per row plus a status dot (Available / Disabled / Archived), bulk bar Enable / Disable / Archive / Delete. Captain: FAQs are "pending" until you "Approve". | Cogniti "Resources". NotebookLM chat-only sharing hides sources from students. |
| **2. Rules** | "Guidance" cards in five categories, each with a title, up to 2,500 characters, an audience and a channel. Max 100 live. Draft / paused / live. | GPT "Instructions" (one big textarea). Claude "Set project instructions". | Decagon AOPs (natural-language procedures). Ada "Custom Instructions". | Captain "Guardrails" and "Response Guidelines", one rule per row, with example rules you can "Add all". | Cogniti "system message", hidden from students. Khanmigo has Socratic behaviour hard-coded. |
| **3. Preview / test** | Preview panel docked right, with a "Testing as" dropdown and two tabs, "Customer view" and "Event log". Batch test of up to 50 questions rated Good / Acceptable / Poor. Simulations. | Split screen: Configure on the left, Preview on the right. Auto-saved draft until "Create" / "Update". | Zendesk "Test AI agent". Ada "Test" plus shareable test URLs. Kustomer sandbox on a draft team. Sierra / Decagon simulations. | Captain "Playground" plus a "Test setup" drawer of temporary rules. Dify "Debug and Preview". | SchoolAI "Preview & Launch". |
| **4. Question log + clusters** | Inbox with "Improve answer". Review sidebar raises issues. "Unresolved questions" clustered into groups. Topics Explorer: treemap plus ridgeline charts. | None. | Decagon Watchtower (natural-language flag criteria, clusters). Sierra Experience Manager plus Explorer. Ada "Provide coaching" per message. | Dify Logs (User Rate vs Op. Rate, "Add annotation"). Captain FAQ suggestions "Ranked by customer demand". | SchoolAI Mission Control (every chat, live). Khanmigo "Chat history" tab with red flag notes. Cogniti de-identified history plus AI topic summary. PingPong weekly AI "Activity Summaries". |
| **5. On/off** | No global switch. Toggle Fin off at Deploy > Chat. Community thread "Help me turn off Fin". | Share scope: "Only me" / "Anyone with the link" / GPT Store. | Zendesk: unpublish or remove channels. Ada: percentage launch controls. | PingPong "Publish" checkbox. Captain: live only when connected to an inbox (banner otherwise). | SchoolAI Invite / Pause / End. MagicSchool pause / lock / resume rooms. Khanmigo "Focus mode" (up to 4 h). |
| **6. Announcement** | Default intro text plus "AI Agent" disclosure label. | Share link. | None. | None. | SchoolAI join link / code / QR plus "Add to Google Classroom" with instructions. |

**The main gap in the market.** None of the customer-service tools has one obvious global on/off switch. Intercom users go to a community forum to ask how to turn Fin off ([community.intercom.com/…/help-me-turn-off-fin-10946](https://community.intercom.com/settings-security-permissions-22/help-me-turn-off-fin-10946)). Zendesk's answer is "unpublish them or remove their channels" ([support.zendesk.com/…/10519557362202](https://support.zendesk.com/hc/en-us/articles/10519557362202-Turning-Zendesk-AI-features-on-or-off)). Education tools do have one: SchoolAI "Pause / End", MagicSchool "pause, lock, or resume", Khanmigo "Focus mode". **Lectern should copy the education model, not the customer-service model, for screen 5.**

---

## 2. Intercom Fin (deep dive)

### 2.0 Information architecture
- Fin's left-nav is organised around four verbs: **Analyze, Train, Test, Deploy**. [O-doc] [intercom.com/changes/en/86405](https://www.intercom.com/changes/en/86405-set-up-and-optimize-fin-easily-with-a-more-intuitive-fin-navigation)
- Intercom markets this as the "Fin Flywheel": "Train your AI Agent with content, tasks and guidance… Test your AI Agent's behavior and performance… Analyze your AI Agent's performance, and take action". [O-doc] [help 10742658](https://www.intercom.com/help/en/articles/10742658-the-fin-flywheel)
- Path strings seen in the docs include `Fin AI Agent > Train > Content`, `Fin AI Agent > Train > Guidance`, `Fin AI Agent > Deploy > Chat`, `Fin AI Agent > Analyze > Performance`, `Fin AI Agent > Analyze > Unresolved questions` and `Fin AI Agent > Analyze > Recommendations`. [O-doc] (articles cited below)
- Brand context: on 12 May 2026 Intercom renamed the company to **Fin**; "Intercom" remains the name of the helpdesk platform. [O-doc] [cxia.ie](https://www.cxia.ie/news/intercom-rebrands-as-fin-to-reflect-shift-toward-ai-first-customer-engagement-platform)

**Lectern takeaway [I]:** a four-verb nav maps cleanly onto the professor's job: **Sources (Train) / Rules (Train) / Preview (Test) / Go live + Announce (Deploy) / Questions & Topics (Analyze)**.

### 2.1 Screen 1: Knowledge / content sources

**Where it lives**
- "In the **Sources > AI Agent** tab, you'll find all sources which are currently available for Fin AI Agent, where you can add or remove content accessible to Fin AI Agent." [O-doc] [help 7837514](https://www.intercom.com/help/en/articles/7837514-add-your-content-for-fin-ai-agent)
- "From **Knowledge > Sources**, you can … see and manage content access across Fin, Copilot, and Help Center." [O-doc] [help 9440354](https://www.intercom.com/help/en/articles/9440354-knowledge-sources-to-power-ai-agents-and-self-serve-support)

**Per-item control**
- Each article or snippet has a **Fin AI Agent toggle in the "Details" panel**. "A published article with the toggle off is invisible to Fin." [O-doc] [help 7837514](https://www.intercom.com/help/en/articles/7837514-add-your-content-for-fin-ai-agent)
- You can also change Fin and Copilot state "from the Details panel when editing or creating new content". [O-doc] [help 9459957](https://www.intercom.com/help/en/articles/9459957-enable-or-disable-content-for-fin-and-copilot)

**Bulk actions**
- Select content on the Content page and use the bulk-action menu items **"Change AI Agent state (Fin for Service)"**, **"Change Copilot state"**, **"Change Sales state"** and **"Change Ecommerce state"**. [O-doc] [help 9459957](https://www.intercom.com/help/en/articles/9459957-enable-or-disable-content-for-fin-and-copilot)

**Scheduling**
- Snippets, internal articles and documents can be set to turn on or off for Fin and Copilot "at a future date, time, and timezone". You can give a start date only, or a start and an end date to make "a time-limited availability window". This works on single items or in bulk. [O-doc] [help 9459957](https://www.intercom.com/help/en/articles/9459957-enable-or-disable-content-for-fin-and-copilot)
- **Lectern [I]:** this maps directly onto "release the Midterm 2 solutions to the tutor only after the exam closes".

**Table columns and filters**
- The Content table has columns for **AI Agent state, Copilot state, Created by, Date, Language, Last updated by, Tag, Type**. Public articles add Help Center collection, Help Center name and Status.
- A **"Display columns"** picker lets users show or hide columns. [O-doc] [help 9459991](https://www.intercom.com/help/en/articles/9459991-search-filter-and-find-content-and-take-bulk-actions)

**Status vocabulary for synced websites**
- Filters are **Syncing, Live, Failed, Excluded**.
- "Syncing: The page sync is still in progress. An initial sync can take anywhere from a few minutes to over an hour."
- Sync-history columns: **Sync date, Status, Synced pages, Excluded pages, Failed pages, Duration, Sync started by**.
- Sync history opens from the settings dropdown at top right → **"View sync history"**. [O-doc] [help 9357945](https://www.intercom.com/help/en/articles/9357945-sync-and-manage-websites)

**Document upload flow**
- Path: `Train > Content` → **"See all"** under **"Add content"** → **"Upload a document"**.
- The upload modal takes drag-and-drop, PDF or DOCX, "up to 10 files at one time".
- Uploaded files are "usually … available for Fin and Copilot to use within 10 minutes". The workspace limit is 100 documents. Single documents can be **"Delete"**d or **"Re-upload"**ed.
- Documents are a "private source so your customers will not see any link references to them in Fin's responses". [O-doc] [help 8124534](https://www.intercom.com/help/en/articles/8124534-upload-and-manage-documents)

**Freshness**
- Native Intercom articles reach Fin "almost instantly". External content syncs **weekly**. [O-doc] [help 7837514](https://www.intercom.com/help/en/articles/7837514-add-your-content-for-fin-ai-agent)

**Prerequisite**
- "To set Fin live, you must have at least 10 public articles live in your Help Center." [O-doc] [help 8286630](https://www.intercom.com/help/en/articles/8286630-deploy-fin-ai-agent-over-chat)

**Not observable this session:** pixel row height, icon tile size, and chip colours of Intercom's Content table. For observed row anatomy, see Chatwoot Captain (§5.1) and Dify (§5.2).

### 2.2 Screen 2: Guidance (rules)

**Categories, with Intercom's own descriptions** [O-doc] [help 10210126](https://www.intercom.com/help/en/articles/10210126-provide-fin-ai-agent-with-specific-guidance)

| Category | Intercom description | Example from the docs |
|---|---|---|
| **Communication style** | "Ensure every response reflects your company's tone and terminology" | "Fin should maintain a warm, friendly tone by using positive language and avoiding overly formal phrases." |
| **Context and clarification** | "Guide Fin to ask thoughtful follow-up questions…" | "If a customer asks about refunds but does not specify a purchase date, ask for the date before proceeding." |
| **Content and sources** | "Specify which content sources … Fin should use when answering particular types of customer questions" | — |
| **Spam** | Custom guidelines for the AI spam detection system | — |
| **Other** | "specific company or support policies" | — |

**Card structure** [O-doc]
- A **title is mandatory**: "You won't be able to save new guidance without adding a title."
- Each card has a built-in **channel selector** (Chat, Email, Voice).
- An **Audience** dropdown defaults to **"Everyone"**. Sources: [help 10210126](https://www.intercom.com/help/en/articles/10210126-provide-fin-ai-agent-with-specific-guidance), [changes 90847](https://www.intercom.com/changes/en/90847-target-fin-guidance-using-audiences)

**Limits**
- "Each guidance can be up to **2,500 characters**." "A maximum of **100** pieces of guidance can be set live." [O-doc] [help 10210126](https://www.intercom.com/help/en/articles/10210126-provide-fin-ai-agent-with-specific-guidance); [community: increase limit 100→150](https://community.intercom.com/train-fin-94/increase-guidance-limit-from-100-to-150-13965)

**States and buttons**
- Guidance states are **draft, paused, live**.
- Buttons are **"Enable"** and **"Save and Enable"**.
- "When you test Guidance in Preview, all types of Guidance are included (draft, paused, and live)", so you can test before publishing. [O-doc] [help 10210126](https://www.intercom.com/help/en/articles/10210126-provide-fin-ai-agent-with-specific-guidance)

**Writing advice (Fin Guidance best practices)** [O-doc] [help 10560969](https://www.intercom.com/help/en/articles/10560969-fin-guidance-best-practices)
- Use "if / when / then" conditions.
- Keep to one objective per guidance.
- Address the agent as **"you"**. Good example: "When a customer mentions a refund, you should escalate to the support team."
- Avoid multi-"and/or" rules.
- Avoid contradictions.
- The page shows ❌ bad / ✅ good pairs.

**Lectern [I]:**
- Seed the rules screen with ready-made, single-objective professor rules written in "you" form, e.g. "When a student asks for the answer to a problem-set question, you give a hint or a parallel worked example, never the final answer."
- Group rules into categories modelled on Intercom's: **Academic integrity / Notation & terminology / Tone / Sources / Escalate to staff**.

### 2.3 Screen 3: Test Fin / preview

**Preview panel** [O-doc] [help 12599471](https://www.intercom.com/help/en/articles/12599471-use-fin-previews)
- Used "while training Fin to observe how it applies content, guidance, attributes, procedures, escalation rules, and deployment settings before going live."
- "At the top of the Preview panel, you'll see the **'Testing as'** dropdown, which lets you choose if Fin should simulate a specific user or audience."
- **Two tabs:** **"Customer view"** shows what the customer sees; **"Event log"** shows "Fin's reasoning process, including which content, data, etc. it used". The event log also lists "any Fin personality, Guidance, Tasks, etc. that Fin has applied".
- Docking: the guidance editor sits beside the Preview panel ("create or edit guidance, use the Preview panel to ask Fin questions and check how your updates are applied"). [O-doc] I could not see whether it is fixed width or collapsible. [I] Treat it as a right-docked panel next to the editor, which is how Intercom's marketing describes it.

**Preview conversations** "appear in your inbox, but are excluded from reporting." [O-doc] [help 14077180](https://www.intercom.com/help/en/articles/14077180-simulations-vs-batch-tests-vs-previews)

**Three testing tools** [O-doc] [help 14077180](https://www.intercom.com/help/en/articles/14077180-simulations-vs-batch-tests-vs-previews)

| Tool | What it is | Best for |
|---|---|---|
| **Previews** | "manual, interactive testing panel where you type messages and see Fin's response and event log in real time" | Quick spot checks while building |
| **Batch tests** | Validate Fin's responses "across up to 50 questions at once" | Coverage checks across many questions |
| **Simulations** | "AI acts as a simulated customer and judges the outcome against success criteria you define" | Procedures only |

**Batch-test rating scale** [O-doc] [help 10521711](https://www.intercom.com/help/en/articles/10521711-batch-test-fin-ai-agent)
- Ratings are **Good / Acceptable / Poor**. "Acceptable" allows an internal note.
- "Poor" requires a reason: *Didn't use the correct content; Didn't clarify the customer's question; Used the content incorrectly; Tone wasn't right; Answer length is too long or short; Didn't speak in the right language; Other.*
- Feedback goes into a "downloadable report". The page states plainly: "Answer ratings do not train Fin directly."

**Lectern [I]:** a "Batch test" of the professor's own past Ed questions is the strongest pre-launch confidence builder. Run it against last semester's top 20 questions and rate each answer with the same three levels.

### 2.4 Screen 4: inbox / conversation review, topics and insights

**Inbox: correcting a single answer**
- "In the Inbox, you can click **Improve Answer** on any AI-generated response to review the content Fin used to create it." [O-doc] [help 9790492](https://www.intercom.com/help/en/articles/9790492-top-ten-ways-to-optimize-fin)
- "See exactly which sources and settings—like tone of voice and Guidance—shaped the response." [O-doc] (same)
- From the conversation's **Review sidebar** you can raise an Issue ticket with a "title, type (Content, Guidance, Procedure, Escalation, and more), and assignee — without leaving the conversation." [O-doc] [help 16295106](https://www.intercom.com/help/en/articles/16295106-using-monitors-to-find-and-fix-fin-answer-issues)

**Monitors / QA**
- "A monitor continuously evaluates conversations against criteria you define — whether that's a random sample … or targeted conversations based on signals like low CX scores, repeated escalations, or answer quality."
- Monitored conversations are scored with a **scorecard** "by Fin, a human reviewer, or both".
- Templates include "weekly Fin reviews, low answer quality, escalation handling, looping issues". [O-doc] [help 16295106](https://www.intercom.com/help/en/articles/16295106-using-monitors-to-find-and-fix-fin-answer-issues)

**Unresolved questions (clustered)** [O-doc] [help 8890980](https://www.intercom.com/help/en/articles/8890980-dig-into-fin-ai-agent-unresolved-questions)
- Path: `Analyze > Unresolved questions`. The list is "automatically grouped by topic areas".
- "Each grouping is a cluster of similar questions asked by your users that were unresolved — meaning Fin AI Agent either didn't have an answer for the question, the user asked to be routed to the team, or the conversation was abandoned."
- Metrics per group: **language, volume, number of abandoned conversations, conversations routed to team members**.
- Clicking a group opens its conversations in a **side panel**; clicking a question opens the conversation in a new tab, with the teammate's reply.

**Topics Explorer** [O-doc] [help 11390087](https://www.intercom.com/help/en/articles/11390087-use-the-topics-explorer-to-see-what-s-driving-volume)
- Topics are AI-generated in two levels: **topics** (broad themes) and **subtopics** ("highly specific, recurring issues"). On first enable the model is built from the past **90 days**.
- Layout:
  - **Left:** a **tree map** where "the size of the box signals the volume of conversations in that topic, and the color of the box is related to the metric selected".
  - **Right:** **ridge line charts** showing the same topics over time.
- Per-topic metrics: **CX Score, resolution rate, handling time**.
- Curation: "How to tailor your AI topics with topic curation" ([help 12521409](https://www.intercom.com/help/en/articles/12521409-how-to-tailor-your-ai-topics-with-topic-curation)).

**Recommendations / content gaps** [O-doc] [help 11394959](https://www.intercom.com/help/en/articles/11394959-use-ai-powered-content-recommendations-to-improve-fin)
- Path: `Analyze > Recommendations`, filtered by "Reason is Content gaps".
- Each recommendation shows the conversations that triggered it and is "ranked by impact".
- Recommendations cover missing, unclear, duplicated or contradictory content.
- "You can edit, accept, or reject any recommendations before it goes live—so changes happen on your terms."

### 2.5 Fin answered / resolved stats

**Performance dashboard** [O-doc] [help 13533623](https://www.intercom.com/help/en/articles/13533623-fin-ai-agent-automation-rate), [help 11390083](https://www.intercom.com/help/en/articles/11390083-monitor-fin-s-performance-with-clarity-and-confidence)
- Path: `Analyze > Performance`. Headline metrics: **automation rate, resolution rate, involvement rate, CX Score**.
- **Automation Rate = Involvement Rate × Resolution Rate.**
- A multi-metric line chart has a toggle at the top to switch between counts and rates.

**Outcome vocabulary** [O-doc] [help 8205718](https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes)
- **Confirmed resolution:** the customer replied positively ("Ok thanks", "That helped").
- **Assumed resolution:** the customer "left without asking to speak to a teammate or giving negative feedback".
- **Routed to team:** handed to a teammate.
- Each resolution is billed at $0.99.
- The community has criticised "assumed resolved" as a metric ([community thread](https://community.intercom.com/ask-the-intercom-team-about-fin-54/fin-s-flawed-assumed-resolved-pricing-design-8929)).

**Lectern [I]:** avoid "assumed resolved"-style vanity metrics, because a professor will distrust them. Show plain counts instead: "Questions asked · Answered from your materials · Sent to course staff · Students flagged an answer".

### 2.6 Screen 5: Set Fin live / turning it off

**Going live**
- Path: `Fin AI Agent > Deploy > Chat`, using an interactive Messenger preview. Under **"Simple deploy"**, open **"Who will see Fin"** and add the rule "Email contains [yourcompanydomain.com]" to test with your own team.
- Then click **"Set Fin Live"**: "Fin will immediately begin handling conversations." [O-doc] [help 8286630](https://www.intercom.com/help/en/articles/8286630-deploy-fin-ai-agent-over-chat)
- Intercom recommends staged rollout: team first, then customer segments. [O-doc] [help 7837527](https://www.intercom.com/help/en/articles/7837527-live-testing-fin-with-your-team-or-customer-segments)

**Pausing**
- "To pause Fin at any time, return to Fin AI Agent > Deploy > Chat and **toggle Fin off**." [O-doc] [help 8286630](https://www.intercom.com/help/en/articles/8286630-deploy-fin-ai-agent-over-chat)
- But: "To turn Fin off and avoid charges, simply remove Fin from any live Workflows or pause Fin in the Simple deploy section." There are several places to check. [O-doc] [community "Help me turn off Fin"](https://community.intercom.com/settings-security-permissions-22/help-me-turn-off-fin-10946)

**Disclosure** [O-doc] [help 11712008](https://www.intercom.com/help/en/articles/11712008-ai-agent-disclosure), [changes 96733](https://www.intercom.com/changes/en/96733-let-your-customers-know-they-re-speaking-with-an-ai-agent)
- Fin can show an **"AI Agent"** label after its name, controlled by `Fin settings > Identity > "Show AI Agent label in Messenger"`.
- "Set AI Agent expectations" shows the subtext "AI Agent and team can help".
- Default intro message: "Hi there, you're speaking with Fin **AI Agent**. I'm well trained and ready to assist you today, but you can ask for the team at any time."

**Lectern [I]:** the go-live control should be one labelled switch in a persistent header, not spread across deploy screens.

### 2.7 Screen 6: announcement
- Intercom has no "copy announcement" artifact. Its closest equivalent is the editable default intro and email messages quoted above, which disclose AI and promise a route to humans. [O-doc] [help 11712008](https://www.intercom.com/help/en/articles/11712008-ai-agent-disclosure)
- **Lectern [I]:** borrow their two content beats for the announcement: (a) it is AI and trained on *my* materials; (b) you can always reach the course staff.

### 2.8 Intercom visual language
These values come from a third-party extraction of **intercom.com marketing pages**, not the in-app console. Treat them as brand cues, not console specs. [O-3p] [VoltAgent/awesome-design-md, design-md/intercom/DESIGN.md](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/intercom/DESIGN.md)

| Token | Value |
|---|---|
| Type | **Saans** (proprietary geometric sans): display weight 500, body 400, SaansMono for code. Free substitute suggested: **Inter 500**. |
| Ink | `#111111` |
| Muted / subtle / tertiary text | `#626260` / `#7b7b78` / `#9c9fa5` |
| Canvas | warm cream `#f5f1ec` |
| Cards | white `#ffffff` on cream |
| Hairline | `#d3cec6`; soft `#ebe7e1` |
| **Fin Orange** | `#ff5600`, "reserved for the Fin AI brand … never decoratively" |
| Error | `#c41c1c` |
| Report palette | blue `#65b5ff`, green `#0bdf50`, pink `#ff2067`, lime `#b3e01c`, orange `#fe4c02` |
| Radii | 4 / 6 / **8 (buttons, inputs)** / 12 (cards) / 16 (product mockups) / pill (tabs) |
| Buttons | 15px / 500, padding 10px 18px; primary is charcoal, not orange |
| Depth | "Intercom resists drop shadows. Depth is communicated by the white-on-cream surface change." |

- Body is 16 / 1.5; captions are 12px.
- **Density lesson:** Intercom briefly shipped a typewriter-style inbox font whose dotted zeros "look very similar to 8s". After complaints it "did take swift action to revert". [O-doc] [community thread 8933](https://community.intercom.com/intercom-community-27/intercom-inbox-new-font-8933)
  - Lectern implication: use tabular, unambiguous numerals for counts in logs.

### 2.9 Why Fin feels controllable (synthesis)
1. **Every answer is traceable:**
   - "Improve answer" in the inbox.
   - "Event log" in the preview.
   - Sources cited inline in replies ("source links now appear directly in replies"). [O-doc] [help 7120684](https://www.intercom.com/help/en/articles/7120684-fin-ai-agent-explained)
2. **Nothing changes without approval:** recommendations are "edit, accept, or reject … so changes happen on your terms". [O-doc] [help 11394959](https://www.intercom.com/help/en/articles/11394959-use-ai-powered-content-recommendations-to-improve-fin)
3. **Testing is safe:**
   - Preview runs are excluded from reporting.
   - Draft guidance can be tested before it is live.
   - Staged audiences.
4. **Grounding claims** on the product site: "It only provides answers based on your support content or data"; ~0.1% hallucination rate. [O-doc] [fin.ai/ai-engine](https://fin.ai/ai-engine)
5. **Intercom's weakness:** turning it off is hard to find (§2.6).

---

## 3. OpenAI custom GPT builder, ChatGPT Projects, Claude Projects

### 3.1 GPT builder
**Layout**
- "The GPT Builder displays a split screen view with the left side being the configuration builder and the right side showing a live preview." [O-doc] [zapier.com/blog/custom-chatgpt](https://zapier.com/blog/custom-chatgpt/), [androidpolice](https://www.androidpolice.com/how-to-use-openai-gpt-builder/)
- Two tabs on the left:
  - **"Create"**: a conversational builder; you chat to build the GPT.
  - **"Configure"**: direct fields. [O-doc] [help.openai.com 8554397](https://help.openai.com/en/articles/8554397-creating-and-editing-gpts)
- [I] The right pane is headed "Preview" and has a chat composer at the bottom. The two panes are roughly 50/50 on desktop (widely documented, not re-verified this session).

**Configure fields, in order** [O-doc] (same article and [ai-toolbox guide](https://www.ai-toolbox.co/chatgpt-management-and-productivity/chatgpt-custom-gpts-builder-guide-2026))

| Field | What the docs say |
|---|---|
| **Name** | "users see in search results, the GPT Store, shared links, and at the top of the chat" |
| **Description** | — |
| **Instructions** | "what it should do, how it should respond, and what it should avoid. These are applied to every conversation" |
| **Conversation starters** | — |
| **Knowledge** | upload files |
| **Recommended model** | — |
| **Capabilities** (checkboxes) | Web Search, Canvas, Image Generation, Code Interpreter & Data Analysis |
| **Actions** | — |

**Knowledge**
- Up to **20 files**, each ≤512 MB (~2M tokens). [O-doc] (same)
- Inline warning under Knowledge: "If you upload files under Knowledge, conversations with your GPT may include file contents. Files can be downloaded when Code Interpreter is enabled." [O-doc] [medium/michael-wahl](https://michael-wahl.medium.com/openai-my-custom-gpts-accessing-my-knowledge-file-s-67d409c0eee0)
  - A model for an honest consequence statement placed right next to the control.

**Saving and publishing**
- "Changes save to a draft automatically". Click **"Create"** the first time and **"Update"** afterwards. [O-doc] [ai-toolbox](https://www.ai-toolbox.co/chatgpt-management-and-productivity/chatgpt-custom-gpts-builder-guide-2026)
- Share levels: **"Only me" / "Anyone with the link" / GPT Store**. [O-doc] [help.openai.com 8798878](https://help.openai.com/en/articles/8798878-sharing-and-publishing-gpts)

**Version history**
- In the ••• menu, pick a version date → **"Restore this version"** → **"Update"**. [O-doc] [help.openai.com 9083999](https://help.openai.com/en/articles/9083999-how-do-i-view-version-history)

**Platform note:** "Personal ChatGPT accounts, including Free, Go, Plus, and Pro, cannot create or publish new GPTs" (2026). [O-doc] (help 8798878 excerpt)

### 3.2 ChatGPT Projects
- A project bundles "the chats you have inside it, any files you upload as reference material, and a set of project instructions".
- Files are added with **"Add files"**. Instructions are set via the project menu → **Project settings**.
- Optional **project-only memory**. [O-doc] [gizmotimes guide](https://www.gizmotimes.com/ai/chatgpt-projects-guide-chats-files-instructions-memory/51425), [ai-toolbox](https://www.ai-toolbox.co/chatgpt-management-and-productivity/how-to-use-chatgpt-projects-guide-2026)

### 3.3 Claude Projects
**Labels** [O-doc via WebFetch of support.claude.com] [9519177](https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects)
- **"+ New Project"** (upper right).
- Visibility **"Keep it private"** / **"Share with your broader organization"**.
- Add knowledge with the **"+"** button.
- **"Set project instructions"** → **"Save instructions"**.
- **"Share project"**, with permissions **"Can view" / "Can edit"**.
- Tabs **"Your projects," "Organization," "Shared with you"**. Delete confirmation reads **"Yes, delete"**.

**Layout**
- The knowledge panel sits on the **right side** of the project. Each file appears as a **card showing the filename and a line count**.
- "A capacity bar above the file cards" reads e.g. **"1% of project capacity used"**. [O-doc] [ai-toolbox Claude guide](https://www.ai-toolbox.co/claude-management-and-productivity/how-to-use-claude-projects-guide-2026), [tldv](https://tldv.io/blog/claude-projects/)

**RAG mode**
- "You'll see a visual indicator showing that your project is RAG-enabled."
- "You'll see Claude using a **project knowledge search tool**." [O-doc] [support.claude.com 11473015](https://support.claude.com/en/articles/11473015-retrieval-augmented-generation-rag-for-projects)

**Claude for Education**
- "Claude's learning mode works like a good tutor: it asks questions that help you find the answers yourself." [O-doc] [claude.com/solutions/education](https://claude.com/solutions/education)

**Visual tokens (claude.com marketing)** [O-3p] [awesome-design-md/claude](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/claude/DESIGN.md)
- Canvas `#faf9f5`; ink `#141413`; body `#3d3d3a`; muted `#6c6a64`; hairline `#e6dfd8`; coral primary `#cc785c`.
- Serif display "Copernicus / Tiempos Headline"; sans "StyreneB / Inter".

**What Lectern borrows [I]:**
- From the GPT builder: the **Configure | Preview split**, with auto-saved draft separate from the published version and an explicit publish step.
- From Claude: the **capacity bar** and **file cards with size meta**.
- From both: one big instructions box is *not* enough for a cautious professor. Use Intercom- or Captain-style discrete rules instead.

---

## 4. Decagon, Sierra, Zendesk, Ada, Kustomer

### Decagon
- **AOPs (Agent Operating Procedures):** "natural language instructions that compile into code"; "you write them in plain language, the way you would write a procedure for a new hire." [O-doc] [decagon.ai/blog/ai-customer-support-setup](https://decagon.ai/blog/ai-customer-support-setup)
- **Watchtower** "reviews every live conversation against criteria you write in plain language". Example criteria: "mentions of frustration", "violations of data privacy policy".
  - Findings are organised "into meaningful clusters", with subcategories (e.g. sentiment → frustration / confusion).
  - "Watchtower's dashboard highlights trends across flags and categories … you can jump straight into the conversations that were flagged." [O-doc] [decagon.ai/product/watchtower](https://decagon.ai/product/watchtower), [blog](https://decagon.ai/blog/decagon-watchtower)
  - **Lectern [I]:** natural-language flag criteria such as "student asks for a full solution" or "student seems distressed" are exactly what a professor wants.
- **Other tools:** Simulations, Experiments (A/B), Suggestions for knowledge-gap diagnosis. [O-doc] [decagon simulations](https://decagon.ai/resources/decagon-simulations)

### Sierra
- **Agent Studio** (no-code). [O-doc] [sierra.ai/blog/meet-agent-studio](https://sierra.ai/blog/meet-agent-studio)
- **Experience Manager:** "customer experience teams formally evaluate samples of conversations every single day, annotating the conversations with feedback". [O-doc] [sierra.ai/blog/agent-development-life-cycle](https://sierra.ai/blog/agent-development-life-cycle)
- **Traces and Explorer:** "Traces let you examine individual conversations, and Explorer investigates patterns … across them." [O-doc] [sierra.ai/blog/your-agent-laid-bare…](https://sierra.ai/blog/your-agent-laid-bare-and-why-it-matters)
- **Releases:** each release is "a snapshot that includes … an immutable snapshot of all knowledge available to the agent". [O-doc] (same)
  - **Lectern [I]:** "Version 3, published Oct 2, used 14 sources" makes the tutor auditable.

### Zendesk
- "In the AI agent editor, click **Test AI agent** and ask a question related to your help center content." [O-doc] [support.zendesk.com 9517744828058](https://support.zendesk.com/hc/en-us/articles/9517744828058-Configuring-settings-for-generative-replies-in-AI-agents)
- Publishing: "clicking **Done** in the upper right corner of the bot builder, then on the AI agent page, clicking **Publish AI agent**, and finally clicking **Publish**". This is a two-step publish with confirmation. [O-doc] [support.zendesk.com 7232810932250](https://support.zendesk.com/hc/en-us/articles/7232810932250-Adding-and-removing-an-AI-agent-for-a-messaging-channel)
- No-answer behaviour: "If no relevant knowledge is found, the AI agent informs the customer that it can't answer their question." [O-doc] [support.zendesk.com 10448933203994](https://support.zendesk.com/hc/en-us/articles/10448933203994-Customizing-the-Knowledge-reply-in-an-AI-agent-with-agentic-AI)
- Off: "To disable AI agents, unpublish them or remove their channels." [O-doc] [support.zendesk.com 10519557362202](https://support.zendesk.com/hc/en-us/articles/10519557362202-Turning-Zendesk-AI-features-on-or-off)

### Ada
- **Knowledge:** at `Training > Knowledge`, "toggle the **Active** setting beside" an article. Bulk: "At the bottom of the page, click either **Set as inactive** or **Set as active**".
  - Filters: active status, source, language, tags. Search field: "Search by article name". [O-doc] [docs.ada.cx/docs/knowledge/article-management](https://docs.ada.cx/docs/knowledge/article-management)
- **Test:** "From the lower left-side panel of your Ada dashboard, click **Test**." Interactive Testing can "share test URLs with stakeholders for feedback". [O-doc] [interactive-testing](https://docs.ada.cx/docs/optimization/testing/interactive-testing), [key concepts](https://docs.ada.cx/docs/welcome/key-concepts)
  - **Lectern [I]:** a "send preview link to my TA" feature.
- **Launch controls:** show the chat button "to only a certain percentage of users". [O-doc] [launch controls](https://docs.ada.cx/docs/channels/chat/launch-controls)
- **Coaching:** "click on the **Provide coaching** icon when hovering over a message or reasoning behavior in the transcript". [O-doc] [coaching tools](https://docs.ada.cx/docs/optimization/coaching/coaching-tools)

### Kustomer
- "When you edit an agent team, a draft team is created but not deployed … select **Test** to engage with your automation in a testing sandbox." [O-doc] [help.kustomer.com testing](https://help.kustomer.com/en_us/testing-ai-agents-B1GdVVIKWl)
- Admins can "identify questions agents couldn't answer, and flag inappropriate conversations". [O-doc] [kustomer blog](https://www.kustomer.com/resources/blog/evaluations-and-live-validation/)

**Common pattern across all five:**
- **Draft → test → publish**, with publish as an explicit, confirmed action.
- **Every conversation reviewable**, with a per-message feedback affordance on hover.

---

## 5. Open-source analogs: observed component anatomy

These are the only places I could verify exact component structure, spacing and microcopy.

### 5.1 Chatwoot Captain (open-source clone of Intercom Fin)
Source: [github.com/chatwoot/chatwoot (develop)](https://github.com/chatwoot/chatwoot/tree/develop/app/javascript/dashboard/components-next/captain). Strings are in [`i18n/locale/en/integrations.json` → `CAPTAIN`](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/i18n/locale/en/integrations.json).

**Card or row shell (`CardLayout.vue`)** [O-code] [link](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/components-next/CardLayout.vue)
- `rounded-xl` (12px), a 1px **outline** in place of a shadow (`outline-n-container`), `bg-n-solid-2`.
- Padding `px-6 py-5` (24/20px), or `px-10 py-6` when selectable. The checkbox is absolutely positioned at `top-7 left-3`. Gap 12px.

**Source row (`DocumentCard.vue`)** [O-code] [link](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/components-next/captain/assistant/DocumentCard.vue)
- **Line 1:** the title, `text-base text-n-slate-12 line-clamp-1`, underlined on hover, clickable to open details. A kebab menu sits right (`i-lucide-ellipsis-vertical`, size xs).
- **Line 2:** a meta strip in `text-sm text-n-slate-11`, laid out as
  `[assistant icon + name] · [link icon + URL + external-link icon] · "{n} FAQs" · [sync status]`
- Kebab menu items: "View details", "Refresh now", "Retry refresh", "Delete Document".

**Status chip (`DocumentSyncStatus.vue`)** [O-code] [link](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/components-next/captain/assistant/DocumentSyncStatus.vue)
- It is an inline icon (14px) plus a word, *not* a filled pill. While syncing the icon becomes a spinner.
- Tone mapping: **amber** for syncing or stale, **ruby** for failed, **slate** for normal.
- Labels: "last updated {time}", "updating...", "update stalled", "Failed to sync", "not updated yet".
- A failure shows an inline link button **"Retry refresh"**.
- Error reasons: "Page not found", "Access denied", "Page took too long to respond", "Page returned empty content".

**Filters and sort** [O-code]
- Source: "All sources / Web pages / PDFs".
- Status: "Any status / Updated / Needs update / Updating / Failed".
- Sort: "Recently updated / Recently created / **Most used in conversations**".
- Usage shown per item: "Used in {n} conversations".

**Bulk actions** [O-code]
- "{count} selected", "Select all ({count})", "Delete", "Refresh".
- Confirmation: "Are you sure you want to delete the selected documents? This action cannot be undone." → **"Yes, delete all"**.

**Approval queue for FAQs (`ResponseCard.vue`)** [O-code] [link](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/components-next/captain/assistant/ResponseCard.vue)
- Question `text-base`; answer `text-sm text-n-slate-11 line-clamp-5`.
- Action row of link-style buttons: **"Approve"** (circle-check icon, shown only when `status === 'pending'`), **"Edit"** (pencil, slate), **"Delete"** (trash, ruby).
- Provenance line: a document name, a user, or "Conversation #{id}".
- Success toast: "The FAQ was marked as approved".
- Feature note: "You can review each suggestion and decide whether to approve or reject it."

**Suggestion queue** [O-code]
- "{count} suggestions to review", **"Ranked by customer demand"**, "Review sources", **"Approve FAQ"** / **"Dismiss"**.
- Detail text: "Captain grouped {count} conversations into this suggestion. Review the evidence and refine the FAQ before approval."
- Empty state: **"The review queue is clear"** / "New FAQ suggestions will appear here when they are ready to review."

**Rules (Guardrails and Response Guidelines)** [O-code]
- Guardrails description: "Keeps things on track—only the kinds of questions you want your assistant to answer, nothing off-limits or off-topic."
- Response Guidelines description: "The vibe and structure of your assistant's replies—clear and friendly? Short and snappy? Detailed and formal?"
- Adding: an "Example guardrails" panel with **"Add all"** / **"Add this"**, plus a free-text field "Type in another guardrail..." and **"Test all"**.
- Each rule is a single row (`RuleCard.vue`): `text-sm` text, then a pen icon, a 1×16px divider, and a trash icon (ghost, xs). [O-code] [RuleCard.vue](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/components-next/captain/assistant/RuleCard.vue)
- Empty state: "No guardrails found. Create or add examples to begin."

**Playground / preview (`AssistantPlayground.vue`)** [O-code] [link](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/components-next/captain/assistant/AssistantPlayground.vue)
- Container: `rounded-xl border`. The chat column is `flex-1`.
- Header: "Playground" (`text-lg font-medium`), with icon buttons for reset (rotate-ccw) and test setup (settings-2) on the right.
- Description: "Use this playground to send messages to your assistant and check if it responds accurately, quickly, and in the tone you expect."
- Composer: `rounded-xl` with a 1px outline and the placeholder "Type your message...". Footnote below: "Messages sent here will count toward your Captain credits."
- **Docked right drawer:** `w-[36rem]` (576px), `border-s`, titled **"Test setup"**, with the text "Changes here apply only to this playground session unless you explicitly save an item."
  - Tabs: **Scenarios / Guidelines / Guardrails / Knowledge**.
  - Temporary items are badged **"Temporary"** / **"Session only"** and promoted with **"Add guideline permanently"**.
  - The Knowledge tab lists "Knowledge available to Captain".
- Below the `xl` breakpoint the drawer becomes a side panel.
- After each run: "Run details · {duration}ms", "Handled by: {handler}".

**Overview: state banners and metric hints** [O-code]
- Not-live banner: **"This assistant isn't connected to any inbox yet, so it won't respond to conversations."** [Connect inbox]
- Coverage banner: "{count} FAQ suggestions are ready for review, keeping coverage at {coverage}%. Approve them so your assistant can resolve more on its own."
- Every metric carries a plain-English hint:
  - "Auto-resolution rate: The share of handled conversations Captain resolved without help from your team."
  - "Time saved … Based on two minutes saved for each public Captain reply."
- Knowledge coverage: "{pct}% approved".

**Type and colour** [O-code] [tailwind.config.js](https://github.com/chatwoot/chatwoot/blob/develop/tailwind.config.js), [theme/colors.js](https://github.com/chatwoot/chatwoot/blob/develop/theme/colors.js)
- System font stack (`-apple-system, system-ui, …`), with Inter available.
- Colours use the **Radix Colors** scales: slate-12 for primary text, slate-11 for secondary, amber-11 for warning, ruby-11 for danger. [I] Radix light values: slate-12 ≈ `#1C2024`, slate-11 ≈ `#60646C`.

### 5.2 Dify (knowledge manager plus logs)
**Knowledge "Documents" table** [O-shot] `a-dify-manage-knowledge-documents.png`, from [langgenius/dify-docs](https://github.com/langgenius/dify-docs/blob/main/images/use-dify/knowledge/manage-knowledge-documents.png)
- Header "Documents" with a one-line description.
- Controls: an "All Status" select and a search box on the left; a "Metadata" secondary button and a blue **"+ Add file"** primary button on the right.
- Columns: **# · NAME · CHUNKING MODE · WORDS · RETRIEVAL COUNT · UPLOAD TIME · STATUS · ACTION**.
- **STATUS** is a coloured dot plus a word: **"Available"** (green text), **"Disabled"** (grey), **"Archived"** (grey).
- **ACTION** holds the **enable toggle** (blue when on), a settings icon and a kebab.
- Rows are about 34px tall. Hairline row dividers, no zebra striping, a file-type icon before the name.
- Selecting rows raises a **floating bulk bar at bottom centre**: "**2 Selected** | Enable | Disable | Metadata | Archive | **Delete** (red) | Cancel".
- Pager at bottom: 10 / 25 / 50 per page.

**Logs** [O-doc] [dify-docs logs.mdx](https://github.com/langgenius/dify-docs/blob/main/en/cloud/use-dify/monitor/logs.mdx)
- "Each row is one conversation". The title is "generated from the conversation's first message".
- **"User Rate"** counts end-user likes and dislikes; **"Op. Rate"** (operator rate) counts your team's.
- Hovering an answer lets you see token spend and latency, open the trace, "Rate the answer as team feedback; a dislike can carry a comment", or **"Add an annotation pairing the question with an improved reply."** [O-shot] `a-dify-add-annotation-icon.png` shows a hover toolbar (speaker, copy, edit) with the tooltip "Add annotation", next to 👍/👎.

**Annotations** [O-doc] [annotation-reply.mdx](https://github.com/langgenius/dify-docs/blob/main/en/cloud/use-dify/monitor/annotation-reply.mdx)
- "When users ask similar questions, Dify returns your pre-written answers instead of generating new responses." Each annotation has hit tracking.

**Editor top bar** [O-shot] `a-dify-multiple-model-debug.png`
- A model chip sits beside a filled blue **"Publish ▾"** button at top right. This is the persistent publish affordance.

### 5.3 PingPong (Harvard Kennedy School's course AI platform; the closest analog to Lectern)
Source: [github.com/comppolicylab/pingpong](https://github.com/comppolicylab/pingpong); production at pingpong.hks.harvard.edu.

**Edit-assistant form** [O-shot] `a-pingpong-edit_assistant_v2.png`
- A single-column form on a white rounded panel, next to a navy sidebar.
- Heading **"Edit assistant"** is set in a serif. Each field has a **bold label plus a one-line helper sentence**:
  - Description: "Describe what this assistant does. This information is **not** included in the prompt, but **is** shown to users."
  - Instructions: "This is the prompt the language model will use to generate responses."
  - **Hide Prompt**: "Hide the prompt from other users. When checked, only the moderation team and the assistant's creator will be able to see this prompt."
  - Tools: "File Search augments the Assistant with knowledge from outside its model using documents you provide."
- **"Delete assistant"** is a red outline pill at top right. **There is no preview pane**: PingPong lacks the split screen.

**Publish control** [O-code] [`routes/group/[classId]/assistant/[assistantId]/+page.svelte`](https://github.com/comppolicylab/pingpong/blob/main/web/pingpong/src/routes/group/%5BclassId%5D/assistant/%5BassistantId%5D/%2Bpage.svelte)
- A checkbox labelled **"Publish"** with helper text: "By default only you can see and interact with this assistant. If you would like to share the assistant with the rest of your group, select this option."

**Class home** [O-shot] `a-pingpong-group_home_v2.png`
- A gold banner: "Build your own AI chatbot for this group…" with **"Create new assistant →"**.
- Assistant cards on cream `#FFF6E4`, each with:
  - the name in a large sans, plus an **eye icon** for visibility;
  - "Created by **Name**";
  - pencil and link icons at top right;
  - a coral **"Start a chat ⊕"** pill.

**Student chat** [O-shot] `a-pingpong-chat_v2.png`
- Directly under the composer, in muted small text with an eye-slash icon: **"This thread will be visible to the moderation team and yourself."**
- Placeholder "Ask me anything"; coral "Submit" pill.

**Homework handling** [O-shot] `a-pingpong-homework_problems.png`
- The student asks "Can you help me with this homework problem? 2x^2 - 3x - 5". The "AI Tutor" explains the methods, then says "Let's use a **different example**…", solves 3y² − 11y + 6 = 0, and ends "Now, try applying these steps to your specific quadratic equation."
- This is the parallel-worked-example pattern Lectern's "never solve problem sets" rule should produce in preview.

**Moderator permissions** [O-code] [`manage/+page.svelte`](https://github.com/comppolicylab/pingpong/blob/main/web/pingpong/src/routes/group/%5BclassId%5D/manage/%2Bpage.svelte)
- "View unpublished threads created by others (**anonymized**)".
- Weekly digest checkbox **"Send me weekly Activity Summaries"**, with the helper "PingPong will gather all thread activity in your group and send an AI-generated summary with relevant thread links to all Moderators at the end of each week."

**Theme** [O-code] [tailwind.config.js](https://github.com/comppolicylab/pingpong/blob/main/web/pingpong/tailwind.config.js)

| Role | Value |
|---|---|
| Sans | **Inter** |
| Serif | **STIX Two Text** |
| Navy | `#201E45` / `#2D2A62` |
| Light blue header | `#F1F4FF` |
| Orange CTA | `#FC624D` |
| Gold | `#FFD076` |
| Gold-light cards | `#FFF6E4` |

---

## 6. Education-specific equivalents

**SchoolAI Spaces / Mission Control**
- "Teachers can see every chat as it happens, across all their Spaces, organized in a single, easy-to-use dashboard." [O-doc] [schoolai.com blog](https://schoolai.com/blog/how-schoolai-protects-students-with-real-time-safety-monitoring)
- Alerts for concerning messages appear "at the top of the teacher's dashboard". [O-doc] (same)
- After a session it "summarizes each student's strengths and gaps, then groups the class by what they actually demonstrated". [O-doc] (same)
- Controls are **"Invite, Pause, and End"**; Pause / End also appear in the ••• menu at Spaces > Sessions. [O-doc] [help.schoolai.com 10270295](https://help.schoolai.com/en/articles/10270295-create-and-use-spaces-with-the-space-creator)
- Launch flow: **"Preview & Launch"** → **"Launch to Students"**. Sharing by join link, code or QR. "On the invite screen, choose Google Classroom, select the class, add any instructions, then click **'Add to Google Classroom.'**" [O-doc] [10270055](https://help.schoolai.com/en/articles/10270055-integrate-and-use-google-classroom), [10280003](https://help.schoolai.com/en/articles/10280003-getting-students-into-spaces)
  - This is the best reference for Lectern's announcement step.

**Khanmigo**
- History: a student's page → **"Chat history"** tab. "Any interactions that were flagged by the moderation system will have a **red disclaimer** under them." [O-doc] [support.khanacademy.org 15127248640525](https://support.khanacademy.org/hc/en-us/articles/15127248640525-How-do-I-view-my-students-Khanmigo-chat-history)
- Teachers get an email and an in-app notification on each flag. [O-doc] [29473549307277](https://support.khanacademy.org/hc/en-us/articles/29473549307277-What-reports-does-Khan-Academy-offer-teachers-to-monitor-their-students-Khanmigo-use)
- **Focus mode:** temporarily disable Khanmigo "for some or all students for a specific amount of time" via Class → Settings → Khanmigo tab → **"Set focus mode"**, up to **4 hours**. It can be ended early. [O-doc] [23528906934797](https://support.khanacademy.org/hc/en-us/articles/23528906934797-How-can-I-temporarily-disable-Khanmigo-for-my-students-Is-there-a-Focus-Mode)
  - Lectern can borrow this as **"Pause during exam"** with a timer.
- When a student says "just tell me the answer": "I want to help you figure this out yourself. Let's start with what you already know." (third-party report) [kidsaitools review](https://www.kidsaitools.com/en/articles/khanmigo-review-2026)

**MagicSchool (MagicStudent rooms)**
- "Educators and district admins can view all student interactions in real time."
- Teachers can "pause, lock, or resume their rooms". [O-doc] [magicschool.ai/magicstudent](https://www.magicschool.ai/magicstudent), [privacy/quality](https://www.magicschool.ai/privacy/quality)

**Flint**
- Full student–AI transcripts; "teachers watch sessions live, spot who's stuck, and turn gaps into follow-up activities in one click". [O-doc] [flintk12.com/teachers](https://flintk12.com/teachers), [help 9126131](https://help.flintk12.com/en/articles/9126131-get-started-with-flint-for-teachers)

**Cogniti (University of Sydney; higher ed, teacher-built agents)**
- The "system message" is hidden from students. "Resources" are the grounding material.
- **Conversation history** (clock icon) is "a list of conversations, with the identity of the user(s) blanked out". Open a conversation with the speech-bubble icon.
- Student flags and ratings appear alongside, with any comments.
- **Insights** "provides an auto generated summary of what kinds of topics and questions your students have been asking". [O-doc] [cogniti.ai/docs/can-i-see…](https://cogniti.ai/docs/can-i-see-how-students-are-interacting-with-my-agent/), [cogniti.ai/docs/can-ai-help…](https://cogniti.ai/docs/can-ai-help-me-to-quickly-understand-what-students-are-asking-about/), [UofT guide](https://teaching.utoronto.ca/tool-guides/cogniti/)

**Ed Discussion Bots++** (relevant because Lectern ingests Ed answers)
- The bot responds to "nobody, students, or staff and students".
- **"Post as Staff Only"** "will create a queue of answers but won't post them until you, as the instructor, approve them".
- The default student disclaimer is editable. [O-doc] [help.canvas.yale.edu 1909054](https://help.canvas.yale.edu/a/1909054-ed-discussions-adding-an-ai-chatbot-with-bots), [UChicago](https://academictech.uchicago.edu/2025/09/03/ed-discussion-now-supports-an-ai-chatbot/)

**NotebookLM / Gemini in Classroom**
- "Chat-only" notebook sharing, "where users can't see or edit sources". Usage analytics are available with an AI Pro for Education licence. Notebooks and Gems can be assigned in Classroom. [O-doc] [workspaceupdates 2025/09](https://workspaceupdates.googleblog.com/2025/09/educators-create-gems-notebooks-google-classroom.html), [2025/08](https://workspaceupdates.googleblog.com/2025/08/notebooklm-is-now-available-to-all.html), [Classroom help](https://support.google.com/edu/classroom/answer/16534159)

---

## 7. What builds trust for a cautious professor (mapped to her three fears)

| Fear | Patterns that answer it (with source) |
|---|---|
| **"It will say wrong things in my name."** | Grounding only in approved sources, with citations on every answer (Fin inline sources [7120684](https://www.intercom.com/help/en/articles/7120684-fin-ai-agent-explained)). An "Event log" showing which sources and rules were used ([12599471](https://www.intercom.com/help/en/articles/12599471-use-fin-previews)). An explicit "I can't answer that from the course materials" fallback (Zendesk [10448933203994](https://support.zendesk.com/hc/en-us/articles/10448933203994-Customizing-the-Knowledge-reply-in-an-AI-agent-with-agentic-AI)). A correct-this-answer path (Fin "Improve answer"; Dify "Add annotation"; Ada "Provide coaching"). An AI disclosure label (Fin "AI Agent" label [11712008](https://www.intercom.com/help/en/articles/11712008-ai-agent-disclosure)). Immutable release snapshots (Sierra). |
| **"It will do their homework."** | Rules written as discrete, testable rows (Captain Guardrails; Fin Guidance). Preview that includes draft rules (Fin). Batch-test past questions with Good / Acceptable / Poor ratings (Fin [10521711](https://www.intercom.com/help/en/articles/10521711-batch-test-fin-ai-agent)). Natural-language monitors such as "asks for full solution" (Decagon Watchtower; Fin Monitors). Parallel-worked-example behaviour (PingPong screenshot). Scheduled source windows that keep solutions out until after a deadline (Fin [9459957](https://www.intercom.com/help/en/articles/9459957-enable-or-disable-content-for-fin-and-copilot)). Focus or pause mode during exams (Khanmigo). |
| **"It will add work for me."** | Clustered views rather than reading every chat (Fin Unresolved questions [8890980](https://www.intercom.com/help/en/articles/8890980-dig-into-fin-ai-agent-unresolved-questions); Topics Explorer [11390087](https://www.intercom.com/help/en/articles/11390087-use-the-topics-explorer-to-see-what-s-driving-volume); Cogniti Insights). A weekly AI digest email (PingPong Activity Summaries). Queues "ranked by customer demand", with an empty state "The review queue is clear" (Captain). A ready-to-post announcement and one-click LMS post (SchoolAI). Sensible defaults with example rules to "Add all" (Captain). |

**Recurring reassurance microcopy worth echoing:**
- "so changes happen on your terms" (Intercom)
- "Changes here apply only to this playground session unless you explicitly save an item." (Captain)
- "Answer ratings do not train Fin directly." (Intercom)
- "This thread will be visible to the moderation team and yourself." (PingPong)
- "This assistant isn't connected to any inbox yet, so it won't respond to conversations." (Captain)

---

## 8. Patterns Lectern should adopt

Each decision is traced to a reference. "[I]" marks where I adapted the reference rather than copying a measured value.

### Global structure
1. **Navigate by verbs, in this order: Sources · Rules · Preview · Questions · Go live.** This is Fin's Train / Test / Deploy / Analyze flywheel recast for a professor. [Intercom changes 86405](https://www.intercom.com/changes/en/86405-set-up-and-optimize-fin-easily-with-a-more-intuitive-fin-navigation); [help 10742658](https://www.intercom.com/help/en/articles/10742658-the-fin-flywheel)
2. **Persistent header with one global status switch: "Tutor is live" / "Tutor is off".** Show the state as words, not only a toggle colour, and add a "Pause until…" option with a timer. Fin hides off-control in Deploy (users ask "Help me turn off Fin"); Zendesk requires unpublishing channels; the education tools get this right (SchoolAI "Pause / End", Khanmigo "Set focus mode", up to 4 h). [community 10946](https://community.intercom.com/settings-security-permissions-22/help-me-turn-off-fin-10946), [Zendesk 10519557362202](https://support.zendesk.com/hc/en-us/articles/10519557362202-Turning-Zendesk-AI-features-on-or-off), [Khan 23528906934797](https://support.khanacademy.org/hc/en-us/articles/23528906934797-How-can-I-temporarily-disable-Khanmigo-for-my-students-Is-there-a-Focus-Mode), [SchoolAI 10270295](https://help.schoolai.com/en/articles/10270295-create-and-use-spaces-with-the-space-creator)
   - **Off-state banner in plain consequence language.** For example: "Your tutor is off, so students who open it will see a 'paused by your professor' message." Modelled on Captain's "This assistant isn't connected to any inbox yet, so it won't respond to conversations." [O-code] [integrations.json](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/i18n/locale/en/integrations.json)
3. **Explicit, confirmed go-live, separate from auto-saved edits.** Use a draft that auto-saves (GPT builder "Changes save to a draft automatically"), a "Publish changes" button that opens a confirmation listing what changes (Zendesk "Publish AI agent" → "Publish"), and version history with "Restore this version" (OpenAI). [ai-toolbox](https://www.ai-toolbox.co/chatgpt-management-and-productivity/chatgpt-custom-gpts-builder-guide-2026), [Zendesk 7232810932250](https://support.zendesk.com/hc/en-us/articles/7232810932250-Adding-and-removing-an-AI-agent-for-a-messaging-channel), [OpenAI 9083999](https://help.openai.com/en/articles/9083999-how-do-i-view-version-history)
4. **Use one quiet neutral palette and reserve a single accent for "AI / live".** Intercom keeps charcoal `#111111` as primary and spends Fin Orange `#ff5600` only on AI moments; cards are white on a warm canvas with hairline borders `#d3cec6`, not shadows. For Lectern, keep the accent for the live switch and AI badges only. [O-3p] [awesome-design-md/intercom](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/intercom/DESIGN.md)
5. **Typography: Inter for UI at 14px body / 12px meta with tabular numerals, plus one serif for page titles.** Inter is the recommended free stand-in for Intercom's Saans 500. PingPong pairs Inter with STIX Two Text serif headings for an academic feel (screenshot shows serif "Edit assistant"). Avoid ambiguous numerals: Intercom reverted a font whose zeros "look very similar to 8s". [O-3p] awesome-design-md/intercom; [O-code] [PingPong tailwind](https://github.com/comppolicylab/pingpong/blob/main/web/pingpong/tailwind.config.js); [community 8933](https://community.intercom.com/intercom-community-27/intercom-inbox-new-font-8933)
6. **Radii and surfaces: 8px buttons and inputs, 12px cards, 1px outline in place of a drop shadow.** Matches Intercom's 8/12 scale [O-3p] and Captain's `rounded-xl` plus `outline` CardLayout. [O-code] [CardLayout.vue](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/components-next/CardLayout.vue)

### Screen 1: Sources
7. **Every source is a row with an approve/exclude toggle at the right edge and a status read as dot plus word.**
   - Columns: Name (file-type icon + title) · Type · Pages/words · **Used in N answers** · Added · Status · toggle · ⋯.
   - Status words: **"Approved"** (green), **"Excluded"** (grey), **"Processing…"** (amber spinner), **"Couldn't read file"** (red, with inline "Retry").
   - Status as an icon plus word, not a pill, with amber for in-progress and red for failed: Captain DocumentSyncStatus. [O-code] [DocumentSyncStatus.vue](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/components-next/captain/assistant/DocumentSyncStatus.vue)
   - Layout: Dify's documents table (toggle in ACTION column, "Available / Disabled / Archived", "RETRIEVAL COUNT"). [O-shot] `a-dify-manage-knowledge-documents.png`
   - Ada also puts an "Active" toggle beside each article. [docs.ada.cx article-management](https://docs.ada.cx/docs/knowledge/article-management)
   - Row height about 40–44px, 14px title / 12px muted meta [I, adapted from Dify ≈34px rows and Captain text-base/text-sm].
8. **New sources start "Pending review", never auto-approved.** Show a counter at the top, "6 sources waiting for your review", with **Approve / Exclude** buttons per row. Modelled on Captain FAQs (pending until "Approve"; "{count} suggestions to review"; empty state "The review queue is clear") and Ed Bots++ "Post as Staff Only" queue. [O-code] [ResponseCard.vue](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/components-next/captain/assistant/ResponseCard.vue); [Yale Bots++](https://help.canvas.yale.edu/a/1909054-ed-discussions-adding-an-ai-chatbot-with-bots)
9. **Floating bulk-action bar at bottom centre on selection:** "N selected · Approve · Exclude · Schedule… · Remove · Cancel". Layout from Dify [O-shot]; verbs from Intercom's "Change AI Agent state" bulk menu and Ada's "Set as active / Set as inactive". [help 9459957](https://www.intercom.com/help/en/articles/9459957-enable-or-disable-content-for-fin-and-copilot), [Ada](https://docs.ada.cx/docs/knowledge/article-management)
10. **Per-source availability window**, e.g. "Available to the tutor from Oct 20, 5:00 pm" for exam solutions. This is Intercom's scheduled Fin availability with start/end date, time and timezone. [help 9459957](https://www.intercom.com/help/en/articles/9459957-enable-or-disable-content-for-fin-and-copilot)
11. **Source-type tabs or filters: Lectures · Slides · Syllabus · Past exams · Ed answers**, plus a status filter "All / Pending / Approved / Excluded / Problems". Pattern from Captain's source and status filters, and Intercom's "Display columns" and filters. [O-code] integrations.json; [help 9459991](https://www.intercom.com/help/en/articles/9459991-search-filter-and-find-content-and-take-bulk-actions)
12. **Capacity and coverage strip above the list**, e.g. "41 of 48 sources approved · 86% of lectures covered". Modelled on Claude Projects' "1% of project capacity used" bar and Captain's "Knowledge coverage {pct}% approved". [ai-toolbox Claude guide](https://www.ai-toolbox.co/claude-management-and-productivity/how-to-use-claude-projects-guide-2026); [O-code] integrations.json
13. **Honest consequence text next to sensitive controls**, e.g. under Past exams: "Students may see passages from approved files quoted in answers." Modelled on the GPT builder's "conversations with your GPT may include file contents" and Intercom's note that documents are "a private source … customers will not see any link references". [medium](https://michael-wahl.medium.com/openai-my-custom-gpts-accessing-my-knowledge-file-s-67d409c0eee0); [help 8124534](https://www.intercom.com/help/en/articles/8124534-upload-and-manage-documents)

### Screen 2: Rules
14. **Rules are discrete one-line rows grouped by category, not one giant prompt box.**
    - Categories: **Academic integrity · Notation & terms · Tone · Sources · When to send students to staff**.
    - Each row: rule text 14px, an on/off toggle, edit and delete icons separated by a 1px divider.
    - Categories adapted from Fin Guidance's Communication style / Context and clarification / Content and sources / Other. [help 10210126](https://www.intercom.com/help/en/articles/10210126-provide-fin-ai-agent-with-specific-guidance)
    - Row anatomy from Captain RuleCard. [O-code] [RuleCard.vue](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/components-next/captain/assistant/RuleCard.vue)
15. **Ship recommended starter rules with "Add all" / "Add this".** Examples: "Never give final answers to problem-set questions; give a hint or a parallel worked example instead." "Use the notation from my lecture slides." Pattern from Captain's "Example guardrails" (Add all / Add this / Test all). The parallel-example behaviour is observed in PingPong's AI Tutor. [O-code] integrations.json; [O-shot] `a-pingpong-homework_problems.png`
16. **Rule-writing helper drawn from Fin's best practices**: one objective per rule, if/when/then, address the tutor as "you", a soft cap of ~2,500 characters per rule. Show a ✅/❌ example under the input. [help 10560969](https://www.intercom.com/help/en/articles/10560969-fin-guidance-best-practices)
17. **Rule states: Draft / On / Off**, and drafts can be tried in Preview before turning on. Intercom includes "draft, paused, and live" guidance in Preview; its buttons are "Enable" / "Save and Enable". [help 10210126](https://www.intercom.com/help/en/articles/10210126-provide-fin-ai-agent-with-specific-guidance)

### Screen 3: Preview
18. **Preview panel docked right, about 400–480px, alongside Sources and Rules, so edits and test sit side by side.**
    - GPT builder: Configure left / Preview right. [zapier](https://zapier.com/blog/custom-chatgpt/)
    - Fin: Preview panel beside the guidance editor. [help 12599471](https://www.intercom.com/help/en/articles/12599471-use-fin-previews)
    - Captain: right drawer `w-[36rem]` with `border-s`. [O-code] [AssistantPlayground.vue](https://github.com/chatwoot/chatwoot/blob/develop/app/javascript/dashboard/components-next/captain/assistant/AssistantPlayground.vue)
    - The 400–480px width [I] is narrower than Captain's 576px because Lectern's editor is the primary surface.
19. **Two preview tabs: "Student view" | "Why this answer".** The second lists the sources cited (with page or slide), the rules applied, and draft-vs-live state. This is Fin's "Customer view" / "Event log" plus Captain's "Run details · Handled by". [help 12599471](https://www.intercom.com/help/en/articles/12599471-use-fin-previews); [O-code] integrations.json
20. **Preview footnote: "Preview chats aren't seen by students and don't appear in your question log."** Intercom's preview conversations are "excluded from reporting"; Captain's footnote pattern is "Messages sent here will count toward your Captain credits." [help 14077180](https://www.intercom.com/help/en/articles/14077180-simulations-vs-batch-tests-vs-previews); [O-code] AssistantPlayground.vue
21. **"Test with last term's questions" batch run.** Pull 20 real Ed questions, show tutor answers side by side, and let her rate each **Good / Acceptable / Poor**, with Poor reasons such as "Used wrong source", "Gave away the answer", "Wrong notation", "Too long". Adapted from Fin Batch test (≤50 questions, Good/Acceptable/Poor, reason list). [help 10521711](https://www.intercom.com/help/en/articles/10521711-batch-test-fin-ai-agent)
22. **"Send preview link to a TA"** for a second pair of eyes before launch. From Ada Interactive Testing ("share test URLs with stakeholders"). [docs.ada.cx interactive-testing](https://docs.ada.cx/docs/optimization/testing/interactive-testing)

### Screen 4: Question log and topics
23. **Log as a table, one row per student question.**
    - Columns: Time · Question (first line, clamped) · Answer status · Sources cited · Student rating · **Your review**.
    - Answer status chips: **"Answered from your materials"**, **"Couldn't answer"**, **"Sent to staff"**, **"Flagged by student"**.
    - Default to de-identified students, with a reveal for authorised staff.
    - Pattern sources: Dify Logs (title from first message; separate "User Rate" vs "Op. Rate"), Fin outcomes (resolved / routed to team), Cogniti de-identified history with student flags, PingPong "(anonymized)". [dify logs.mdx](https://github.com/langgenius/dify-docs/blob/main/en/cloud/use-dify/monitor/logs.mdx); [help 8205718](https://www.intercom.com/help/en/articles/8205718-fin-ai-agent-outcomes); [Cogniti](https://cogniti.ai/docs/can-i-see-how-students-are-interacting-with-my-agent/); [O-code] PingPong manage page
24. **Hover actions on each AI answer: 👍 / 👎 (with reason), "Correct this answer", "Show sources".** "Correct this answer" saves her wording as an approved answer reused for similar questions. Pattern from Fin "Improve answer", Dify "Add annotation" (curated answer returned "instead of generating new responses"), Ada "Provide coaching" on hover. [help 9790492](https://www.intercom.com/help/en/articles/9790492-top-ten-ways-to-optimize-fin); [O-shot] `a-dify-add-annotation-icon.png`; [dify annotation-reply.mdx](https://github.com/langgenius/dify-docs/blob/main/en/cloud/use-dify/monitor/annotation-reply.mdx); [Ada coaching](https://docs.ada.cx/docs/optimization/coaching/coaching-tools)
25. **Topics view: ranked list of clusters (title, question count, % couldn't-answer, trend sparkline); click a cluster to open its questions in a side panel.**
    - Ranked list and side panel from Fin "Unresolved questions" (grouped clusters with volume, abandoned, routed counts; group click → side panel). [help 8890980](https://www.intercom.com/help/en/articles/8890980-dig-into-fin-ai-agent-unresolved-questions)
    - Optional treemap (size = volume, colour = confusion rate) with small-multiple trend lines, from the Topics Explorer. [help 11390087](https://www.intercom.com/help/en/articles/11390087-use-the-topics-explorer-to-see-what-s-driving-volume)
    - Captain's "Ranked by customer demand" ordering. [O-code]
26. **Plain-English hint on every metric; no "assumed resolution".** Example: "Answered from your materials: questions where the tutor cited at least one approved source." From Captain metric hints and the backlash against Fin's "assumed resolved". [O-code] integrations.json; [community thread](https://community.intercom.com/ask-the-intercom-team-about-fin-54/fin-s-flawed-assumed-resolved-pricing-design-8929)
27. **Weekly digest email: "This week in your tutor"** with top three confusion clusters, flagged answers, and links. Opt-in checkbox. From PingPong "Send me weekly Activity Summaries" ("an AI-generated summary with relevant thread links … at the end of each week"), Cogniti Insights, SchoolAI post-session summaries. [O-code] PingPong manage page; [Cogniti insights](https://cogniti.ai/docs/can-ai-help-me-to-quickly-understand-what-students-are-asking-about/)
28. **Natural-language "watch for" flags**, e.g. "student asks for a full solution", "student seems distressed", "answer contradicts the syllabus". Flagged items surface at the top of the log. From Decagon Watchtower (plain-language criteria, clustered flags), Fin Monitors, SchoolAI alerts "at the top of the teacher's dashboard", Khanmigo flag emails. [decagon watchtower](https://decagon.ai/product/watchtower); [help 16295106](https://www.intercom.com/help/en/articles/16295106-using-monitors-to-find-and-fix-fin-answer-issues); [SchoolAI](https://schoolai.com/blog/how-schoolai-protects-students-with-real-time-safety-monitoring); [Khan](https://support.khanacademy.org/hc/en-us/articles/29473549307277-What-reports-does-Khan-Academy-offer-teachers-to-monitor-their-students-Khanmigo-use)

### Screens 5–6: Go live and announcement
29. **Go-live flow: "Preview" → "Go live" → announcement dialog**, which shows a ready-to-paste message with **Copy**, the link, and "Post to Canvas / Ed" options. The message states AI disclosure, that the tutor was built from her materials, what it won't do (solve problem sets), that she can read conversations, and how to reach staff.
    - From SchoolAI "Preview & Launch" → "Launch to Students" (join link, code, QR, "add any instructions" → "Add to Google Classroom"). [SchoolAI 10270055](https://help.schoolai.com/en/articles/10270055-integrate-and-use-google-classroom), [10280003](https://help.schoolai.com/en/articles/10280003-getting-students-into-spaces)
    - Fin's disclosure intro ("you're speaking with Fin AI Agent … you can ask for the team at any time"). [help 11712008](https://www.intercom.com/help/en/articles/11712008-ai-agent-disclosure)
    - PingPong's student notice. [O-shot]
30. **Student-side transparency line under the composer: "Your professor and course staff can read this conversation."** Adapted from PingPong's "This thread will be visible to the moderation team and yourself." [O-shot] `a-pingpong-chat_v2.png`; Ed Bots++ editable disclaimer. [Yale](https://help.canvas.yale.edu/a/1909054-ed-discussions-adding-an-ai-chatbot-with-bots)

---

## 9. Gaps and caveats

- **No Intercom, OpenAI, Decagon, Sierra, Zendesk or Ada screenshots were viewable**, because their CDNs and help centres were blocked by egress policy and Firecrawl had no credits. All Intercom layout claims are **[O-doc]** (their own help text). Pixel values for Intercom's in-app console are unverified.
  - Before high-fidelity design, open these Intercom help articles in a browser to confirm row and chip visuals: 9440354, 9459957, 12599471, 11390087, 8890980.
- Intercom colours and fonts are from a **third-party extraction of the marketing site**, not the app.
- Search budget ran out before I could confirm: the GPT builder's exact pane proportions; MagicSchool's exact status labels (only "pause, lock, or resume" is documented); and whether Google now shows teachers students' Gem/NotebookLM chats.
- The PingPong, Chatwoot and Dify values are fully verifiable at the linked file paths (clones in `scratchpad/research/a-pingpong`, `a-chatwoot`, `a-difydocs`; raw notes in `a-notes.md`).
