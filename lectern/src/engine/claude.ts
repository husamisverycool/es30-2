// Thin wrapper over the artifact runtime's `sample` capability.
// Resolves null anywhere the page runs without a Claude viewer, and the tutor falls back to quoting sources.

export type SampleFn = ((
  input: string | { role: 'user' | 'assistant'; content: string }[],
  opts?: {
    onText?: (u: { text: string; delta: string }) => void
    signal?: AbortSignal
    modelTier?: 'quick' | 'default' | 'complex'
    cache?: boolean | { gcTime?: number; refresh?: boolean }
  },
) => Promise<{ text: string; truncated: boolean }>) & {}

export interface SampleError {
  code: string
  message: string
  text?: string
}

let pending: Promise<SampleFn | null> | null = null
let disabled = false

export function getSample(): Promise<SampleFn | null> {
  if (disabled) return Promise.resolve(null)
  if (!pending) {
    const c = typeof window === 'undefined' ? undefined : (window as unknown as { claude?: { use?: (n: string) => Promise<unknown> } }).claude
    pending = c?.use ? (c.use('sample') as Promise<SampleFn | null>).catch(() => null) : Promise.resolve(null)
  }
  return pending
}

/** After a permanent refusal (declined consent, sampling off), stop asking for the rest of the visit. */
export function disableSample() {
  disabled = true
}

export const PERMANENT = new Set([
  'not_granted',
  'sampling_disabled',
  'not_declared',
  'capability_disabled',
  'capability_removed',
  'session_expired',
])
