import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, unlink, mkdir } from "fs/promises";
import { join, dirname } from "path";

interface FileChange {
  path: string;
  action: "create" | "modify" | "delete";
  content?: string;
  diff?: string;
}

function getProviderConfig(provider: string, apiKey?: string, model?: string) {
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

async function generateWithOpenAI(config: any, prompt: string): Promise<string> {
  const response = await fetch(config.url, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: "You are a code editing assistant. Return only valid JSON arrays." },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 4000,
    }),
  });
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "[]";
}

async function generateWithAnthropic(config: any, prompt: string): Promise<string> {
  const response = await fetch(config.url, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      model: config.model,
      system: "You are a code editing assistant. Return only valid JSON arrays.",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "[]";
}

async function generateWithOllama(config: any, prompt: string): Promise<string> {
  const response = await fetch(config.url, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: "You are a code editing assistant. Return only valid JSON arrays." },
        { role: "user", content: prompt },
      ],
      stream: false,
    }),
  });
  const data = await response.json();
  return data.message?.content || "[]";
}

async function generateChanges(
  instruction: string,
  files: Record<string, string>,
  context: string | undefined,
  provider: string,
  apiKey?: string,
  model?: string
): Promise<FileChange[]> {
  const prompt = `You are a code editor. Given the following instruction and files, generate the necessary changes.

Instruction: ${instruction}

${context ? `Context: ${context}\n\n` : ""}Current files:
${Object.entries(files).map(([path, content]) => `\n--- ${path} ---\n${content}`).join("\n")}

Return a JSON array of changes. Each change object must have:
- "path": the file path relative to project root
- "action": one of "create", "modify", "delete"
- "content": the new full file content (required for create and modify)
- "diff": a unified diff string showing what changed (optional, for modify)

Example:
[
  {
    "path": "src/utils/helper.ts",
    "action": "modify",
    "content": "// new content here",
    "diff": "@@ -1,3 +1,4 @@\\n+// new content here\\n  existing line"
  },
  {
    "path": "src/new-file.ts",
    "action": "create",
    "content": "export function hello() { return 'world'; }"
  }
]

Only return the JSON array, no explanations or markdown fences.`;

  const config = getProviderConfig(provider, apiKey, model);
  let raw: string;

  switch (provider) {
    case "openai":
      raw = await generateWithOpenAI(config, prompt);
      break;
    case "anthropic":
      raw = await generateWithAnthropic(config, prompt);
      break;
    case "ollama":
      raw = await generateWithOllama(config, prompt);
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  // Strip markdown fences if present
  const cleaned = raw.replace(/^```(?:json)?\s*\n?/m, "").replace(/\n?```\s*$/m, "").trim();

  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { instruction, files, context, provider = "ollama", apiKey, model } = await request.json();

    if (!instruction || !files || !Array.isArray(files)) {
      return NextResponse.json(
        { error: "instruction and files (array) are required" },
        { status: 400 }
      );
    }

    const fileContents: Record<string, string> = {};
    for (const filePath of files) {
      try {
        const content = await readFile(join(process.cwd(), filePath), "utf-8");
        fileContents[filePath] = content;
      } catch {
        fileContents[filePath] = "";
      }
    }

    const changes = await generateChanges(instruction, fileContents, context, provider, apiKey, model);

    return NextResponse.json({ changes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { changes } = await request.json();

    if (!changes || !Array.isArray(changes)) {
      return NextResponse.json({ error: "changes array required" }, { status: 400 });
    }

    let applied = 0;
    for (const change of changes as FileChange[]) {
      const fullPath = join(process.cwd(), change.path);

      switch (change.action) {
        case "create":
        case "modify":
          await mkdir(dirname(fullPath), { recursive: true });
          await writeFile(fullPath, change.content || "", "utf-8");
          applied++;
          break;
        case "delete":
          await unlink(fullPath);
          applied++;
          break;
      }
    }

    return NextResponse.json({ success: true, applied });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
