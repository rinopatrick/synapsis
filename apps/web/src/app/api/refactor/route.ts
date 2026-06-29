import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code, language, instruction } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code required" }, { status: 400 });
    }

    const prompt = `Refactor this ${language || "code"} code:

\`\`\`${language || ""}
${code}
\`\`\`

${instruction ? `Instruction: ${instruction}` : "Improve the code quality, readability, and performance."}

Return JSON with:
{
  "refactoredCode": "the improved code",
  "changes": [
    {
      "type": "improvement|fix|optimization",
      "description": "what was changed",
      "line": number
    }
  ],
  "explanation": "overall explanation of changes"
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a code refactoring assistant. Return valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "{}";

    try {
      const result = JSON.parse(content);
      if (result.refactoredCode) {
        result.refactoredCode = result.refactoredCode.replace(/^```\w*\n/m, "").replace(/\n```$/m, "");
      }
      return NextResponse.json(result);
    } catch {
      return NextResponse.json({
        refactoredCode: content,
        changes: [],
        explanation: "Generated refactored code",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
