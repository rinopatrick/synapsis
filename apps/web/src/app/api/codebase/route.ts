import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, stat } from "fs/promises";
import { join, extname } from "path";

interface FileInfo {
  path: string;
  name: string;
  extension: string;
  size: number;
  content?: string;
  summary?: string;
}

async function indexDirectory(dir: string, basePath: string = ""): Promise<FileInfo[]> {
  const files: FileInfo[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;

    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".next" || entry.name === ".turbo") {
      continue;
    }

    if (entry.isDirectory()) {
      const subFiles = await indexDirectory(fullPath, relativePath);
      files.push(...subFiles);
    } else {
      const ext = extname(entry.name);
      const codeExtensions = [".ts", ".tsx", ".js", ".jsx", ".py", ".rs", ".go", ".json", ".md"];

      if (codeExtensions.includes(ext)) {
        try {
          const stats = await stat(fullPath);
          if (stats.size > 500_000) continue; // Skip files > 500KB

          const content = await readFile(fullPath, "utf-8");
          files.push({
            path: relativePath,
            name: entry.name,
            extension: ext,
            size: stats.size,
            content: content.substring(0, 5000),
            summary: generateSummary(content, ext),
          });
        } catch {
          // Skip unreadable files
        }
      }
    }
  }

  return files;
}

function generateSummary(content: string, ext: string): string {
  const lines = content.split("\n");
  const summary: string[] = [];

  if (ext === ".ts" || ext === ".tsx" || ext === ".js" || ext === ".jsx") {
    for (const line of lines) {
      const trimmed = line.trim();
      if (
        trimmed.startsWith("export ") ||
        trimmed.startsWith("interface ") ||
        trimmed.startsWith("type ") ||
        trimmed.startsWith("function ") ||
        trimmed.startsWith("class ") ||
        trimmed.startsWith("const ") && trimmed.includes("=>")
      ) {
        summary.push(trimmed);
      }
    }
  } else if (ext === ".py") {
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("class ") || trimmed.startsWith("def ") || trimmed.startsWith("async def ")) {
        summary.push(trimmed);
      }
    }
  } else if (ext === ".json") {
    try {
      const parsed = JSON.parse(content);
      if (parsed.name) summary.push(`name: ${parsed.name}`);
      if (parsed.version) summary.push(`version: ${parsed.version}`);
      if (parsed.description) summary.push(`description: ${parsed.description}`);
    } catch {
      // Skip invalid JSON
    }
  }

  return summary.slice(0, 20).join("\n");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("file");
    const rootPath = searchParams.get("path") || process.cwd();

    // Single file content request
    if (filePath) {
      try {
        const content = await readFile(join(rootPath, filePath), "utf-8");
        return NextResponse.json({ content, path: filePath });
      } catch {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
    }

    // Full index request
    const files = await indexDirectory(rootPath);

    return NextResponse.json({
      files,
      totalFiles: files.length,
      totalSize: files.reduce((sum, f) => sum + f.size, 0),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
