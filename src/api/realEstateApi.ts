// Helper functions to call backend prediction and forecast APIs

export type PredictRequest = {
  Property_Type: string;
  Location: string;
  Size_sq_m: number;
  Furnished: string;
  Bedrooms: number;
  Bathrooms: number;
  Year: number;
};

export interface PredictResponse {
  prediction: number;
  error?: string;
}

export type ForecastRequest = {
  csv_data: string; // JSON stringified array of rows
  location: string;
  property_type: string;
  timeframe: string; // e.g. "Next 6 Months"
};

export interface ForecastEntry {
  month: string;
  price: number;
}

export interface ForecastResponse {
  forecast: ForecastEntry[];
  lowest_month: string;
  lowest_price: number;
  error?: string;
}

// Both development (via Vite proxy) and production (Vercel serverless) use the same relative paths
const PREDICT_URL = '/api/predict';
const FORECAST_URL = '/api/forecast';

export async function postPrediction(payload: PredictRequest): Promise<PredictResponse> {
  const res = await fetch(PREDICT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function postForecast(payload: ForecastRequest): Promise<ForecastResponse> {
  const res = await fetch(FORECAST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
} 