import { render } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import './styles.css'
import './console.css'
import { Console, type Page } from './console/Console'
import { Student } from './student/Student'
import { Toaster } from './ui/kit'
import { logActivityOnce } from './state/store'

const PAGES: Page[] = ['overview', 'sources', 'rules', 'preview', 'questions', 'golive']

function route(): Page | 'student' {
  const h = location.hash.replace('#', '')
  if (h === 'student') return 'student'
  return (PAGES as string[]).includes(h) ? (h as Page) : 'overview'
}

function App() {
  const [r, setR] = useState(route())
  useEffect(() => {
    const on = () => setR(route())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  useEffect(() => {
    if (r !== 'student') logActivityOnce('opened', 'Opened the console for the first time')
  }, [r === 'student'])
  useEffect(() => {
    document.title = r === 'student' ? 'CHEM 11 Tutor' : 'Lectern'
  }, [r === 'student'])
  return (
    <>
      {r === 'student' ? <Student /> : <Console page={r} />}
      <Toaster />
    </>
  )
}

render(<App />, document.getElementById('app')!)
