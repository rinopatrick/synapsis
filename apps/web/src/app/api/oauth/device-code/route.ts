import { NextResponse } from "next/server";

// Real OpenAI Codex OAuth configuration (same as Hermes uses)
const OPENAI_CODEX_CLIENT_ID = "app_EMoaMEZ73f0CkXaXp7hrannu";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider } = body;

    if (!provider) {
      return NextResponse.json({ error: "Missing provider" }, { status: 400 });
    }

    // Only OpenAI supports device code flow via Codex
    if (provider !== "openai") {
      return NextResponse.json(
        { error: `${provider} does not support OAuth. Use API key instead.` },
        { status: 400 }
      );
    }

    // Request device code from OpenAI's Codex OAuth endpoint
    const params = new URLSearchParams({
      client_id: OPENAI_CODEX_CLIENT_ID,
      scope: "openid profile email offline_access",
    });

    const response = await fetch("https://auth.openai.com/oauth/device/code", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI OAuth error:", errorText);
      return NextResponse.json(
        { error: `OpenAI OAuth failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Device code error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
