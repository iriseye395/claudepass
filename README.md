# claudepass

A small giveaway for 6 Claude Code guest passes (1 free week each), shared by [@mehulmpt](https://x.com/mehulmpt) and [@YashSolanki_](https://x.com/YashSolanki_), live at **[claudepass.mehulmohan.com](https://claudepass.mehulmohan.com)**.

You pick one of three tickets. The server draws the result; the ticket you pick is just for fun. If you win, you have 5 minutes to leave your email, and the pass is sent to you personally.

This repo is public so anyone can check how the draw works.

## How the draw works

1. **One pull a minute per network.** Your IP is the key: IPv4 as-is, IPv6 grouped to its `/64` (one subscriber usually controls a whole `/64`, so a per-address limit would be easy to dodge). The check is a single atomic SQL statement, so parallel requests can't sneak in extra pulls.
2. **Bot check.** Every pull needs a fresh, single-use [Turnstile](https://developers.cloudflare.com/turnstile/) token, verified on the server and consumed in D1, so a replay is rejected even while Cloudflare's replay detection catches up.
3. **The roll.** The server draws from `crypto.getRandomValues`. Odds get harder as passes go:

    | Passes   | Odds         |
    | -------- | ------------ |
    | 1st, 2nd | 1 in 10,000  |
    | 3rd, 4th | 1 in 20,000  |
    | 5th, 6th | 1 in 100,000 |
