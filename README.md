# FitGame

Mobile exercise ranking app with accounts.

## Stack

| Layer | Tech | Status |
|-------|------|--------|
| Mobile app | **React Native (Expo)** | Login, create account, ranks |
| Backend | **Node.js (Express)** | Auth API + SQLite users |
| Native iOS | **Swift** | Later |

## Product

- Create an account / log in
- Log reps for: pushups, situps, leg raises, bicep curls, pullups
- Ranks: Bronze → Silver → Gold → Diamond → Champion
- Progress bar to the next rank

| Rank | Min lifetime reps |
|------|-------------------|
| Bronze | 0 |
| Silver | 250 |
| Gold | 1,000 |
| Diamond | 5,000 |
| Champion | 15,000 |

## Run

### 1. API (Node)

```bash
cd server
npm install
npm run dev
```

API: `http://localhost:3001`

### 2. Mobile app

```bash
# from repo root
npm install
npx expo start
```

On a physical phone, point the app at your computer:

```bash
EXPO_PUBLIC_API_URL=http://YOUR_LAN_IP:3001 npx expo start
```

Browser preview of the RN UI:

```bash
npx expo start --web
```

## Auth endpoints

- `POST /auth/register` `{ email, password, displayName }`
- `POST /auth/login` `{ email, password }`
- `GET /auth/me` (Bearer token)
