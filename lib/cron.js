import cron from 'node-cron'
import db from './db'
import { sendReminderEmail } from './mailer'

let started = false

export function startCron() {
  if (started) return
  started = true

  cron.schedule('* * * * *', async () => {
    console.log('🔍 Cron tick at', new Date().toISOString())
    try {
      const now = new Date()
      const pad = n => String(n).padStart(2, '0')
      const nowStr = `${now.getUTCFullYear()}-${pad(now.getUTCMonth()+1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:00`
      
      console.log('🕐 Checking reminders due before:', nowStr)

      const [reminders] = await db.query(
        `SELECT r.id, r.title, r.remind_at, u.email, u.username 
         FROM reminders r
         JOIN users u ON r.user_id = u.id
         WHERE r.done = FALSE 
         AND r.remind_at <= ?`,
        [nowStr]
      )

      console.log(`📋 Found ${reminders.length} due reminders`)

      for (const reminder of reminders) {
        console.log(`📧 Sending to ${reminder.email}...`)
        await sendReminderEmail(reminder.email, reminder.username, reminder.title, reminder.remind_at)
        await db.query('UPDATE reminders SET done = TRUE WHERE id = ?', [reminder.id])
        console.log(`✅ Done: ${reminder.title}`)
      }
    } catch (err) {
      console.error('❌ Cron error:', err)
    }
  })

  console.log('⏰ Reminder cron job started')
}