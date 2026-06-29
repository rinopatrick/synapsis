import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

interface DebugSession {
  id: string;
  process: any;
  breakpoints: Map<string, number[]>;
  isRunning: boolean;
  currentLine: number | null;
  variables: Record<string, any>;
  currentFile: string | null;
}

const sessions = new Map<string, DebugSession>();

export async function POST(request: NextRequest) {
  try {
    const { action, sessionId, file, line, expression } = await request.json();

    switch (action) {
      case "start": {
        const id = `debug-${Date.now()}`;
        const proc = spawn("python", ["-m", "debugpy", "--listen", "5678", "--wait-for-client", file], {
          stdio: ["pipe", "pipe", "pipe"],
        });

        proc.stderr?.on("data", (data: Buffer) => {
          console.log(`[debug ${id}] ${data.toString()}`);
        });

        sessions.set(id, {
          id,
          process: proc,
          breakpoints: new Map(),
          isRunning: true,
          currentLine: null,
          variables: {},
          currentFile: file,
        });

        return NextResponse.json({ sessionId: id, status: "started" });
      }

      case "setBreakpoint": {
        const session = sessions.get(sessionId);
        if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

        const fileBreakpoints = session.breakpoints.get(file) || [];
        if (!fileBreakpoints.includes(line)) {
          fileBreakpoints.push(line);
          session.breakpoints.set(file, fileBreakpoints);
        }

        return NextResponse.json({ success: true });
      }

      case "removeBreakpoint": {
        const session = sessions.get(sessionId);
        if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

        const fileBreakpoints = session.breakpoints.get(file) || [];
        session.breakpoints.set(file, fileBreakpoints.filter(l => l !== line));

        return NextResponse.json({ success: true });
      }

      case "continue": {
        const session = sessions.get(sessionId);
        if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
        session.isRunning = true;
        return NextResponse.json({ success: true });
      }

      case "stepOver": {
        const session = sessions.get(sessionId);
        if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
        if (session.currentLine) session.currentLine++;
        return NextResponse.json({ currentLine: session.currentLine });
      }

      case "stepInto": {
        const session = sessions.get(sessionId);
        if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
        return NextResponse.json({ currentLine: session.currentLine });
      }

      case "stepOut": {
        const session = sessions.get(sessionId);
        if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
        return NextResponse.json({ currentLine: session.currentLine });
      }

      case "evaluate": {
        const session = sessions.get(sessionId);
        if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
        return NextResponse.json({ result: `Evaluated: ${expression}` });
      }

      case "stop": {
        const session = sessions.get(sessionId);
        if (session) {
          session.process.kill();
          sessions.delete(sessionId);
        }
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ sessions: Array.from(sessions.keys()) });
  }

  const session = sessions.get(sessionId);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: session.id,
    isRunning: session.isRunning,
    currentLine: session.currentLine,
    currentFile: session.currentFile,
    breakpoints: Object.fromEntries(session.breakpoints),
    variables: session.variables,
  });
}
