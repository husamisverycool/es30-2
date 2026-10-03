import { useState } from 'preact/hooks'
import { course } from '../app/context'
import { update, useStore } from '../state/store'
import { RULES, ruleOn, type Rule } from '../engine/rules'
import { IconLock, IconTrash, IconPlus } from '../ui/icons'
import { Button, Switch, toast, relTime } from '../ui/kit'
import { PageHead } from './Console'
import { TryPanel } from './Preview'

const GROUPS: { title: string; ids: string[]; note?: string }[] = [
  { title: 'Academic integrity', ids: ['no-pset'] },
  { title: 'Where answers come from', ids: ['sources-only', 'cite'] },
  { title: 'How it writes', ids: ['notation'] },
  { title: 'When to send students to staff', ids: ['tfs', 'exam'] },
]

function RuleRow({ rule, onTry }: { rule: Rule; onTry: (q: string) => void }) {
  const s = useStore()
  const on = ruleOn(s.rules, rule.id)
  return (
    <li class="rule">
      <div class="rule-text">
        <div class="rule-title">{rule.title}</div>
        <p class="rule-detail">{rule.detail}</p>
        {rule.id === 'notation' && (
          <table class="notation">
            <thead>
              <tr>
                <th>Writes</th>
                <th>Instead of</th>
              </tr>
            </thead>
            <tbody>
              {course.notation.map((n) => (
                <tr key={n.write}>
                  <td>{n.write}</td>
                  <td class="muted">{n.not}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {rule.tryIt && (
          <button type="button" class="link-btn rule-try" onClick={() => onTry(rule.tryIt!)}>
            Try it with “{rule.tryIt}”
          </button>
        )}
      </div>
      <div class="rule-control">
        {rule.locked ? (
          <span class="rule-locked" title="Part of the offer. It can’t be switched off.">
            <IconLock size={14} /> Always on
          </span>
        ) : (
          <Switch
            id={`rule-${rule.id}`}
            checked={on}
            label={rule.title}
            onChange={(v) =>
              update(
                (st) => {
                  st.rules[rule.id] = v
                },
                { kind: 'rule', detail: `${v ? 'Turned on' : 'Turned off'} “${rule.title}”` },
              )
            }
          />
        )}
      </div>
    </li>
  )
}

export function Rules() {
  const s = useStore()
  const [tryQ, setTryQ] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  return (
    <>
      <PageHead
        title="Rules"
        sub="Short, specific rules the tutor follows on every answer. The first two are part of the offer and stay on."
        actions={
          s.rulesConfirmedAt ? (
            <span class="muted small">Confirmed {relTime(s.rulesConfirmedAt)}</span>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                update(
                  (st) => {
                    st.rulesConfirmedAt = new Date().toISOString()
                  },
                  { kind: 'rules-confirmed', detail: 'Confirmed the rules' },
                )
                toast('Rules confirmed')
              }}
            >
              These rules look right
            </Button>
          )
        }
      />
      <div class="rules">
        {GROUPS.map((g) => (
          <section key={g.title} class="rule-group" aria-label={g.title}>
            <h2 class="section-title">{g.title}</h2>
            <ul class="rule-list">
              {g.ids.map((id) => (
                <RuleRow key={id} rule={RULES.find((r) => r.id === id)!} onTry={setTryQ} />
              ))}
            </ul>
          </section>
        ))}

        <section class="rule-group" aria-labelledby="own-rules">
          <h2 id="own-rules" class="section-title">
            Your own rules
          </h2>
          <ul class="rule-list">
            {s.customRules.map((r) => (
              <li key={r.id} class="rule">
                <div class="rule-text">
                  <div class="rule-title rule-title-plain">{r.text}</div>
                </div>
                <div class="rule-control">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<IconTrash size={15} />}
                    aria-label="Delete rule"
                    onClick={() =>
                      update(
                        (st) => {
                          st.customRules = st.customRules.filter((x) => x.id !== r.id)
                        },
                        { kind: 'custom-rule', detail: `Deleted rule “${r.text.slice(0, 60)}”` },
                      )
                    }
                  />
                </div>
              </li>
            ))}
            <li class="rule rule-add">
              <form
                class="rule-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  const text = draft.trim()
                  if (!text) return
                  update(
                    (st) => {
                      st.customRules = [...st.customRules, { id: Date.now().toString(36), text }]
                    },
                    { kind: 'custom-rule', detail: `Added rule “${text.slice(0, 60)}${text.length > 60 ? '…' : ''}”` },
                  )
                  setDraft('')
                  toast('Rule added')
                }}
              >
                <label class="sr-only" for="new-rule">
                  New rule
                </label>
                <input
                  id="new-rule"
                  class="input"
                  value={draft}
                  maxLength={500}
                  placeholder="When a student asks about significant figures, remind them to round only at the end."
                  onInput={(e) => setDraft((e.target as HTMLInputElement).value)}
                />
                <Button type="submit" variant="secondary" icon={<IconPlus size={16} />} disabled={!draft.trim()}>
                  Add
                </Button>
              </form>
              <p class="field-help">
                One instruction per rule works best. Start with when it applies, then what to do. Your rules apply to answers Claude writes; prepared answers already
                follow your materials.
              </p>
            </li>
          </ul>
        </section>
      </div>
      <TryPanel question={tryQ} onClose={() => setTryQ(null)} />
    </>
  )
}
