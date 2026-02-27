import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateRecipeMutation, useAnalyzeRecipeImagesMutation } from '../hooks/useRecipes';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';

const promptSchema = z.object({
  prompt: z.string().min(5, 'Please describe the recipe in at least 5 characters'),
});
type PromptForm = z.infer<typeof promptSchema>;

export function RecipeNewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateRecipeMutation();
  const analyzeMutation = useAnalyzeRecipeImagesMutation();

  const [files, setFiles] = useState<FileList | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [analyzeError, setAnalyzeError] = useState('');

  const form = useForm<PromptForm>({
    resolver: zodResolver(promptSchema),
    defaultValues: { prompt: '' },
  });

  async function onTextSubmit(values: PromptForm) {
    const recipe = await createMutation.mutateAsync({
      title: values.prompt.slice(0, 60),
      ingredients: [],
      instructions: [],
      source_prompt: values.prompt,
    });
    navigate(`/recipes/${recipe.id}`);
  }

  async function onImageSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAnalyzeError('');
    if (!files || files.length === 0) {
      setAnalyzeError('Please select at least one image.');
      return;
    }
    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append('files', file);
    }
    if (imagePrompt) formData.append('prompt', imagePrompt);
    try {
      const recipe = await analyzeMutation.mutateAsync(formData);
      navigate(`/recipes/${recipe.id}`);
    } catch (err) {
      setAnalyzeError((err as Error).message);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">New Recipe</h1>

      <Tabs defaultValue="describe">
        <TabsList className="mb-6 grid w-full grid-cols-2">
          <TabsTrigger value="describe">Describe it</TabsTrigger>
          <TabsTrigger value="photograph">Photograph it</TabsTrigger>
        </TabsList>

        <TabsContent value="describe">
          <form onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(onTextSubmit)(e); }} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prompt">Describe the recipe</Label>
              <Textarea
                id="prompt"
                placeholder="E.g. A creamy pasta with mushrooms and thyme..."
                rows={5}
                {...form.register('prompt')}
              />
              {form.formState.errors.prompt && (
                <p className="text-sm text-destructive">{form.formState.errors.prompt.message}</p>
              )}
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Generating...' : 'Generate Recipe'}
            </Button>
            {createMutation.error && (
              <p className="text-sm text-destructive">{(createMutation.error as Error).message}</p>
            )}
          </form>
        </TabsContent>

        <TabsContent value="photograph">
          <form onSubmit={(e) => void onImageSubmit(e)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="images">Food photos</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="imagePrompt">Additional instructions (optional)</Label>
              <Textarea
                id="imagePrompt"
                placeholder="E.g. Include nutritional info..."
                rows={3}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={analyzeMutation.isPending}>
              {analyzeMutation.isPending ? 'Analyzing...' : 'Extract Recipe from Photos'}
            </Button>
            {analyzeError && <p className="text-sm text-destructive">{analyzeError}</p>}
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
