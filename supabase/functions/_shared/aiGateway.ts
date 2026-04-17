// Shared Lovable AI Gateway helper for all edge functions.
// Centralizes the AI provider so swapping to a custom Gemini key later
// only requires editing this file.

const GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

export const DEFAULT_MODEL = 'google/gemini-2.5-flash';
export const FAST_MODEL = 'google/gemini-2.5-flash-lite';
export const PRO_MODEL = 'google/gemini-2.5-pro';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: any;
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

export async function callAIGateway(options: AIGatewayOptions): Promise<any> {
  const apiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!apiKey) {
    throw new AIGatewayError('LOVABLE_API_KEY is not configured', 500);
  }

  const body: Record<string, any> = {
    model: options.model || DEFAULT_MODEL,
    messages: options.messages,
  };
  if (options.tools) body.tools = options.tools;
  if (options.tool_choice) body.tool_choice = options.tool_choice;
  if (options.max_tokens) body.max_tokens = options.max_tokens;
  if (options.temperature !== undefined) body.temperature = options.temperature;

  const response = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    if (response.status === 429) {
      throw new AIGatewayError('Rate limit exceeded, please try again shortly.', 429);
    }
    if (response.status === 402) {
      throw new AIGatewayError('AI credits exhausted. Please add credits in Workspace Usage.', 402);
    }
    throw new AIGatewayError(`AI gateway error ${response.status}: ${text}`, response.status);
  }

  return await response.json();
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
  const objMatch = content.match(/\{[\s\S]*\}/);
  if (objMatch) { try { return JSON.parse(objMatch[0]); } catch { /* fallthrough */ } }
  const arrMatch = content.match(/\[[\s\S]*\]/);
  if (arrMatch) { try { return JSON.parse(arrMatch[0]); } catch { /* fallthrough */ } }
  return null;
}

/** Extract plain text content from a chat completion. */
export function extractTextOutput(aiResponse: any): string {
  return aiResponse?.choices?.[0]?.message?.content || '';
}
