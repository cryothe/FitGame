# FitGame

Exercise ranking app with accounts. **Run it in the browser** (easiest).

## Stack

| Layer | Tech |
|-------|------|
| App | React Native (Expo) — web + mobile |
| Backend | Node.js (Express + SQLite) |
| Native iOS | Swift — later |

## Run (web)

Use **2 terminal tabs**. One command at a time.

### Terminal 1 — API

```bash
cd ~/FitGame/server
npm install
npm run dev
```

Leave it running. Check: `curl http://127.0.0.1:3001/health`

### Terminal 2 — App in browser

```bash
cd ~/FitGame
npm install
npm start
```

Your browser should open the app (or go to the URL Expo prints, usually `http://localhost:8081`).

Login / create account, then log reps and climb ranks.

## Product

- Create account / log in
- Exercises: pushups, situps, leg raises, bicep curls, pullups
- Ranks: Bronze → Silver → Gold → Diamond → Champion

| Rank | Min lifetime reps |
|------|-------------------|
| Bronze | 0 |
| Silver | 250 |
| Gold | 1,000 |
| Diamond | 5,000 |
| Champion | 15,000 |
