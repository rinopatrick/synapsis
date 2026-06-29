import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { description, language, context } = await request.json();

    if (!description) {
      return NextResponse.json({ error: "Description required" }, { status: 400 });
    }

    const prompt = `Generate ${language || "JavaScript"} code based on this description:

${description}

${context ? `Context: ${context}\n\n` : ""}Requirements:
- Write clean, well-structured code
- Include appropriate comments
- Follow best practices
- Make it production-ready

Return only the code, no explanations.`;

    const provider = process.env.AI_PROVIDER || "openai";
    let code = "";

    if (provider === "openai") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a code generation assistant. Return only code, no explanations." },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
        }),
      });
      const data = await response.json();
      code = data.choices[0]?.message?.content || "";
    } else if (provider === "anthropic") {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      code = data.content?.[0]?.text || "";
    }

    code = code.replace(/^```\w*\n/m, "").replace(/\n```$/m, "");

    return NextResponse.json({ code, language: language || "javascript" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
