import { NextResponse } from "next/server";

export async function GET() {
  const providers = [];

  // Check Ollama
  try {
    const response = await fetch("http://localhost:11434/api/tags", {
      signal: AbortSignal.timeout(2000),
    });
    if (response.ok) {
      const data = await response.json();
      providers.push({
        id: "ollama",
        name: "Ollama (Local)",
        available: true,
        models: data.models?.map((m: any) => m.name) || ["llama3.2"],
      });
    } else {
      providers.push({
        id: "ollama",
        name: "Ollama (Local)",
        available: false,
        models: [],
      });
    }
  } catch {
    providers.push({
      id: "ollama",
      name: "Ollama (Local)",
      available: false,
      models: [],
    });
  }

  // Check OpenAI (if API key exists)
  providers.push({
    id: "openai",
    name: "OpenAI",
    available: !!process.env.OPENAI_API_KEY,
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
  });

  // Check Anthropic (if API key exists)
  providers.push({
    id: "anthropic",
    name: "Anthropic",
    available: !!process.env.ANTHROPIC_API_KEY,
    models: [
      "claude-3-5-sonnet-20241022",
      "claude-3-haiku-20240307",
      "claude-3-opus-20240229",
    ],
  });

  return NextResponse.json({ providers });
}
