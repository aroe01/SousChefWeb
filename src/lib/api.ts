import { auth } from './firebase';
import type {
  RecipeCreate,
  RecipeUpdate,
  RecipeResponse,
  WineCreate,
  WineUpdate,
  WineResponse,
  WineAnalysisResponse,
  UserResponse,
} from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await auth.currentUser?.getIdToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Only set Content-Type for JSON — let browser handle multipart boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error((errorBody as { detail: string }).detail ?? response.statusText);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

// ─── Recipes ──────────────────────────────────────────────────────────────────

export function getRecipes(): Promise<RecipeResponse[]> {
  return apiFetch('/api/v1/recipes/');
}

export function getRecipe(id: number): Promise<RecipeResponse> {
  return apiFetch(`/api/v1/recipes/${id}`);
}

/** AI-generates a recipe from a natural-language prompt, then saves and returns it. */
export function createRecipe(data: RecipeCreate): Promise<RecipeResponse> {
  return apiFetch('/api/v1/recipes/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Analyse food images to extract a recipe, then save and return it.
 * FormData must include `images` (files) and optionally `prompt` (string).
 */
export function analyzeRecipeImages(formData: FormData): Promise<RecipeResponse> {
  return apiFetch('/api/v1/recipes/analyze', {
    method: 'POST',
    body: formData,
  });
}

export function updateRecipe(id: number, data: RecipeUpdate): Promise<RecipeResponse> {
  return apiFetch(`/api/v1/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteRecipe(id: number): Promise<void> {
  return apiFetch(`/api/v1/recipes/${id}`, { method: 'DELETE' });
}

// ─── Wines ────────────────────────────────────────────────────────────────────

export function getWines(): Promise<WineResponse[]> {
  return apiFetch('/api/v1/wines/');
}

export function getWine(id: number): Promise<WineResponse> {
  return apiFetch(`/api/v1/wines/${id}`);
}

/** AI-generates a wine recommendation from a natural-language prompt, then saves and returns it. */
export function createWine(data: WineCreate): Promise<WineResponse> {
  return apiFetch('/api/v1/wines/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Analyse wine bottle images — returns a text sommelier response (NOT a saved wine).
 * FormData must include `images` (files) and optionally `prompt` (string).
 */
export function analyzeWineImages(formData: FormData): Promise<WineAnalysisResponse> {
  return apiFetch('/api/v1/wines/analyze', {
    method: 'POST',
    body: formData,
  });
}

/** Ask the sommelier a freeform question — returns a text response (NOT a saved wine). */
export function askWineSommelier(prompt: string): Promise<WineAnalysisResponse> {
  return apiFetch('/api/v1/wines/ask', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
}

export function updateWine(id: number, data: WineUpdate): Promise<WineResponse> {
  return apiFetch(`/api/v1/wines/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteWine(id: number): Promise<void> {
  return apiFetch(`/api/v1/wines/${id}`, { method: 'DELETE' });
}

// ─── User ─────────────────────────────────────────────────────────────────────

export function getCurrentUser(): Promise<UserResponse> {
  return apiFetch('/api/v1/users/me');
}

export function deleteUserAccount(id: number): Promise<void> {
  return apiFetch(`/api/v1/users/${id}`, { method: 'DELETE' });
}
