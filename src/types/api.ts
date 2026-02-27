// TypeScript interfaces mirroring the SousChef FastAPI Pydantic schemas

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: string;
  email: string;
  display_name: string | null;
  photo_url: string | null;
  created_at: string;
}

// ─── Recipes ─────────────────────────────────────────────────────────────────

export interface RecipeCreate {
  title: string;
  description?: string | null;
  ingredients: string[];
  instructions: string[];
  cooking_time?: number | null;    // minutes
  servings?: number | null;
  cuisine?: string | null;
  dietary_info?: string[] | null;
  image_url?: string | null;
  source_prompt?: string | null;
}

export interface RecipeUpdate {
  title?: string | null;
  description?: string | null;
  ingredients?: string[] | null;
  instructions?: string[] | null;
  cooking_time?: number | null;
  servings?: number | null;
  cuisine?: string | null;
  dietary_info?: string[] | null;
  image_url?: string | null;
}

export interface RecipeResponse {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  cooking_time: number | null;
  servings: number | null;
  cuisine: string | null;
  dietary_info: string[] | null;
  image_url: string | null;
  source_prompt: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Wines ───────────────────────────────────────────────────────────────────

export interface WineCreate {
  name: string;
  producer?: string | null;
  vintage?: number | null;
  varietal?: string | null;
  region?: string | null;
  country?: string | null;
  tasting_notes?: string | null;
  food_pairings?: string[] | null;
  rating?: number | null;
  price?: number | null;
  image_url?: string | null;
  source_prompt?: string | null;
}

export interface WineUpdate {
  name?: string | null;
  producer?: string | null;
  vintage?: number | null;
  varietal?: string | null;
  region?: string | null;
  country?: string | null;
  tasting_notes?: string | null;
  food_pairings?: string[] | null;
  rating?: number | null;
  price?: number | null;
  image_url?: string | null;
}

export interface WineResponse {
  id: string;
  user_id: string;
  name: string;
  producer: string | null;
  vintage: number | null;
  varietal: string | null;
  region: string | null;
  country: string | null;
  tasting_notes: string | null;
  food_pairings: string[] | null;
  rating: number | null;
  price: number | null;
  image_url: string | null;
  source_prompt: string | null;
  created_at: string;
  updated_at: string;
}

export interface WineAnalysisResponse {
  answer: string;
}

// ─── Shared ───────────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
}
