import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code, language, fileName } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code required" }, { status: 400 });
    }

    const prompt = `Review this ${language || "code"} code and provide detailed feedback:

\`\`\`${language || ""}
${code}
\`\`\`

Provide feedback on:
1. Code quality and readability
2. Potential bugs or issues
3. Security concerns
4. Performance optimizations
5. Best practices
6. Suggestions for improvement

Format your response as JSON:
{
  "score": 1-10,
  "issues": [
    {
      "line": number,
      "severity": "error|warning|info",
      "message": "description",
      "suggestion": "how to fix"
    }
  ],
  "summary": "overall feedback",
  "improvements": ["list of improvements"]
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
          { role: "system", content: "You are a code review assistant. Return valid JSON only." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "{}";

    try {
      const review = JSON.parse(content);
      return NextResponse.json(review);
    } catch {
      return NextResponse.json({
        score: 5,
        issues: [],
        summary: content,
        improvements: [],
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
