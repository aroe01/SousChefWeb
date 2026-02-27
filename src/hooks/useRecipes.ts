import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getRecipes,
  getRecipe,
  createRecipe,
  analyzeRecipeImages,
  updateRecipe,
  deleteRecipe,
} from '../lib/api';
import type { RecipeCreate, RecipeUpdate } from '../types/api';

export const recipeKeys = {
  all: ['recipes'] as const,
  detail: (id: string) => ['recipes', id] as const,
};

export function useRecipesQuery() {
  return useQuery({
    queryKey: recipeKeys.all,
    queryFn: getRecipes,
  });
}

export function useRecipeQuery(id: string) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => getRecipe(id),
    enabled: !!id,
  });
}

export function useCreateRecipeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RecipeCreate) => createRecipe(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export function useAnalyzeRecipeImagesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => analyzeRecipeImages(formData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export function useUpdateRecipeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecipeUpdate }) => updateRecipe(id, data),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}

export function useDeleteRecipeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRecipe(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}
