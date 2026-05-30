# 🎙️ VocaText — Speech-to-Text Web Application

> Real-time audio transcription powered by OpenAI Whisper, built with Next.js + Flask.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![Flask](https://img.shields.io/badge/Flask-3-green?logo=flask) ![Whisper](https://img.shields.io/badge/Whisper-OpenAI-orange) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)

---

## Architecture

```
vocatext/
├── frontend/          # Next.js 14 + Tailwind CSS
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/
│   │   └── lib/       # API helpers, auth utils
│   └── public/
└── backend/           # Flask + Whisper + PostgreSQL
    ├── app/
    │   ├── routes/    # auth, transcribe, history
    │   ├── models/    # SQLAlchemy models
    │   └── utils/     # whisper wrapper, audio processing
    ├── migrations/
    └── tests/
```

## Quick Start

### Prerequisites
- Python 3.10+, Node.js 18+, PostgreSQL 14+
- `ffmpeg` installed (`brew install ffmpeg` / `apt install ffmpeg`)

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env                            # fill in values
flask db upgrade
flask run
```

### Frontend
```bash
cd frontend
npm install
cp ../.env.example .env.local                     # set NEXT_PUBLIC_API_URL
npm run dev
```

App runs at **http://localhost:3000**

---

## Features
- 🎙️ Real-time microphone recording in browser
- 📝 Accurate transcription via OpenAI Whisper (local, no API cost)
- 📚 Transcript history with search
- 🔐 JWT authentication (register / login)
- 📥 Export as .txt or .json
- 🌐 Fully responsive, mobile-friendly UI

## Deployment
- **Frontend** → Vercel (`vercel --prod`)
- **Backend** → Render (use `Procfile`)

## License
MIT
