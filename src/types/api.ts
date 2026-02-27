// TypeScript interfaces mirroring the SousChef FastAPI Pydantic schemas
// Source of truth: ../SousChefBackend/app/*/schemas.py

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: number;
  firebase_uid: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
}

// ─── Recipes ─────────────────────────────────────────────────────────────────

/** POST /api/v1/recipes/ — AI generates the recipe from a natural-language prompt */
export interface RecipeCreate {
  prompt: string;
}

export interface RecipeUpdate {
  title?: string | null;
  description?: string | null;
  cooking_time?: string | null;   // e.g. "30 minutes"
  ingredients?: string[] | null;
  instructions?: string | null;   // newline-separated numbered steps
}

export interface RecipeResponse {
  id: number;
  title: string;
  description: string | null;
  cooking_time: string | null;    // e.g. "30 minutes"
  ingredients: string[];
  instructions: string;           // newline-separated numbered steps
  created_at: string;
  updated_at: string;
}

// ─── Wines ───────────────────────────────────────────────────────────────────

/** POST /api/v1/wines/ and /ask — AI uses a natural-language prompt */
export interface WineCreate {
  prompt: string;
}

export interface WineUpdate {
  name?: string | null;
  varietal?: string | null;
  region?: string | null;
  vintage?: number | null;
  tasting_notes?: string | null;
  food_pairings?: string[] | null;
}

export interface WineResponse {
  id: number;
  name: string;
  varietal: string | null;
  region: string | null;
  vintage: number | null;
  tasting_notes: string | null;
  food_pairings: string[];
  created_at: string;
  updated_at: string;
}

/** Returned by POST /api/v1/wines/analyze and POST /api/v1/wines/ask */
export interface WineAnalysisResponse {
  response: string;
}
