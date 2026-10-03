# D. Academic vernacular & existing tools — research for "Lectern"

Prepared 2026-10-03. Persona: senior lecturer, 230-student intro chemistry lecture, 6 teaching fellows (TFs), MWF lectures, problem set due every Friday, lectures recorded and posted on Canvas, ~400 Ed Discussion posts per semester.

---

## 0. Method and limits (read first)

- **Network egress was heavily restricted.** Direct `curl`/WebFetch to edstem.org, canvashelp.stanford.edu, ocw.mit.edu, cs50.harvard.edu, insidehighered.com, tytonpartners.com, educause.edu, arxiv.org, archive.org, and all `*.github.io` sites was **blocked by the egress proxy (HTTP 403 on CONNECT)**. Firecrawl returned "insufficient credits" (the connected Firecrawl account needs more credits). The session's WebSearch budget (200 calls, shared across this session) was used up near the end.
- **What worked:** (a) WebSearch result excerpts, (b) `raw.githubusercontent.com` plus GitHub code search, which turned up primary material: Berkeley CS 61B/61BL's Ed guide **with its original Ed screenshots**, real Ed announcement JSON from a Fall 2025 Berkeley course, MIT OCW 5.111 lecture transcripts (WebVTT), CS50's own docs repo, and reverse-engineered Ed API docs.
- **Labels used below.** **[fetched]** means I read the primary file myself. **[excerpt]** means the text comes from a WebSearch result excerpt of the cited page, which I could not open directly. Treat [excerpt] quotes as "very likely verbatim, but verify before you publish." **[pattern]** means a URL built from a known site pattern that I did not open in this session.
- **Screenshots** (all opened and viewed with the Read tool) are in `scratchpad/research/shots/`, named `d-cs61bl-*.png`. Source: https://raw.githubusercontent.com/cs61bl/su24/main/guides/ed/ (the images in UC Berkeley CS 61BL's "An Ed Guide for New Users", https://raw.githubusercontent.com/cs61bl/su24/main/guides/ed/ed-guide.md). The same images are still used in the Summer 2026 version of the guide (https://raw.githubusercontent.com/cs61bl/su26/main/resources/using-ed.md). They show the classic Ed UI. Ed's 2024–26 UI may differ in chrome color and font, but the structure (three panes, pills, badges, endorsements) is the same as every 2024–25 university guide describes.

---

## 1. Ed Discussion (edstem.org)

### 1.1 Thread types, roles, and the Announcement flow

| Fact | Source |
|---|---|
| Three thread types: **Question**, **Post**, **Announcement**. The composer shows them as three large toggle tiles across the top: "? Question", "Post" (speech-bubble icon), "Announcement" (megaphone icon). | Screenshot `d-cs61bl-categories.png` [fetched]; Wharton/UCI/Yale guides [excerpt]: https://support.wharton.upenn.edu/help/ed-discussion-for-faculty, https://edtechtools.eee.uci.edu/ed-discussion-getting-started-for-instructors/, https://help.canvas.yale.edu/a/1452322-ed-discussion-creating-and-managing-threads |
| "Students will not see the Announcement option, as this is teaching team only. An Announcement is the same as a Post, but with the option to email the students about the new thread." Student posts default to **Question**, staff posts to **Post**. | [excerpt] same guides as above |
| Steps to post a welcome announcement: "click the New Thread button on the top left corner … then select the Announcement option … Enter a title … Click 'Post Announcement' once finished, and an email from notifications@edstem.org will be sent to all members who are enrolled." | [excerpt] search results that surfaced Columbia CTL (https://ctl.columbia.edu/resources-and-technology/teaching-with-technology/teaching-online/ed-discussion/), Swarthmore KB (https://swatkb.atlassian.net/wiki/spaces/SW/pages/20775794), Stanford (https://canvashelp.stanford.edu/hc/en-us/articles/4402081717011-Getting-Started-with-Ed-Discussion). I could not tell which of these pages the sentence came from. |
| "When you are finished editing, use the 'Preview' button to check the content and format of the post in a preview window before officially posting to the class." | [excerpt] same set |
| Thread `type` values in the API are exactly `announcement`, `question`, `post`. Live sample from two 2026 courses: 7 announcements, 10 posts, 33 questions in 50 threads, and 6/2/15 in 23. | [fetched] https://raw.githubusercontent.com/Skooyo/Attendance_Crawler/main/.wayfinder/research/ed-unread-and-role-fields.md |
| Course roles enum: `student`, `mentor`, `tutor`, `staff`, `admin`. Courses can relabel these (`course.settings.role_labels`). In live data, staff often appear as `admin`. | [fetched] same file, plus https://raw.githubusercontent.com/smartspot2/edapi/master/docs/api_docs.md |
| "TAs are automatically assigned the Admin role … you can upgrade your TA's role by clicking Staff (TA) and choosing Admin (Instructor)." | [excerpt] Yale "Setting Up Your Course" https://help.canvas.yale.edu/a/1451264-ed-discussion-setting-up-your-course |
| Thread flags: `is_pinned`, `is_private`, `is_anonymous`, `is_megathread`, `anonymous_comments`, `is_endorsed`, `is_answered`, `is_staff_answered`, `is_student_answered`, `is_locked`, `pinned_at`, `view_count`, `unique_view_count`, `vote_count`, `reply_count`, `number` (the course-local "#" shown in the UI). Course setting `full_announcement_emails` exists. | [fetched] edapi docs (above) and Skooyo note |
| Deep-link pattern: `https://edstem.org/us/courses/{course_id}/discussion/{thread_id}` | [fetched] real announcement JSON, e.g. https://raw.githubusercontent.com/andyzorigin/extra/main/ed_posts/detailed_posts/post_0406_7395242.json |

### 1.2 Categories, subcategories, pinning, endorsing, anonymity

- **Categories** are folders the instructor defines. "You can optionally add subcategories (for example, Category is Homework, subcategories can be Homework 1, Homework 2, etc.), and when subcategories are present, users must select both a category and subcategory. There is a limit of up to 2 levels of nesting." The category editor is a text field with one category per line, and "you can use the TAB key … to specify subcategories." [excerpt] Stanford / Wharton / NYU Steinhardt / Yale / Dartmouth guides (https://canvashelp.stanford.edu/hc/en-us/articles/4402081717011-Getting-Started-with-Ed-Discussion, https://technology.steinhardt.nyu.edu/hc/en-us/articles/16637243925403-Discussion-Q-A-Ed-Discussion, https://services.dartmouth.edu/TDClient/1806/Portal/KB/ArticleDet?ID=136531)
- **Real category sets.** From the composer screenshot: **General, Lectures, Sections, Problem Sets, Midterm, Final**, with subcategories **Pset 1, Pset 2** (`d-cs61bl-categories.png`). Another real course used General, GitBug, Lab Swap, Lectures, Labs, Quizzes, Projects, Exams (`d-cs61bl-landing-page.png`). A Fall 2025 Berkeley course filed its announcements under **"Admin"** (post_0406 JSON above). [fetched]
- **Display format.** Category and subcategory join with a spaced en dash: "Problem Sets – Pset 2", "Quizzes – Quiz10", "Exams – Final", "Projects – 2A: HeapPQ". [fetched] screenshots
- **Pinning.** Pinned threads collect in a **"Pinned"** group at the top of the thread list (purple pushpin icon), with a "Show N more" link. "All important announcements and index posts will be **pinned**." [fetched] CS61BL guide and `d-cs61bl-landing-page.png`
- **Endorse.** Only staff can endorse. An endorsed answer gets a pill labelled **ENDORSED** with a blue ribbon icon, in the top right of the answer. The action row then reads "Comment Edit Delete **Unendorse** •••". [fetched] `d-cs61bl-answered.png`. Guides call it "a blue ribbon on the post/comment" [excerpt, Wharton].
- **Accepted answer.** A green check (one per question). "When a staff member answers a question, it is automatically marked with a green checkmark." [fetched] CS61BL guide
- **Staff badges.** Small yellow capsule badges, **INSTRUCTOR** or **TA**, all caps, placed right after the name. Courses can relabel roles; Harvard courses typically say TF. [fetched] screenshots
- **Anonymous.** The thread list shows the author as "Anonymous". In comments, anonymous students get an animal pseudonym, e.g. **"Anonymous Okapi"**, shown in purple with a grey silhouette avatar. Students can post anonymously or privately (visible to staff only). Private threads get a grey **PRIVATE** pill. [fetched] CS61BL guide, `d-cs61bl-megathread.png`
- **Megathreads.** Top-level comments carry **Resolved** (green, with a check) or **Unresolved** (navy outline) pills. Comments can be sorted "by Unresolved"/"Top". [fetched] `d-cs61bl-megathread.png`
- **Search/filter list.** All, Unread, New Replies, Unanswered, Unresolved, Endorsed, Starred, Private, Public, Staff, Mine, plus Category and a Date From/To range. [fetched] `d-cs61bl-ed-search.png`
- **Composer toolbar.** Text-type dropdown, B/I/U, inline code, link, bullet and numbered lists, image, video, attach file, LaTeX (inline `$…$` works), runnable code snippet (with Line Numbers / Runnable checkboxes), web snippet, draw, **Preview**. [fetched] CS61BL guide
- **Body format (useful for a "copy to Ed" button).** Ed stores bodies as XML: `<document version="2.0">` containing `<heading level="1-3">`, `<paragraph>`, `<bold>`, `<italic>`, `<underline>`, `<math>` (LaTeX), `<link href>`, `<list style="bullet|number">`/`<list-item>`, **`<callout type="success|info|warning|error">`**, `<code>`, `<pre>`, `<snippet language runnable>`, `<spoiler>`, `<figure><image src width height>`, `<file url>`, `<break/>`. [fetched] edapi docs. Real announcements also use `<blockquote>` [fetched] post_0378 JSON.

### 1.3 Layout, colors, type (measured from screenshots)

Pixel colors were sampled with Pillow from the CS61BL screenshots [fetched]. They describe the classic Ed theme.

| Element | Observed |
|---|---|
| Top bar | Solid purple `#5a418c`, white "ed" wordmark, then "CS 61BL – Discussion" in white. The search overlay shows a darker purple. |
| Left sidebar (white) | Blue **New Thread** button `#096ff4` (pencil icon). Grey uppercase section labels `#757575` ("COURSES", "CATEGORIES"). Selected course row has a pale blue background `#e5f0ff` with blue text and an unread count in blue. Each category has a small colored square. |
| Category colors (flat-UI palette) | General `#3498db`, (2nd) `#2ecc71`, (3rd) `#f1c40f`, Lectures `#e74c3c`, Labs `#9b59b6`, Quizzes `#50d7ce`, Projects `#f39c12`, Exams `#1abc9c` |
| Category pills in composer | Pastel fill with darker text and a light border: General `#eff7fc`/`#246a99`; Lectures `#effbf4`/`#208e4f`; Sections `#fefaec`/`#a8890a`; Problem Sets `#fdf1f0`/`#a1352a`; Midterm `#f7f2f9`/`#6c3e7f`; Final `#f1fcfb`/`#389690`. Selected pill gets a 2-px blue ring `#7fb6fd`. Subcategory pills are white with a `#e5e5e5` border. |
| Type tiles in composer | Selected Question tile: `#f8e9f8` fill, `#6a166a` text. Unselected Post/Announcement tiles: `#f8f8f8` fill, `#222` text. |
| Thread list row | Unread blue dot `#0080ff`; type icon (? or megaphone); title `#222` (~17px); second line has the category in its color (bold), the author in `#222`, a role badge, relative time ("43m", "1d", "2d") in grey. Right side: heart count, comment count, green check `#28dc28` when answered. Group headers on a `#fafafa` band: **Pinned**, **This Week**. Row dividers `#eeeeee`. |
| Thread view header | Large title (~36–40px, `#222`, regular weight). Colored circle avatar with a white initial. Author name in red-orange `#dd3919`, then a yellow role badge (`#ffed99` fill, `#332f1f` text, all caps, ~11px). Meta line: "a minute ago in **Problem Sets – Pset 2**" (time `#757575`, category in category color, e.g. `#e74e43`). Right side: icon+label columns **PIN · STAR · WATCH(ING) · N VIEWS** in grey `#888`. WATCHING turns blue `#0072f7`. |
| Thread view body | Outline heart in the left gutter (`#ef9b9d`; filled `#df3333` with a count). Body text `#222`, ~16px. Action row "Comment Edit Delete Endorse •••" in `#757575`. "Add comment" input with a `#ddd` border and a speech-bubble icon. Answers section header reads "**2 Answers**". |
| Badges/pills | ENDORSED: `#e5f2fe` fill, `#0084f5` text + ribbon. Resolved: `#008515`. Unresolved: `#0b489c` outline. PRIVATE: `#ececec` fill, `#444` text. Anonymous name: `#881fd9`. |
| Font | A humanist sans that looks like Open Sans in the screenshots. **Unverified**: I could not inspect Ed's CSS. |

### 1.4 What real Ed announcements read like (corpus: Berkeley CS 182, Fall 2025, course 84647)

Primary JSON exports of real announcements [fetched], e.g. https://raw.githubusercontent.com/andyzorigin/extra/main/ed_posts/detailed_posts/post_0273_7293506.json, post_0002_6886970, post_0249_7269940, post_0250_7273818, post_0251_7275838, post_0294_7328421, post_0306_7350819, post_0378_7384785, post_0406_7395242, post_0496_7412221 (same directory).

- **Titles, verbatim:** "Office Hours Now" · "Tuesday 2-3pm OH Today" · "JupyterHub Compute Tutorial" · "New: JupyterHub Compute Portal Now Available" · "Update: Compute Portal Time Slots Removed" · "Reminder to sign up for Tinker" · "Tinker access for final projects --- Opt-in deadline Nov 7 at 10 am." · "IMPORTANT: Students must accept the reviewer invitation email..." · "Compute Portal Storage Update 12/4" · "Extra Credit Update".
  - **Pattern:** Title Case, 3–9 words. An optional prefix (**New:**, **Update:**, **IMPORTANT:**, **Reminder**) and/or a date or deadline in the title.
- **Length:** from one line ("Office Hours now in 400 Cory!") to about 350 words. Typical feature launches run 120–250 words.
- **Openers:** "Hi everyone," / "Dear students,". **Sign-offs:** "Best,⏎Alex" / "Thanks,⏎182 Staff". Signatures are a first name or "<course> Staff".
- **Formatting:** short paragraphs; **bold lead-in labels** ("**How to access:**", "**What you get:**", "**Compute options:**", "**Group assignments:**"); bullet lists; bare URLs pasted as links; sparing emoji (🎉, 👍). Transparent tone ("To be fully transparent, the resources we received came with very minimal infrastructure…"). Explicit asks ("If you run into issues or have questions, reply in the thread below…").
- **Email is used sparingly:** "We don't typically send out email notifications for Ed Posts. But given the timelines involved and the risk to students, we made an exception in this case." (post_0306) [fetched]
- **Metadata:** announcements are usually pinned (`is_pinned: true`). One got 1,430 views (post_0406).

### 1.5 How students title questions on Ed (verbatim from screenshots)

"Do Grades Get Rounded Up?" · "redemption quiz12" · "Su19 Final Question 1c" · "Selection Sort" · "Guerilla worksheet and solutions" · "runtime analysis mt1 su19 #5" · "runtime analysis - recursion questions" · "Runtime Analysis Question" · "Confused on runtime analysis on Pset 2 problem 5". Bodies: "Can someone explain why the runtime is … my thought process was to …", "I thought it would be 3 since there is a 3 in the for-loop. Can someone clarify?" The most common author shown is "Anonymous". [fetched] `d-cs61bl-landing-page.png`, `d-cs61bl-ed-search.png`, `d-cs61bl-unanswered.png`

Etiquette norms courses publish: no "+1"/"me too" follow-ups (use the heart); no all-caps or clickbait titles; don't reply "nevermind, fixed" without saying how; search before posting; megathread per assignment. [fetched] https://raw.githubusercontent.com/cs61bl/su26/main/resources/using-ed.md

---

## 2. Lecture recordings, captions, and course naming conventions

### 2.1 Panopto / Canvas Studio / Zoom

- **Harvard:** "Panopto can be found on all FAS Canvas course websites … in the left-hand navigation." In-person recordings and Zoom recordings scheduled in Canvas "are processed and published in the course Panopto folder." Under FERPA, "students and alumni are unable to download or save lecture videos" and keep view-only access for up to 18 months after the course ends. [excerpt] https://atg.fas.harvard.edu/panopto, https://www.huit.harvard.edu/panopto, https://ess.fas.harvard.edu/teaching-learning/lecture-capture-and-class-recording/
- **Timestamp deep links:** append `&start=<seconds>` to the Panopto Viewer URL, e.g. `…/Panopto/Pages/Viewer.aspx?id=816a7666-…&start=30`. The viewer's Share dialog has a **"Start at"** checkbox next to Copy Link. [excerpt] https://confluence.uwf.edu/display/public/Sharing+a+Panopto+Recording+by+Direct+Link, https://ithelp.brown.edu/kb/articles/pdf/sharing-specific-starting-point-in-a-panopto-video, https://help.intech.arizona.edu/article/570-share-a-panopto-video
  - So "Lecture 9 at 23:14" maps to `&start=1394`.
- **Default session names:** "Panopto will provide by default the Day, Date, and Time of the session." If no one renames it, the date/time becomes the title. Folder names follow the term + course code + title, e.g. "Fall 2019 EDU 285 – V1 Instructional Design…". [excerpt] https://www.virginiawestern.edu/wp-content/uploads/2021/05/Panopto-Lecture-Capture-User-Guide.pdf, https://help.uis.cam.ac.uk/service/teaching-and-learning/lecture-capture/how-make-and-edit-recordings/schedule-lectures
  - Instructors usually rename sessions to "Lecture 09 – Orbitals" or similar.
- **Captions:** Panopto runs ASR on every recording. Instructors can import it as captions and edit them. Reported accuracy varies: "around 70% to 75%", "65–90%", "85–95%" depending on audio. Panopto exports SRT, VTT, DFXP and similar ("Actions ▸ Download .srt"). [excerpt] https://www.monash.edu/learning-teaching/teachhq/learning-technologies/panopto/how-to/use-captions-in-panopto, https://www.tcd.ie/itservices/vle/learning-technologies/panopto-lecture-capture/how-to-guides/captions/, https://teaching.pitt.edu/resources/how-to-add-captions-to-your-panopto-video/
- **Canvas Studio** adds auto-captions by default ("about 85% accurate and should be reviewed"). It also supports time-stamped comments on the media timeline. [excerpt] https://community.instructure.com/en/kb/articles/660518-how-do-i-add-auto-generated-captions-to-my-media-file-in-canvas-studio, https://it.semo.edu/TDClient/93/IT/KB/PrintArticle?ID=25127, https://www.umass.edu/ideas/news/bring-your-lectures-life-canvas-studio
- **Zoom cloud recordings** produce an "Audio Transcript" `.vtt` with timestamps and speaker labels, once it is enabled in the web portal's advanced cloud-recording settings. [excerpt] https://teamdynamix.umich.edu/TDClient/30/Portal/KB/Article/173/Zoom-Audio-Transcription-Captioning-for-Cloud-Recordings

### 2.2 What a real chemistry lecture transcript looks like (MIT 5.111, WebVTT) [fetched]

Source: https://raw.githubusercontent.com/e-caste/masters-thesis/master/datasets/subsets/mitocw_lectures_dataset/data/transcripts/Principles-of-Chemical-Science-Video-Lectures-LECTURE-19--CHEMICAL-EQUILIBRIUM.vtt (MIT OCW 5.111 Fall 2008, CC-licensed transcripts).

```
WEBVTT

00:01:40.190 --> 00:01:45.760
So I'm Kathy Drennan and this
is lecture 19 of 36, which

00:01:45.760 --> 00:01:49.170
means that you are halfway
through the course.
```

From the Lecture 20 (Le Chatelier) and Lecture 22 (Buffers) files in the same directory:

```
00:26:23.470 --> ...
We know that delta g nought is minus r t natural log of k, so

00:10:33.150 --> ...
What happens if we add an inert gas to a system

00:05:01.750 --> ...
value or p k a value.

00:06:14.930 --> ...
P k b is minus log of the k b.
```

**Implications for Lectern.** Notation in transcripts is spelled out: "delta g nought" = ΔG°, "q"/"k" = Q/K, "p k a" = pKₐ, "Cl minus" = Cl⁻, "kelvin to the minus 1" = K⁻¹. Retrieval needs a symbol↔spoken-form map. Citations should read "Lecture 19 · 26:23". Real lectures also start with logistics ("Pay attention to the clicker questions", "lecture 19 of 36"). The tutor should skip those when it quotes.

### 2.3 How lectures, slides, psets and exams are named in real intro chem courses

- **MIT 5.111SC (Fall 2014, Drennan):** 36 lectures in five units (I The Atom; II Chemical Bonding & Structure; III Thermodynamics & Chemical Equilibrium; IV Transition Metals & Oxidation-Reduction; V Chemical Kinetics). Each lecture page has video, notes, **clicker questions**, a reading assignment, and problems. [excerpt] https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/pages/syllabus/
  - Handout title style: **"5.111 Lecture Summary #18 Wednesday, October 22, 2014"** [excerpt] https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/ec12f084d867a5e5532b12ee99bdc767_MIT5_111F14_Lec18.pdf
  - File-name style: `MIT5_111F14_Lec18.pdf`, `mit5_111f14_lec16clkr` (clicker), `mit5_111f14_exam1equsheet` (exam equation sheet), `mit5_111f14_exam4sol`. [excerpt] https://www.ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/resources/mit5_111f14_exam1equsheet
  - "Students on the MIT campus complete nine problem sets"; four exams; textbook by Atkins. [excerpt] same syllabus
- **UC Irvine Chem 1A (OCW, Brindley):** lecture titles follow "**Chem 1A. Lec. 05. General Chemistry. Emission Spectra.**" Other lectures: Lec. 04 Wavelengths, Lec. 06 Quantum Numbers, Lec. 08 Chemical Bonds, Lec. 09 Breaking the Octet Rule, Lec. 12 Two Theories of Bonding, Lec. 14 Molecular Orbital Theory, Lec. 17 Review, Lec. 18 Gas Laws Part 1, Lec. 21 Kinetic Molecular Theory. Textbook: Tro, *Chemistry: Structure and Properties*. [excerpt] https://ocw.uci.edu/courses/chem_1a_general_chemistry.html, https://ocw.uci.edu/lectures/chem_1a_lec_05_general_chemistry_emission_spectra.html
- **Berkeley Chem 1A:** MWF lectures (9/11/1 in Pimentel Hall) plus a weekly GSI-led discussion "reviewing the previous week's material." Spring 2023/24: "13 problem sets; you will receive points for your best 10," uploaded to Gradescope by your discussion section. Another term used Aktiv online homework "due by 11:59pm on Monday evenings." [excerpt] https://classes.berkeley.edu/content/2025-fall-chem-1a-201-dis-201, https://www.coursehero.com/file/188988596/CHEM1A-Syllabus-Spring2023pdf/
- **Harvard LPS A:** "Weekly discussion sections are held with teaching fellows"; "Weekly problem sets review the topics covered in lectures and discussion sections"; weekly "**problem set sessions**, a gathering of students with teaching fellows and course assistants." [excerpt] https://scienceeducation.fas.harvard.edu/foundational-courses (exact source page uncertain)
- **Vernacular summary:** "Lecture 9", "L9", "PS3"/"Pset 3", "Problem 4b", "section" (Harvard) or "discussion" (Berkeley), "TF" (Harvard) or "GSI" (Berkeley) or "TA", "OH", "pset night"/"problem set session", "Midterm 1"/"Exam 1", "equation sheet", "clicker question", "practice exam", "solutions posted after the deadline", "Gradescope", "regrade request".

---

## 3. Real intro chemistry course structure

### 3.1 Topic sequence (consensus across MIT 5.111, UCI 1A, Berkeley 1A)

Berkeley 1A covers "stoichiometry of chemical reactions, quantum mechanical description of atoms, the elements and periodic table, chemical bonding, real and ideal gases, thermochemistry, introduction to thermodynamics and equilibrium, acid-base and solubility equilibria, introduction to oxidation-reduction reactions, and introduction to chemical kinetics." [excerpt] https://classes.berkeley.edu/content/2025-fall-chem-1a-201-dis-201

MIT 5.111 F14 lecture titles seen (transcript file names [fetched] plus OCW/infocobuild [excerpt], https://raw.githubusercontent.com/e-caste/masters-thesis/master/datasets/subsets/mitocw_lectures_dataset/data/transcripts/ and http://www.infocobuild.com/education/audio-video-courses/chemistry/5-111-fall2014-mitocw.html):

- **Unit I:** L1 The Importance of Chemical Principles; L2 Atomic Structure; L3 Wave-Particle Duality of Light; L4 Wave-Particle Duality of Matter/Schrödinger Equation; L5 Hydrogen Atom Energy Levels; L6 Hydrogen Atom Wavefunctions (Orbitals); L7 Multi-electron Atoms.
- **Unit II:** L8 Periodic Trends; L9 Periodic Table/Ionic and Covalent Bonds; L10 Introduction to Lewis Structures; L11 Lewis Structures/Breakdown of the Octet Rule; L12 Shapes of Molecules (VSEPR); L13 Molecular Orbital Theory; L14 Valence Bond Theory and Hybridization.
- **Unit III:** L18 Introduction to Chemical Equilibrium; L19 Le Chatelier's Principle; L20 Solubility and Acid-Base Equilibrium; L22 Salt Solutions and Buffers; L23 Acid-Base Titrations Part I.
- **Unit IV:** L25 Oxidation-Reduction and Electrochemical Cells; L27 Introduction to Transition Metals.
- **Unit V:** L31 Nuclear Chemistry and Chemical Kinetics; L32 Reaction Mechanisms; L34 Catalysts.

### 3.2 Textbooks commonly used

- Atkins (*Chemical Principles*) at MIT 5.111 [excerpt, syllabus above]
- Tro, *Chemistry: Structure and Properties*, at UCI [excerpt, above]
- Pearson+ (with "an AI tutor") at Utah [excerpt] https://class-tools.app.utah.edu/syllabus/1258/12200/CHEM+1210+Fall+2025+syllabus.pdf
- Free option: OpenStax *Chemistry 2e* (https://openstax.org/books/chemistry-2e/pages/1-5-measurement-uncertainty-accuracy-and-precision [excerpt]). Its standard chapter numbering is handy for fictional reading assignments: Ch 4 stoichiometry, Ch 5 thermochemistry, Ch 6 electronic structure, Ch 7 bonding/VSEPR, Ch 9 gases, Ch 13 equilibrium, Ch 14 acid–base, Ch 16 thermodynamics, Ch 17 electrochemistry, Ch 12 kinetics [pattern].

### 3.3 Real AI-policy language in 2023–2026 syllabi

- **Harvard OUE template, "maximally restrictive"** (also used verbatim in Harvard Extension CHEM E-17x, Fall 2023/2024):
  > "We expect that all work students submit for this course will be their own. In instances when collaborative work is assigned, we expect for the assignment to list all team members who participated. We specifically forbid the use of ChatGPT or any other generative artificial intelligence (AI) tools at all stages of the work process, including preliminary ones. Violations of this policy will be considered academic misconduct."
  
  [excerpt] https://www.thecrimson.com/article/2023/9/1/fas-ai-guidance/, https://oue.fas.harvard.edu/faculty-resources/generative-ai-guidance, https://harvard.simplesyllabus.com/en-US/syllabus/Fall%20Term%202024%20-%20Full%20Term/CHEM/E-17x/1
- **Harvard OUE template, "fully-encouraging":**
  > "…students to explore the use of generative artificial intelligence (GAI) tools such as ChatGPT for all assignments and assessments. Any such use must be appropriately acknowledged and cited. It is each student's responsibility to assess the validity and applicability of any GAI output that is submitted; you bear the final responsibility."
  
  The "mixed" template begins "Certain assignments in this course will permit or even encourage the use of generative artificial inte[lligence]…" (full text not retrieved). [excerpt] same sources
- **Univ. of Florida chemistry course (Fall 2025), paraphrased in the excerpt:** students "may use generative artificial intelligence (AI) tools—such as ChatGPT—as a tutoring resource to support their understanding of chemistry concepts, including reviewing content, asking clarifying questions, exploring alternative explanations, and practicing problems. However, all submitted assignments and quizzes must reflect the student's own original work, and generative AI must not be used to generate responses or solve problems that are submitted for a grade." [excerpt] https://undergrad.aa.ufl.edu/media/undergradaaufledu/gen-ed/ge-core-syllabi/ge-syllabi-2025/fall-2025/10843.pdf
- **Univ. of Utah CHEM 1210 (2025):** "the use of generative artificial intelligence (AI) tools without citation, documentation, or authorization is prohibited." One section explicitly authorizes **UBot, "a Socratic AI tutor"** as the exception. Spring 2025: "With one exception, students are not allowed to use AI tools, e.g. ChatGPT, to generate answers to ALEKS questions and problems." [excerpt] https://class-tools.app.utah.edu/syllabus/1258/12200/CHEM+1210+Fall+2025+syllabus.pdf, https://class-tools.app.utah.edu/syllabus/1258/12252/Fall+2025+CHEM+1210+Syllabus+7.23.2025+2.0.pdf, https://class-tools.app.utah.edu/syllabus/1254/9443/CHEM%201210%20spring%202025%20syllabus.pdf
  - This is the closest real analogue to Lectern: a course-sanctioned tutor carved out of a general ban.
- **Univ. of Tennessee CHEM 122 (Fall 2025, several sections):**
  > "In this course, it is expected that all submitted work is produced by the students themselves. Students must not seek the assistance of Generative AI Tools like ChatGPT. Use of a Generative AI Tool to complete an assignment constitutes academic dishonesty."
  
  [excerpt] https://chem.utk.edu/wp-content/uploads/2025/08/CHEM-122-003-Syllabus-Fall-2025.pdf
- **Berkeley Chem 1A (Fall 2025):** the syllabus has a "Use of AI" section stressing that one of a scientist's most important skills is "the ability to puzzle out how to get started on a problem, especially in situations where the best approach is not obvious at first glance." The co-instructor said "There probably isn't a one-size-fits-all policy." Of 36 Berkeley policies the Daily Cal collected, "almost 60%" allowed some AI use. [excerpt] https://data.dailycal.org/2026-01-05-syllabusai/

### 3.4 Notation conventions instructors care about

- **Significant figures** (OpenStax 1.5) [excerpt] https://openstax.org/books/chemistry-2e/pages/1-5-measurement-uncertainty-accuracy-and-precision:
  - Leading zeros are never significant; captive zeros always are; trailing zeros left of the decimal point are ambiguous.
  - Add/subtract: round to the fewest **decimal places**. Multiply/divide: round to the fewest **significant figures**.
  - Common instructor rule (not from OpenStax): don't round intermediate steps; for logs/pH, the digits after the decimal in pH equal the sig figs in [H⁺].
- **Standard state:** superscript degree (ΔH°, ΔS°, ΔG°) in US texts; IUPAC also allows the Plimsoll ⦵. [excerpt] http://goldbook.iupac.org/S05925.html, https://iupac.org/wp-content/uploads/2025/03/IUPAC-GB4Abridged.pdf. IUPAC style also attaches the reaction subscript: ΔrG°, ΔfH°.
- **ΔG° vs ΔG°′ (biochemical standard state, pH 7):** "the biochemical standard free energy change (ΔG°′) modifies the chemical standard state by setting the pH to 7." [excerpt] https://chem.libretexts.org/Courses/Fullerton_College/Introductory_Biochemistry/13:_Energy/13.01:_Basics_of_Energy, http://samples.jbpub.com/9780763763848/63848_ch01_p1_20.pdf
  - ΔG (any composition) vs ΔG° (standard) is itself a top confusion. Use ΔG = ΔG° + RT ln Q and ΔG° = −RT ln K (MIT transcript above).
- **Square brackets = molar concentration** ([H₃O⁺] in mol L⁻¹). K is written with activities, so **pure solids and liquids are omitted** (activity = 1) [pattern] https://openstax.org/books/chemistry-2e/pages/13-2-equilibrium-constants.
- **Units:** many instructors want kJ mol⁻¹ (or kJ/mol). Use R = 8.314 J mol⁻¹ K⁻¹ for energy but 0.08206 L atm mol⁻¹ K⁻¹ for PV = nRT. Temperatures in K. "Per mole of reaction" for ΔrH.
- **5% rule** for dropping x in ICE tables: valid if x/[HA]₀ × 100 ≤ 5%; otherwise solve the quadratic. [excerpt] https://chem-textbook.ucalgary.ca/version2/chapter-13-main/equilibrium-calculations/equilibrium-calculations-using-an-algebra-simplifying-assumption/, https://chemteam.info/AcidBase/five-percent-rule.html

### 3.5 Well-documented student difficulties (research basis for the question bank)

- **Limiting reagent:** "The majority of students (88%) had difficulties identifying the limiting reagent and … identif[ied] the limiting reagent as the one with the smallest mass." [excerpt] https://files.eric.ed.gov/fulltext/EJ1164987.pdf
  - Six major stoichiometry difficulties: mole concept, balancing, inconsistent ratios, limiting reagent, theoretical yield, excess reagent. [excerpt] https://www.ijese.com/article/examining-challenges-and-difficulties-students-face-in-learning-about-stoichiometry-in-general-17701
- **Le Chatelier misapplication:** a classic study tested 170 first-year university students and 40 teachers. Inert gas is a classic trap: "79% of students … believ[e] adding N₂(g) shifts equilibrium" (as reported in the excerpt). [excerpt] https://onlinelibrary.wiley.com/doi/abs/10.1002/tea.3660320906
- **Other recurring confusions** (instructor knowledge, consistent with the sources above): sig figs in logs; K vs Q direction; including solids/water in K; Hess's-law sign flips and multiplying ΔH; calorimetry sign (q_rxn = −q_soln); R units; quantum number allowed sets; Cr/Cu configurations; N vs O ionization energy; formal charge vs oxidation state; VSEPR electron vs molecular geometry; polarity of symmetric molecules; O₂ paramagnetism (MO); ΔG vs ΔG°; buffer ratio (moles vs concentration); Ksp with common ion; first-order half-life.

---

## 4. CS50's AI tutor (the "CS50 Duck", cs50.ai): exact wording

**Official docs** [fetched] https://raw.githubusercontent.com/cs50/cs50.readthedocs.io/main/cs50.ai.md (rendered at https://cs50.readthedocs.io/cs50.ai/):

> "CS50.ai is an adaptation of ChatGPT for students and teachers at cs50.ai; it's also built into Visual Studio Code for CS50 at cs50.dev. Otherwise known as the CS50 Duck, CS50.ai supports rubber duck debugging and is thus a "duck debugger," or `ddb` for short…"

> "Whereas ChatGPT itself is all too helpful nowadays—all too willing to provide outright answers to problems—CS50.ai is designed to behave more like a good tutor, leading students toward answers rather than spoiling them outright. It aspires to provide students with "office hours" 24/7, approximating a 1:1 student-to-teacher (well, student-to-duck) ratio."

> "Across CS50's courses, it is unreasonable (i.e., academically dishonest) to use AI-based software other than CS50's own (e.g., ChatGPT, Claude, Copilot, Gemini, et al.) that suggests or completes answers to questions or lines of code, except when explicitly allowed by a course. But it is reasonable to use CS50's own AI-based software, including the CS50 Duck in cs50.ai and cs50.dev."

**Syllabus "Reasonable / Not Reasonable" list items.** Quoted from https://cs50.harvard.edu/x/2026/honesty/ via a secondary GitHub note [fetched] https://raw.githubusercontent.com/Boyu-Zhang-UOI/Vibe_Coding_101/main/research/notes/university-courses.md:

- Reasonable: "Using CS50's own AI-based software, including the CS50 Duck (ddb) in cs50.ai and cs50.dev."
- Not reasonable: "Using AI-based software other than CS50's own (e.g., ChatGPT, Claude, Copilot, Gemini, et al.) that suggests or completes answers to questions or lines of code."
- The course's overall philosophy is "be reasonable." [excerpt] https://cs50.harvard.edu/college/2025/fall/syllabus/

**Lecture 0** slides 7–8 are titled "**Not Reasonable** — Using AI-based software other than CS50's own…" and "**Reasonable** — Using CS50's own AI-based software…" [fetched via code search] github.com/emowat/ai-teaching-assistant `raw_data/Harvard/cs50_lecture_text/lecture0.txt`. Lecture 0 notes:

> "Although AI-based software is very useful in many avenues of life and work, we stipulate that using AI-based software other than CS50's own is *not reasonable*. … CS50.ai is an AI helper that you can use during this course. It will help you, but not give away the entire answers to the course's problems."

[fetched via code search] mirror github.com/tamnd/cs50-i18n `content/en/x/notes/0.md` (of https://cs50.harvard.edu/x/notes/0/)

**SIGCSE 2024 paper**, Liu, Zenke, Liu, Holmes, Thornton & Malan, "Teaching CS50 with AI: Leveraging Generative Artificial Intelligence in Computer Science Education," SIGCSE 2024, pp. 750–756, https://doi.org/10.1145/3626252.3630938, PDF https://cs.harvard.edu/malan/publications/V1fp0567-liu.pdf:

- Deployed "to approximately 70 summer students, then to thousands of students online," then to roughly 500 on-campus students (Fall 2023). "The tools were received positively by students, who noted that they felt like they had 'a personal tutor.'" Goal: guide "students toward solutions rather than offer them outright." [excerpt]
- Rate limit: "each student starts with **10 hearts** and regains **one heart every three minutes**. Each interaction … consumes a heart," partly because "we are charged for each GPT-4 request." [quoted in secondary note, citing paper §4.4] https://raw.githubusercontent.com/canhta/ai-engineering-atlas/main/.scratch/research/ai-tutor-budgets.md
- Architecture (same note, §4.4/§4.6):
  - PII removed before prompting.
  - RAG over **lecture captions**.
  - A prompt-injection "guard."
  - The Duck answers on **Ed**, where "staff can endorse, amend, or delete Duck answers." Ed marks the endorsed ones. [excerpt]
- Outcomes reported by Harvard SEAS (Jan 2024): "75% of students using the tools frequently and 94% finding them helpful and effective"; "53% … 'loved' the AI tools, 33% 'liked' them, 13% were neutral, and only 1% 'disliked' them." [excerpt] https://seas.harvard.edu/news/2024/01/quacking-computer-programming
- SIGCSE TS 2025 follow-up: "approximately 211,000 students had used the duck, which has processed 10 million queries at an average cost of $1.50 per student per year." Moving from GPT-4 to GPT-4o raised code-block responses from 20% to 25%, which their TF-graded evals caught. [secondary note, citing] https://cs.harvard.edu/malan/publications/fp0627-liu.pdf
- Still in use in Fall 2026 under Henry Leitner during Malan's sabbatical. The Duck asks "more questions than it answers." [excerpt] https://news.harvard.edu/gazette/story/2026/09/taming-the-duck-for-starters/

**Are logs visible to instructors?** I found **no public CS50 statement that individual students' cs50.ai chat logs are visible to course staff.** What is published:
- PII is stripped before queries reach the model.
- Staff review, endorse, amend or delete the Duck's **Ed** answers.
- Future oral-exam transcripts would be reviewed by human staff (Harvard Magazine 2023, https://www.harvardmagazine.com/2023/08/ai-in-education [excerpt]).

**Opportunity for Lectern:** say plainly, up front, "your teaching staff can see the questions you ask here." CS50 doesn't.

**Replacement framing exists in the wild:** a Harvard Independent story ran as "Meet Your New TF: A Duck" (https://harvardindependent.com/cs50-ai/). Malan shared it as "CS50.ai: The duck could replace your TF." (https://www.linkedin.com/posts/malan_cs50ai-harvard-independent-activity-7121632933219590144-Zxek). [excerpt titles]

---

## 5. Faculty attitudes, 2024–2026 (numbers for trust copy)

| Survey | Key numbers | Source |
|---|---|---|
| **Elon Univ. / AAC&U, "The AI Challenge"** (released Jan 21 2026; 1,057 faculty; fielded Oct 29–Nov 26 2025; non-scientific) | **95%** say GenAI will increase student overreliance (75% "a lot"); **90%** say it will diminish critical thinking (66% "a lot"); **78%** say cheating on campus has increased (57% "a lot"); **33%** personally had "a lot" of integrity cases, **40%** "a few" | [excerpt] https://www.elon.edu/u/news/2026/01/21/elon-aacu-national-survey-95-of-college-faculty-fear-student-overreliance-on-ai/ · report https://imaginingthedigitalfuture.org/wp-content/uploads/2026/01/Elon-AACU-faculty-AI-survey-full-report-1-21-26.pdf |
| AAC&U newsroom (same survey) | **69%** of faculty address AI literacy topics, "such as bias, hallucinations, misinformation, privacy and ethics," in their teaching | [excerpt] https://www.aacu.org/newsroom/national-survey-95-of-college-faculty-fear-student-overreliance-on-ai-and-diminished-critical-thinking-among-learners-who-use-generative-ai-tools |
| **Tyton Partners, Time for Class 2025** | Instructors using GenAI daily/weekly: **30%** (from 4% in spring 2023); students 42%, admins 40%. **36%** of daily users report a marked workload decrease, while "less frequent users say monitoring for improper AI use increases their workload." Faculty are open to GenAI for academic support (**66%**) and study habits (**63%**). **58%** of faculty say teaching students to use AI is their or their institution's responsibility. | [excerpt] https://www.d2l.com/newsroom/tyton_partners_report_examines_ai_in_higher_education/ · PDF https://4213961.fs1.hubspotusercontent-na1.net/hubfs/4213961/Publications/Time%20for%20Class/Tyton%20Partners_Time%20for%20Class%202025.pdf · https://www.insidehighered.com/news/student-success/academic-life/2025/06/11/65-percent-students-use-gen-ai-chat-bot-weekly |
| Tyton Partners 2024 | **34%** of instructors say GenAI **increased** their workload (integrity monitoring, assessment redesign). **77%** of non-users vs 60% of users expect new plagiarism challenges. 29% of instructors vs 17% of students think students turn to GenAI when struggling. | [excerpt; exact report page not isolated] https://tytonpartners.com/racing-forward-bridging-the-gap-between-generative-ai-proficiency-and-educational-practice/ |
| Tyton Time for Class 2026 | Faculty perceive student cheating as "higher than it's ever been in the history of this survey" | [excerpt] https://www.everylearnereverywhere.org/blog/time-for-class-2026-highlights-the-intersection-of-ai-integrated-assessment-and-student-engagement/ |
| **Digital Education Council Global AI Faculty Survey 2025** (1,681 faculty, 52 institutions, 28 countries) | **83%** concerned about students' ability to critically evaluate AI output; 61% have used AI in teaching, but 88% of those only minimally; 40% "just beginning" their AI-literacy journey | [excerpt] https://www.digitaleducationcouncil.com/dec-insights/what-faculty-want-key-results-from-the-global-ai-faculty-survey-2025 |
| **EDUCAUSE 2025 AI Landscape Study** | Most-cited urgent risks: increased misinformation (**55%**), use of data without consent (**52%**), loss of fundamental independent-thought skills (**51%**). Academic integrity is the top teaching-and-learning focus (**74%**). 68% say students use AI more than faculty. | [excerpt] https://librarylearningspace.com/educause-releases-2025-ai-landscape-study/ |
| **Inside Higher Ed provosts survey 2025** (478 provosts, June–July 2025) | Majority see AI as a moderate or serious academic-integrity risk; nearly 9 in 10 say faculty are engaged in AI discussions; only ~14% report a comprehensive AI policy | [excerpt] https://www.insidehighered.com/news/faculty-issues/academic-freedom/2025/09/16/survey-provosts-focused-funding-cuts-academic |
| **AAUP, "Artificial Intelligence and Academic Professions"** (July 2025; ~500 members, ~200 campuses) | Concerns: workload, **surveillance**, threats to academic freedom, demands for **transparency and the ability to opt out**. Press summaries report large shares saying AI worsened classroom environments and job enthusiasm. **Verify exact %s in the PDF before quoting.** | [excerpt] https://www.aaup.org/sites/default/files/2025-07/TREP-Artificial-Intelligence-and-Academic-Professions.pdf · https://www.diverseeducation.com/home/article/15751194/faculty-demand-voice-in-ai-decisions-as-universities-rush-to-embrace-new-technology |
| EDUCAUSE Review, "Listening to Skepticism" (Apr 2026) | For many faculty the question is "whether GenAI should be used in their teaching at all, and if so, under what conditions" | [excerpt] https://er.educause.edu/articles/2026/4/listening-to-skepticism-what-faculty-concerns-about-generative-ai-reveal |
| Student side, HEPI 2025 (UK) | Top deterrents to using AI: fear of being accused of cheating (**53%**) and hallucinations (**51%**) | [excerpt] https://www.hepi.ac.uk/reports/student-generative-ai-survey-2025/ |

**Evidence that course-built tutors can work:**
- **Harvard Physical Sciences 2, "PS2 Pal"** (Kestin et al., *Scientific Reports* 2025; 194 students, crossover RCT): median learning gains "more than doubled" vs in-class active learning, in 49 vs 60 minutes. The tutor "was told to only give away one step at a time and not to divulge the full solution in a single message." [excerpt] https://www.nature.com/articles/s41598-025-97652-6, https://hechingerreport.org/proof-points-ai-tutor-harvard-physics/
- **LAK 2025**, AI tutor inside homework for a large intro STEM course: students mostly worked without it and used it "selectively"; 4.6 messages per conversation on average; usage *frequency* was not linked to exam performance, while *patterns* of use were. [excerpt] https://dl.acm.org/doi/10.1145/3706468.3706524

**Trust-copy implications for the professor console**, mapped to the fears:

| Fear | Copy direction |
|---|---|
| **Misrepresentation** (EDUCAUSE 55% misinformation; hallucinations) | "Answers only from sources you approved. Every answer cites the lecture and timestamp or the slide." Add a "not in your materials" fallback. |
| **Cheating** (Elon 78%; Tyton 2026) | "Will never produce problem-set solutions" as a visible, testable rule, plus a log of refused requests. |
| **Workload** (Tyton 2024: 34% say AI added work) | "One Ed announcement and a 10-minute weekly digest." No new grading. |
| **Surveillance / opt-out** (AAUP) | The off switch, and disclosure language for students. |
| **Replacement** ("Meet Your New TF: A Duck") | "Routes students to section, OH and Ed. Your TFs see what students are stuck on." |

---

## 6. Ed announcement: draft and preview-card spec

### 6.1 Draft announcement (modeled on §1.4 conventions)

- **Type:** Announcement · **Category:** General (or "Course Logistics") · **Pinned:** yes · **Email students:** yes (first launch only; see the CS 182 note on sparing email)
- **Title:** `New: Lectern, a study tutor built from our Chem 10 materials`

> Hi everyone,
>
> Starting today you can use **Lectern**, a study tutor built only from our course materials: the lecture recordings, slides, and assigned textbook sections. I chose and approved every source it draws on.
>
> **Where to find it:** "Lectern" in the left sidebar of our Canvas site.
>
> **What it's good for:**
> - Re-explaining something from lecture a different way
> - Finding where we covered a topic (e.g., "Lecture 13, 18:40")
> - Checking your reasoning on practice problems and old exams
>
> **What it won't do:** It won't give answers or worked solutions to problem set questions. If you ask, it will say so and help you with the underlying idea instead. Problem sets are still yours to work through under the collaboration policy in the syllabus.
>
> **Privacy:** The teaching staff (the TFs and I) can see the questions asked in Lectern. We read them to see where the class is stuck, and we'll use that to plan section and lecture.
>
> Ed, section, and office hours aren't going anywhere. If Lectern's answer doesn't match what you heard in lecture, trust lecture and post here.
>
> Midterm 1 is Thursday. Lectern has Lectures 1–13 and the practice exam.
>
> Best,
> Dr. [Last name]

About 200 words, consistent with real launch posts (120–250 words).

### 6.2 Preview card ("this is how it will appear")

All values from §1.3.

- **Card:** white, 1px `#eee` frame. Optional purple top bar `#5a418c` reading "ed  CHEM 10 – Discussion" to mimic Ed chrome. Keep it clearly labelled "Preview", and don't use Ed's logo.
- **Title row:** 28–32px regular, `#222`.
- **Meta row:**
  - 44px colored circle avatar with a white initial
  - Name in `#dd3919`
  - Yellow badge `INSTRUCTOR` (`#ffed99` bg, `#332f1f` text, 11px caps, 2px radius)
  - Second line: "just now in **General**" (time `#757575`, category `#3498db`)
  - Right side: PIN (pinned state) · STAR · WATCHING (`#0072f7`) · 0 VIEWS in 11px caps `#888`
  - Megaphone icon before the title, as Ed shows for announcements in the list
- **Body:** 16px `#222`. Bold lead-ins, bullets, paragraphs as in the draft. Under the body, the action row "Comment Edit Delete •••" in `#757575`, then an "Add comment" input with a `#ddd` border.
- **List-row variant:**
  - Group header "Pinned" on a `#fafafa` band
  - Blue unread dot `#0080ff`, megaphone icon, title `#222` 17px, purple pushpin `#ae47ff` at right
  - Second line: **General** (`#3498db`, bold) · "Dr. [Name]" · INSTRUCTOR badge · "now"

---

## 7. Material for the demo course

**Fictional course:** *Chemistry 10: Principles of Chemistry*, Fall 2026.
- **Staff:** a senior lecturer and 6 teaching fellows (TFs).
- **Enrollment:** 230 students.
- **Lectures:** MWF 10:30–11:45 in a lecture hall, recorded to Panopto and posted in Canvas.
- **Sections:** 12 weekly sections of about 19 students, two per TF.
- **Problem sets:** due **Fridays 11:59 pm on Gradescope**. Solutions are posted Saturday morning.
- **Office hours:** professor Mon 1–2 pm and Wed 3–4 pm. TF OH and Thursday-night "pset session" 8–10 pm.
- **Exams:** Midterm 1 Thu Oct 8 and Midterm 2 Thu Nov 5, both 7:30–9:30 pm (evening exams). Final during the December exam period. Equation sheet provided.
- **Textbook:** OpenStax *Chemistry 2e* (free).
- **Ed categories:**
  - General
  - Lectures (L01…L34)
  - Problem Sets (PS1…PS11)
  - Sections
  - Exams (Midterm 1, Midterm 2, Final)
  - Lectern (feedback)
- **File naming** (modeled on MIT's `MIT5_111F14_Lec18.pdf`):
  - Slides: `CHEM10_F26_L09_Orbitals.pdf`
  - Problem sets: `PS3.pdf`, `PS3_solutions.pdf`
  - Exam materials: `Midterm1_equation_sheet.pdf`, `Midterm1_practice.pdf`
  - Panopto sessions renamed to "Lecture 09 – Orbitals (Wed Sep 23)"
- **Citation format for Lectern:** "Lecture 9 (Wed Sep 23) · 23:14". The link uses Panopto `&start=1394`.

### 7.1 13-week lecture schedule (MWF, starting Wed Sept 2 2026)

No class Mon Sep 7 (Labor Day), Mon Oct 12 (Indigenous Peoples' Day), or Wed Nov 25 / Fri Nov 27 (Thanksgiving recess). Weekdays were verified with Python. The topic order follows MIT 5.111, UCI 1A and Berkeley 1A (§3.1).

| Wk | Lecture | Date | Title | Due / event |
|---|---|---|---|---|
| 1 | L01 | Wed Sep 2 | Why Chemistry? Measurement, Units, and Significant Figures | |
| 1 | L02 | Fri Sep 4 | Atoms, Isotopes, and the Mole | |
| 2 | — | Mon Sep 7 | *No class: Labor Day* | |
| 2 | L03 | Wed Sep 9 | Chemical Formulas and Balancing Equations | |
| 2 | L04 | Fri Sep 11 | Stoichiometry: Limiting Reactant and Percent Yield | **PS1 due** (units, sig figs, moles) |
| 3 | L05 | Mon Sep 14 | Solutions, Molarity, and Reactions in Water | |
| 3 | L06 | Wed Sep 16 | Light as a Wave and a Particle | |
| 3 | L07 | Fri Sep 18 | The Hydrogen Atom: Bohr Model and Emission Spectra | **PS2 due** (stoichiometry, solutions) |
| 4 | L08 | Mon Sep 21 | Wave–Particle Duality of Matter and Quantum Numbers | |
| 4 | L09 | Wed Sep 23 | Atomic Orbitals: Shapes and Nodes | |
| 4 | L10 | Fri Sep 25 | Multi-electron Atoms and Electron Configurations | **PS3 due** (light, H atom, quantum numbers) |
| 5 | L11 | Mon Sep 28 | Periodic Trends | |
| 5 | L12 | Wed Sep 30 | Ionic and Covalent Bonds; Electronegativity | |
| 5 | L13 | Fri Oct 2 | Lewis Structures, Formal Charge, and Resonance | **PS4 due** (orbitals, configurations, trends) |
| 6 | L14 | Mon Oct 5 | Breaking the Octet Rule; Introduction to VSEPR | |
| 6 | L15 | Wed Oct 7 | Molecular Shape and Polarity | Midterm 1 review session (TFs), Wed 8 pm |
| 6 | — | Thu Oct 8 | **Midterm 1** (7:30–9:30 pm; L01–L13) | |
| 6 | L16 | Fri Oct 9 | Valence Bond Theory and Hybridization | **PS5 due** (bonding, Lewis, VSEPR; short) |
| 7 | — | Mon Oct 12 | *No class: Indigenous Peoples' Day* | |
| 7 | L17 | Wed Oct 14 | Molecular Orbital Theory | |
| 7 | L18 | Fri Oct 16 | Intermolecular Forces | **PS6 due** (hybridization, MO, IMFs) |
| 8 | L19 | Mon Oct 19 | Gases and the Ideal Gas Law | |
| 8 | L20 | Wed Oct 21 | Partial Pressures and Kinetic Molecular Theory | |
| 8 | L21 | Fri Oct 23 | Thermochemistry: Enthalpy and Calorimetry | **PS7 due** (gases) |
| 9 | L22 | Mon Oct 26 | Hess's Law, Enthalpies of Formation, and Bond Enthalpies | |
| 9 | L23 | Wed Oct 28 | Entropy and the Second Law | |
| 9 | L24 | Fri Oct 30 | Gibbs Free Energy and Spontaneity | **PS8 due** (thermochemistry, Hess, entropy) |
| 10 | L25 | Mon Nov 2 | Chemical Equilibrium: K and Q | |
| 10 | L26 | Wed Nov 4 | Le Châtelier's Principle; ΔG° = −RT ln K | Midterm 2 review session, Wed 8 pm |
| 10 | — | Thu Nov 5 | **Midterm 2** (7:30–9:30 pm; L14–L24) | |
| 10 | L27 | Fri Nov 6 | Equilibrium Calculations: ICE Tables | **PS9 due** (free energy, K/Q, Le Châtelier) |
| 11 | L28 | Mon Nov 9 | Acids and Bases: Kw and pH | |
| 11 | L29 | Wed Nov 11 | Weak Acids and Bases: Ka, Kb, and pKa | |
| 11 | L30 | Fri Nov 13 | Buffers and the Henderson–Hasselbalch Equation | **PS10 due** (ICE tables, acids/bases) |
| 12 | L31 | Mon Nov 16 | Titrations and Solubility Equilibria (Ksp) | |
| 12 | L32 | Wed Nov 18 | Electrochemistry: Redox and Cell Potentials | |
| 12 | L33 | Fri Nov 20 | Kinetics: Rate Laws and Reaction Order | **PS11 due** (buffers, titrations, Ksp, electrochem) |
| 13 | L34 | Mon Nov 23 | Kinetics: Half-Life, Arrhenius, and Catalysts (course wrap-up) | |
| 13 | — | Wed Nov 25 / Fri Nov 27 | *No class: Thanksgiving recess* | |

Optional, if you want instruction to run into December: add Week 14 lectures Mon Nov 30 (Kinetics problem day) and Wed Dec 2 (Final review), then reading period and the final.

As of today (Sat Oct 3 2026), the demo course has just finished L13 and PS4. Next week holds L14–L16, Midterm 1 (Thu Oct 8) and a short PS5.

### 7.2 Syllabus: collaboration and AI policy (written fresh, modeled on CS50 / Harvard OUE / UF / Utah)

> **Collaboration.** You are encouraged to work on problem sets with classmates: talk through approaches at the whiteboard, compare strategies, and check each other's reasoning. What you submit must be written by you, in your own words and your own work. List the names of everyone you worked with at the top of each problem set. Don't share your written solutions, photograph someone else's, or use solutions from previous years or from homework-help sites.
>
> **Generative AI.** Learning chemistry depends on getting stuck and working out how to start. A tool that does that step for you takes away the part that teaches you. So for this course:
>
> *Reasonable:* Using **Lectern**, the course tutor in our Canvas site. It draws only on materials I have approved (our lecture recordings, slides, and assigned readings). Use it to re-explain a concept, find where we covered something in lecture, check your reasoning on practice problems and past exams, or study for midterms. Lectern is built not to give answers or worked solutions to current problem set questions. Please don't try to get around that.
>
> *Not reasonable:* Using any other AI tool (e.g., ChatGPT, Claude, Gemini, Copilot, or "homework solver" apps) to produce answers, solutions, or steps for anything you submit for credit. Pasting problem set questions into such tools also counts.
>
> **Transparency.** The teaching staff can see the questions asked in Lectern. We read them in aggregate to find out where the class is stuck and to plan section and lecture. They are not graded and do not count against you. If you're unsure whether something is allowed, ask on Ed (privately if you like) *before* you do it. Using AI in a way this policy doesn't allow will be handled as an academic integrity matter, under the same procedures as any other unauthorized aid.

### 7.3 Thirty student questions (Ed voice)

`[ANS]` marks the 10 questions (one third) that ask directly for a problem set answer. Each line shows the Ed category · subcategory, the author display, and the week it would plausibly appear.

1. **General · —** · *Anonymous* · Wk 1. "do we need to use sig figs on the psets or just on exams?? like will i lose points for writing 0.04572 instead of 0.0457"
2. **Problem Sets · PS1** · *Anonymous* · Wk 2. "PS1 #3c: how many sig figs does 1200 g have. is it 2 or 4? the problem doesn't have a decimal point so idk"
3. **Problem Sets · PS1** · *Anonymous* · Wk 2. `[ANS]` "can someone just tell me what the answer to 5b is, i keep getting 3.01 x 10^23 atoms but that seems too big"
4. **Problem Sets · PS2** · *Anonymous* · Wk 3. "for limiting reactant why can't you just pick the one with the smaller mass? i did that on 2a and it was the right one lol so is that a coincidence"
5. **Problem Sets · PS2** · *Anonymous* · Wk 3. `[ANS]` "is the limiting reagent in 2b the O2 or the C3H8? just want to check before i do the rest of the problem"
6. **Problem Sets · PS2** · *Anonymous* · Wk 3. "percent yield on 4 came out to 112%?? did i mess up or is that possible if the product is wet"
7. **Lectures · L05** · *Anonymous* · Wk 3. "in lecture 5 she did M1V1 = M2V2 for the dilution but on the pset the volumes are in mL, do i have to convert to L or does it cancel"
8. **Problem Sets · PS3** · *Anonymous* · Wk 4. `[ANS]` "what wavelength did people get for 2a (the n=4 to n=2 transition)? i got 486 nm but my friend got 4.86 x 10^-7 and idk which they want"
9. **Problem Sets · PS3** · *Anonymous* · Wk 4. "why is (n=2, l=2, ml=0) not allowed? i thought l could be anything up to n"
10. **Lectures · L10** · *Anonymous* · Wk 4. "why is chromium [Ar]4s1 3d5 and not 4s2 3d4?? is this going to be on the midterm or can we just memorize Cr and Cu"
11. **Problem Sets · PS4** · *Anonymous* · Wk 5. "PS4 #6 asks why O has a lower first ionization energy than N even though it's further right. i get that it's an exception but what do i actually write"
12. **Problem Sets · PS4** · *Anonymous* · Wk 5. `[ANS]` "can a TF confirm the ranking for 7a is Na < Mg < Al < Si for atomic radius? or is it the other way, lecture 11 slides confused me"
13. **Lectures · L13** · *Anonymous* · Wk 5. "how do you know which resonance structure is the 'best' one? is it always the one where formal charges are closest to 0"
14. **Problem Sets · PS5** · *Anonymous* · Wk 6. "SF4: is it seesaw or tetrahedral? the electron geometry is trigonal bipyramidal right, so why isn't the shape just that"
15. **Problem Sets · PS5** · *Anonymous* · Wk 6. `[ANS]` "is XeF4 polar or nonpolar for 3d, just need a yes/no i'm running out of time before the midterm"
16. **Exams · Midterm 1** · *Anonymous* · Wk 6. "is the equation sheet going to have the rydberg equation on it or do we need to memorize it? also is a graphing calc ok"
17. **Problem Sets · PS6** · *Anonymous* · Wk 7. "why is O2 paramagnetic if the lewis structure has all electrons paired? does the MO diagram override the lewis structure?"
18. **Problem Sets · PS6** · *Anonymous* · Wk 7. `[ANS]` "what's the hybridization of the central N in 2c? i put sp2 but i'm not sure if the lone pair counts. pls just tell me"
19. **Lectures · L18** · *Anonymous* · Wk 7. "why does H2O have a higher boiling point than H2S if H2S is heavier? i thought heavier = more london dispersion"
20. **Problem Sets · PS7** · *Anonymous* · Wk 8. "which R do i use for #3, 0.08206 or 8.314? i got a crazy number with 8.314 and P in atm"
21. **Problem Sets · PS7** · *Anonymous* · Wk 8. `[ANS]` "can someone post the final answer for 5 (the partial pressure of He)? want to check my work, i got 0.42 atm"
22. **Problem Sets · PS8** · *Anonymous* · Wk 9. "for hess's law when you flip the reaction do you flip the sign AND multiply by 2 if you double it? 4b has both and i'm confused on the order"
23. **Problem Sets · PS8** · *Anonymous* · Wk 9. "in the coffee cup calorimetry problem, the water temp went up so q is positive, so why is ΔH negative?? feels contradictory"
24. **Problem Sets · PS9** · *Anonymous* · Wk 10. "why don't we include CaCO3(s) in the K expression for 2a? it's literally in the reaction"
25. **Problem Sets · PS9** · *Anonymous* · Wk 10. `[ANS]` "is the answer to 6 that the equilibrium shifts right? (adding argon at constant volume) i said right because more gas = more pressure"
26. **Lectures · L26** · *Anonymous* · Wk 10. "what's the difference between ΔG and ΔG°? in lecture 26 at like 31:00 she says ΔG = 0 at equilibrium but ΔG° isn't 0?? also what is ΔG°' (with the prime) in my bio class"
27. **Problem Sets · PS10** · *Anonymous* · Wk 11. "on the ICE table for 3 can i drop the x? the Ka is 1.8e-5 and the conc is 0.010 M. how do i know if the 5% thing works"
28. **Problem Sets · PS10** · *Anonymous* · Wk 11. "for the buffer in #5 do i plug moles or concentrations into henderson hasselbalch? they give me the volume of each solution"
29. **Problem Sets · PS10** · *Anonymous* · Wk 11. `[ANS]` "can someone just tell me the pH for 5b? i got 4.57 and the answer key from last year says 4.74 so i think i'm wrong"
30. **Problem Sets · PS11** · *Anonymous* · Wk 12. `[ANS]` "what is the molar solubility for 4c (AgCl in 0.10 M NaCl)? got 1.8e-9 M but that seems way too small, did i do the common ion part right"

**Spread:** sig figs (1, 2); moles/units (3, 7); stoichiometry and limiting reagent (4, 5, 6); light and H atom (8); quantum numbers and configurations (9, 10); trends (11, 12); Lewis/resonance (13); VSEPR/polarity (14, 15); logistics (16); MO (17); hybridization (18); IMFs (19); gases (20, 21); thermochemistry (22, 23); equilibrium/K (24); Le Châtelier inert gas (25); ΔG/ΔG°/ΔG°′ (26); ICE/5% rule (27); buffers (28, 29); Ksp common ion (30).

**For a single "this week" demo** (Week 6, Oct 5–9): use 13, 14, 15, 16 plus PS5 variants. That is the pre-midterm crunch, when Ed volume and answer-seeking peak.
