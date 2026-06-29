import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");
  const cwd = searchParams.get("cwd") || process.cwd();

  try {
    switch (action) {
      case "status": {
        const { stdout } = await execAsync("git status --porcelain", { cwd });
        const files = stdout
          .split("\n")
          .filter(Boolean)
          .map((line) => {
            const status = line.substring(0, 2).trim();
            const path = line.substring(3);
            return { status, path };
          });
        return NextResponse.json({ files });
      }

      case "branch": {
        const { stdout } = await execAsync("git branch --show-current", { cwd });
        return NextResponse.json({ branch: stdout.trim() });
      }

      case "log": {
        const { stdout } = await execAsync(
          "git log --oneline -20 --format=%H|%s|%an|%ar",
          { cwd }
        );
        const commits = stdout
          .split("\n")
          .filter(Boolean)
          .map((line) => {
            const [hash, message, author, date] = line.split("|");
            return { hash, message, author, date };
          });
        return NextResponse.json({ commits });
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
    const { action, message, files, cwd } = await request.json();
    const workingDir = cwd || process.cwd();

    switch (action) {
      case "add": {
        const fileList = files.join(" ");
        await execAsync(`git add ${fileList}`, { cwd: workingDir });
        return NextResponse.json({ success: true });
      }

      case "commit": {
        const escapedMessage = message.replace(/"/g, '\\"');
        const { stdout } = await execAsync(`git commit -m "${escapedMessage}"`, {
          cwd: workingDir,
        });
        return NextResponse.json({ success: true, output: stdout });
      }

      case "push": {
        const { stdout } = await execAsync("git push", { cwd: workingDir });
        return NextResponse.json({ success: true, output: stdout });
      }

      case "pull": {
        const { stdout } = await execAsync("git pull", { cwd: workingDir });
        return NextResponse.json({ success: true, output: stdout });
      }

      case "checkout": {
        const { stdout } = await execAsync(`git checkout ${files[0]}`, {
          cwd: workingDir,
        });
        return NextResponse.json({ success: true, output: stdout });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
