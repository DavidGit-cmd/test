import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VehicleData {
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  regNumber?: string;
  color?: string;
  fuel?: string;
  transmission?: string;
  chassisNumber?: string;
  firstRegistered?: string;
  equipment?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    
    if (!url || !url.includes('finn.no')) {
      return new Response(
        JSON.stringify({ error: 'Invalid finn.no URL' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Fetching finn.no listing:', url);

    // Fetch the finn.no page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch finn.no page: ${response.status}`);
    }

    const html = await response.text();
    console.log('Successfully fetched finn.no page');

    // Parse the vehicle data
    const vehicleData: VehicleData = {};

    // Extract brand (Merke)
    const brandMatch = html.match(/Merke<\/dt>\s*<dd[^>]*>([^<]+)/i);
    if (brandMatch) vehicleData.brand = brandMatch[1].trim();

    // Extract model (Modell)
    const modelMatch = html.match(/Modell<\/dt>\s*<dd[^>]*>([^<]+)/i);
    if (modelMatch) vehicleData.model = modelMatch[1].trim();

    // Extract year (Modellår)
    const yearMatch = html.match(/Modellår<\/dt>\s*<dd[^>]*>(\d{4})/i);
    if (yearMatch) vehicleData.year = parseInt(yearMatch[1]);

    // Extract mileage (Kilometerstand)
    const mileageMatch = html.match(/Kilometerstand<\/dt>\s*<dd[^>]*>([\d\s]+)\s*km/i);
    if (mileageMatch) {
      vehicleData.mileage = parseInt(mileageMatch[1].replace(/\s/g, ''));
    }

    // Extract color (Farge)
    const colorMatch = html.match(/Farge<\/dt>\s*<dd[^>]*>([^<]+)/i);
    if (colorMatch) vehicleData.color = colorMatch[1].trim();

    // Extract fuel type (Drivstoff)
    const fuelMatch = html.match(/Drivstoff<\/dt>\s*<dd[^>]*>([^<]+)/i);
    if (fuelMatch) vehicleData.fuel = fuelMatch[1].trim();

    // Extract transmission (Girkasse)
    const transmissionMatch = html.match(/Girkasse<\/dt>\s*<dd[^>]*>([^<]+)/i);
    if (transmissionMatch) vehicleData.transmission = transmissionMatch[1].trim();

    // Extract chassis number (VIN)
    const chassisMatch = html.match(/Chassis nr\.\s*\(VIN\)<\/dt>\s*<dd[^>]*>([^<]+)/i);
    if (chassisMatch) vehicleData.chassisNumber = chassisMatch[1].trim();

    // Extract first registration date
    const firstRegMatch = html.match(/1\.\s*gang registrert<\/dt>\s*<dd[^>]*>([^<]+)/i);
    if (firstRegMatch) {
      const dateStr = firstRegMatch[1].trim();
      // Convert from DD.MM.YYYY to YYYY-MM-DD
      const parts = dateStr.split('.');
      if (parts.length === 3) {
        vehicleData.firstRegistered = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    // Try to extract registration number from the page title or content
    const regNumberMatch = html.match(/reg(?:istreringsnummer)?[:\s]+([A-Z]{2}\d{4,5})/i);
    if (regNumberMatch) vehicleData.regNumber = regNumberMatch[1].trim();

    console.log('Parsed vehicle data:', vehicleData);

    return new Response(
      JSON.stringify({ success: true, data: vehicleData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching finn.no listing:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch listing data';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
