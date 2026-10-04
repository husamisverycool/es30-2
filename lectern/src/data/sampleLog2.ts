// Sample log, part 2: Thu Oct 1 night (the PS4 rush) through Sat Oct 3 noon.
import { entry } from './logHelpers'
import type { LogEntry } from './types'

export const sampleLogB: LogEntry[] = [
  entry('LOG-33', '2026-10-01T21:14', '4263', 'Gas laws',
    `how do i use the van der waals equation with a and b to get the pressure`,
    'not_covered',
    `Prof. Marsh's materials only treat the van der Waals equation qualitatively, so there's no worked method from her lectures to give you. In Lecture 7 she said that a corrects for attractions and b for molecular volume, that real gases deviate most at high pressure and low temperature, and that you won't calculate with the van der Waals equation on problem sets or exams. [[L7-09]]

If you're curious beyond that, Brown has a table of a and b values, and Ed or office hours are the place to ask. [[L7-09]]`),

  entry('LOG-34', '2026-10-01T21:36', '4307', 'Calorimetry',
    `in calorimetry do i use the mass of the solute or the whole solution for m in q = mcΔT`,
    'answered',
    `The whole solution. In coffee-cup calorimetry, the solution absorbs the reaction's heat, so q_solution uses the mass of the solution. [[L8-07]] In Prof. Marsh's neutralization example, 50.0 mL of HCl plus 50.0 mL of NaOH is treated as 100.0 g of solution with the specific heat of water, so q_solution = 100.0 g × 4.184 J g⁻¹ °C⁻¹ × 6.50 °C = 2719.6 J. [[L8-08]]

Using the mass of the solute instead of the whole solution is one of the common calorimetry errors she lists, along with getting the sign of q_rxn backwards. [[L8-10]]

See 32:30 in Lecture 8 (slide 12).`),

  entry('LOG-35', '2026-10-01T21:52', '1475', 'Equilibrium expressions',
    `do you leave solids out of Q too or just K`,
    'answered',
    `Out of Q too. Q has exactly the same form as K, just with the current concentrations instead of equilibrium ones. [[L10-11]] Since pure solids and pure liquids never appear in the equilibrium expression, they don't appear in Q either. [[L10-06]]

That's why adding more of a pure solid doesn't shift an equilibrium: for CaCO₃(s) ⇌ CaO(s) + CO₂(g), the solid isn't in Q, so Q doesn't change and there's no shift. [[L12-04]]

See 44:00 in Lecture 10 (slide 17) for Q, and 11:00 in Lecture 12 for the solid case.`),

  entry('LOG-36', '2026-10-01T22:15', '4459', 'ICE tables',
    `for ps4 #7 can you tell me if [NO2] = 0.0152 M? i used the small x approximation`,
    'declined_pset',
    `I can't check Problem Set 4 answers before the deadline; Prof. Marsh's syllabus doesn't allow AI tools to be used to solve or check problem sets. [[SYL-08]]

A nudge: an approximation is only as good as its check. After solving, divide x by the initial concentration it was subtracted from; if that's over 5%, the approximate answer can't be trusted and you need the quadratic. [[L11-10]] Also make sure your Initial row is in molarity, not moles. [[L11-03]]

See 32:30–39:50 in Lecture 11 for one case where the check passes and one where it fails.`),

  entry('LOG-37', '2026-10-01T22:33', '4581', "Enthalpy & Hess's law",
    `for the ΔHf of O2 do i use 0 or do i have to look it up`,
    'answered',
    `Use zero. ΔH°f is the enthalpy change to form one mole of a compound from its elements in their standard states, so for an element in its standard state, like O₂(g) or C(graphite), it's zero by definition. [[L9-09]] Then ΔH°rxn = Σ n ΔH°f(products) − Σ n ΔH°f(reactants), with each value multiplied by its coefficient. [[L9-09]]

In Prof. Marsh's methane example, O₂ contributes nothing, and products minus reactants is −965.1 − (−74.8) = −890.3 kJ mol⁻¹. Watch the double negative. [[L9-10]]

See 38:10 in Lecture 9 (slide 13).`),

  entry('LOG-38', '2026-10-01T22:49', '4626', 'Course logistics',
    `can i get an extension on ps4? i have two midterms tomorrow`,
    'sent_to_tfs',
    `Extensions go through the head TF, so I've flagged this for the teaching staff. Every student has two 48-hour extensions per term, no reason needed: request one before the deadline using the extension form linked on the Canvas home page, and Priya Raghunathan approves it, usually within a day. [[SYL-06]] PS4 is due Friday, October 2, so submit the form tonight. [[L10-12]]`),

  entry('LOG-39', '2026-10-01T23:05', '4795', 'ICE tables',
    `in the change row why is it -3x for H2 and not -x`,
    'answered',
    `Because changes follow the coefficients. Define x once, as the change for a species with coefficient 1, and multiply it by each coefficient: for N₂ + 3 H₂ ⇌ 2 NH₃ going forward, that's −x for N₂, −3x for H₂ and +2x for NH₃. [[L11-04]] The coefficients are mole ratios, so every time one N₂ reacts, three H₂ react with it. [[L4-01]]

Prof. Marsh is particular about keeping x consistent: one x, defined once, not x in one column and y in another. [[L11-04]] When you substitute into K, raise the whole term to its power, coefficient included, just as (2x)² = 4x². [[ED-10]]

See 10:50 in Lecture 11 (slide 5).`),

  entry('LOG-40', '2026-10-01T23:21', '4830', "Enthalpy & Hess's law",
    `what does the per mole in kJ mol-1 mean for ΔH, per mole of what?`,
    'answered',
    `Per mole of reaction, as written. For CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(l), ΔH°rxn = −890.3 kJ mol⁻¹ refers to one mole of CH₄ reacting with two moles of O₂. [[L9-03]] If you double the equation, ΔH doubles too, to −1780.6 kJ. [[L9-04]]

To find the heat for an actual amount, convert to moles. In Prof. Marsh's example, 4.00 g CH₄ is 0.2494 mol, and with one mole of CH₄ per mole of reaction, q = −222 kJ, so 222 kJ of heat is released. [[L9-05]]

See 9:00 and 18:30 in Lecture 9 (slides 5 and 7).`),

  entry('LOG-41', '2026-10-01T23:40', '4972', 'Equilibrium expressions',
    `ps4 5b is Kp = 2.81 x 10^-5? not sure which R i was supposed to use`,
    'declined_pset',
    `I can't confirm Problem Set 4 answers before the deadline; the course's AI policy doesn't allow it. [[SYL-08]]

On the R question, though, the general rule is fair game: in Kp = Kc(RT)^Δn, R is 0.08206 L atm mol⁻¹ K⁻¹, T is in kelvin, and Δn is moles of gaseous products minus moles of gaseous reactants. [[L10-05]] In general, pick R by the units the expression needs. [[ED-02]]

Prof. Marsh covers Kp and Kc at 17:20 in Lecture 10 (slide 8).`),

  entry('LOG-42', '2026-10-01T23:54', '5018', 'Le Châtelier',
    `why does compressing shift toward fewer moles of gas, like mathematically why`,
    'answered',
    `Prof. Marsh's Q argument shows it. Halve the volume of N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g) and every partial pressure doubles instantly, because P = nRT/V. In Qp = P(NH₃)² / (P(N₂) P(H₂)³), the numerator goes up by 2² = 4 and the denominator by 2⁴ = 16, so Q is multiplied by a quarter. Q is now less than K, so the reaction shifts right, toward fewer moles of gas. [[L12-06]]

The fewer-moles rule is just a summary of that arithmetic. [[L12-06]] If both sides have the same number of moles of gas, a volume change causes no shift at all. [[L12-05]]

See 18:20 in Lecture 12 (slide 8).`),

  entry('LOG-43', '2026-10-02T00:12', '5164', 'ICE tables',
    `do i round x before plugging back into K to check?`,
    'answered',
    `No. Keep the unrounded x for every later step, including computing the other concentrations and plugging back in. Prof. Marsh's warning: rounding x to one digit is how a correct ICE table produces a wrong answer. [[L11-13]] In her PCl₅ example, the check uses the unrounded values, 0.07165 squared over 0.12835, and returns 0.0400. [[L11-12]]

This is the same rule she's insisted on since the first week: carry extra digits through every intermediate step and round once, at the final answer. [[L1-06]]

See 43:30 in Lecture 11 (slide 16).`),

  entry('LOG-44', '2026-10-02T00:29', '0951', 'ICE tables',
    `when K is like 50 can i still use the small x approximation`,
    'answered',
    `Almost certainly not. The approximation needs x to be tiny compared with the initial concentration, which happens when K is small; Prof. Marsh's rule of thumb is an initial concentration more than a few hundred times K. [[L11-13]] With K around 50, that's nowhere close.

In her H₂ + I₂ ⇌ 2 HI example with Kc = 50.5, she didn't approximate at all: the expression was a perfect square, so she took the square root of both sides and solved exactly, getting x = 0.3902 M. [[L11-07]] When there's no perfect square, solve the quadratic and keep the positive root. [[L11-12]]

See 21:40 in Lecture 11 (slide 8).`),

  entry('LOG-45', '2026-10-02T00:47', '5291', 'Calorimetry',
    `is ΔT final minus initial or initial minus final, i keep getting the wrong sign`,
    'answered',
    `Final minus initial, always. With ΔT = T_final − T_initial in q = m c ΔT, a temperature drop gives a negative ΔT, and the sign of q comes out right on its own. [[L8-05]]

Then remember whose q you have: the thermometer measures the solution, so for the reaction, q_rxn = −q_solution. If the solution warms up, the reaction is exothermic and q_rxn is negative. [[L8-07]] Write the sign explicitly in your final answer, because a molar ΔH without a sign will be read as positive. [[ED-05]]

See 18:00 in Lecture 8 (slide 8) and 27:40 for coffee-cup calorimetry.`),

  entry('LOG-46', '2026-10-02T01:10', '1529', 'Equilibrium expressions',
    `ps4 4b do i include H2O(g) in K or not, just yes or no`,
    'declined_pset',
    `I can't answer Problem Set 4 questions directly before the deadline, even as a yes or no; the syllabus doesn't allow AI tools to be used to solve or check problem sets. [[SYL-08]]

What I can point you to is the rule itself: whether water belongs in K depends on its state symbol, and Prof. Marsh contrasts the two cases side by side. [[L10-07]] Look at the state symbol on the water in your reaction and apply that rule.

It's at 26:30–31:00 in Lecture 10 (slide 12).`),

  entry('LOG-47', '2026-10-02T01:26', '2045', 'Course logistics',
    `i submitted the extension form about an hour ago and haven't heard back, ps4 is due tonight. am i ok?`,
    'sent_to_tfs',
    `I can't see or approve extension requests, so I've passed this to the teaching staff. The head TF, Priya Raghunathan, approves extensions submitted through the form, usually within a day, and the request just has to be made before the deadline. [[SYL-06]] Yours went in well before Friday night, so keep an eye on your email, and if you haven't heard by Friday afternoon, email Priya directly. [[SYL-02]]`),

  entry('LOG-48', '2026-10-02T01:48', '3482', 'Equilibrium expressions',
    `if i multiply a reaction by 2 does K double?`,
    'answered',
    `No, it gets squared. Multiplying a reaction by n raises K to the nth power; reversing a reaction gives 1/K; adding reactions multiplies their K values. [[L10-10]] Prof. Marsh's warning is not to carry over the enthalpy rules: adding and scaling are what you do with ΔH, and they're wrong for K. [[L10-10]]

You can see it from the expression itself: coefficients become exponents in K, so doubling every coefficient doubles every exponent, which squares the whole expression. [[L10-03]]

See 39:40 in Lecture 10 (slide 15).`),

  entry('LOG-49', '2026-10-02T11:27', '0587', 'Acids & pH',
    `why isn't water in the Ka expression? it's a reactant`,
    'answered',
    `Because it's the liquid solvent. For HA(aq) + H₂O(l) ⇌ H₃O⁺(aq) + A⁻(aq), Ka = [H₃O⁺][A⁻] / [HA], and water is left out because it's a pure liquid. [[L13-07]] It's the same rule from Lecture 10: pure solids and liquids never appear in an equilibrium expression, because their activity is 1. [[L10-06]]

Water is left out of Kw for the same reason: 2 H₂O(l) ⇌ H₃O⁺(aq) + OH⁻(aq) gives Kw = [H₃O⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 25 °C. [[L13-03]]

See 22:00 in Lecture 13 (slide 12).`),

  entry('LOG-50', '2026-10-02T11:40', '1820', 'Acids & pH',
    `how many decimal places should pH have?`,
    'answered',
    `As many as the significant figures in the concentration. For logarithms, the decimal places in the pH match the significant figures in [H₃O⁺]. [[L13-05]] So [H₃O⁺] = 2.5 × 10⁻⁴ M, with two significant figures, gives pH = 3.60, with two decimal places; the leading 3 only reflects the power of ten. [[L13-05]]

Prof. Marsh's strong-acid examples follow the same rule: 0.020 M HCl gives pH 1.70, and 0.0050 M NaOH gives pOH 2.30 and pH 11.70. [[L13-06]]

See 14:40 in Lecture 13 (slide 8).`),

  entry('LOG-51', '2026-10-02T12:05', '2203', 'Acids & pH',
    `whats the difference between H3O+ and H+ in this class, can i write either`,
    'answered',
    `In concentrations, either is fine: Prof. Marsh said she'll write H₃O⁺ and H⁺ interchangeably in concentrations, but H₃O⁺ in equations. [[L13-02]] H₃O⁺, the hydronium ion, is what actually forms when an acid donates a proton to water, as in HCl(aq) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq). [[L13-02]]

So write equations with H₃O⁺ and the water shown explicitly, like HA(aq) + H₂O(l) ⇌ H₃O⁺(aq) + A⁻(aq), using ⇌ because a weak acid's ionization is an equilibrium. [[L13-07]]

See 3:40 in Lecture 13 (slide 3).`),

  entry('LOG-52', '2026-10-02T14:32', '2714', 'Le Châtelier',
    `ps5 5a(i), argon added at constant volume, it's no shift right? since the partial pressures don't change`,
    'declined_pset',
    `I can't confirm answers to Problem Set 5; the syllabus doesn't allow AI tools to be used to solve or check problem sets, and that includes yes-or-no checks. [[SYL-08]]

Since the problem asks you to justify each prediction, make sure your write-up says what happens to Q and why, in terms of what changed for the reacting gases. Prof. Marsh's framework is to state what happened to Q or to K, because that one sentence is most of the reasoning. [[L12-02]]

The constant-volume inert-gas case is at 22:00 in Lecture 12 (slide 9).`),

  entry('LOG-53', '2026-10-02T15:10', '0412', 'Acids & pH',
    `how do i find the pH of a buffer made from acetic acid and sodium acetate?`,
    'not_covered',
    `Prof. Marsh hasn't taught buffers yet, so I can't explain this from her materials. She covers them on Monday, October 5, in Lecture 14, along with the Henderson–Hasselbalch equation, and she asked the class not to use Henderson–Hasselbalch until you've done it together. [[SYL-12]] [[L13-12]]

Buffers will be on Midterm 1, which covers Lectures 1 through 14. [[SYL-09]] If you'd like a head start before Monday, Ed or office hours are the place to ask.`),

  entry('LOG-54', '2026-10-02T18:45', '3770', 'Acids & pH',
    `if Ka is smaller is the acid weaker or stronger? and what's pKa for`,
    'answered',
    `Weaker: the smaller Ka is, the weaker the acid. pKa is −log Ka, the same move as pH, so smaller Ka means larger pKa means weaker acid. Acetic acid, with Ka = 1.8 × 10⁻⁵, has pKa = 4.74. [[L13-07]]

For comparison, HF has Ka = 6.8 × 10⁻⁴, larger than acetic acid's, which makes HF the stronger of those two weak acids. [[L13-10]] Strong acids like HCl ionize completely, so for them [H₃O⁺] is just the acid concentration and no Ka or ICE table is needed. [[L13-06]]

See 22:00 in Lecture 13 (slide 12).`),

  entry('LOG-55', '2026-10-02T20:45', '2476', 'ICE tables',
    `for ps5 3a is x = 0.010? the 5% check comes out around 4% so it passes`,
    'declined_pset',
    `I can't check Problem Set 5 answers; Prof. Marsh's syllabus doesn't allow AI tools to be used to solve or check problem sets. [[SYL-08]]

One thing worth double-checking yourself: the 5% check compares the change with the initial concentration it was subtracted from. [[L11-10]] When a species has a coefficient other than 1, its change is x times that coefficient, so make sure you're dividing the right quantity. [[L11-04]]

See 10:50 and 32:30 in Lecture 11 (slides 5 and 12).`),

  entry('LOG-56', '2026-10-02T21:30', '3615', 'Equilibrium expressions',
    `can Q be bigger than K? what does that even mean`,
    'answered',
    `Yes. Q uses whatever concentrations you have right now, so it can be bigger than, smaller than or equal to K. If Q is greater than K, the reaction proceeds in reverse until Q equals K; if Q is less than K, there are too few products and it proceeds forward. [[L10-11]]

Prof. Marsh's example: with Kc = 0.105 for the ammonia reaction and [N₂] = 0.50 M, [H₂] = 0.40 M and [NH₃] = 0.10 M, Q = 0.31, which is greater than K, so it shifts left. [[L10-11]] Comparing Q with K is also how you choose signs in an ICE table that starts from a mixture. [[L11-05]]

See 44:00 in Lecture 10 (slide 17).`),

  entry('LOG-57', '2026-10-02T22:40', '4307', 'Le Châtelier',
    `if a problem just says "the pressure is increased" and doesn't say how, what should i assume`,
    'answered',
    `Assume it means compression, and say in your answer that you're assuming that. [[L12-08]] Prof. Marsh flags the phrase as ambiguous: compressing the container changes every reacting partial pressure and shifts the equilibrium toward fewer moles of gas, while adding an inert gas at constant volume raises the total pressure without changing any reacting partial pressure, so there's no shift. [[L12-08]]

If the problem does mention an inert gas, check whether the volume changes. At constant volume there's no shift; at constant total pressure the container expands and the system shifts toward more moles of gas. [[L12-10]]

See 25:40 in Lecture 12.`),

  entry('LOG-58', '2026-10-03T00:35', '3846', 'Acids & pH',
    `percent ionization is the same number as the 5% check right?`,
    'answered',
    `For a weak acid, yes. Percent ionization is x over the initial acid concentration, times 100%, which is the same ratio as the 5% check, so the numbers match; for 0.10 M acetic acid, both are 1.3%. [[L13-09]]

They answer different questions, though. The 5% check tells you whether the small-x approximation was justified. [[L11-10]] Percent ionization tells you what fraction of the acid is ionized, here about one molecule in seventy-five, and it increases as a weak acid gets more dilute. [[L13-09]]

See 29:30 in Lecture 13 (slide 14).`),

  entry('LOG-59', '2026-10-03T09:15', '4120', 'Acids & pH',
    `is the pH for ps5 6a around 2.1? i used the quadratic because the approximation was borderline`,
    'declined_pset',
    `I can't check Problem Set 5 answers, even approximately; the syllabus doesn't allow AI tools to be used to solve or check problem sets. [[SYL-08]]

A way to check yourself: after solving, substitute your x back into the Ka expression and see whether you recover the given Ka. Prof. Marsh does this after her examples because it catches most mistakes. [[L11-07]] And report the pH with as many decimal places as your concentration has significant figures. [[L13-05]]

Her quadratic weak-acid example is at 33:10 in Lecture 13 (slide 16).`),

  entry('LOG-60', '2026-10-03T09:35', '1188', 'Equilibrium expressions',
    `looking at the ps4 solutions, why does 4b include water? i left it out`,
    'answered',
    `In 4b, 4 NH₃(g) + 5 O₂(g) ⇌ 4 NO(g) + 6 H₂O(g), the water is a gas, so it belongs in the expression: Kc = [NO]⁴[H₂O]⁶ / ([NH₃]⁴[O₂]⁵). The posted solution notes that leaving it out was the most common error on that problem. [[PS4-4]]

The rule is about the state symbol: water as a liquid solvent is left out, but water as a gas goes in like any other gas. [[L10-07]] Prof. Marsh also said on Ed that "it doesn't matter much" isn't the rule; including H₂O(g) is required, and leaving it out changes the number. [[ED-08]]

The lecture discussion is at 26:30 in Lecture 10 (slide 12).`),

  entry('LOG-61', '2026-10-03T09:58', '4795', 'Acids & pH',
    `what's the pH of 0.10 M NaF? F- is a base so do i use Kb?`,
    'not_covered',
    `Prof. Marsh hasn't covered weak bases or the pH of salt solutions yet, so I can't work through this from her materials. Weak bases, Kb and salt solutions are Lecture 15, on Wednesday, October 7, and that lecture is not on Midterm 1. [[SYL-12]]

What she has covered so far is weak acids and Ka, including HF itself, with Ka = 6.8 × 10⁻⁴. [[L13-10]] For questions about F⁻ as a base before Wednesday, post on Ed or come to office hours.`),

  entry('LOG-62', '2026-10-03T10:20', '1302', 'Course logistics',
    `my section conflicts with my new work-study shift, how do i switch sections`,
    'sent_to_tfs',
    `Section changes are handled by the head TF, Priya Raghunathan, so I've passed your question to the teaching staff. [[SYL-02]] Email her with your current section and the times you're free; for anything personal, the syllabus asks you to email course staff directly rather than posting on Ed. [[SYL-02]] Section participation counts for 5% of the course grade, so it's worth sorting out soon. [[SYL-04]]`),

  entry('LOG-63', '2026-10-03T10:44', '5291', 'ICE tables',
    `ps4 #7, why did the small x approximation fail there? K was pretty small (4.64 x 10^-3)`,
    'answered',
    `Small isn't small enough unless it's small compared with the initial concentration. Prof. Marsh's rule of thumb is that the approximation tends to work when the initial concentration divided by K is more than a few hundred. [[L11-13]] In Problem 7, [N₂O₄]₀ was 0.0500 M and Kc was 4.64 × 10⁻³, a ratio of only about 11. Sure enough, the approximation gave x = 7.62 × 10⁻³ M, which is 15% of 0.0500 M, so it failed the 5% check and the solution used the quadratic. [[PS4-7]]

Her own failing example, PCl₅, had a ratio of five. Either way, the 5% check, not the rule of thumb, is what decides. [[L11-13]]

See 43:30 in Lecture 11 (slide 16).`),

  entry('LOG-64', '2026-10-03T11:05', '1664', 'ICE tables',
    `ps5 2a can you check my ice table setup? i put 0.750 in the initial row for CO and H2O`,
    'declined_pset',
    `I can't check setups for Problem Set 5; the syllabus doesn't allow AI tools to be used to solve or check problem sets, and that includes reviewing your work on one. [[SYL-08]]

A general reminder that applies to every ICE table: for Kc, the Initial row must be in molarity, not moles, so look at the units the problem gives and whether a volume is involved. [[L11-03]] Prof. Marsh explains why at 7:10 in Lecture 11 (slide 4). TF office hours, Sunday–Thursday 7–10 pm, are a good place to have a person look at your setup. [[SYL-02]]`),
]
