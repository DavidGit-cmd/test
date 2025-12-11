import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      throw new Error('No image provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Calling AI to scan car image...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Extract all available car information from this image. Return as JSON with these keys (omit if not visible):

Kjøretøyopplysninger (Basic Info):
- registrationNumber: registration number/reg.nr
- make: car brand/merke
- model: car model/modell
- year: year model/årsmodell
- price: price in NOK/pris
- mileage: mileage in km/kilometerstand
- fuel: fuel type/drivstoff
- transmission: transmission type/girkasse

Spesifikasjoner (Specifications):
- omregistrering: re-registration info
- prisExclOmreg: price excluding re-registration
- modellYear: model year/modellår
- karosseri: body type/karosseri
- effekt: power/effect
- slagvolum: engine displacement
- co2Utslipp: CO2 emissions
- maksimalTilhengervekt: max trailer weight
- hjuldrift: drive type/wheel drive
- vekt: weight
- seter: number of seats
- dorer: number of doors
- bagasjerom: trunk size
- farge: color/farge
- bilenStarI: car location
- sistEuGodkjent: last EU approval date (YYYY-MM-DD)
- nesteEuKontroll: next EU control date (YYYY-MM-DD)
- avgiftsklasse: tax class
- chassisNr: chassis number/VIN
- forsteGangRegistrert: first registration date (YYYY-MM-DD)
- salgsform: sales form

Return only fields found in the image.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Extract JSON from the response
    let extractedData;
    try {
      // Try to parse the content directly as JSON
      extractedData = JSON.parse(content);
    } catch {
      // If direct parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[1]);
      } else {
        // Last attempt: look for JSON object pattern
        const objectMatch = content.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          extractedData = JSON.parse(objectMatch[0]);
        } else {
          throw new Error('Could not extract JSON from AI response');
        }
      }
    }

    console.log('Extracted data:', extractedData);

    return new Response(
      JSON.stringify({ data: extractedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scan-car-image function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
