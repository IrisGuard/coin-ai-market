// Shared Google Gemini helper for all edge functions.
// Uses ONLY Google Gemini API directly with the user's GEMINI_API_KEY.
// No Lovable AI Gateway, no OpenAI, no Anthropic.

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

// Model selection per cost/capability:
// - LITE: cheapest, used by default for text/JSON tasks (OCR JSON, source discovery, web extraction, single-image basic recognition)
// - FLASH: harder vision tasks (dual-side, multi-step coin reasoning)
// - PRO: only if explicitly requested for the hardest cases
export const LITE_MODEL = 'gemini-2.5-flash-lite';
export const FLASH_MODEL = 'gemini-2.5-flash';
export const PRO_MODEL = 'gemini-3.1-pro-preview';
export const DEFAULT_MODEL = LITE_MODEL;

export type ChatPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string | ChatPart[];
};

export interface AIGatewayOptions {
  model?: string;
  messages: ChatMessage[];
  tools?: any[];
  tool_choice?: any;
  max_tokens?: number;
  temperature?: number;
}

export class AIGatewayError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Convert OpenAI-style messages to Gemini contents/systemInstruction
function toGeminiPayload(opts: AIGatewayOptions) {
  const systemTexts: string[] = [];
  const contents: any[] = [];

  for (const msg of opts.messages) {
    if (msg.role === 'system') {
      systemTexts.push(typeof msg.content === 'string' ? msg.content : msg.content.map(p => p.type === 'text' ? p.text : '').join('\n'));
      continue;
    }

    const parts: any[] = [];
    if (typeof msg.content === 'string') {
      parts.push({ text: msg.content });
    } else {
      for (const p of msg.content) {
        if (p.type === 'text') parts.push({ text: p.text });
        else if (p.type === 'image_url') {
          const url = p.image_url.url;
          const m = url.match(/^data:([^;]+);base64,(.+)$/);
          if (m) parts.push({ inlineData: { mimeType: m[1], data: m[2] } });
          else parts.push({ text: `[image: ${url}]` });
        }
      }
    }

    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts,
    });
  }

  const body: Record<string, any> = { contents };
  if (systemTexts.length) body.systemInstruction = { parts: [{ text: systemTexts.join('\n\n') }] };

  const generationConfig: Record<string, any> = {};
  if (opts.max_tokens) generationConfig.maxOutputTokens = opts.max_tokens;
  if (opts.temperature !== undefined) generationConfig.temperature = opts.temperature;
  if (Object.keys(generationConfig).length) body.generationConfig = generationConfig;

  // Map OpenAI-style tools (tool_choice forced function) to Gemini function calling
  if (opts.tools && opts.tools.length) {
    const functionDeclarations = opts.tools
      .filter((t: any) => t.type === 'function')
      .map((t: any) => ({
        name: t.function.name,
        description: t.function.description,
        parameters: t.function.parameters,
      }));
    body.tools = [{ functionDeclarations }];
    if (opts.tool_choice?.type === 'function' && opts.tool_choice.function?.name) {
      body.toolConfig = {
        functionCallingConfig: {
          mode: 'ANY',
          allowedFunctionNames: [opts.tool_choice.function.name],
        },
      };
    }
  }

  return body;
}

export async function callAIGateway(options: AIGatewayOptions): Promise<any> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new AIGatewayError('GEMINI_API_KEY is not configured', 500);

  const model = options.model || DEFAULT_MODEL;
  const url = `${BASE_URL}/${model}:generateContent?key=${apiKey}`;
  const body = toGeminiPayload(options);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    if (response.status === 429) throw new AIGatewayError('Gemini rate limit exceeded, please try again shortly.', 429);
    if (response.status === 402 || response.status === 403) {
      throw new AIGatewayError(`Gemini API auth/quota error: ${text}`, response.status);
    }
    throw new AIGatewayError(`Gemini API error ${response.status}: ${text}`, response.status);
  }

  const geminiResponse = await response.json();

  // Adapt Gemini response into an OpenAI-compatible shape so existing extractors work
  const candidate = geminiResponse?.candidates?.[0];
  const parts = candidate?.content?.parts || [];

  let textContent = '';
  const tool_calls: any[] = [];
  for (const p of parts) {
    if (p.text) textContent += p.text;
    if (p.functionCall) {
      tool_calls.push({
        type: 'function',
        function: {
          name: p.functionCall.name,
          arguments: JSON.stringify(p.functionCall.args ?? {}),
        },
      });
    }
  }

  return {
    choices: [{
      message: {
        role: 'assistant',
        content: textContent,
        ...(tool_calls.length ? { tool_calls } : {}),
      },
    }],
    _gemini: geminiResponse,
  };
}

/** Build a vision message that includes a base64 image as a data URL. */
export function buildImageMessage(text: string, base64OrDataUrl: string, mediaType = 'image/jpeg'): ChatMessage {
  let dataUrl = base64OrDataUrl;
  if (!base64OrDataUrl.startsWith('data:')) {
    const cleaned = String(base64OrDataUrl).replace(/\s/g, '').replace(/^data:[^,]+,/, '');
    dataUrl = `data:${mediaType};base64,${cleaned}`;
  }
  return {
    role: 'user',
    content: [
      { type: 'text', text },
      { type: 'image_url', image_url: { url: dataUrl } },
    ],
  };
}

/** Extract first tool call arguments as parsed JSON. Falls back to JSON in content. */
export function extractStructuredOutput(aiResponse: any): any {
  const toolCall = aiResponse?.choices?.[0]?.message?.tool_calls?.[0];
  if (toolCall?.function?.arguments) {
    try { return JSON.parse(toolCall.function.arguments); } catch { /* fallthrough */ }
  }
  const content = aiResponse?.choices?.[0]?.message?.content || '';
  // Strip markdown fences if present
  const cleaned = content.replace(/```json\s*|\s*```/g, '');
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objMatch) { try { return JSON.parse(objMatch[0]); } catch { /* fallthrough */ } }
  const arrMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrMatch) { try { return JSON.parse(arrMatch[0]); } catch { /* fallthrough */ } }
  return null;
}

/** Extract plain text content from a chat completion. */
export function extractTextOutput(aiResponse: any): string {
  return aiResponse?.choices?.[0]?.message?.content || '';
}
