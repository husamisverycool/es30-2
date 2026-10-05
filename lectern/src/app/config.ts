/** Where the app lives. Inside the Claude artifact viewer it's the published artifact link;
 *  anywhere else (Netlify, a local server) it's this same page. Students use #student. */
export const ARTIFACT_URL = 'https://claude.ai/artifact/Dsn1kNKUcrwKrWMKboUerX'

export const inArtifact = typeof window !== 'undefined' && !!(window as unknown as { claude?: unknown }).claude
const hosted = typeof location !== 'undefined' && location.protocol.startsWith('http')

export const CONSOLE_URL = inArtifact || !hosted ? ARTIFACT_URL : `${location.origin}${location.pathname}`
export const STUDENT_URL = inArtifact ? `${ARTIFACT_URL}#student` : hosted ? `${location.origin}${location.pathname}#student` : ''
