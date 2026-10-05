// Claude answers outside the artifact viewer (e.g. on Netlify), using an Anthropic API key the founder
// pastes into Settings. The key stays in this browser's storage and requests go straight to Anthropic.
import type Anthropic from '@anthropic-ai/sdk'

const KEY = 'lectern:anthropic-key'
export const MODEL = 'claude-opus-5-5'

export function getApiKey(): string {
  try {
    return localStorage.getItem(KEY) ?? ''
  } catch {
    return ''
  }
}

export function setApiKey(key: string) {
  try {
    if (key) localStorage.setItem(KEY, key.trim())
    else localStorage.removeItem(KEY)
  } catch {
    /* storage blocked: the key lasts for this page only */
  }
}

let cached: { key: string; client: Anthropic } | null = null
async function client(key: string): Promise<Anthropic> {
  if (cached?.key === key) return cached.client
  // Loaded on first use so the page stays light for viewers who never set a key.
  const { default: AnthropicSDK } = await import('@anthropic-ai/sdk')
  cached = { key, client: new AnthropicSDK({ apiKey: key, dangerouslyAllowBrowser: true }) }
  return cached.client
}

export interface ApiError {
  code: 'auth' | 'rate' | 'network' | 'refused' | 'bad_request' | 'cancelled' | 'other'
  message: string
  text?: string
}

async function toApiError(e: unknown, partial: string): Promise<ApiError> {
  const { default: AnthropicSDK } = await import('@anthropic-ai/sdk')
  const text = partial || undefined
  if (e instanceof AnthropicSDK.APIUserAbortError) return { code: 'cancelled', message: 'Stopped', text }
  if (e instanceof AnthropicSDK.AuthenticationError) return { code: 'auth', message: 'The API key was rejected. Check it in Settings.', text }
  if (e instanceof AnthropicSDK.PermissionDeniedError) return { code: 'auth', message: 'This API key can’t use that model.', text }
  if (e instanceof AnthropicSDK.RateLimitError) return { code: 'rate', message: 'Rate limited. Try again in a minute.', text }
  if (e instanceof AnthropicSDK.BadRequestError) return { code: 'bad_request', message: e.message, text }
  if (e instanceof AnthropicSDK.APIConnectionError) return { code: 'network', message: 'Couldn’t reach Anthropic.', text }
  if (e instanceof AnthropicSDK.APIError) return { code: 'other', message: `API error ${e.status ?? ''}`.trim(), text }
  return { code: 'other', message: String((e as Error)?.message ?? e), text }
}

/** Stream one answer. Resolves with the full text; rejects with an ApiError. */
export async function streamAnswer(
  prompt: string,
  opts: { onText?: (text: string) => void; signal?: AbortSignal } = {},
): Promise<string> {
  const key = getApiKey()
  if (!key) throw { code: 'auth', message: 'No API key set.' } satisfies ApiError
  let acc = ''
  try {
    const c = await client(key)
    const stream = c.beta.messages.stream(
      {
        model: MODEL,
        max_tokens: 64000,
        // Short grounded answers: low effort keeps the chat quick.
        output_config: { effort: 'low' },
        // If a safety classifier declines, the API re-runs the request on a fallback model.
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        messages: [{ role: 'user', content: prompt }],
      },
      { signal: opts.signal },
    )
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        acc += event.delta.text
        opts.onText?.(acc)
      }
    }
    const final = await stream.finalMessage()
    if (final.stop_reason === 'refusal') throw { code: 'refused', message: 'Claude declined this question.' } satisfies ApiError
    return acc
  } catch (e) {
    if (e && typeof e === 'object' && 'code' in e && 'message' in e && !(e instanceof Error)) throw e
    throw await toApiError(e, acc)
  }
}

/** A one-line request to confirm the key works. */
export async function testKey(key: string): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const c = await client(key.trim())
    await c.messages.create({
      model: MODEL,
      max_tokens: 64,
      output_config: { effort: 'low' },
      messages: [{ role: 'user', content: 'Reply with the word ready.' }],
    })
    return { ok: true }
  } catch (e) {
    return { ok: false, message: (await toApiError(e, '')).message }
  }
}
