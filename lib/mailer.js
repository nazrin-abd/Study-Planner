import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }
})

export async function sendReminderEmail(toEmail, username, reminderTitle, remindAt) {
  await transporter.sendMail({
    from: `"Study Planner" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `⏰ Reminder: ${reminderTitle}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #8B6914;">⏰ Study Planner Reminder</h2>
        <p>Hi <strong>${username}</strong>,</p>
        <p>This is your reminder for:</p>
        <h3 style="color: #5a3e0a;">${reminderTitle}</h3>
        <p style="color: #888;">Scheduled for: ${remindAt}</p>
        <hr />
        <small style="color: #aaa;">Study Planner — stay on track!</small>
      </div>
    `
  })
}