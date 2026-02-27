import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getWines,
  getWine,
  createWine,
  analyzeWineImages,
  askWineSommelier,
  updateWine,
  deleteWine,
} from '../lib/api';
import type { WineCreate, WineUpdate } from '../types/api';

export const wineKeys = {
  all: ['wines'] as const,
  detail: (id: number) => ['wines', id] as const,
};

export function useWinesQuery() {
  return useQuery({
    queryKey: wineKeys.all,
    queryFn: getWines,
  });
}

export function useWineQuery(id: number) {
  return useQuery({
    queryKey: wineKeys.detail(id),
    queryFn: () => getWine(id),
    enabled: !!id,
  });
}

export function useCreateWineMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WineCreate) => createWine(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: wineKeys.all });
    },
  });
}

/** Returns WineAnalysisResponse (text only) — does NOT save a wine */
export function useAnalyzeWineImagesMutation() {
  return useMutation({
    mutationFn: (formData: FormData) => analyzeWineImages(formData),
  });
}

/** Returns WineAnalysisResponse (text only) — does NOT save a wine */
export function useWineAskMutation() {
  return useMutation({
    mutationFn: (prompt: string) => askWineSommelier(prompt),
  });
}

export function useUpdateWineMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: WineUpdate }) => updateWine(id, data),
    onSuccess: (_data, { id }) => {
      void queryClient.invalidateQueries({ queryKey: wineKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: wineKeys.all });
    },
  });
}

export function useDeleteWineMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteWine(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: wineKeys.all });
    },
  });
}
