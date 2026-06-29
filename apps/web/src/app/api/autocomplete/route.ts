import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prefix, suffix, language, fileName, provider = "ollama", apiKey, model } =
      await request.json();

    if (!prefix) {
      return NextResponse.json({ suggestion: "" });
    }

    const prompt = `Complete the code. Only return the completion, no explanations.

Language: ${language}
File: ${fileName}

Code before cursor:
\`\`\`${language}
${prefix}\`\`\`

Code after cursor (context):
${suffix ? `\`\`\`${language}\n${suffix}\`\`\`` : "(end of file)"}

Completion:`;

    const config = getProviderConfig(provider, apiKey, model);

    const response = await fetch(config.url, {
      method: "POST",
      headers: config.headers,
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: "system",
            content:
              "You are a code completion assistant. Only return the code completion, nothing else. Keep completions concise and relevant.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
        temperature: 0.2,
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error("Autocomplete provider error:", response.statusText);
      return NextResponse.json({ suggestion: "" });
    }

    const data = await response.json();
    const suggestion = extractContent(provider, data) || "";

    return NextResponse.json({ suggestion });
  } catch (error: any) {
    console.error("Autocomplete error:", error);
    return NextResponse.json({ suggestion: "" });
  }
}

function getProviderConfig(
  provider: string,
  apiKey?: string,
  model?: string
): { url: string; headers: Record<string, string>; model: string } {
  switch (provider) {
    case "openai":
      return {
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        model: model || "gpt-4o-mini",
      };
    case "anthropic":
      return {
        url: "https://api.anthropic.com/v1/messages",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
          "anthropic-version": "2023-06-01",
        },
        model: model || "claude-3-haiku-20240307",
      };
    case "ollama":
      return {
        url: "http://localhost:11434/api/chat",
        headers: { "Content-Type": "application/json" },
        model: model || "llama3.2",
      };
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

function extractContent(provider: string, data: any): string | null {
  switch (provider) {
    case "openai":
      return data.choices?.[0]?.message?.content?.trim() ?? null;
    case "anthropic":
      return data.content?.[0]?.text?.trim() ?? null;
    case "ollama":
      return data.message?.content?.trim() ?? null;
    default:
      return null;
  }
}
