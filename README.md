# FitGame

Mobile exercise ranking app.

## Stack

| Layer | Tech | Status |
|-------|------|--------|
| Mobile frontend | **React Native (Expo)** | This repo |
| Backend | **Node.js** | Later |
| Native iOS | **Swift** | Later (when we need iOS-native pieces) |

## What it does

Log reps for five exercises and climb ranks:

**Pushups · Situps · Leg raises · Bicep curls · Pullups**

Ranks: **Bronze → Silver → Gold → Diamond → Champion**

| Rank | Min lifetime reps |
|------|-------------------|
| Bronze | 0 |
| Silver | 250 |
| Gold | 1,000 |
| Diamond | 5,000 |
| Champion | 15,000 |

A progress bar shows how far you are to the next rank. Counts persist on-device via AsyncStorage.

## Run (phone / simulator)

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (iOS/Android), or press `i` / `a` for a simulator.

```bash
npx expo start --web   # browser preview of the same RN UI
```
