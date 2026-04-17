import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANG_NAMES: Record<string, string> = {
  en: "English", de: "German", fr: "French", es: "Spanish", it: "Italian",
  bg: "Bulgarian", ro: "Romanian", tr: "Turkish", ar: "Arabic",
  zh: "Simplified Chinese", ru: "Russian",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { strings, targetLang } = await req.json();
    if (!strings || typeof strings !== "object" || !targetLang) {
      return new Response(JSON.stringify({ error: "strings(object) and targetLang required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    const targetName = LANG_NAMES[targetLang] ?? targetLang;
    const prompt = `Translate the following UI strings (JSON values) into ${targetName}.
Preserve the JSON structure and keys exactly. Keep placeholders like {{name}} unchanged.
Return ONLY a valid JSON object, no markdown.

Input:
${JSON.stringify(strings, null, 2)}`;

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
        }),
      }
    );

    if (!resp.ok) {
      const txt = await resp.text();
      console.error("Gemini error:", resp.status, txt);
      return new Response(JSON.stringify({ error: "Translation failed", details: txt }), {
        status: resp.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    let translations: unknown;
    try { translations = JSON.parse(text); }
    catch { translations = JSON.parse(text.replace(/```json|```/g, "").trim()); }

    return new Response(JSON.stringify({ translations, targetLang }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("translate-ui error:", err);
    return new Response(JSON.stringify({ error: err.message ?? "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
