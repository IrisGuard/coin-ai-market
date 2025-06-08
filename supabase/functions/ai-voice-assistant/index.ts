
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input, context, language } = await req.json();

    if (!input) {
      throw new Error('No input provided');
    }

    console.log('Processing AI voice input:', input);

    const systemPrompt = `Είσαι ο AI voice assistant για μια εφαρμογή marketplace νομισμάτων. 
Ο χρήστης σου μιλάει στα ελληνικά και θέλει να εκτελέσεις εντολές φωνητικά.

Μπορείς να εκτελέσεις τις παρακάτω εντολές:
- Πλοήγηση (marketplace, αρχική, admin, κλπ)
- Αναζήτηση νομισμάτων
- Εμφάνιση πληροφοριών

Όταν ο χρήστης σου δώσει μια εντολή, απάντησε με ένα JSON που περιέχει:
- response: Μια φιλική απάντηση στα ελληνικά
- actions: Array με εντολές που πρέπει να εκτελεστούν

Παράδειγμα εντολών που μπορείς να επιστρέψεις:
- {"type": "navigate", "url": "/marketplace"} για πλοήγηση
- {"type": "search", "query": "bitcoin"} για αναζήτηση
- {"type": "toast", "title": "Τίτλος", "message": "Μήνυμα"} για ειδοποίηση

Αν δεν μπορείς να εκτελέσεις κάτι, πες το ευγενικά στα ελληνικά.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // Try to parse as JSON, if it fails treat as plain text
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      // If not JSON, create a simple response
      parsedResponse = {
        response: aiResponse,
        actions: []
      };
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI voice assistant:', error);
    return new Response(JSON.stringify({ 
      response: "Συγγνώμη, αντιμετώπισα ένα πρόβλημα. Δοκίμασε ξανά.",
      actions: [],
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
