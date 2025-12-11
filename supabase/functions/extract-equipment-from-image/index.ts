import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      throw new Error("No image provided");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing equipment image with AI...");

    // Call Lovable AI Gateway with the image
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an automotive equipment extraction assistant. Your job is to analyze images of car equipment lists or specifications and extract ALL equipment items mentioned.

Extract equipment items and return them as a JSON array of strings. Each string should be a single equipment item in Norwegian.

Common equipment terms to look for include:
- Safety features (Airbag, ABS, Antiskrens, etc.)
- Comfort features (Klimaanlegg, Setevarme, etc.)
- Technology (Navigasjon, Bluetooth, Ryggekamera, etc.)
- Lighting (LED-lys, Adaptiv matrix LED, etc.)
- Interior (Skinninteriør, Elektriske seter, etc.)
- Exterior (Panoramatak, Glasstak, etc.)

Return ONLY a valid JSON array of strings, nothing else. Example:
["Adaptiv cruisekontroll", "LED-lys", "Skinninteriør", "Navigasjon"]

If you cannot extract any equipment, return an empty array: []`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract all car equipment items from this image. Return only a JSON array of equipment names in Norwegian."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content returned from AI");
    }

    console.log("AI response:", content);

    // Parse the JSON array from the response
    let equipmentItems: string[] = [];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        equipmentItems = JSON.parse(jsonMatch[0]);
      } else {
        equipmentItems = JSON.parse(content);
      }
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e);
      // Fallback: split by newlines and filter
      equipmentItems = content
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0 && !line.startsWith('[') && !line.startsWith(']'))
        .map((line: string) => line.replace(/^[-•*]\s*/, '').replace(/^"\s*/, '').replace(/\s*"$/, ''));
    }

    console.log("Extracted equipment items:", equipmentItems);

    return new Response(
      JSON.stringify({ equipmentItems }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in extract-equipment-from-image:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
