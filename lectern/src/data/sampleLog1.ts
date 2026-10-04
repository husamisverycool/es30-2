// Sample log, part 1: Mon Sep 28 – Thu Oct 1 afternoon. What the tutor would have
// said had it been live this week.
import { entry } from './logHelpers'
import type { LogEntry } from './types'

export const sampleLogA: LogEntry[] = [
  entry('LOG-01', '2026-09-28T00:41', '0412', "Enthalpy & Hess's law",
    `is ps4 #2 supposed to come out positive? i got +226.8 kJ/mol for the acetylene one, can you check`,
    'declined_pset',
    `I can't check Problem Set 4 answers while it's still open; Prof. Marsh's syllabus doesn't allow AI tools to be used to solve or check problem sets. [[SYL-08]]

A nudge you can use to check yourself: for each given equation, decide whether it has to be reversed so the target compound lands on the correct side, and whether it has to be multiplied. Write the adjusted ΔH beside each line, sign flipped and scaled, then confirm that everything not in the target cancels. [[L9-08]]

Her strategy is at 33:20 in Lecture 9 (slide 11), with a fully worked example at 28:10.`),

  entry('LOG-02', '2026-09-28T01:18', '0587', "Enthalpy & Hess's law",
    `when you reverse an equation in hess's law and it has 1/2 O2 in it, do i have to multiply to get rid of the fraction?`,
    'answered',
    `No, fractions are fine in thermochemistry. Prof. Marsh wants whole-number coefficients in an ordinary balanced equation, but she said in Lecture 3 that in thermochemistry you'd use fractions on purpose. [[L3-08]] In her Hess's law example, the target is C(s) + ½ O₂(g) → CO(g), and the given CO(g) + ½ O₂(g) → CO₂(g) is reversed with its half O₂ intact; adding the two gives ΔH = −393.5 + 283.0 = −110.5 kJ mol⁻¹. [[L9-07]]

What matters is that each equation matches the target. If you do multiply an equation, multiply its ΔH by the same factor, and if you reverse it, flip the sign. [[L9-04]]

The example is at 28:10 in Lecture 9 (slide 10).`),

  entry('LOG-03', '2026-09-28T11:26', '0733', 'ICE tables',
    `in the ICE table why is the change 2x for HI and not just x`,
    'answered',
    `Because the Change row follows the coefficients. Define x once, as the change for a species with coefficient 1, and every other change is x times its coefficient, with minus signs for what's used up and plus signs for what's made. [[L11-04]] In H₂(g) + I₂(g) ⇌ 2 HI(g), H₂ and I₂ each have coefficient 1, so they change by −x, and HI has coefficient 2, so it changes by +2x. [[L11-06]]

Then when you substitute into K, the exponent squares the whole thing, including the 2: (2x)² = 4x². [[L11-06]]

Prof. Marsh covers the Change row at 10:50 and this example at 18:10 in Lecture 11 (slides 5 and 8).`),

  entry('LOG-04', '2026-09-28T11:34', '0951', 'ICE tables',
    `do we put moles or concentration in the ice table? the problem gives moles and liters`,
    'answered',
    `Concentration. For Kc, the entries in an ICE table are molarities, so divide moles by liters before you fill in the Initial row. [[L11-03]] Prof. Marsh's example: 1.00 mol H₂ and 1.00 mol I₂ in a 2.00-L flask start at 0.500 M each, not 1.00. The only time moles and molarity are the same number is in a 1.00-L container. [[L11-03]]

If the problem is about Kp instead, you can run the same table in partial pressures, in atm. [[L11-03]] Either way, define x once and multiply it by each coefficient in the Change row. [[L11-04]]

This is at 7:10 in Lecture 11 (slide 4).`),

  entry('LOG-05', '2026-09-28T11:52', '1046', 'ICE tables',
    `when can we use the small x approximation?`,
    'answered',
    `When K is small compared with the initial concentration, so that x will be tiny next to the numbers it's subtracted from. Prof. Marsh's rule of thumb is that it tends to work when the initial concentration divided by K is more than a few hundred, but the rule of thumb is not the check. [[L11-13]]

The check is the 5% rule: after solving, divide x by the initial concentration it was subtracted from, and if that's under 5%, the approximation is justified. Write that line out every time. [[L11-10]] And drop x only where it's added to or subtracted from a larger number, never in the numerator. [[L11-09]]

See 29:00–32:30 and 43:30 in Lecture 11 (slides 11, 12 and 16).`),

  entry('LOG-06', '2026-09-28T12:37', '1188', 'Equilibrium expressions',
    `does K have units? i wrote M^-2 next to mine in my notes`,
    'answered',
    `No. K is dimensionless, and it's the one exception to Prof. Marsh's rule about units on every number; everything else, including the concentrations you substitute into K, still carries its unit. [[L1-03]] The reason is that K is really built from activities, which have no units, so don't write units on K. [[L10-09]]

The size of K is what carries the information: much greater than 1 means products dominate at equilibrium, much less than 1 means reactants dominate, and around 1 you have significant amounts of both. [[L10-09]]

She says this at 35:20 in Lecture 10 (slide 14).`),

  entry('LOG-07', '2026-09-28T13:15', '1302', 'Course logistics',
    `gradescope says my ps3 is missing problem 4 but i definitely uploaded it?? what do i do`,
    'sent_to_tfs',
    `That needs a person to look at your submission, so I've passed it to the teaching staff. Gradescope problems are handled by the head TF, Priya Raghunathan. [[SYL-02]]

When you contact her, mention which pages problem 4 is on. Pages have to be assigned to each problem when you upload, and unassigned pages may not be graded, so that's the first thing to check. [[SYL-05]] If it turns out to be a grading question rather than an upload problem, submit a regrade request on Gradescope within one week of grades being released. [[SYL-10]]`),

  entry('LOG-08', '2026-09-28T19:48', '1475', 'ICE tables',
    `how do i know which way the reaction goes in the ice table if i start with some of everything`,
    'answered',
    `Calculate Q first and compare it with K. If Q is less than K, the reaction goes forward, so reactants get minus signs; if Q is greater than K, it goes in reverse and the signs flip. [[L11-05]] Q has the same form as K but uses the concentrations you have right now. [[L10-11]]

If you start with only reactants, it has to go forward, and with only products it has to go backward, so you only need Q for mixtures. [[L11-05]] And if you ever end up with a negative concentration, that's the sign you picked the wrong direction. [[L11-05]]

Prof. Marsh covers this at 14:30 in Lecture 11 (slide 6), and Q itself at 44:00 in Lecture 10.`),

  entry('LOG-09', '2026-09-28T21:05', '1529', 'Calorimetry',
    `ps4 problem 1, is ΔH positive or negative? the temperature dropped`,
    'declined_pset',
    `I can't answer Problem Set 4 questions before the deadline; the syllabus doesn't allow AI tools to be used to solve or check problem sets. [[SYL-08]]

A conceptual nudge: work out the sign of q for the solution from ΔT, which is always final minus initial. [[L8-05]] Then remember that the thermometer measures the surroundings, so the reaction's heat is the opposite: q_rxn = −q_solution. [[L8-07]] Whatever you conclude, write the sign explicitly.

Prof. Marsh explains this at 27:40 in Lecture 8 (slide 11), with a worked example right after at 32:30.`),

  entry('LOG-10', '2026-09-28T22:30', '0733', 'ICE tables',
    `on the PCl5 example how do you know which root of the quadratic to take`,
    'answered',
    `Take the root that gives physically sensible concentrations. In Prof. Marsh's PCl₅ example, x² + 0.0400x − 0.00800 = 0 has a positive root, x = 0.0717 M, and a negative root, which would mean a negative concentration of PCl₃ and Cl₂, so it's discarded. [[L11-12]]

Then check the result: [PCl₃] = [Cl₂] = 0.0717 M and [PCl₅] = 0.200 − 0.0717 = 0.128 M, and plugging the unrounded values back into K returns 0.0400. [[L11-12]] Plugging back in takes seconds and catches most mistakes. [[L11-07]]

The quadratic is at 39:50 in Lecture 11 (slide 14).`),

  entry('LOG-11', '2026-09-28T23:12', '1664', 'Equilibrium expressions',
    `if i flip a reaction what happens to K, do i make it negative like ΔH?`,
    'answered',
    `No, K gets inverted, not negated. Reversing a reaction makes the new K equal to 1/K; multiplying a reaction by n raises K to the n; adding reactions multiplies their K values. [[L10-10]] Prof. Marsh's example: N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g) has Kc = 0.105 at 472 °C, so the reverse reaction has Kc = 1/0.105 = 9.52. [[L10-10]]

Flipping the sign is the ΔH rule for a reversed equation, and it doesn't carry over to K. [[L9-04]] The K rules parallel Hess's law, but with multiplication where enthalpy uses addition. [[L10-10]]

It's at 39:40 in Lecture 10 (slide 15).`),

  entry('LOG-12', '2026-09-29T10:05', '1820', 'Significant figures',
    `for subtraction is it sig figs or decimal places? like 10.0 g − 8.879 g`,
    'answered',
    `Decimal places. For adding and subtracting, the answer keeps the decimal places of the least precise measurement; for multiplying and dividing, it's the fewest significant figures. [[L1-05]] So 10.0 g − 8.879 g is 1.121 g on the calculator, but 10.0 g is known only to the tenths place, and you report 1.1 g. [[L1-05]]

That exact subtraction shows up again in Lecture 4, as the aluminum left over in the limiting-reagent example. [[L4-07]] Prof. Marsh's advice is to write down which rule you're using, since mixing them up is common. [[L1-05]]

See 18:10 in Lecture 1 (slide 7).`),

  entry('LOG-13', '2026-09-29T15:22', '1937', 'Gas laws',
    `does PV = nRT work for each gas in a mixture separately, or only for the total pressure?`,
    'answered',
    `For each gas separately. In a mixture, each gas exerts the pressure it would exert if it were alone, and that partial pressure obeys the ideal gas law by itself: P_A = n_A RT/V. The partial pressures add up to the total pressure. [[L7-02]]

You can also get a partial pressure from the mole fraction: P_A = χ_A × P_total. In Prof. Marsh's example, 1.00 mol N₂ and 3.00 mol H₂ at 8.00 atm total give P(H₂) = 6.00 atm and P(N₂) = 2.00 atm. [[L7-03]]

She flagged that this comes back when we do equilibrium with gases, which is this week. [[L7-01]] It's at 4:30 in Lecture 7 (slide 3).`),

  entry('LOG-14', '2026-09-29T16:40', '2045', 'Stoichiometry',
    `is the coefficient in a balanced equation a mass ratio or a mole ratio? i used grams and got it wrong`,
    'answered',
    `A mole ratio. The coefficients in a balanced equation are mole ratios, not mass ratios. [[L4-01]] That's why Prof. Marsh's stoichiometry roadmap always goes through moles: grams of A to moles of A with A's molar mass, moles of A to moles of B with the coefficients, then moles of B to grams of B. You can't compare grams directly, because a gram of one substance and a gram of another contain very different numbers of molecules. [[L4-02]]

Her worked example: 10.0 g of propane is 0.2268 mol, which gives 3 × 0.2268 = 0.6804 mol CO₂, or 29.9 g. [[L4-03]]

See 4:10 in Lecture 4 (slide 3).`),

  entry('LOG-15', '2026-09-29T20:10', '2203', "Enthalpy & Hess's law",
    `does ΔG tell you if a reaction is at equilibrium? my roommate in another chem class says ΔG = 0 at equilibrium`,
    'not_covered',
    `Prof. Marsh hasn't covered Gibbs free energy yet, so I don't have her materials to explain it from. According to the course schedule, entropy and Gibbs free energy come after Midterm 1. [[SYL-12]]

For now, the tools she's given you for deciding whether a reaction is at equilibrium are Q and K: Q = K means equilibrium, and Q less than or greater than K tells you which way it will go. [[L10-11]] If you're curious about the connection before then, it's a good question for Ed or her Tuesday office hours, 2:00–3:30 pm. [[SYL-02]]`),

  entry('LOG-16', '2026-09-29T21:47', '1046', 'ICE tables',
    `do i really have to show the 5% check if the answer is obviously tiny`,
    'answered',
    `Yes. Prof. Marsh wants the check written out as a line in your work every time you use the approximation; on problem sets and exams, an unchecked approximation is an unjustified answer, even if the number happens to be right. [[L11-10]] On Ed she suggested the exact line: x ÷ initial concentration × 100% = __%, followed by "< 5%, approximation OK" or "> 5%, solve the quadratic." [[ED-09]]

It only takes one line. In her NO example, it's 6.3 × 10⁻⁴ M ÷ 0.20 M = 0.32%, so the approximation is justified. [[L11-10]]

See 32:30 in Lecture 11 (slide 12).`),

  entry('LOG-17', '2026-09-30T11:24', '2318', 'Le Châtelier',
    `if you add argon to the container why doesn't the equilibrium shift? the pressure literally went up`,
    'answered',
    `The total pressure went up, but nothing that appears in Q changed. In a rigid container at constant volume, each reacting gas's partial pressure is P = nRT/V: its own moles, the temperature and the volume. Adding argon changes none of those for N₂, H₂ or NH₃, so every partial pressure in Q is unchanged, Q still equals K, and there's no shift. [[L12-07]]

This is Dalton's law from Lecture 7: adding a second gas to a rigid container raises the total pressure but leaves each gas's partial pressure where it was. [[L7-02]]

Prof. Marsh explains it at 22:00 in Lecture 12 (slide 9).`),

  entry('LOG-18', '2026-09-30T11:31', '2476', 'Le Châtelier',
    `why did the syringe get darker first and then lighter when you pushed the plunger in`,
    'answered',
    `Two things happened in sequence. Pushing the plunger in halved the volume, which instantly doubled the concentration of everything, including the brown NO₂, so it got darker. Then the system shifted toward N₂O₄, the side with one mole of gas instead of two, so it got lighter. [[L12-09]] It didn't return all the way to the original color, because Le Châtelier's principle says the system partly counteracts the disturbance; it doesn't undo it. [[L12-09]]

The underlying rule: decreasing the volume shifts a gaseous equilibrium toward the side with fewer moles of gas. [[L12-05]]

The demo is at 29:10 in Lecture 12 (slide 10).`),

  entry('LOG-19', '2026-09-30T11:45', '2590', 'Le Châtelier',
    `does adding more CaCO3 solid shift CaCO3 -> CaO + CO2 to the right?`,
    'answered',
    `No. For CaCO₃(s) ⇌ CaO(s) + CO₂(g), Kc = [CO₂]. The solid isn't in Q, so adding more of it doesn't change Q, and there's no shift. The same goes for adding a pure liquid that isn't in the expression. [[L12-04]]

This follows from the rule that pure solids and liquids are left out of K: as long as some solid is present, the amount doesn't matter, and two flasks with different amounts of CaCO₃ reach the same CO₂ pressure. [[L10-07]] (Remove all of the CaCO₃, of course, and there's no equilibrium left to shift.) [[L12-04]]

Prof. Marsh covers this at 11:00 in Lecture 12 (slide 5).`),

  entry('LOG-20', '2026-09-30T12:10', '2714', 'Le Châtelier',
    `so does increasing pressure shift toward fewer moles or not?? the argon thing confused me`,
    'answered',
    `It depends on how the pressure is increased, and Prof. Marsh calls the phrase ambiguous for exactly this reason. [[L12-08]]

- **Compressing the container** (smaller volume) changes every reacting partial pressure and concentration, so the equilibrium shifts toward fewer moles of gas.
- **Adding an inert gas at constant volume** raises the total pressure without changing any reacting partial pressure, so there's no shift. [[L12-08]]

If a problem just says "the pressure is increased," assume compression and say that you're assuming it. [[L12-08]] For N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g), compression shifts right, toward the side with two moles of gas instead of four. [[L12-05]]

See 25:40 in Lecture 12.`),

  entry('LOG-21', '2026-09-30T13:02', '2862', 'Course logistics',
    `i have a varsity away game on oct 14, can i take the midterm at a different time?`,
    'sent_to_tfs',
    `Exam conflicts are handled by the head TF, Priya Raghunathan, so I've passed this to the teaching staff. [[SYL-02]] The syllabus asks you to tell the head TF about an exam conflict at least two weeks in advance, and Midterm 1 is Wednesday, October 14, 7:30–9:30 pm, so please email her today with the details of the game. [[SYL-09]]`),

  entry('LOG-22', '2026-09-30T14:30', '2988', 'Le Châtelier',
    `does a catalyst shift the equilibrium to the right since it makes the reaction go faster`,
    'answered',
    `No. A catalyst speeds up the forward and reverse reactions by the same factor, so it gets you to equilibrium faster without changing where equilibrium is: no shift, and no change in K. If a problem asks what a catalyst does to the equilibrium amount of product, the answer is nothing; what changes is how long you wait. [[L12-12]]

Prof. Marsh mentions that every year someone says a catalyst shifts things right "because it helps the reaction," and her reply is that it helps both reactions equally. [[L12-12]] In the Haber process, for example, the iron catalyst is there for speed. [[L12-13]]

See 39:50 in Lecture 12 (slide 15).`),

  entry('LOG-23', '2026-09-30T19:55', '3107', 'Le Châtelier',
    `what happens if you add helium but the total pressure is kept constant instead of the volume`,
    'answered',
    `Then the volume has to increase, and that changes things. With the container expanding, the reacting partial pressures go down, and the system shifts toward the side with more moles of gas, just like any other volume increase. [[L12-10]]

Compare the constant-volume case: adding an inert gas there raises the total pressure but leaves every reacting partial pressure, and so Q, unchanged, so there's no shift. [[L12-07]] Prof. Marsh's summary is that an inert gas only matters if it changes the volume, and constant volume is the case she'll ask about unless she says otherwise. [[L12-10]]

See 32:40 in Lecture 12 (slide 11).`),

  entry('LOG-24', '2026-09-30T21:20', '3251', 'Le Châtelier',
    `for H2 + I2 ⇌ 2HI if you halve the volume which way does it shift`,
    'answered',
    `It doesn't shift. There are two moles of gas on each side, and when both sides have the same number of moles of gas, a volume change causes no shift at all. [[L12-05]]

You can see why with Prof. Marsh's Q argument: halving the volume doubles every partial pressure instantly, and whether the reaction shifts depends on whether that doubling changes Q. [[L12-06]] For HI, Q = P(HI)² / (P(H₂) P(I₂)), so the numerator and the denominator both go up by a factor of four, Q is unchanged, and Q still equals K.

See 14:40 and 18:20 in Lecture 12 (slides 7 and 8).`),

  entry('LOG-25', '2026-09-30T22:48', '2318', 'Le Châtelier',
    `wait so with argon the total pressure goes up but the partial pressures don't change? how does that work with dalton's law`,
    'answered',
    `That's exactly Dalton's law. The total pressure is the sum of the partial pressures, P_total = P_A + P_B + P_C, and each partial pressure is P_A = n_A RT/V, which depends only on that gas's own moles, the temperature and the volume. [[L7-02]] Adding argon adds a new term to the sum, so the total goes up, but n, T and V for N₂, H₂ and NH₃ are untouched, so their partial pressures stay put.

Since Q is built from those reacting partial pressures, Q still equals K and the equilibrium doesn't shift. [[L12-07]]

Prof. Marsh connects the two at 22:00 in Lecture 12; Dalton's law is at 4:30 in Lecture 7.`),

  entry('LOG-26', '2026-09-30T23:30', '3349', 'Le Châtelier',
    `if temperature goes up for an exothermic reaction does K go down?`,
    'answered',
    `Yes. For an exothermic reaction, treat heat as a product: raising the temperature shifts the reaction left, and K decreases. Prof. Marsh's example is N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g), ΔH°rxn = −92.2 kJ mol⁻¹. [[L12-11]] For an endothermic reaction it's the opposite: N₂O₄(g) ⇌ 2 NO₂(g), ΔH°rxn = +57.2 kJ mol⁻¹, shifts right and K increases when heated. [[L12-11]]

Temperature is the only disturbance that changes K; concentration and volume changes only change Q. [[L12-02]]

See 36:20 in Lecture 12 (slide 13).`),

  entry('LOG-27', '2026-10-01T09:40', '3482', 'Equilibrium expressions',
    `whats the difference between Kc and Kp and when do i use which`,
    'answered',
    `Kc uses molar concentrations and Kp uses partial pressures in atm; the expression has the same form either way. For 2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g), Kp = P(SO₃)² / (P(SO₂)² P(O₂)). [[L10-05]] They're related by Kp = Kc(RT)^Δn, where Δn is moles of gaseous products minus moles of gaseous reactants, R = 0.08206 L atm mol⁻¹ K⁻¹ and T is in kelvin. When Δn is zero, Kp equals Kc. [[L10-05]]

Use whichever the problem gives or asks for, and always say which K you mean. [[L10-05]] For Kp, you can run an ICE table directly in partial pressures. [[L11-03]]

See 17:20 in Lecture 10 (slide 8).`),

  entry('LOG-28', '2026-10-01T13:15', '3615', 'Le Châtelier',
    `if you lower the pressure by making the volume bigger for N2 + 3H2 ⇌ 2NH3, which way does it go and does K change`,
    'answered',
    `It shifts left, toward the side with more moles of gas: four on the left versus two on the right. [[L12-05]] K doesn't change. A volume change only changes Q, and the reaction shifts until Q equals K again; temperature is the only disturbance that changes K itself. [[L12-02]]

If you want to see it with numbers, Prof. Marsh's Q argument works through compression: halving the volume multiplies Qp by a quarter, so Q falls below K and the reaction shifts right. [[L12-06]] Expanding the volume runs the same arithmetic in reverse.

See 14:40 and 18:20 in Lecture 12 (slides 7 and 8).`),

  entry('LOG-29', '2026-10-01T16:50', '3770', 'Course logistics',
    `when do the ps4 solutions come out?`,
    'answered',
    `Problem sets are due Fridays at 11:59 pm Eastern on Gradescope, and solutions are posted on Canvas the day after the deadline. [[SYL-05]] Problem Set 4 is due Friday, October 2, so expect its solutions on Saturday, October 3. [[L10-12]]

One note from the syllabus if you're using one of your two 48-hour extensions: don't open the posted solutions until you've submitted. Late work without an approved extension isn't accepted for exactly this reason, since the solutions go up the next day. [[SYL-06]]`),

  entry('LOG-30', '2026-10-01T20:04', '3846', 'Equilibrium expressions',
    `why is water left out of K for the acetic acid reaction but included for the iron one`,
    'answered',
    `Because of its state. In CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq), water is the liquid solvent, so it's left out: Kc = [H₃O⁺][CH₃COO⁻] / [CH₃COOH]. In 3 Fe(s) + 4 H₂O(g) ⇌ Fe₃O₄(s) + 4 H₂(g), water is a gas, so it goes in, and Kc = [H₂]⁴/[H₂O]⁴. [[L10-08]]

Same molecule, different state, different treatment. The state symbol decides, which is why Prof. Marsh insists you write them. [[L10-07]] Pure liquids drop out because their activity is 1. [[L10-06]]

See 26:30 and 31:00 in Lecture 10 (slide 12).`),

  entry('LOG-31', '2026-10-01T20:31', '3991', 'Equilibrium expressions',
    `ps4 #6 i got Q = 1250 so it goes forward right?`,
    'declined_pset',
    `I can't check Problem Set 4 answers before the deadline; the syllabus rules out using AI tools to solve or check problem sets. [[SYL-08]]

Here's the idea to test your reasoning against: comparing Q with K tells you which side is in excess right now. If Q is less than K, there are too few products and the reaction goes forward; if Q is greater than K, it goes in reverse. [[L10-11]] Compare your Q with the given K and ask which of those cases you're in.

Prof. Marsh covers this at 44:00 in Lecture 10 (slide 17).`),

  entry('LOG-32', '2026-10-01T20:58', '4120', 'ICE tables',
    `my ice table gave me a negative concentration at the end, what did i do wrong`,
    'answered',
    `Usually it's the direction. If you start with a mixture, you have to calculate Q and compare it with K before choosing signs: Q less than K means forward, Q greater than K means reverse. Getting the direction wrong gives negative concentrations at the end, which Prof. Marsh calls the universe's way of telling you to check Q. [[L11-05]]

The other common cause is keeping the wrong root of a quadratic: the negative root gives a negative concentration, so discard it and take the positive one. [[L11-12]] Also check that you converted moles to molarity before filling in the table. [[L11-03]]

See 14:30 in Lecture 11 (slide 6).`),
]
