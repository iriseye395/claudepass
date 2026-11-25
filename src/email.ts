import { env } from 'cloudflare:workers'
import { escapeHtml } from './lib.ts'
import type { WinnerRow } from './schemas.ts'

const FROM = () => ({ email: env.FROM_ADDRESS, name: 'Claude Pass Giveaway' })

function shell(inner: string): string {
	return `<!doctype html>
<html><body style="margin:0;padding:32px 16px;background:#0e0e11;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#1b1b20;border:1px solid #34343d;border-top:2px solid #a8a8f0;border-radius:12px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#e6e6ea;">
${inner}
<tr><td style="padding:14px 28px;border-top:1px solid #2a2a31;font-size:12px;color:#6f6f7a;">claudepass.mehulmohan.com</td></tr>
</table></td></tr></table></body></html>`
}

/** Confirmation to the winner. Deliberately contains no pass link: Mehul sends those by hand. */
export async function sendWinnerEmail({
	to,
	test = false,
}: {
	to: string
	test?: boolean
}) {
	const html = shell(`
${test ? '<tr><td style="padding:14px 28px;background:#2a2a45;color:#c8c8ff;font-size:13px;">TEST MODE: this is not a real win and no pass was reserved.</td></tr>' : ''}
<tr><td style="padding:28px 28px 8px;">
<div style="color:#a8a8f0;font-size:16px;">Guest pass</div>
<div style="color:#8a8a96;font-size:14px;margin-top:4px;">1 week of Claude Code</div>
</td></tr>
<tr><td style="padding:20px 28px;">
<div style="display:inline-block;border:1px solid #d97757;border-radius:4px;padding:10px 16px;font-size:16px;color:#d97757;">) CC &#10043; &#9478; (</div>
</td></tr>
<tr><td style="padding:4px 28px 28px;font-size:14px;line-height:1.7;color:#c9c9d1;">
<span style="color:#7ec699;">&#10003; You won one of the passes.</span><br><br>
Mehul will email you the pass personally at this address once all the winners are in. You don't need to do anything else. Keep an eye on your inbox.
</td></tr>`)

	const text = `${test ? 'TEST MODE: this is not a real win and no pass was reserved.\n\n' : ''}You won a Claude Code guest pass (1 week free).

Mehul will email you the pass personally at this address once all the winners are in. You don't need to do anything else.

- claudepass.mehulmohan.com`

	return env.EMAIL.send({
		to,
		from: FROM(),
		subject: `${test ? '[TEST] ' : ''}You won a Claude Code guest pass`,
		html,
		text,
	})
}

/** Notice to Mehul with every winner so far. */
export async function sendAdminNotice({
	latest,
	winners,
	total,
	test = false,
}: {
	latest: string
	winners: WinnerRow[]
	total: number
	test?: boolean
}) {
	const done = !test && winners.length >= total
	const rows = winners
		.map(
			(w, i) =>
				`<tr><td style="padding:4px 12px 4px 0;color:#8a8a96;">${i + 1}.</td><td style="padding:4px 12px 4px 0;color:#e6e6ea;">${escapeHtml(w.email)}</td><td style="padding:4px 0;color:#6f6f7a;">${new Date(w.redeemed_at * 1000).toISOString().replace('T', ' ').slice(0, 16)} UTC</td></tr>`,
		)
		.join('')

	const html = shell(`
<tr><td style="padding:28px;font-size:14px;line-height:1.7;color:#c9c9d1;">
<div style="color:${done ? '#7ec699' : '#a8a8f0'};font-size:16px;margin-bottom:12px;">${test ? 'Test claim (nothing saved, no pass used)' : done ? `All ${total} passes claimed` : `New winner: ${winners.length} of ${total}`}</div>
Latest: <b style="color:#d97757;">${escapeHtml(latest)}</b>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:16px;font-size:13px;">${rows}</table>
</td></tr>`)

	const text = `${test ? `Test claim from ${latest}. Nothing saved, no pass used.` : done ? `All ${total} passes claimed.` : `New winner (${winners.length} of ${total}).`}

${winners.map((w, i) => `${i + 1}. ${w.email}`).join('\n')}`

	return env.EMAIL.send({
		to: env.ADMIN_EMAIL,
		from: FROM(),
		subject: test
			? `claudepass [TEST]: ${latest}`
			: done
				? `claudepass: all ${total} winners are in`
				: `claudepass: winner ${winners.length}/${total} (${latest})`,
		html,
		text,
	})
}
