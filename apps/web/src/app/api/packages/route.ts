import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { readFile } from "fs/promises";
import { join } from "path";

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const cwd = searchParams.get("cwd") || process.cwd();

  try {
    switch (action) {
      case "list": {
        const isNode = await fileExists(join(cwd, "package.json"));
        const isPython =
          (await fileExists(join(cwd, "requirements.txt"))) ||
          (await fileExists(join(cwd, "pyproject.toml")));

        if (isNode) {
          const { stdout } = await execAsync("npm list --json --depth=0", {
            cwd,
          });
          const data = JSON.parse(stdout);
          const packages = Object.entries(data.dependencies || {}).map(
            ([name, info]: [string, any]) => ({
              name,
              version: info.version,
              type: "npm",
            })
          );
          return NextResponse.json({ packages, manager: "npm" });
        }

        if (isPython) {
          const { stdout } = await execAsync("pip list --format=json", {
            cwd,
          });
          const packages = JSON.parse(stdout).map((p: any) => ({
            name: p.name,
            version: p.version,
            type: "pip",
          }));
          return NextResponse.json({ packages, manager: "pip" });
        }

        return NextResponse.json({ packages: [], manager: "unknown" });
      }

      case "search": {
        const query = searchParams.get("q");
        if (!query)
          return NextResponse.json(
            { error: "Query required" },
            { status: 400 }
          );

        const { stdout } = await execAsync(`npm search ${query} --json`, {
          cwd,
        });
        const results = JSON.parse(stdout)
          .slice(0, 20)
          .map((p: any) => ({
            name: p.name,
            version: p.version,
            description: p.description,
            type: "npm",
          }));
        return NextResponse.json({ results });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, package: pkg, manager, cwd } = await request.json();
    const workingDir = cwd || process.cwd();

    switch (action) {
      case "install": {
        const cmd =
          manager === "pip" ? `pip install ${pkg}` : `npm install ${pkg}`;
        const { stdout } = await execAsync(cmd, { cwd: workingDir });
        return NextResponse.json({ success: true, output: stdout });
      }

      case "uninstall": {
        const cmd =
          manager === "pip"
            ? `pip uninstall -y ${pkg}`
            : `npm uninstall ${pkg}`;
        const { stdout } = await execAsync(cmd, { cwd: workingDir });
        return NextResponse.json({ success: true, output: stdout });
      }

      case "update": {
        const cmd =
          manager === "pip"
            ? `pip install --upgrade ${pkg}`
            : `npm update ${pkg}`;
        const { stdout } = await execAsync(cmd, { cwd: workingDir });
        return NextResponse.json({ success: true, output: stdout });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await readFile(path);
    return true;
  } catch {
    return false;
  }
}
