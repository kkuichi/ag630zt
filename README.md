# Podporné IKT riešenie v doméne BOZP

Progresívna webová aplikácia (PWA) na správu bezpečnosti a ochrany zdravia pri práci. Obsahuje správu spoločností, používateľov, hlásenie incidentov, e-learningové testy a učebné materiály.

---

## Štruktúra projektu

```
bozp-app/
├── frontend/   # Vue 3 SPA/PWA
└── backend/    # Node.js REST API
└── database/    # SQL script
```

---

## Požiadavky

| Nástroj                        | Minimálna verzia |
| ------------------------------ | ---------------- |
| [Node.js](https://nodejs.org/) | 18+              |
| [npm](https://www.npmjs.com/)  | 9+               |
| PostgreSQL databáza            | 14+              |
| Storage cloud                  | -                |

> PostgreSQL môže bežať lokálne alebo ako cloudová služba (napr. Render).  
> Storage cloud je potrebný na ukladanie fotografií.

---

## Lokálne spustenie

### 1. Klonovanie repozitára

```bash
git clone <url-repozitara>
cd pwa-bozp
```

### 2. Nastavenie backendu

```bash
cd backend
npm install
```

Vytvor súbor `.env` v priečinku `backend/` podľa šablóny `backend/.env.example`.

Spustenie vývojového servera:

```bash
npm run dev
```

Backend pobeží na `http://localhost:3000`.

### 3. Nastavenie frontendu

```bash
cd frontend
npm install
```

Vytvor súbor `.env` v priečinku `frontend/` podľa šablóny `frontend/.env.example`.

Spustenie vývojového servera:

```bash
npm run dev
```

Frontend pobeží na `http://localhost:5173`.

### 4. Databáza

Aplikácia používa PostgreSQL s raw SQL bez ORM. Celá schéma sa nachádza v súbore [`database/schema.sql`](database/schema.sql).

Tabuľky sa vytvoria spustením SQL súboru v nástroji ako pgAdmin, DBeaver alebo priamo cez psql.

> Po spustení skriptu bude automaticky vytvorený administrátorský účet:
>
> - **PID:** `A000000`
> - **Heslo:** `123456`

---
