import nodemailer from 'nodemailer';
import { EMAIL_TO } from './config.js';

function buildHtml(newJobs) {
  const byKeyword = {};
  for (const job of newJobs) {
    (byKeyword[job.keyword] ??= []).push(job);
  }

  const sections = Object.entries(byKeyword).map(([keyword, jobs]) => {
    const rows = jobs.map(j => {
      const location = j.remote ? 'Remote' : (j.city ?? 'Unknown');
      const posted = j.posted_at ? new Date(j.posted_at).toLocaleDateString() : '—';
      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee"><a href="${j.url}" style="color:#0066cc">${j.title}</a></td>
          <td style="padding:8px;border-bottom:1px solid #eee">${j.company ?? '—'}</td>
          <td style="padding:8px;border-bottom:1px solid #eee">${location}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;color:#888">${posted}</td>
        </tr>`;
    }).join('');

    return `
      <h3 style="color:#333;margin-top:24px">${keyword} <span style="color:#888;font-size:14px">(${jobs.length})</span></h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#f5f5f5">
            <th style="padding:8px;text-align:left">Title</th>
            <th style="padding:8px;text-align:left">Company</th>
            <th style="padding:8px;text-align:left">Location</th>
            <th style="padding:8px;text-align:left">Posted</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;
  }).join('');

  const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return `
    <div style="font-family:sans-serif;max-width:800px;margin:0 auto;padding:24px">
      <h2 style="color:#111">Hunt — ${newJobs.length} new job${newJobs.length !== 1 ? 's' : ''} · ${date}</h2>
      ${sections}
      <p style="color:#aaa;font-size:12px;margin-top:32px">Source: SmartRecruiters · New York / Remote</p>
    </div>`;
}

export async function sendReport(newJobs) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: EMAIL_TO,
    subject: `Hunt — ${newJobs.length} new job${newJobs.length !== 1 ? 's' : ''} (${date})`,
    html: buildHtml(newJobs),
  });
}
