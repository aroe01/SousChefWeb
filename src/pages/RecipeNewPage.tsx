import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRecipeMutation, useAnalyzeRecipeImagesMutation } from '../hooks/useRecipes';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';

export function RecipeNewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateRecipeMutation();
  const analyzeMutation = useAnalyzeRecipeImagesMutation();

  const [prompt, setPrompt] = useState('');
  const [promptError, setPromptError] = useState('');

  const [files, setFiles] = useState<FileList | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [analyzeError, setAnalyzeError] = useState('');

  async function onTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPromptError('');
    if (prompt.trim().length < 5) {
      setPromptError('Please describe the recipe in at least 5 characters.');
      return;
    }
    try {
      const recipe = await createMutation.mutateAsync({ prompt: prompt.trim() });
      navigate(`/recipes/${recipe.id}`);
    } catch (err) {
      setPromptError((err as Error).message);
    }
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
      // Backend expects field name "images"
      formData.append('images', file);
    }
    if (imagePrompt.trim()) formData.append('prompt', imagePrompt.trim());
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
          <form onSubmit={(e) => void onTextSubmit(e)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="prompt">Describe the recipe</Label>
              <Textarea
                id="prompt"
                placeholder="E.g. A creamy pasta with mushrooms and thyme..."
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              {promptError && <p className="text-sm text-destructive">{promptError}</p>}
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Generating...' : 'Generate Recipe'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="photograph">
          <form onSubmit={(e) => void onImageSubmit(e)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="images">Food photos</Label>
              <Input
                id="images"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="imagePrompt">Additional instructions (optional)</Label>
              <Textarea
                id="imagePrompt"
                placeholder="E.g. Make it gluten-free..."
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
