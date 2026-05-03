import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Dashboard.module.css'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const SECTIONS = [
  { key: 'schedule', label: 'Schedule', icon: '📅' },
  { key: 'todos', label: 'Tasks & Homework', icon: '✅' },
  { key: 'study', label: 'Study Sessions', icon: '📚' },
  { key: 'notes', label: 'Notes', icon: '📝' },
  { key: 'progress', label: 'Progress', icon: '📊' },
  { key: 'reminders', label: 'Reminders', icon: '🔔' },
]

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [section, setSection] = useState('schedule')
  const [animKey, setAnimKey] = useState(0)

  const [schedule, setSchedule] = useState([])
  const [todos, setTodos] = useState([])
  const [sessions, setSessions] = useState([])
  const [notes, setNotes] = useState([])
  const [reminders, setReminders] = useState([])

  const [newLesson, setNewLesson] = useState({ subject: '', day: 'Monday', start_time: '', end_time: '' })
  const [newTodo, setNewTodo] = useState({ title: '', type: 'todo', deadline: '' })
  const [newSession, setNewSession] = useState({ subject: '', date: '', duration_minutes: '', notes: '' })
  const [newNote, setNewNote] = useState({ title: '', content: '' })
  const [newReminder, setNewReminder] = useState({ title: '', remind_at: '' })

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => { if (!res.ok) router.push('/login'); return res.json() })
      .then(data => setUser(data))
    loadAll()
  }, [])

  const loadAll = () => {
    fetch('/api/schedule').then(r => r.json()).then(d => setSchedule(d.data || []))
    fetch('/api/todos').then(r => r.json()).then(d => setTodos(d.data || []))
    fetch('/api/study-sessions').then(r => r.json()).then(d => setSessions(d.data || []))
    fetch('/api/notes').then(r => r.json()).then(d => setNotes(d.data || []))
    fetch('/api/reminders').then(r => r.json()).then(d => setReminders(d.data || []))
  }

  const changeSection = (key) => {
    setSection(key)
    setAnimKey(k => k + 1)
  }

  const post = async (url, body) => {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    loadAll()
  }

  const del = async (url, id) => {
    await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    loadAll()
  }

  const patch = async (url, body) => {
    await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    loadAll()
  }

  const getDeadlineClass = (deadline) => {
    if (!deadline) return ''
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
    if (days <= 1) return styles.deadlineUrgent
    if (days <= 3) return styles.deadlineSoon
    return ''
  }

  // ── SCHEDULE ──
  const renderSchedule = () => (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Weekly Schedule</h2>
        <p className={styles.sectionSubtitle}>Your recurring classes & lessons</p>
      </div>
      <div className={styles.card}>
        <p className={styles.cardTitle}>Add a lesson</p>
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Subject</label>
            <input className={styles.input} placeholder="e.g. Mathematics" value={newLesson.subject}
              onChange={e => setNewLesson({ ...newLesson, subject: e.target.value })} />
          </div>
          <div className={styles.inputGroup} style={{ maxWidth: 140 }}>
            <label className={styles.inputLabel}>Day</label>
            <select className={styles.input} value={newLesson.day}
              onChange={e => setNewLesson({ ...newLesson, day: e.target.value })}>
              {DAYS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className={styles.inputGroup} style={{ maxWidth: 120 }}>
            <label className={styles.inputLabel}>From</label>
            <input className={styles.input} type="time" value={newLesson.start_time}
              onChange={e => setNewLesson({ ...newLesson, start_time: e.target.value })} />
          </div>
          <div className={styles.inputGroup} style={{ maxWidth: 120 }}>
            <label className={styles.inputLabel}>To</label>
            <input className={styles.input} type="time" value={newLesson.end_time}
              onChange={e => setNewLesson({ ...newLesson, end_time: e.target.value })} />
          </div>
          <button className={styles.btn} style={{ alignSelf: 'flex-end' }}
            onClick={() => { if (!newLesson.subject) return; post('/api/schedule', newLesson); setNewLesson({ subject: '', day: 'Monday', start_time: '', end_time: '' }) }}>
            Add
          </button>
        </div>
      </div>
      <div className={styles.scheduleGrid}>
        {DAYS.map(day => (
          <div key={day} className={styles.dayCol}>
            <div className={styles.dayTitle}>{day.slice(0, 3)}</div>
            {schedule.filter(s => s.day === day).length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--stone)', fontSize: '0.7rem', marginTop: 16 }}>—</div>
            )}
            {schedule.filter(s => s.day === day).map(s => (
              <div key={s.id} className={styles.lesson}>
                <span className={styles.lessonSubject}>{s.subject}</span>
                <span className={styles.lessonTime}>{s.start_time?.slice(0,5)} – {s.end_time?.slice(0,5)}</span>
                <button className={styles.lessonDelete} onClick={() => del('/api/schedule', s.id)}>remove</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )

  // ── TODOS ──
  const renderTodos = () => (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Tasks & Homework</h2>
        <p className={styles.sectionSubtitle}>Stay on top of what matters</p>
      </div>
      <div className={styles.card}>
        <p className={styles.cardTitle}>Add a task</p>
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Title</label>
            <input className={styles.input} placeholder="What needs to be done?" value={newTodo.title}
              onChange={e => setNewTodo({ ...newTodo, title: e.target.value })} />
          </div>
          <div className={styles.inputGroup} style={{ maxWidth: 140 }}>
            <label className={styles.inputLabel}>Type</label>
            <select className={styles.input} value={newTodo.type}
              onChange={e => setNewTodo({ ...newTodo, type: e.target.value })}>
              <option value="todo">To-do</option>
              <option value="homework">Homework</option>
            </select>
          </div>
          <div className={styles.inputGroup} style={{ maxWidth: 160 }}>
            <label className={styles.inputLabel}>Deadline</label>
            <input className={styles.input} type="date" value={newTodo.deadline}
              onChange={e => setNewTodo({ ...newTodo, deadline: e.target.value })} />
          </div>
          <button className={styles.btn} style={{ alignSelf: 'flex-end' }}
            onClick={() => { if (!newTodo.title) return; post('/api/todos', newTodo); setNewTodo({ title: '', type: 'todo', deadline: '' }) }}>
            Add
          </button>
        </div>
      </div>
      <div className={styles.card}>
        {todos.length === 0 && <p className={styles.empty}>No tasks yet — add one above</p>}
        {todos.map(t => (
          <div key={t.id} className={`${styles.item} ${t.done ? styles.done : ''}`}>
            <div>
              <span className={styles.itemTitle}>{t.title}</span>
              <span className={`${styles.tag} ${t.type === 'homework' ? styles.tagHomework : styles.tagTodo}`}>{t.type}</span>
              {t.deadline && (
                <div className={`${styles.itemMeta} ${getDeadlineClass(t.deadline)}`}>
                  Due {new Date(t.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              )}
            </div>
            <div className={styles.itemActions}>
              {!t.done && <button className={styles.btnSuccess} onClick={() => patch('/api/todos', { id: t.id, done: true })}>Done</button>}
              <button className={styles.btnDanger} onClick={() => del('/api/todos', t.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )

  // ── STUDY SESSIONS ──
  const renderStudy = () => (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Study Sessions</h2>
        <p className={styles.sectionSubtitle}>Log your study time</p>
      </div>
      <div className={styles.card}>
        <p className={styles.cardTitle}>Log a session</p>
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Subject</label>
            <input className={styles.input} placeholder="e.g. Physics" value={newSession.subject}
              onChange={e => setNewSession({ ...newSession, subject: e.target.value })} />
          </div>
          <div className={styles.inputGroup} style={{ maxWidth: 160 }}>
            <label className={styles.inputLabel}>Date</label>
            <input className={styles.input} type="date" value={newSession.date}
              onChange={e => setNewSession({ ...newSession, date: e.target.value })} />
          </div>
          <div className={styles.inputGroup} style={{ maxWidth: 110 }}>
            <label className={styles.inputLabel}>Minutes</label>
            <input className={styles.input} type="number" placeholder="60" value={newSession.duration_minutes}
              onChange={e => setNewSession({ ...newSession, duration_minutes: e.target.value })} />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Note (optional)</label>
            <input className={styles.input} placeholder="What did you cover?" value={newSession.notes}
              onChange={e => setNewSession({ ...newSession, notes: e.target.value })} />
          </div>
          <button className={styles.btn} style={{ alignSelf: 'flex-end' }}
            onClick={() => { if (!newSession.subject) return; post('/api/study-sessions', newSession); setNewSession({ subject: '', date: '', duration_minutes: '', notes: '' }) }}>
            Log
          </button>
        </div>
      </div>
      <div className={styles.card}>
        {sessions.length === 0 && <p className={styles.empty}>No sessions logged yet</p>}
        {sessions.map(s => (
          <div key={s.id} className={styles.item}>
            <div>
              <span className={styles.itemTitle}>{s.subject}</span>
              <div className={styles.itemMeta}>
                {s.date?.slice(0,10)} &nbsp;·&nbsp; {s.duration_minutes} minutes
                {s.notes && <> &nbsp;·&nbsp; {s.notes}</>}
              </div>
            </div>
            <div className={styles.itemActions}>
              <button className={styles.btnDanger} onClick={() => del('/api/study-sessions', s.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )

  // ── NOTES ──
  const renderNotes = () => (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Notes</h2>
        <p className={styles.sectionSubtitle}>Capture your thoughts</p>
      </div>
      <div className={styles.card}>
        <p className={styles.cardTitle}>New note</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input className={styles.input} placeholder="Title" value={newNote.title}
            onChange={e => setNewNote({ ...newNote, title: e.target.value })} />
          <textarea className={styles.textarea} placeholder="Write your note here..." value={newNote.content}
            onChange={e => setNewNote({ ...newNote, content: e.target.value })} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className={styles.btn}
              onClick={() => { if (!newNote.title) return; post('/api/notes', newNote); setNewNote({ title: '', content: '' }) }}>
              Save Note
            </button>
          </div>
        </div>
      </div>
      {notes.length === 0 && <p className={styles.empty} style={{ marginTop: 20 }}>No notes yet</p>}
      {notes.map(n => (
        <div key={n.id} className={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <p className={styles.cardTitle} style={{ marginBottom: 2 }}>{n.title}</p>
              <span style={{ fontSize: '0.72rem', color: 'var(--stone)', letterSpacing: '0.05em' }}>
                {new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button className={styles.btnDanger} onClick={() => del('/api/notes', n.id)}>Remove</button>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--umber)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{n.content}</p>
        </div>
      ))}
    </>
  )

  // ── PROGRESS ──
  const renderProgress = () => {
    const totalTodos = todos.length
    const doneTodos = todos.filter(t => t.done).length
    const pct = totalTodos === 0 ? 0 : Math.round((doneTodos / totalTodos) * 100)
    const totalMins = sessions.reduce((a, s) => a + Number(s.duration_minutes || 0), 0)
    const subjectMinutes = {}
    sessions.forEach(s => { subjectMinutes[s.subject] = (subjectMinutes[s.subject] || 0) + Number(s.duration_minutes) })
    const maxMins = Math.max(...Object.values(subjectMinutes), 1)

    return (
      <>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Progress</h2>
          <p className={styles.sectionSubtitle}>Your academic overview</p>
        </div>
        <div className={styles.statGrid}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{doneTodos}<span style={{ fontSize: '1.2rem', color: 'var(--stone)' }}>/{totalTodos}</span></span>
            <span className={styles.statLabel}>Tasks Done</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{Math.floor(totalMins / 60)}<span style={{ fontSize: '1.2rem', color: 'var(--stone)' }}>h {totalMins % 60}m</span></span>
            <span className={styles.statLabel}>Total Study Time</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{sessions.length}</span>
            <span className={styles.statLabel}>Sessions Logged</span>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Task completion</p>
          <div className={styles.progressStat}>
            <span className={styles.progressLabel}>Overall progress</span>
            <span className={styles.progressValue}>{pct}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
        </div>

        {Object.keys(subjectMinutes).length > 0 && (
          <div className={styles.card}>
            <p className={styles.cardTitle}>Study time by subject</p>
            {Object.entries(subjectMinutes).sort((a,b) => b[1]-a[1]).map(([subject, mins]) => (
              <div key={subject} style={{ marginBottom: 14 }}>
                <div className={styles.progressStat}>
                  <span className={styles.progressLabel}>{subject}</span>
                  <span className={styles.progressValue}>{Math.floor(mins/60)}h {mins%60}m</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${(mins / maxMins) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.card}>
          <p className={styles.cardTitle}>Upcoming deadlines</p>
          {todos.filter(t => !t.done && t.deadline).sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).slice(0,5).map(t => (
            <div key={t.id} className={styles.item}>
              <div>
                <span className={styles.itemTitle}>{t.title}</span>
                <span className={`${styles.tag} ${t.type === 'homework' ? styles.tagHomework : styles.tagTodo}`}>{t.type}</span>
              </div>
              <span className={`${styles.itemMeta} ${getDeadlineClass(t.deadline)}`}>
                {new Date(t.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          ))}
          {todos.filter(t => !t.done && t.deadline).length === 0 && <p className={styles.empty}>No upcoming deadlines</p>}
        </div>
      </>
    )
  }

  // ── REMINDERS ──
  const renderReminders = () => (
    <>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Reminders</h2>
        <p className={styles.sectionSubtitle}>Email alerts sent automatically</p>
      </div>
      <div className={styles.card}>
        <p className={styles.cardTitle}>Set a reminder</p>
        <div className={styles.inputRow}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Title</label>
            <input className={styles.input} placeholder="e.g. Submit assignment" value={newReminder.title}
              onChange={e => setNewReminder({ ...newReminder, title: e.target.value })} />
          </div>
          <div className={styles.inputGroup} style={{ maxWidth: 220 }}>
            <label className={styles.inputLabel}>Date & Time (24h)</label>
            <input className={styles.input} type="datetime-local" value={newReminder.remind_at}
              onChange={e => setNewReminder({ ...newReminder, remind_at: e.target.value })} />
          </div>
          <button className={styles.btn} style={{ alignSelf: 'flex-end' }}
            onClick={() => {
              if (!newReminder.title || !newReminder.remind_at) { alert('Please fill in both fields'); return }
              post('/api/reminders', newReminder)
              setNewReminder({ title: '', remind_at: '' })
            }}>
            Set
          </button>
        </div>
      </div>
      <div className={styles.card}>
        {reminders.length === 0 && <p className={styles.empty}>No reminders set</p>}
        {reminders.map(r => (
          <div key={r.id} className={`${styles.item} ${r.done ? styles.done : ''}`}>
            <div>
              <span className={styles.itemTitle}>{r.title}</span>
              <div className={styles.itemMeta}>
                {r.remind_at ? (() => {
                  const d = new Date(r.remind_at)
                  d.setHours(d.getHours() + 4) // Baku is UTC+4
                  return d.toLocaleString('en-GB', { hour12: false, day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                })() : ''}
                {r.done && <span style={{ marginLeft: 8, color: 'var(--sage)' }}>· Sent</span>}
              </div>
            </div>
            <div className={styles.itemActions}>
              {!r.done && <button className={styles.btnSuccess} onClick={() => patch('/api/reminders', { id: r.id, done: true })}>Done</button>}
              <button className={styles.btnDanger} onClick={() => del('/api/reminders', r.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )

  const renderSection = () => {
    if (section === 'schedule') return renderSchedule()
    if (section === 'todos') return renderTodos()
    if (section === 'study') return renderStudy()
    if (section === 'notes') return renderNotes()
    if (section === 'progress') return renderProgress()
    if (section === 'reminders') return renderReminders()
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarUser}>
          <span className={styles.sidebarUserGreeting}>Signed in as</span>
          <span className={styles.sidebarUserName}>{user?.username}</span>
        </div>
        {SECTIONS.map(s => (
          <button key={s.key}
            className={`${styles.sidebarBtn} ${section === s.key ? styles.sidebarBtnActive : ''}`}
            onClick={() => changeSection(s.key)}>
            <span className={styles.sidebarIcon}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
      <div className={styles.main} key={animKey}>
        {renderSection()}
      </div>
    </div>
  )
}
