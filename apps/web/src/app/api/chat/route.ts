import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Synapsis, an AI learning assistant integrated into an IDE. Your goal is to help users learn coding by guiding them through decisions, not giving direct answers.

CORE PRINCIPLES:
1. **Guide, don't give** - Help users discover answers themselves
2. **Ask questions** - Make users think before providing solutions
3. **Explain why** - Always explain the reasoning behind suggestions
4. **Gradual reveal** - Start with hints, then options, then explanations
5. **Encourage** - Be supportive and celebrate learning moments

LEARNING MODES:
- **Learning Mode**: Ask questions, provide hints, guide discovery
- **Builder Mode**: Provide direct solutions with explanations

RESPONSE FORMAT:
- Use markdown for formatting
- Use code blocks with language tags for code
- Be concise but thorough
- Include emojis for visual clarity (💡 for hints, 🤔 for questions, ✅ for confirmations)

When users ask about building something:
1. Break down the problem
2. Ask what approach they think is best
3. Provide hints if they're stuck
4. Explain trade-offs of different approaches
5. Guide them to the solution

When users share code:
1. Acknowledge what they did well
2. Point out areas for improvement
3. Explain why changes would help
4. Provide learning resources if relevant

IMPORTANT: This is a TEXT-ONLY model. Do not attempt to process images.`;

function getProviderConfig(provider: string, apiKey?: string, model?: string) {
  switch (provider) {
    case "openai":
      return {
        url: "https://api.openai.com/v1/chat/completions",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        model: model || "gpt-4o-mini",
      };
    case "anthropic":
      return {
        url: "https://api.anthropic.com/v1/messages",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
          "anthropic-version": "2023-06-01",
        },
        model: model || "claude-3-haiku-20240307",
      };
    case "ollama":
      return {
        url: "http://localhost:11434/api/chat",
        headers: {
          "Content-Type": "application/json",
        },
        model: model || "llama3.2",
      };
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// Sanitize messages to ensure text-only content
function sanitizeMessages(messages: any[]): any[] {
  return messages.map((msg) => {
    // Ensure content is a string
    let content = typeof msg.content === "string" ? msg.content : String(msg.content || "");
    
    // Remove any base64 image data
    content = content.replace(/data:image\/[^;]+;base64,[a-zA-Z0-9+/=\s]+/g, "[image removed]");
    
    // Remove any image URLs that might be trying to send images
    content = content.replace(/!\[.*?\]\(.*?\)/g, "[image removed]");
    
    // Limit content length
    if (content.length > 32000) {
      content = content.substring(0, 32000) + "\n... (truncated)";
    }
    
    return {
      role: msg.role,
      content: content,
    };
  });
}

async function streamOpenAI(config: any, messages: any[], codebaseContext?: string) {
  const sanitizedMessages = sanitizeMessages(messages);
  const systemContent = codebaseContext
    ? `${SYSTEM_PROMPT}\n\n${codebaseContext}`
    : SYSTEM_PROMPT;

  const response = await fetch(config.url, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "system", content: systemContent }, ...sanitizedMessages],
      stream: true,
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  return response;
}

async function streamAnthropic(config: any, messages: any[], codebaseContext?: string) {
  const sanitizedMessages = sanitizeMessages(messages);
  const systemContent = codebaseContext
    ? `${SYSTEM_PROMPT}\n\n${codebaseContext}`
    : SYSTEM_PROMPT;

  const response = await fetch(config.url, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      model: config.model,
      system: systemContent,
      messages: sanitizedMessages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
      max_tokens: 2000,
    }),
  });

  return response;
}

async function streamOllama(config: any, messages: any[], codebaseContext?: string) {
  const sanitizedMessages = sanitizeMessages(messages);
  const systemContent = codebaseContext
    ? `${SYSTEM_PROMPT}\n\n${codebaseContext}`
    : SYSTEM_PROMPT;

  const response = await fetch(config.url, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: "system", content: systemContent }, ...sanitizedMessages],
      stream: true,
    }),
  });

  return response;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, provider = "ollama", apiKey, model, codebaseContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Validate that all messages are text
    for (const msg of messages) {
      if (typeof msg.content !== "string") {
        return NextResponse.json(
          { error: "Only text messages are supported. Images are not allowed." },
          { status: 400 }
        );
      }
    }

    const config = getProviderConfig(provider, apiKey, model);

    let response: Response;

    switch (provider) {
      case "openai":
        response = await streamOpenAI(config, messages, codebaseContext);
        break;
      case "anthropic":
        response = await streamAnthropic(config, messages, codebaseContext);
        break;
      case "ollama":
        response = await streamOllama(config, messages, codebaseContext);
        break;
      default:
        return NextResponse.json(
          { error: `Unknown provider: ${provider}` },
          { status: 400 }
        );
    }

    if (!response.ok) {
      const error = await response.text();
      console.error(`LLM API error: ${error}`);
      return NextResponse.json(
        { error: `LLM API error: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Process SSE lines
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6).trim();
                if (data === "[DONE]") {
                  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                  continue;
                }

                try {
                  const json = JSON.parse(data);
                  
                  // OpenAI format
                  if (json.choices?.[0]?.delta?.content) {
                    const content = json.choices[0].delta.content;
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                    );
                  }
                  // Ollama format
                  else if (json.message?.content) {
                    const content = json.message.content;
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                    );
                  }
                  // Anthropic format
                  else if (json.type === "content_block_delta" && json.delta?.text) {
                    const content = json.delta.text;
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                    );
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
