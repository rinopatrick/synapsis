import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { command, cwd } = await request.json();

    if (!command) {
      return NextResponse.json({ error: "Command required" }, { status: 400 });
    }

    const { stdout, stderr } = await execAsync(command, {
      cwd: cwd || process.cwd(),
      timeout: 30000,
      maxBuffer: 1024 * 1024,
    });

    return NextResponse.json({
      stdout: stdout.toString(),
      stderr: stderr.toString(),
      exitCode: 0,
    });
  } catch (error: any) {
    return NextResponse.json({
      stdout: "",
      stderr: error.message || "Command failed",
      exitCode: error.code || 1,
    });
  }
}
