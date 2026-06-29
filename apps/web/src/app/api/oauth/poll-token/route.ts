import { NextResponse } from "next/server";

// Real OpenAI Codex OAuth configuration
const OPENAI_CODEX_CLIENT_ID = "app_EMoaMEZ73f0CkXaXp7hrannu";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, deviceCode } = body;

    if (!provider || !deviceCode) {
      return NextResponse.json(
        { error: "Missing provider or deviceCode" },
        { status: 400 }
      );
    }

    if (provider !== "openai") {
      return NextResponse.json(
        { error: `${provider} does not support OAuth device flow` },
        { status: 400 }
      );
    }

    // Poll OpenAI for token
    const params = new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      client_id: OPENAI_CODEX_CLIENT_ID,
      device_code: deviceCode,
    });

    const response = await fetch("https://auth.openai.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    // Still pending
    if (data.error === "authorization_pending" || data.error === "slow_down") {
      return NextResponse.json({ status: "pending" });
    }

    // Error
    if (data.error) {
      return NextResponse.json({
        status: "error",
        message: data.error_description || data.error,
      });
    }

    // Success - got token!
    if (data.access_token) {
      return NextResponse.json({
        status: "success",
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
        token_type: data.token_type,
      });
    }

    return NextResponse.json({
      status: "error",
      message: "Unexpected response from OpenAI",
    });
  } catch (error) {
    console.error("Poll token error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
