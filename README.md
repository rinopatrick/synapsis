# Synapsis

[![CI](https://github.com/rinopatrick/synapsis/actions/workflows/ci.yml/badge.svg)](https://github.com/rinopatrick/synapsis/actions/workflows/ci.yml)
[![Node.js 18+](https://img.shields.io/badge/node.js-18+-green.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AI Learning IDE** — Form the connection. Learn the code.

Synapsis adalah AI-powered learning IDE yang membantu kamu belajar coding dengan cara **membimbing melalui keputusan**, bukan langsung memberi jawaban. AI akan bertanya, memberi hints, dan membantu kamu memahami "why" di balik setiap keputusan.

## ✨ Features

### 🎓 Learning System
- **Learning Mode** — AI membimbing kamu melalui keputusan, membantu memahami reasoning
- **Builder Mode** — AI langsung implementasi saat kamu butuh bergerak cepat
- **Level System** — Beginner, Intermediate, dan Advanced menyesuaikan guidance AI
- **Skip Topics** — Tandai topik yang sudah kamu tahu untuk skip pertanyaan
- **Gradual Reveal** — Dapat hints dulu, lalu options, lalu explanations

### 🧠 AI Integration
- **Multi-Provider** — Support Ollama (local), OpenAI, dan Anthropic
- **AI-Powered Questions** — Pertanyaan di-generate secara dinamis oleh AI
- **Code Review** — AI review kode kamu dan berikan feedback
- **Voice Input** — Interaksi dengan AI menggunakan speech-to-text

### 📊 Progress Tracking
- **Skill Tracking** — Track progress dan XP di berbagai skills
- **Learning Dashboard** — Visualisasi progress, streak, dan achievements
- **Session Recap** — Ringkasan pembelajaran per session

### 👥 Collaboration
- **Shared Sessions** — Belajar bersama dalam real-time sessions
- **Participant Tracking** — Lihat siapa yang sedang belajar
- **Learning Together Mode** — Mode belajar bersama

### 🖥️ IDE Features
- **VS Code-like Interface** — Familiar UI untuk developers
- **Code Editor** — Syntax highlighting dan autocomplete
- **Terminal** — Integrated terminal
- **File Explorer** — Manage project files
- **AI Chat Panel** — Chat dengan AI assistant
- **Command Palette** — Quick access ke semua fitur
- **Theme Support** — Dark dan light theme

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Synapsis IDE                         │
├─────────────────────────────────────────────────────────┤
│  apps/web/                    Next.js Web App          │
│  ├── components/ide/          IDE UI Components         │
│  ├── hooks/                   React Hooks               │
│  └── app/api/                 API Routes               │
├─────────────────────────────────────────────────────────┤
│  packages/core/               Business Logic            │
│  ├── learning/                Learning Engine           │
│  ├── decision/                Decision Registry         │
│  ├── ai/                      AI Provider               │
│  ├── skill/                   Skill Tracker             │
│  └── session/                 Session Manager           │
├─────────────────────────────────────────────────────────┤
│  packages/ui/                 Shared UI Components      │
│  packages/config/             Shared Configuration      │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Ollama (untuk local AI) atau API key untuk OpenAI/Anthropic

### Installation

```bash
# Clone repository
git clone https://github.com/rinopatrick/synapsis.git
cd synapsis

# Install dependencies
pnpm install

# Setup environment variables
cp apps/web/.env.example apps/web/.env.local

# Start development server
pnpm dev
```

### Environment Variables

Buat file `apps/web/.env.local`:

```env
# OpenAI (opsional)
OPENAI_API_KEY=your-openai-api-key

# Anthropic (opsional)
ANTHROPIC_API_KEY=your-anthropic-api-key

# Ollama (default, tidak perlu key)
# Pastikan Ollama running di http://localhost:11434
```

## 📖 Usage

### 1. Start Learning
```
Buka Synapsis → Klik "Start Learning" → Pilih topik
```

### 2. Answer Questions
```
AI akan bertanya → Pilih jawaban → Dapat hints jika salah
```

### 3. Get Hints
```
Klik "Show Hint" → Lihat options → Baca explanation
```

### 4. Build Project
```
Switch ke "Builder Mode" → AI langsung implementasi
```

### 5. Track Progress
```
Buka Dashboard → Lihat XP, skills, dan achievements
```

## 🧪 Testing

```bash
# Run all tests (143 tests)
cd packages/core && npm test

# Run specific test file
npm test -- --grep "LearningEngine"
```

### Test Coverage

| Module | Tests | Coverage |
|--------|-------|----------|
| LearningEngine | 36 | Core learning logic |
| AIProvider | 22 | API integration |
| DecisionRegistry | 24 | Decision tracking |
| SkillTracker | 37 | XP dan leveling |
| SessionManager | 24 | Session management |
| **Total** | **143** | **All modules** |

## 🐳 Docker

```bash
# Build image
docker build -t synapsis .

# Run container
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=$OPENAI_API_KEY \
  synapsis

# Atau pakai docker-compose
docker-compose up -d
```

## 📁 Project Structure

```
synapsis/
├── apps/
│   └── web/                     # Next.js Web App
│       ├── src/
│       │   ├── app/             # App router pages
│       │   │   ├── api/         # API routes
│       │   │   └── demo/        # Demo page
│       │   ├── components/
│       │   │   ├── ide/         # IDE components
│       │   │   │   ├── ide-layout.tsx
│       │   │   │   ├── ai-chat.tsx
│       │   │   │   ├── code-editor.tsx
│       │   │   │   ├── terminal.tsx
│       │   │   │   └── ...
│       │   │   ├── chat/        # Chat components
│       │   │   └── ui/          # UI primitives
│       │   ├── hooks/           # React hooks
│       │   │   ├── use-ide-store.ts
│       │   │   ├── use-ai-chat.ts
│       │   │   ├── use-voice-input.ts
│       │   │   ├── use-collaborative.ts
│       │   │   └── ...
│       │   └── lib/             # Utilities
│       └── package.json
│
├── packages/
│   ├── core/                    # Business Logic
│   │   ├── src/
│   │   │   ├── learning/        # Learning Engine
│   │   │   ├── decision/        # Decision Registry
│   │   │   ├── ai/              # AI Provider
│   │   │   ├── skill/           # Skill Tracker
│   │   │   ├── session/         # Session Manager
│   │   │   └── types/           # TypeScript types
│   │   └── package.json
│   │
│   ├── ui/                      # Shared UI Components
│   └── config/                  # Shared Configuration
│
├── .github/workflows/ci.yml    # CI/CD pipeline
├── Dockerfile                   # Docker config
├── docker-compose.yml           # Docker Compose
├── turbo.json                   # Turborepo config
├── pnpm-workspace.yaml          # pnpm workspace
└── package.json                 # Root package
```

## ⚙️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| AI | OpenAI / Anthropic / Ollama |
| State | Zustand |
| Database | SQLite (local) |
| Monorepo | Turborepo + pnpm |
| Testing | Vitest |
| CI/CD | GitHub Actions |
| Container | Docker |

## 🎯 Key Features Explained

### Learning Mode vs Builder Mode

| Feature | Learning Mode | Builder Mode |
|---------|---------------|--------------|
| AI Behavior | Guides through decisions | Implements directly |
| Questions | Yes, with hints | No |
| Speed | Slower, educational | Faster, productive |
| Best for | Learning new concepts | Building real projects |

### Gradual Reveal System

```
Level 1: Hint only
   ↓
Level 2: Hint + Options
   ↓
Level 3: Hint + Options + Explanation + Answer
```

### Skill Tracking

- **XP System** — Earn XP for completing challenges
- **Level Up** — Level up setelah capai XP threshold
- **Categories** — Track skills per category (frontend, backend, etc.)
- **Mastery** — Master skill setelah level 10

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Development Guidelines

- Ikuti TDD (Test-Driven Development)
- Pastikan semua tests pass sebelum commit
- Gunakan conventional commits
- Update dokumentasi jika diperlukan

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Inspired by VS Code interface
- Built with Next.js, Tailwind CSS, dan shadcn/ui
- AI powered by OpenAI, Anthropic, dan Ollama

---

**Built by [Patrick Rino](https://github.com/rinopatrick)** — Nuclear Engineering → AI/ML Transition
