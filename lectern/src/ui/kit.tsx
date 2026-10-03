import type { ButtonHTMLAttributes, ComponentChildren, JSX } from 'preact'
import { createPortal } from 'preact/compat'
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'
import { IconX } from './icons'

export function cx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(' ')
}

type BtnProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'icon'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'quiet'
  size?: 'sm' | 'md'
  icon?: JSX.Element
  disabled?: boolean
  type?: 'button' | 'submit'
}
export function Button({ variant = 'secondary', size = 'md', icon, children, class: c, type = 'button', ...rest }: BtnProps) {
  return (
    <button type={type} class={cx('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', !children && 'btn-icon', c as string)} {...rest}>
      {icon}
      {children && <span>{children}</span>}
    </button>
  )
}

export function Switch(props: {
  id: string
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  return (
    <button
      id={props.id}
      type="button"
      role="switch"
      aria-checked={props.checked}
      aria-label={props.label}
      disabled={props.disabled}
      class={cx('switch', props.size && `switch-${props.size}`)}
      onClick={() => props.onChange(!props.checked)}
    >
      <span class="switch-thumb" />
    </button>
  )
}

/** Small state label: a dot plus a word. One visual language for every status in the app. */
export function Status({ tone, children }: { tone: 'good' | 'warn' | 'bad' | 'muted' | 'info' | 'live'; children: ComponentChildren }) {
  return (
    <span class={cx('status', `status-${tone}`)}>
      <span class="status-dot" />
      {children}
    </span>
  )
}

export function Kbd({ children }: { children: ComponentChildren }) {
  return <kbd class="kbd">{children}</kbd>
}

/** Right-side panel used for source previews, question details and the student source viewer. */
export function Panel(props: { open: boolean; onClose: () => void; title: ComponentChildren; sub?: ComponentChildren; children: ComponentChildren; width?: number; actions?: ComponentChildren }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!props.open) return
    const prev = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && props.onClose()
    window.addEventListener('keydown', onKey)
    ref.current?.querySelector<HTMLElement>('.panel-close')?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      prev?.focus?.()
    }
  }, [props.open])
  if (!props.open) return null
  return createPortal(
    <div class="panel-layer">
      <div class="panel-scrim" onClick={props.onClose} />
      <div class="panel" ref={ref} style={props.width ? { "--panel-w": `${props.width}px` } : undefined} role="dialog" aria-modal="true">
        <header class="panel-head">
          <div class="panel-titles">
            <h2 class="panel-title">{props.title}</h2>
            {props.sub && <div class="panel-sub">{props.sub}</div>}
          </div>
          {props.actions}
          <Button variant="ghost" class="panel-close" icon={<IconX />} aria-label="Close" onClick={props.onClose} />
        </header>
        <div class="panel-body">{props.children}</div>
      </div>
    </div>,
    document.body,
  )
}

/** In-page confirmation: the viewer blocks window.confirm, so every confirm step lives here. */
export function Dialog(props: { open: boolean; onClose: () => void; title: string; children: ComponentChildren; actions: ComponentChildren }) {
  useEffect(() => {
    if (!props.open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && props.onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [props.open])
  if (!props.open) return null
  return createPortal(
    <div class="dialog-layer">
      <div class="panel-scrim" onClick={props.onClose} />
      <div class="dialog" role="alertdialog" aria-modal="true" aria-label={props.title}>
        <h2 class="dialog-title">{props.title}</h2>
        <div class="dialog-body">{props.children}</div>
        <div class="dialog-actions">{props.actions}</div>
      </div>
    </div>,
    document.body,
  )
}

/** Floating card anchored to an element; used for citation hover cards and small menus. */
export function Popover(props: { anchor: HTMLElement | null; open: boolean; onClose: () => void; children: ComponentChildren; class?: string; place?: 'below' | 'above' }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  useLayoutEffect(() => {
    if (!props.open || !props.anchor || !ref.current) return
    const a = props.anchor.getBoundingClientRect()
    const r = ref.current.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let left = Math.min(Math.max(12, a.left + a.width / 2 - r.width / 2), vw - r.width - 12)
    let top = props.place === 'above' || a.bottom + r.height + 10 > vh ? a.top - r.height - 8 : a.bottom + 8
    top = Math.max(12, top)
    left = Math.max(12, left)
    setPos({ top, left })
  }, [props.open, props.anchor])
  useEffect(() => {
    if (!props.open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && props.onClose()
    const onDown = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node) || props.anchor?.contains(e.target as Node)) return
      props.onClose()
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousedown', onDown)
    }
  }, [props.open, props.anchor])
  if (!props.open) return null
  return createPortal(
    <div ref={ref} class={cx('popover', props.class)} style={pos ? { top: `${pos.top}px`, left: `${pos.left}px` } : { visibility: 'hidden', top: '0', left: '0' }}>
      {props.children}
    </div>,
    document.body,
  )
}

// Toasts: one line, bottom centre, auto-dismiss.
let pushToast: ((t: string) => void) | null = null
export function toast(text: string) {
  pushToast?.(text)
}
export function Toaster() {
  const [items, setItems] = useState<{ id: number; text: string }[]>([])
  useEffect(() => {
    pushToast = (text) => {
      const id = Date.now() + Math.random()
      setItems((xs) => [...xs.slice(-2), { id, text }])
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3200)
    }
    return () => {
      pushToast = null
    }
  }, [])
  return (
    <div class="toaster" role="status" aria-live="polite">
      {items.map((t) => (
        <div class="toast" key={t.id}>
          {t.text}
        </div>
      ))}
    </div>
  )
}

export async function copyText(text: string, fallbackEl?: HTMLElement | null): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    if (fallbackEl) {
      const range = document.createRange()
      range.selectNodeContents(fallbackEl)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
    return false
  }
}

export function relTime(iso: string, now = Date.now()) {
  const d = (now - new Date(iso).getTime()) / 1000
  if (d < 45) return 'just now'
  if (d < 3600) return `${Math.round(d / 60)}m ago`
  if (d < 86400) return `${Math.round(d / 3600)}h ago`
  if (d < 86400 * 7) return `${Math.round(d / 86400)}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const TZ = 'America/New_York'
const asDate = (iso: string) => new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T12:00:00-04:00` : iso)
export function fmtDay(iso: string) {
  return asDate(iso).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: TZ })
}
export function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: TZ })
}
export function fmtDate(iso: string) {
  return asDate(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: TZ })
}
