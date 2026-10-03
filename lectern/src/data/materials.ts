// Course documents other than lectures and slides: syllabus, problem sets,
// last year's midterm, and Ed Discussion answers.
import type { Source } from './types'

export const HEAD_TF = 'Priya Raghunathan'
export const TFS = [HEAD_TF, 'Marcus Adeyemi', 'Sofia Castellanos', 'Daniel Cho', 'Hannah Lindqvist', 'Omar Haddad']

const SYL: Source = {
  id: 'SYL',
  kind: 'syllabus',
  title: 'Syllabus · Fall 2026',
  date: '2026-08-28',
  meta: '9 pages · PDF',
  origin: 'Canvas › Syllabus',
  proposed: 'approved',
  mode: 'answer',
  passages: [
    { id: 'SYL-01', loc: 'Overview', text: `CHEM 11, Foundations of Chemistry, is a one-semester introduction to chemical principles for students with any amount of high-school chemistry. We cover measurement, stoichiometry, solutions, gases, thermochemistry, chemical equilibrium and acids and bases, and, after the first midterm, thermodynamics, electrochemistry, atomic structure and bonding. Lectures meet Monday, Wednesday and Friday, 10:30–11:20 am. Every lecture is recorded and posted to Canvas, usually within a few hours. Questions about course material go on Ed Discussion, where I read every post.` },
    { id: 'SYL-02', loc: 'Staff and office hours', text: `Instructor: Ellen Marsh, Senior Lecturer in Chemistry (emarsh@example.edu). Office hours: Tuesdays 2:00–3:30 pm, Chemistry 214. Head teaching fellow: ${HEAD_TF}, who handles extensions, exam conflicts, Gradescope problems and section changes. Teaching fellows: Marcus Adeyemi, Sofia Castellanos, Daniel Cho, Hannah Lindqvist and Omar Haddad. TF office hours run Sunday through Thursday, 7–10 pm, in the Chemistry Learning Center and on Zoom; the nightly schedule is pinned on Ed. For anything personal, email me or the head TF directly rather than posting on Ed.` },
    { id: 'SYL-03', loc: 'Textbook', text: `Brown, LeMay, Bursten, Murphy, Woodward and Stoltzfus, Chemistry: The Central Science, 15th edition. Any edition from the 13th on is fine; section numbers shift slightly between editions, so use the reading list on Canvas, which gives the chapter and section for each lecture. Before Midterm 1 we cover chapters 1–5, 10, 15 and 16. Copies are on reserve at the library. You do not need an online homework access code; problem sets are posted on Canvas and submitted on Gradescope.` },
    { id: 'SYL-04', loc: 'Grading', text: `Problem sets 25% (lowest score dropped), Midterm 1 20%, Midterm 2 20%, final exam 30%, section participation 5%. Grades are not curved against one another: you are not competing with your classmates. Letter-grade cutoffs are set at the end of the term and will be no stricter than 93% for an A, 90% for an A−, 87% for a B+, 83% for a B and 80% for a B−, with the same pattern below. Grades are posted on Canvas; Gradescope shows problem-by-problem feedback.` },
    { id: 'SYL-05', loc: 'Problem sets', text: `There are eleven weekly problem sets. Each is posted on Canvas after Friday's lecture and is due the following Friday at 11:59 pm Eastern on Gradescope. Upload a single PDF and assign pages to each problem; unassigned pages may not be graded. Show your work: we grade the reasoning, not just the final number. Write units on every number and report final answers to the correct number of significant figures, rounding only at the end. Solutions are posted on Canvas the day after the deadline. Your lowest problem-set score is dropped.` },
    { id: 'SYL-06', loc: 'Late work', text: `Each student has two 48-hour extensions to use on any problem sets during the term, no reason needed. Request one before the deadline through the extension form linked on the Canvas home page; the head TF, ${HEAD_TF}, approves them, usually within a day. Late work without an approved extension is not accepted, because solutions go up the next day; if you're on an extension, don't open the solutions until you've submitted. If you've used both extensions and something serious comes up, such as illness or a family emergency, contact the head TF and your resident dean, and we'll work out something reasonable. Extensions do not apply to exams.` },
    { id: 'SYL-07', loc: 'Collaboration', text: `You're encouraged to work on problem sets with other students: discuss approaches, compare strategies, work at a whiteboard together. But the write-up you submit must be your own, written by you, with your own calculations. Don't copy another student's solutions or let yours be copied, and don't consult solutions from previous years of this course. List the names of everyone you worked with at the top of each problem set. Exams are individual work.` },
    { id: 'SYL-08', loc: 'Use of AI', text: `Generative AI tools (ChatGPT, Claude, Gemini and the like) may not be used to solve, check or write up problem sets. Don't paste problem-set questions into an AI tool, and don't submit work an AI produced. Using AI to help you understand a concept is fine: asking it to explain why solids are left out of an equilibrium expression, or to walk through an example from lecture, is no different from reading the textbook or asking a friend. If you're unsure whether a use is allowed, ask me first. Violations are handled under the College's academic integrity policy.` },
    { id: 'SYL-09', loc: 'Exams', text: `There are two evening midterms and a final. Midterm 1 is Wednesday, October 14, 7:30–9:30 pm, and covers Lectures 1 through 14, through buffers. Midterm 2 is Wednesday, November 18, 7:30–9:30 pm. The final is in the December exam period at the time the Registrar assigns. Bring a scientific calculator (no graphing calculators, no phones); a periodic table and a sheet of constants are provided. Last year's midterms, with solutions, are posted on Canvas as practice. If you have a conflict with an exam time, tell the head TF at least two weeks in advance.` },
    { id: 'SYL-10', loc: 'Regrades', text: `If you believe something was graded incorrectly, submit a regrade request through Gradescope within one week of the grades being released. Explain specifically what you think was misgraded, referring to the posted solutions. The TF who graded the problem reviews it first; if you're still not satisfied, I review it myself. A regrade request means the whole problem may be re-examined, so the score can go down as well as up. Please don't email TFs about regrades or post grading questions on Ed.` },
    { id: 'SYL-11', loc: 'Accommodations', text: `Students with accommodations through the Accessibility Education Office should send me their letter in the first two weeks of the term, and at least a week before each exam, so we can arrange extended time or a separate room. If you're dealing with illness or a personal emergency, contact your resident dean and the head TF, ${HEAD_TF}; we will be flexible. You never need to share medical details with course staff.` },
    { id: 'SYL-12', loc: 'Schedule', text: `Remaining schedule before Midterm 1. Lecture 14, Mon Oct 5: buffers and the Henderson–Hasselbalch equation. Lecture 15, Wed Oct 7: weak bases, Kb and the pH of salt solutions (not on Midterm 1). Lecture 16, Fri Oct 9: midterm review. Mon Oct 12: no class (holiday). Wed Oct 14: Midterm 1, 7:30–9:30 pm. After the midterm: entropy and Gibbs free energy, electrochemistry, then atomic structure, quantum numbers and electron configurations, and chemical bonding. Problem Set 5 is due Fri Oct 9.` },
  ],
}

const PS5: Source = {
  id: 'PS5',
  kind: 'pset',
  title: 'Problem Set 5 · due Fri Oct 9',
  date: '2026-10-02',
  meta: '7 problems · PDF',
  origin: 'Canvas › Assignments',
  proposed: 'approved',
  mode: 'recognize',
  note: 'Used only to recognize PS5 questions so the tutor can decline them. Students never see text from it.',
  passages: [
    { id: 'PS5-1a', loc: 'Problem 1a', text: `Write the equilibrium expression Kc for the decomposition of baking soda: 2 NaHCO₃(s) ⇌ Na₂CO₃(s) + CO₂(g) + H₂O(g). In one sentence, state which species you left out of the expression and why.` },
    { id: 'PS5-1b', loc: 'Problem 1b', text: `For the reaction in 1a, Kp = 0.231 at 100 °C. Calculate Kc at 100 °C. Show how you determined Δn, and include R with its units.` },
    { id: 'PS5-2a', loc: 'Problem 2a', text: `CO(g) + H₂O(g) ⇌ CO₂(g) + H₂(g) has Kc = 1.56 at a certain temperature. A 5.00-L vessel initially contains 0.750 mol CO and 0.750 mol H₂O and no products. Use an ICE table to calculate the equilibrium concentrations of all four species.` },
    { id: 'PS5-2b', loc: 'Problem 2b', text: `After the system in 2a reaches equilibrium, an additional 0.250 mol of CO is injected at constant volume and temperature. Calculate Q immediately after the addition, state the direction in which the reaction will shift, and explain how you know.` },
    { id: 'PS5-3a', loc: 'Problem 3a', text: `For 2 NOCl(g) ⇌ 2 NO(g) + Cl₂(g), Kc = 1.6 × 10⁻⁵ at 35 °C. A flask initially contains 0.50 M NOCl and no products. Use the small-x approximation to find [Cl₂] at equilibrium, and show the 5% check.` },
    { id: 'PS5-3b', loc: 'Problem 3b', text: `Repeat Problem 3a for an initial NOCl concentration of 0.010 M. Is the small-x approximation still justified? Show your check. If it is not justified, explain how you would proceed (you do not need to solve a cubic equation).` },
    { id: 'PS5-4', loc: 'Problem 4', text: `Br₂(g) + Cl₂(g) ⇌ 2 BrCl(g) has Kc = 7.0 at 400 K. A mixture at 400 K contains [Br₂] = 0.040 M, [Cl₂] = 0.030 M and [BrCl] = 0.090 M. Is the system at equilibrium? If not, in which direction will the reaction proceed? Justify your answer with Q.` },
    { id: 'PS5-5a', loc: 'Problem 5a', text: `For 2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g), ΔH°rxn = −198 kJ mol⁻¹, predict the direction of shift, if any, for each change, and justify each prediction in terms of Q or K: (i) argon is added at constant volume; (ii) the volume of the container is halved; (iii) some O₂ is removed; (iv) a V₂O₅ catalyst is added.` },
    { id: 'PS5-5b', loc: 'Problem 5b', text: `For the reaction in 5a, state whether Kc increases, decreases or stays the same when (i) the temperature is raised and (ii) the volume is halved at constant temperature. Explain each answer in one or two sentences.` },
    { id: 'PS5-6a', loc: 'Problem 6a', text: `Calculate the pH of 0.15 M nitrous acid, HNO₂ (Ka = 4.5 × 10⁻⁴). Decide whether the small-x approximation is justified, and show your check. Report the pH to the correct number of decimal places.` },
    { id: 'PS5-6b', loc: 'Problem 6b', text: `Calculate the percent ionization of the HNO₂ solution in 6a. Then predict, without calculating, whether the percent ionization of 0.015 M HNO₂ would be larger or smaller, and explain why.` },
    { id: 'PS5-7', loc: 'Problem 7', text: `A 0.25 M solution of a weak monoprotic acid, HX, has a pH of 2.75. Calculate Ka and pKa for HX, reporting each to the correct number of significant figures or decimal places.` },
  ],
}

const PS4: Source = {
  id: 'PS4',
  kind: 'pset',
  title: 'Problem Set 4 · solutions',
  date: '2026-10-03',
  meta: '7 problems · PDF with worked solutions',
  origin: 'Canvas › Files › Solutions',
  proposed: 'approved',
  mode: 'answer',
  note: 'PS4 was due Fri Oct 2 at 11:59 pm and you posted these solutions to Canvas on Oct 3, so the tutor may now explain them.',
  passages: [
    { id: 'PS4-1', loc: 'Problem 1', text: `Problem: When 5.00 g of NH₄NO₃ dissolves in 100.0 g of water in a coffee-cup calorimeter, the temperature falls from 22.50 °C to 18.85 °C. Assuming 105.0 g of solution with c = 4.184 J g⁻¹ °C⁻¹, find ΔH for dissolving NH₄NO₃ in kJ mol⁻¹. Solution: ΔT = 18.85 °C − 22.50 °C = −3.65 °C. q_soln = (105.0 g)(4.184 J g⁻¹ °C⁻¹)(−3.65 °C) = −1603.5 J. q_rxn = −q_soln = +1.6035 kJ. Moles NH₄NO₃ = 5.00 g ÷ 80.05 g mol⁻¹ = 0.06246 mol. ΔH = +1.6035 kJ ÷ 0.06246 mol = +25.7 kJ mol⁻¹. Endothermic: the solution got colder, so heat flowed into the dissolving salt. A ΔH reported without its sign is marked as positive.` },
    { id: 'PS4-2', loc: 'Problem 2', text: `Problem: Use (1) C₂H₂(g) + 5/2 O₂(g) → 2 CO₂(g) + H₂O(l), ΔH° = −1299.6 kJ mol⁻¹; (2) C(s) + O₂(g) → CO₂(g), ΔH° = −393.5 kJ mol⁻¹; (3) H₂(g) + ½ O₂(g) → H₂O(l), ΔH° = −285.8 kJ mol⁻¹ to find ΔH° for 2 C(s) + H₂(g) → C₂H₂(g). Solution: C₂H₂ must be a product, so reverse (1) and flip its sign: +1299.6 kJ mol⁻¹. We need 2 C(s), so multiply (2) by 2: −787.0 kJ mol⁻¹. Keep (3) as written: −285.8 kJ mol⁻¹. Adding, 2 CO₂, H₂O and 5/2 O₂ cancel. ΔH° = +1299.6 − 787.0 − 285.8 = +226.8 kJ mol⁻¹.` },
    { id: 'PS4-3', loc: 'Problem 3', text: `Problem: Using ΔH°f values (C₃H₈(g) −103.8, CO₂(g) −393.5, H₂O(l) −285.8 kJ mol⁻¹), find ΔH°rxn for C₃H₈(g) + 5 O₂(g) → 3 CO₂(g) + 4 H₂O(l), and the heat released when 10.0 g of propane burns. Solution: Products: 3(−393.5) + 4(−285.8) = −2323.7 kJ. Reactants: −103.8 + 5(0) = −103.8 kJ; O₂(g) is an element in its standard state, so its ΔH°f is zero. ΔH°rxn = −2323.7 − (−103.8) = −2219.9 kJ mol⁻¹. For 10.0 g: 10.0 g ÷ 44.09 g mol⁻¹ = 0.2268 mol, and q = 0.2268 mol × (−2219.9 kJ mol⁻¹) = −503 kJ, so 503 kJ is released.` },
    { id: 'PS4-4', loc: 'Problem 4', text: `Problem: Write Kc for (a) NH₄Cl(s) ⇌ NH₃(g) + HCl(g); (b) 4 NH₃(g) + 5 O₂(g) ⇌ 4 NO(g) + 6 H₂O(g); (c) Cu(s) + 2 Ag⁺(aq) ⇌ Cu²⁺(aq) + 2 Ag(s). Solution: (a) Kc = [NH₃][HCl]; NH₄Cl is a pure solid and is left out. (b) Kc = [NO]⁴[H₂O]⁶ / ([NH₃]⁴[O₂]⁵). Water is a gas in this reaction, so it is included; leaving it out was the most common error on this problem. (c) Kc = [Cu²⁺] / [Ag⁺]²; Cu(s) and Ag(s) are pure solids. No units on any K.` },
    { id: 'PS4-5', loc: 'Problem 5', text: `Problem: At 472 °C, N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g) has Kc = 0.105. (a) Find Kc for NH₃(g) ⇌ ½ N₂(g) + 3/2 H₂(g). (b) Find Kp for the original reaction at 472 °C. Solution: (a) Reversing gives 1/0.105 = 9.524; halving the coefficients takes the square root, so Kc = √9.524 = 3.09. (b) Δn = 2 − 4 = −2 and T = 745.15 K. Kp = Kc(RT)^Δn = 0.105 × (0.08206 L atm mol⁻¹ K⁻¹ × 745.15 K)⁻² = 0.105 × (61.15)⁻² = 2.81 × 10⁻⁵. Use R = 0.08206 L atm mol⁻¹ K⁻¹ here, not 8.314.` },
    { id: 'PS4-6', loc: 'Problem 6', text: `Problem: For 2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g), Kc = 280 at 1000 K. A vessel at 1000 K contains [SO₂] = 0.0400 M, [O₂] = 0.0200 M and [SO₃] = 0.200 M. Is the mixture at equilibrium? If not, which way will it proceed? Solution: Q = [SO₃]² / ([SO₂]²[O₂]) = (0.200)² / ((0.0400)²(0.0200)) = 0.0400 / (3.20 × 10⁻⁵) = 1.25 × 10³. Q > Kc (1250 > 280), so there is too much product: the reaction proceeds in reverse, toward SO₂ and O₂, until Q = Kc.` },
    { id: 'PS4-7', loc: 'Problem 7', text: `Problem: At 25 °C, N₂O₄(g) ⇌ 2 NO₂(g) has Kc = 4.64 × 10⁻³. A 2.00-L flask is charged with 0.100 mol N₂O₄ and no NO₂. Find the equilibrium concentrations. Solution: Convert to molarity first: [N₂O₄]₀ = 0.100 mol ÷ 2.00 L = 0.0500 M. I: 0.0500, 0. C: −x, +2x. E: 0.0500 − x, 2x. Kc = (2x)² / (0.0500 − x) = 4.64 × 10⁻³. Trying the approximation gives x = 7.62 × 10⁻³ M, which is 15% of 0.0500 M, so it fails. Quadratic: 4x² + 4.64 × 10⁻³ x − 2.32 × 10⁻⁴ = 0; positive root x = 7.06 × 10⁻³ M. [NO₂] = 2x = 0.0141 M; [N₂O₄] = 0.0500 − 0.00706 = 0.0429 M. Check with unrounded values: (0.014116)² / 0.042942 = 4.64 × 10⁻³ ✓.` },
  ],
}

const MT1: Source = {
  id: 'MT1-2025',
  kind: 'exam',
  title: 'Midterm 1 · Fall 2025 (practice, with solutions)',
  date: '2025-10-15',
  meta: '8 problems · PDF with solutions',
  origin: 'Canvas › Files › Practice exams',
  proposed: 'approved',
  mode: 'answer',
  note: 'You post this on Canvas as a practice exam.',
  passages: [
    { id: 'MT1-2025-1', loc: 'Problem 1', text: `Problem: Report each result with the correct significant figures and units. (a) (25.0 g)(4.184 J g⁻¹ °C⁻¹)(3.2 °C); (b) 14.27 mL + 3.1 mL − 0.006 mL. Solution: (a) The calculator gives 334.72 J; multiplication, so the fewest significant figures (two, from 3.2 °C) govern: 3.3 × 10² J. (b) The calculator gives 17.364 mL; addition, so the fewest decimal places (tenths, from 3.1 mL) govern: 17.4 mL.` },
    { id: 'MT1-2025-2', loc: 'Problem 2', text: `Problem: 4 NH₃(g) + 5 O₂(g) → 4 NO(g) + 6 H₂O(g). If 20.0 g NH₃ reacts with 40.0 g O₂, which reactant is limiting, and what mass of NO forms? Solution: NH₃: 20.0 g ÷ 17.03 g mol⁻¹ = 1.174 mol; ÷ 4 = 0.2936. O₂: 40.0 g ÷ 32.00 g mol⁻¹ = 1.250 mol; ÷ 5 = 0.2500. O₂ gives the smaller value, so O₂ is limiting. NO formed: 1.250 mol O₂ × (4 mol NO / 5 mol O₂) = 1.000 mol; × 30.01 g mol⁻¹ = 30.0 g NO.` },
    { id: 'MT1-2025-3', loc: 'Problem 3', text: `Problem: What volume of O₂ at 25 °C and 0.950 atm is needed to burn 5.00 g of propane completely (C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O)? Solution: 5.00 g ÷ 44.09 g mol⁻¹ = 0.1134 mol C₃H₈; × 5 = 0.5670 mol O₂. V = nRT/P = (0.5670 mol)(0.08206 L atm mol⁻¹ K⁻¹)(298.15 K) ÷ 0.950 atm = 14.6 L. Temperature must be in kelvin.` },
    { id: 'MT1-2025-4', loc: 'Problem 4', text: `Problem: A 50.0 g piece of metal at 100.00 °C is dropped into 100.0 g of water at 22.00 °C in an insulated cup. The final temperature is 25.60 °C. Find the specific heat of the metal. Solution: Heat gained by the water equals heat lost by the metal. q_water = (100.0 g)(4.184 J g⁻¹ °C⁻¹)(25.60 °C − 22.00 °C) = +1506.2 J. q_metal = −1506.2 J = (50.0 g)(c)(25.60 °C − 100.00 °C) = (50.0 g)(c)(−74.40 °C). c = 0.405 J g⁻¹ °C⁻¹.` },
    { id: 'MT1-2025-5', loc: 'Problem 5', text: `Problem: Given 2 S(s) + 3 O₂(g) → 2 SO₃(g), ΔH° = −790 kJ mol⁻¹, and S(s) + O₂(g) → SO₂(g), ΔH° = −297 kJ mol⁻¹, find ΔH° for 2 SO₂(g) + O₂(g) → 2 SO₃(g). Solution: Keep the first equation (−790 kJ mol⁻¹). Reverse the second and multiply by 2: 2 SO₂(g) → 2 S(s) + 2 O₂(g), ΔH° = +594 kJ mol⁻¹. Add: 2 S and 2 O₂ cancel, leaving 2 SO₂(g) + O₂(g) → 2 SO₃(g), ΔH° = −790 + 594 = −196 kJ mol⁻¹.` },
    { id: 'MT1-2025-6', loc: 'Problem 6', text: `Problem: COCl₂(g) ⇌ CO(g) + Cl₂(g) has Kc = 2.2 × 10⁻¹⁰ at 100 °C. If [COCl₂]₀ = 0.250 M, find [CO] at equilibrium. Solution: E row: 0.250 − x, x, x. x² / (0.250 − x) = 2.2 × 10⁻¹⁰. Small-x approximation: x² = 5.5 × 10⁻¹¹, so x = 7.4 × 10⁻⁶ M. 5% check: 7.4 × 10⁻⁶ ÷ 0.250 × 100% = 0.0030% ✓. [CO] = [Cl₂] = 7.4 × 10⁻⁶ M, and [COCl₂] = 0.250 M.` },
    { id: 'MT1-2025-7', loc: 'Problem 7', text: `Problem: CO(g) + 3 H₂(g) ⇌ CH₄(g) + H₂O(g), ΔH° = −206 kJ mol⁻¹. Predict the shift for each change: (a) He added at constant volume; (b) volume decreased; (c) temperature increased; (d) H₂O removed. Solution: (a) No shift: the partial pressures of the reacting gases are unchanged, so Q still equals K. (b) Shifts right: 4 mol of gas on the left, 2 on the right; compression makes Q smaller than K. (c) Shifts left, and K decreases, because the reaction is exothermic. (d) Shifts right: removing a product makes Q smaller than K.` },
    { id: 'MT1-2025-8', loc: 'Problem 8', text: `Problem: Calculate the pH of 0.20 M formic acid, HCOOH (Ka = 1.8 × 10⁻⁴). Solution: HCOOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + HCOO⁻(aq). x² / (0.20 − x) = 1.8 × 10⁻⁴. Small-x approximation: x² = 3.6 × 10⁻⁵, so x = 6.0 × 10⁻³ M. 5% check: 6.0 × 10⁻³ ÷ 0.20 × 100% = 3.0% ✓. pH = −log(6.0 × 10⁻³) = 2.22.` },
  ],
}

const MT1_RUBRIC: Source = {
  id: 'MT1-2025-RUBRIC',
  kind: 'exam',
  title: 'Midterm 1 · Fall 2025 grading rubric',
  date: '2025-10-16',
  meta: '4 pages · internal',
  origin: 'Canvas › Files › Staff only',
  proposed: 'excluded',
  mode: 'answer',
  note: 'Recommend leaving this out: it lists TF point deductions, which is grading guidance for staff rather than something students should be quoted.',
  passages: [
    { id: 'MT1-2025-R1', loc: 'Problems 1–2', text: `Problem 1 (6 pts, 3 per part): −1 wrong significant figures; −1 missing unit. Problem 2 (10 pts): −3 limiting reagent chosen by comparing grams; −2 mole ratio not taken from the balanced equation; −1 last-digit error caused by rounding intermediates. "30 g" with no work: 2 of 10 maximum. TFs: if the limiting reagent is wrong but carried through correctly, award follow-through credit.` },
    { id: 'MT1-2025-R2', loc: 'Problems 3–4', text: `Problem 3 (10 pts): −3 temperature left in °C; −2 R with the wrong units; −1 significant figures. Problem 4 (10 pts): −3 sign error (metal treated as gaining heat); −2 water mass used for the metal; −1 ΔT computed as initial minus final when the final answer is otherwise correct. Do not award credit for a negative specific heat.` },
    { id: 'MT1-2025-R3', loc: 'Problems 5–6', text: `Problem 5 (8 pts): −2 for each equation reversed without flipping the sign; −2 for an equation multiplied without scaling ΔH; −1 missing sign on the final answer. Problem 6 (12 pts): −2 if the 5% check is missing, even when the number is right; −3 ICE table in moles; −4 x dropped from the numerator; −1 significant figures.` },
    { id: 'MT1-2025-R4', loc: 'Problems 7–8', text: `Problem 7 (12 pts, 3 per part): no credit for a direction without a reason. Part (a): "shifts right because pressure increases" earns 0 of 3; this was the most common wrong answer. Problem 8 (10 pts): −1 pH not reported to two decimal places; −2 missing 5% check; −3 Ka expression includes water. Disputed regrades go to Prof. Marsh.` },
  ],
}

const ED_MARSH: Source = {
  id: 'ED-MARSH',
  kind: 'ed',
  title: 'Your answers on Ed',
  date: '2026-10-03',
  meta: '41 posts · this term',
  origin: 'Ed Discussion › Posts by Ellen Marsh (staff)',
  proposed: 'approved',
  mode: 'answer',
  passages: [
    { id: 'ED-01', loc: 'Ed #23', text: `Keep at least one or two extra digits in every intermediate result (I usually just leave everything in the calculator) and round once, at the final answer. If you round 0.22679 mol to 0.23 mol halfway through, your final answer can be off in the last significant figure, and that's a real error, not a formatting one. The cube example on slide 9 of Lecture 1 shows it: 3.06 versus 3.07 g cm⁻³ from the same data. It's fine to write rounded intermediates on the page, as long as you calculate with the unrounded ones.` },
    { id: 'ED-02', loc: 'Ed #108', text: `They're the same constant in different units. If pressure is in atm and volume in liters, use R = 0.08206 L atm mol⁻¹ K⁻¹. If you need an energy in joules (kinetic energy, u_rms, anything thermochemical), use R = 8.314 J mol⁻¹ K⁻¹. The test: write R with its units in your setup and see whether everything cancels to what you want. If you're left with L atm when you wanted joules, you picked the wrong R. And for Kp = Kc(RT)^Δn, it's 0.08206.` },
    { id: 'ED-03', loc: 'Ed #67', text: `Don't compare grams, and don't compare moles directly either unless the coefficients are equal. Convert each reactant to moles and divide by its coefficient in the balanced equation; the smallest number is the limiting reagent. In the Al/Cl₂ example from Lecture 4 there are more grams of Cl₂, but 0.4937 mol ÷ 3 = 0.1646 is smaller than aluminum's 0.3706 mol ÷ 2 = 0.1853, so chlorine limits. Then calculate every product from the limiting reagent.` },
    { id: 'ED-04', loc: 'Ed #91', text: `Liters of solution. Molarity is moles of solute per liter of the final solution, which is why we fill a volumetric flask to the line after dissolving. If a problem says "dissolved in enough water to make 250.0 mL of solution," use 0.2500 L. If it says "dissolved in 250.0 mL of water," the solution volume isn't exactly 250.0 mL, and the problem should tell you to assume it is; on our problem sets, it will.` },
    { id: 'ED-05', loc: 'Ed #146', text: `The thermometer is measuring the water, not the reaction. If the water warms up, the water gained heat (q_solution positive), and that heat came from the reaction, so the reaction lost it: q_rxn = −q_solution, which is negative, so the reaction is exothermic. Endothermic is the reverse: the water cools, q_solution is negative and q_rxn is positive. Write the minus sign explicitly every time. A molar ΔH without a sign will be read as positive.` },
    { id: 'ED-06', loc: 'Ed #168', text: `Two independent operations. Reversing flips the sign. Multiplying by a number multiplies ΔH by that number. If you do both, do both: reversing CO(g) + ½ O₂(g) → CO₂(g), ΔH = −283.0 kJ mol⁻¹, and doubling it gives 2 CO₂(g) → 2 CO(g) + O₂(g), ΔH = +566.0 kJ mol⁻¹. Write the adjusted ΔH beside every line before you add; most errors I see are a line that got reversed in the equation but not in the ΔH.` },
    { id: 'ED-07', loc: 'Ed #184', text: `Because their "concentration" can't change. The concentration of a pure solid is its density divided by its molar mass, a fixed number whether you have a gram or a kilogram. Formally, K is written in terms of activities, and the activity of a pure solid or liquid is 1, so it drops out. Practical consequence: for CaCO₃(s) ⇌ CaO(s) + CO₂(g), Kc = [CO₂], and adding more CaCO₃ doesn't shift anything. The solids are still in the reaction; they're just not in K.` },
    { id: 'ED-08', loc: 'Ed #201', text: `It depends on the state symbol. H₂O(l) as the solvent in an aqueous reaction: leave it out, because it's a pure liquid. H₂O(g) in a gas-phase reaction: it's a gas like any other, and it goes in, with its coefficient as the exponent. So for 3 Fe(s) + 4 H₂O(g) ⇌ Fe₃O₄(s) + 4 H₂(g), Kc = [H₂]⁴/[H₂O]⁴. "It doesn't matter much" is not the rule. Including H₂O(g) and excluding H₂O(l) are both required, and getting it wrong changes the number.` },
    { id: 'ED-09', loc: 'Ed #216', text: `Yes, show it, every time. After you solve with the approximation, write one line: x ÷ initial concentration × 100% = __%, followed by "< 5%, approximation OK" (or "> 5%, solve the quadratic"). The approximation is a claim that x is negligible; the check is the evidence. An answer that happens to be right but skips the check is an unjustified answer, and that's how it will be graded.` },
    { id: 'ED-10', loc: 'Ed #221', text: `Two things I see in almost every wrong ICE table. First, moles instead of molarity: convert to M before you fill in the Initial row (unless the volume is 1.00 L, the only time they match). Second, inconsistent x: define x once, as the change for a species with coefficient 1, and write every change as x times its coefficient: −x, −3x, +2x. Then in K, square the whole (2x), not just the x: (2x)² = 4x².` },
    { id: 'ED-11', loc: 'Ed #247', text: `No shift. Adding argon to a rigid container raises the total pressure, but each reacting gas's partial pressure is P = nRT/V, and none of n, T or V changed for N₂, H₂ or NH₃. Q is built from those partial pressures, so Q still equals K. Compare compressing the container: that changes V, so every partial pressure changes and the reaction shifts toward fewer moles of gas. An inert gas only matters if it changes the volume, for example if it's added at constant total pressure, so the container expands.` },
    { id: 'ED-12', loc: 'Ed #252', text: `Only temperature changes K. Concentration changes, volume changes and catalysts don't. Adding a reactant shifts the position of equilibrium, but once equilibrium is re-established, the new concentrations plugged into K give the same K as before. Raising the temperature does change K: for an exothermic reaction K decreases as T goes up, and for an endothermic reaction it increases. A catalyst speeds up both directions equally, so you reach the same equilibrium sooner.` },
    { id: 'ED-13', loc: 'Ed #131', text: `Regrade requests go through Gradescope within one week of grades being released: open the question, click "Request Regrade," and say specifically what you think was misgraded, referring to the posted solutions. The TF who graded it looks first, and I look at anything that's still disputed. Heads-up: the whole problem can be re-examined. Please don't post individual grading questions on Ed.` },
    { id: 'ED-14', loc: 'Ed #77', text: `Everyone has two 48-hour extensions for the term, no explanation needed. Use the extension form linked on the Canvas home page before the deadline; Priya (head TF) approves them. Once you've used both, contact Priya and your resident dean if something serious comes up. And if you're on an extension, please don't open the posted solutions until you've submitted.` },
    { id: 'ED-15', loc: 'Ed #279', text: `Logs are the exception to the usual counting. The number of decimal places in the pH equals the number of significant figures in [H₃O⁺]. [H₃O⁺] = 2.5 × 10⁻⁴ M has two significant figures, so pH = 3.60, with two decimal places. The "3" only tells you the power of ten. Going the other way, pH 4.20 gives [H₃O⁺] = 6.3 × 10⁻⁵ M, two significant figures.` },
    { id: 'ED-16', loc: 'Ed #284', text: `No. The syllabus is clear on this: AI tools may not be used to solve, check or write up problem sets, and pasting a problem-set question into one counts. Asking an AI (or a friend, or the textbook) to explain a concept is fine. If you want an answer checked, that's exactly what TF office hours are for, Sunday through Thursday, 7–10 pm.` },
  ],
}

const ED_TF: Source = {
  id: 'ED-TF',
  kind: 'ed',
  title: 'TF answers on Ed',
  date: '2026-10-03',
  meta: '187 posts · this term',
  origin: 'Ed Discussion › Posts by staff',
  proposed: 'excluded',
  mode: 'answer',
  note: "Some TF answers explain things differently than you do. Left out until you've looked.",
  passages: [
    { id: 'EDTF-01', loc: 'Ed #119', text: `For Gradescope: upload one PDF and assign pages to every problem before the deadline. If you don't assign pages, the grader may not find your work. You can resubmit as many times as you like before 11:59 pm, and only the last submission is graded.` },
    { id: 'EDTF-02', loc: 'Ed #144', text: `I'd round your moles to 2 sig figs right after you calculate them (so 0.2268 mol → 0.23 mol). Your data only has 3 sig figs anyway, it keeps the arithmetic cleaner, and the final answer will be close enough.` },
    { id: 'EDTF-03', loc: 'Ed #198', text: `For water, honestly it doesn't matter much whether it's a gas or not. The concentration of water is basically constant either way, so you can include it or leave it out and you'll be fine. Most people just leave it out to keep things simple.` },
    { id: 'EDTF-04', loc: 'Ed #228', text: `If K is smaller than about 10⁻³ you can always drop the x in the denominator, no need to check. It'll be fine for anything on the problem sets.` },
    { id: 'EDTF-05', loc: 'Ed #245', text: `Adding argon increases the total pressure, so by Le Châtelier the reaction shifts toward the side with fewer moles of gas to relieve the pressure. Same as compressing it.` },
  ],
}

export const materials: Source[] = [SYL, PS5, PS4, MT1, MT1_RUBRIC, ED_MARSH, ED_TF]
