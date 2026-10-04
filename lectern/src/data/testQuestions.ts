// Twenty real-sounding questions from this term's Ed history, with the answer
// the tutor gives today (Sat Oct 3, 2026) using the approved sources.
import type { Outcome, TestQuestion } from './types'
import type { Topic } from './topics'

function tq(id: string, from: string, topic: Topic, text: string, outcome: Outcome, body: string): TestQuestion {
  return { id, from, topic, text, answer: { outcome, body } }
}

export const testQuestions: TestQuestion[] = [
  tq('TQ-01', 'Ed #31 · PS1', 'Significant figures',
    `why did i lose a point for rounding? i rounded my moles to 3 sig figs in the middle and my final answer was off by 1 in the last digit. isn't 3 sig figs right since the data had 3`,
    'answered',
    `Three significant figures is right for the **final** answer, but not for the steps in between. Prof. Marsh's rule is to carry at least one or two extra digits through every intermediate step and round once, at the end. [[L1-06]] Rounding in the middle is how the last digit drifts: in her Lecture 1 example, the same cube data gives 3.06 g cm⁻³ if the volume is rounded first and 3.07 g cm⁻³ if the digits are carried, and only 3.07 g cm⁻³ is right. [[L1-06]]

It's fine to write a rounded number on the page, as long as you calculate with the unrounded one; she usually just leaves everything in the calculator. [[ED-01]]

The worked example is at 22:40 in Lecture 1 (slide 9).`),

  tq('TQ-02', 'Ed #72 · Lecture 4', 'Limiting reagent',
    `how do i tell which reactant is limiting?? i keep picking the one with fewer grams and getting it wrong`,
    'answered',
    `Grams can't tell you, because a gram of one substance and a gram of another contain different numbers of particles. Prof. Marsh's method: convert each reactant to moles, divide each by its coefficient in the balanced equation, and the smallest result is the limiting reagent. [[L4-05]]

In her example, 2 Al(s) + 3 Cl₂(g) → 2 AlCl₃(s) with 10.0 g Al and 35.0 g Cl₂, aluminum gives 0.3706 mol ÷ 2 = 0.1853 and chlorine gives 0.4937 mol ÷ 3 = 0.1646, so Cl₂ is limiting even though there are more grams of it. [[L4-05]] Once you know the limiting reagent, calculate every product from it, never from the excess reagent. [[L4-06]]

It's at 18:50 in Lecture 4 (slide 7).`),

  tq('TQ-03', 'Ed #95 · Lecture 5', 'Solutions',
    `for molarity is it liters of water or liters of solution? like if i dissolve 5.85 g of nacl to make 250 ml is that 0.400 M`,
    'answered',
    `Liters of **solution**. Molarity is moles of solute per liter of solution, not per liter of solvent, which is why solutions are made in a volumetric flask: dissolve, then fill to the line. [[L5-02]]

Your numbers match her Lecture 5 example: 5.85 g NaCl ÷ 58.44 g mol⁻¹ = 0.1001 mol, and 0.1001 mol ÷ 0.2500 L = 0.400 M, as long as 250.0 mL is the final volume of the solution. [[L5-03]] If a problem instead says the salt was added to 250.0 mL of water, the solution volume isn't exactly 250.0 mL; on CHEM 11 problem sets you'll be told to assume it is. [[ED-04]]

See 4:40 and 9:30 in Lecture 5.`),

  tq('TQ-04', 'Ed #112 · Lecture 6', 'Gas laws',
    `which R am i supposed to use?? 0.08206 or 8.314. my pressure came out in the thousands`,
    'answered',
    `Both are the same constant in different units, so pick the one whose units cancel. With pressure in atm and volume in liters, use R = 0.08206 L atm mol⁻¹ K⁻¹; when you need an energy in joules, use R = 8.314 J mol⁻¹ K⁻¹. [[L6-04]] Writing R with its units in your setup is the quickest test: if you're left with L atm when you wanted joules, or the other way round, you picked the wrong one. [[ED-02]]

If an answer looks wildly off, check two things: which R you used, and whether the temperature is in kelvin. 25.0 °C is 298.15 K, and putting °C into PV = nRT throws the answer off badly. [[L6-05]]

Prof. Marsh covers this at 12:50 in Lecture 6 (slide 7).`),

  tq('TQ-05', 'Ed #151 · Lecture 8', 'Calorimetry',
    `in the coffee cup example the temperature went UP but q for the reaction is negative?? that seems backwards`,
    'answered',
    `It's a question of whose heat you're measuring. The thermometer sits in the solution, which is the surroundings, so the temperature change gives you q for the solution, and the reaction's heat is the opposite: q_rxn = −q_solution. [[L8-07]] The solution warmed up, so it gained heat; that heat came from the reaction, so the reaction lost it and is exothermic. [[ED-05]]

In Prof. Marsh's example, mixing HCl and NaOH raised the temperature by 6.50 °C, so q_solution = +2719.6 J and q_rxn = −2.7196 kJ, or −54.4 kJ mol⁻¹ for the 0.0500 mol of water formed. [[L8-08]]

Keep the minus sign explicit, since a ΔH without a sign is read as positive. [[ED-05]] The explanation is at 27:40 in Lecture 8 (slide 11).`),

  tq('TQ-06', 'Ed #166 · Lecture 9', "Enthalpy & Hess's law",
    `hess's law question: if i flip an equation AND multiply it by 2, do i flip the sign and double it, or just one of those`,
    'answered',
    `Both. They're two independent rules: multiplying an equation multiplies ΔH by the same factor, and reversing it flips the sign. [[L9-04]] Prof. Marsh's example on Ed: reversing CO(g) + ½ O₂(g) → CO₂(g), ΔH = −283.0 kJ mol⁻¹, and doubling it gives 2 CO₂(g) → 2 CO(g) + O₂(g), ΔH = +566.0 kJ mol⁻¹. [[ED-06]]

Her tip is to write the adjusted ΔH next to each line as you go, then add and check that everything not in the target cancels. If something doesn't cancel, one of your arrangements is wrong. [[L9-08]]

The rules are at 13:40 and the strategy at 33:20 in Lecture 9 (slides 6 and 11).`),

  tq('TQ-07', 'Ed #187 · Lecture 10', 'Equilibrium expressions',
    `why isn't CaCO3 in the K expression for CaCO3(s) ⇌ CaO(s) + CO2(g)? it's literally the reactant`,
    'answered',
    `It's still in the reaction; it just isn't in K. Pure solids and pure liquids never appear in an equilibrium expression, so for CaCO₃(s) ⇌ CaO(s) + CO₂(g), Kc = [CO₂]. [[L10-06]] The reason is that the "concentration" of a pure solid is its density divided by its molar mass, which is fixed: a gram of CaCO₃ is just as concentrated as a kilogram. Strictly, K is built from activities, and a pure solid's activity is 1, so it drops out. [[L10-06]]

One consequence Prof. Marsh demonstrated: as long as some solid is present, the amount doesn't matter, so two flasks with different amounts of CaCO₃ reach the same CO₂ pressure. [[L10-07]]

This is at 21:50 in Lecture 10 (slide 10).`),

  tq('TQ-08', 'Ed #198 · Lecture 10', 'Equilibrium expressions',
    `is water supposed to be in K or not?? someone on ed said it doesn't really matter if it's a gas or liquid but i keep getting different numbers`,
    'answered',
    `It does matter, and the state symbol decides. Water as the liquid solvent in an aqueous reaction is essentially a pure liquid, so it's left out of K; water as a gas goes into the expression like any other gas. [[L10-07]]

Prof. Marsh's two examples side by side: for 3 Fe(s) + 4 H₂O(g) ⇌ Fe₃O₄(s) + 4 H₂(g), water is a gas, so Kc = [H₂]⁴/[H₂O]⁴; for CH₃COOH(aq) + H₂O(l) ⇌ H₃O⁺(aq) + CH₃COO⁻(aq), water is the solvent, so Kc = [H₃O⁺][CH₃COO⁻]/[CH₃COOH]. [[L10-08]] She's been explicit on Ed that "it doesn't matter much" is not the rule: including H₂O(g) and leaving out H₂O(l) are both required. [[ED-08]]

See 26:30–31:00 in Lecture 10 (slide 12).`),

  tq('TQ-09', 'Ed #209 · Lecture 11', 'ICE tables',
    `in the ICE table do i use moles or molarity? the problem says 1.00 mol H2 and 1.00 mol I2 in a 2.00 L flask`,
    'answered',
    `Molarity. The entries in an ICE table for Kc are concentrations, so convert before you start: 1.00 mol in 2.00 L is 0.500 M, and your Initial row is 0.500 M H₂ and 0.500 M I₂, not 1.00 and 1.00. [[L11-03]] Moles and molarity are only the same number in a 1.00-L container. [[L11-03]]

That's Prof. Marsh's first worked example. With Kc = 50.5 at 448 °C, the Change row is −x, −x, +2x and the equilibrium row is 0.500 − x, 0.500 − x, 2x; notice that the whole (2x) gets squared in K. [[L11-06]] Solving gives [HI] = 0.780 M and [H₂] = [I₂] = 0.110 M, and plugging back in returns 50.5. [[L11-07]]

See 7:10 and 18:10 in Lecture 11 (slides 4 and 8).`),

  tq('TQ-10', 'Ed #224 · Lecture 11', 'ICE tables',
    `when am i allowed to drop the x in (0.20 - x)? and do i actually have to write out the 5% thing or is that optional`,
    'answered',
    `You can try dropping x when K is small compared with the initial concentration, and only where x is added to or subtracted from a larger number. Never drop the x in the numerator, because that's your answer. [[L11-09]]

The 5% check isn't optional. After solving, divide x by the initial concentration it was subtracted from; under 5%, the approximation is justified. In Prof. Marsh's NO example, 6.3 × 10⁻⁴ M ÷ 0.20 M = 0.32%, well under. She wants that check written as a line in your work every time, because an unchecked approximation is an unjustified answer even if the number happens to be right. [[L11-10]] If the check fails, as in her PCl₅ example at 45%, throw out the approximate x and solve properly. [[L11-11]]

See 29:00–36:10 in Lecture 11 (slides 11–14).`),

  tq('TQ-11', 'Ed #245 · Lecture 12', 'Le Châtelier',
    `if you add argon to the container the total pressure goes up, so shouldn't it shift to the side with fewer moles of gas? that's what the reply in this thread said`,
    'answered',
    `Not if the volume stays constant. Adding an inert gas like argon to a rigid container raises the total pressure, but each reacting gas's partial pressure is P = nRT/V, and argon doesn't change the n, T or V of any of them. So every partial pressure in Q is unchanged, Q still equals K, and there's no shift. [[L12-07]]

Compressing the container is different: it changes V, so every reacting partial pressure changes and the system shifts toward fewer moles of gas. Prof. Marsh's point is that "increase the pressure" is ambiguous, so always ask how it was increased. [[L12-08]] An inert gas only matters if it changes the volume, for instance when it's added at constant total pressure and the container expands. [[L12-10]]

It's at 22:00 in Lecture 12 (slide 9), building on Dalton's law from Lecture 7.`),

  tq('TQ-12', 'Ed #256 · Lecture 12', 'Le Châtelier',
    `does raising the temperature change K or does it just shift the equilibrium like adding a reactant does? and what does a catalyst do`,
    'answered',
    `Temperature is the one disturbance that changes K itself. Concentration and volume changes only change Q, and the system shifts until Q equals K again. [[L12-02]] For temperature, treat heat as a product of an exothermic reaction and a reactant of an endothermic one. N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g), ΔH°rxn = −92.2 kJ mol⁻¹, shifts left and K decreases when heated, while N₂O₄(g) ⇌ 2 NO₂(g), ΔH°rxn = +57.2 kJ mol⁻¹, shifts right and K increases. [[L12-11]]

A catalyst speeds up the forward and reverse reactions by the same factor, so you reach equilibrium faster, but there's no shift and no change in K. [[L12-12]]

See 3:50, 36:20 and 39:50 in Lecture 12 (slides 3, 13 and 15).`),

  tq('TQ-13', 'Ed #281 · Lecture 13', 'Acids & pH',
    `how many decimal places for pH? if [H3O+] = 2.5 x 10^-4 M is it 3.6 or 3.60 or 3.602`,
    'answered',
    `3.60. For logarithms, the number of decimal places in the pH equals the number of significant figures in the concentration. [[L13-05]] [H₃O⁺] = 2.5 × 10⁻⁴ M has two significant figures, so the pH gets two decimal places: 3.60. The leading 3 only reflects the power of ten, so it isn't counted. [[L13-05]]

It works in reverse too. Prof. Marsh's Ed example is pH 4.20, which gives [H₃O⁺] = 6.3 × 10⁻⁵ M, two significant figures. [[ED-15]]

As always, carry the unrounded concentration into the log and round only once, at the end. [[L1-06]] It's at 14:40 in Lecture 13 (slide 8).`),

  tq('TQ-14', 'Ed #289 · PS5', 'ICE tables',
    `for ps5 3b can someone check if [Cl2] = 7.4 x 10^-4 M? i used the small x approximation like in 3a`,
    'declined_pset',
    `I can't check answers to Problem Set 5; Prof. Marsh's syllabus doesn't allow AI tools to be used to solve or check problem sets. [[SYL-08]]

Here's a nudge on the idea: an approximation is only a claim until you test it. Divide the change by the initial concentration it was subtracted from; if the result is over 5%, the approximation isn't justified and you need another approach. [[L11-10]] Watch the coefficients when you do it.

She works through one case where the check passes and one where it fails at 32:30–36:10 in Lecture 11. For a person to look at your number, TF office hours run Sunday–Thursday, 7–10 pm. [[SYL-02]]`),

  tq('TQ-15', 'Ed #294 · PS5', 'Le Châtelier',
    `ps5 5a part (i), when they add argon at constant volume does it shift left or right? i said right bc pressure goes up`,
    'declined_pset',
    `I can't work Problem Set 5 problems or confirm answers to them; the course's AI policy rules that out. [[SYL-08]]

A nudge on the concept, though: before deciding on a direction, ask what the disturbance does to Q. Q for a gas reaction is built from the partial pressures of the reacting gases, and each of those is P = nRT/V. [[L12-07]] So the question to answer for yourself is which of n, T or V changed for those gases, and whether Q changed as a result.

Prof. Marsh treats exactly this idea at 22:00 in Lecture 12 (slide 9), right after the volume discussion.`),

  tq('TQ-16', 'Ed #302 · PS5', 'Acids & pH',
    `what's the pH for ps5 6a? i got 1.89 and it seems low for a weak acid`,
    'declined_pset',
    `I can't give or check answers for Problem Set 5, including 6a; Prof. Marsh's syllabus says AI tools can't be used to solve or check problem sets. [[SYL-08]]

One conceptual nudge: a weak acid only partly ionizes, so [H₃O⁺] is the x from an ICE table built on Ka, not the full acid concentration. [[L13-07]] Before you trust an approximate x, run the 5% check; Prof. Marsh's HF example shows a case where it fails and the quadratic is needed. [[L13-10]]

Her weak-acid examples are at 25:50 and 33:10 in Lecture 13 (slides 13 and 16).`),

  tq('TQ-17', 'Ed #311 · PS5', 'Acids & pH',
    `can you just walk me through ps5 #7? the weak acid with pH 2.75. i have no idea where to start`,
    'declined_pset',
    `I can't walk through Problem Set 5 problems, since the syllabus doesn't allow AI tools to be used to solve problem sets, but I can point you to the idea. [[SYL-08]]

The key is to run the usual weak-acid reasoning backward. A pH tells you [H₃O⁺], and in the ICE table for HA(aq) + H₂O(l) ⇌ H₃O⁺(aq) + A⁻(aq), that concentration is x. Once you know x, you know every entry in the equilibrium row, and you can put them into the Ka expression. [[L13-11]]

Prof. Marsh works an example of going from pH to Ka, with different numbers, at 37:40 in Lecture 13 (slide 18). TF office hours, Sunday–Thursday 7–10 pm, are a good place to talk through your setup. [[SYL-02]]`),

  tq('TQ-18', 'Ed #174 · PS2', 'Course logistics',
    `how long do we have to submit a regrade request for ps2? and do i email my TF or what`,
    'answered',
    `Regrade requests go through Gradescope, not email, and they're due within one week of grades being released. [[SYL-10]] Explain specifically what you think was misgraded, referring to the posted solutions. The TF who graded the problem reviews it first, and Prof. Marsh reviews anything that's still disputed. [[SYL-10]]

Two things to know before you submit: the whole problem may be re-examined, so the score can go down as well as up, and grading questions shouldn't be emailed to TFs or posted on Ed. [[SYL-10]] In Gradescope, open the question and click "Request Regrade." [[ED-13]]`),

  tq('TQ-19', 'Ed #298 · PS4', 'Course logistics',
    `i've been sick all week and i already used both of my extensions. is there any way to get more time on ps4`,
    'sent_to_tfs',
    `I'm sorry you've been sick. This one needs a person: once both 48-hour extensions are used, the syllabus asks you to contact the head TF, Priya Raghunathan, and your resident dean, and they'll work out something reasonable. [[SYL-06]] You never need to share medical details with course staff. [[SYL-11]]

I've passed your question to the teaching staff. In the meantime, email Priya directly rather than posting personal details on Ed. [[SYL-02]] Since solutions go up the day after the deadline, don't open the PS4 solutions until you have a plan with her. [[SYL-06]]`),

  tq('TQ-20', 'Ed #315 · Lecture 13', 'Acids & pH',
    `how do you use henderson-hasselbalch for a buffer? like pH = pKa + log(base/acid). do we need it for the midterm`,
    'not_covered',
    `Prof. Marsh hasn't covered buffers or the Henderson–Hasselbalch equation yet, so I don't have her materials to explain it from. She'll teach it in Lecture 14 on Monday, October 5, and she asked the class not to use Henderson–Hasselbalch until you've done it together in lecture. [[SYL-12]] [[L13-12]]

It will be on the midterm: Midterm 1 covers Lectures 1 through 14, through buffers. [[SYL-09]] If you want a head start before Monday, post on Ed or bring it to office hours.`),
]
