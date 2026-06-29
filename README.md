# Synapsis

**AI Learning IDE** - Form the connection. Learn the code.

## Overview

Synapsis is an AI-powered learning IDE that helps users learn coding by guiding them through decisions rather than giving direct answers. It's designed to be an interactive learning experience where the AI asks questions, provides hints, and helps users understand the "why" behind each decision.

## Features

- **Learning Mode**: AI guides you through decisions, helping you understand the reasoning
- **Builder Mode**: AI implements directly when you need to move fast
- **Level System**: Beginner, Intermediate, and Advanced levels adjust the AI's guidance
- **Skip Topics**: Mark topics you already know to skip unnecessary questions
- **Gradual Reveal**: Get hints first, then options, then explanations
- **Skill Tracking**: Track your progress and XP across different skills
- **Multi-Provider AI**: Support for Ollama (local), OpenAI, and Anthropic

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: Vercel AI SDK
- **Database**: SQLite (local)
- **State**: Zustand
- **Monorepo**: Turborepo + pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Ollama (for local AI) or API key for OpenAI/Anthropic

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/synapsis.git
cd synapsis

# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local

# Start development server
pnpm dev
```

### Environment Variables

Create `apps/web/.env.local`:

```env
# OpenAI (optional)
OPENAI_API_KEY=your-openai-api-key

# Anthropic (optional)
ANTHROPIC_API_KEY=your-anthropic-api-key

# Ollama (default, no key needed)
# Make sure Ollama is running on http://localhost:11434
```

## Project Structure

```
synapsis/
├── apps/
│   └── web/                 # Next.js web app
│       ├── src/
│       │   ├── app/         # App router pages
│       │   ├── components/  # UI components
│       │   ├── lib/         # Utilities
│       │   └── hooks/       # React hooks
│       └── package.json
│
├── packages/
│   ├── core/                # Shared business logic
│   │   ├── src/
│   │   │   ├── learning/    # Learning engine
│   │   │   ├── decision/    # Decision registry
│   │   │   ├── ai/          # AI provider
│   │   │   ├── skill/       # Skill tracker
│   │   │   ├── session/     # Session manager
│   │   │   └── db/          # Database schema
│   │   └── package.json
│   │
│   ├── ui/                  # Shared UI components
│   └── config/              # Shared configuration
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## Usage

1. **Start a conversation**: Tell Synapsis what you want to build
2. **Answer questions**: The AI will ask about your approach
3. **Get hints**: If you're stuck, ask for hints
4. **Learn**: Understand the reasoning behind each decision
5. **Build**: Apply what you've learned to your project

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

## License

MIT
