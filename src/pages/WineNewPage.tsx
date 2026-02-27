import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateWineMutation, useAnalyzeWineImagesMutation, useWineAskMutation } from '../hooks/useWines';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function WineNewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateWineMutation();
  const analyzeMutation = useAnalyzeWineImagesMutation();
  const askMutation = useWineAskMutation();

  const [describePrompt, setDescribePrompt] = useState('');
  const [describeError, setDescribeError] = useState('');

  const [files, setFiles] = useState<FileList | null>(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageError, setImageError] = useState('');

  const [question, setQuestion] = useState('');
  const [sommelierAnswer, setSommelierAnswer] = useState('');
  const [askError, setAskError] = useState('');

  async function onDescribeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDescribeError('');
    if (describePrompt.trim().length < 5) {
      setDescribeError('Please describe the wine in at least 5 characters.');
      return;
    }
    try {
      const wine = await createMutation.mutateAsync({
        name: describePrompt.slice(0, 60),
        source_prompt: describePrompt,
      });
      navigate(`/wines/${wine.id}`);
    } catch (err) {
      setDescribeError((err as Error).message);
    }
  }

  async function onImageSubmit(e: React.FormEvent) {
    e.preventDefault();
    setImageError('');
    if (!files || files.length === 0) {
      setImageError('Please select at least one image.');
      return;
    }
    const formData = new FormData();
    for (const file of Array.from(files)) {
      formData.append('files', file);
    }
    if (imagePrompt) formData.append('prompt', imagePrompt);
    try {
      const wine = await analyzeMutation.mutateAsync(formData);
      navigate(`/wines/${wine.id}`);
    } catch (err) {
      setImageError((err as Error).message);
    }
  }

  async function onAskSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAskError('');
    setSommelierAnswer('');
    if (question.trim().length < 5) {
      setAskError('Please ask a question of at least 5 characters.');
      return;
    }
    try {
      const result = await askMutation.mutateAsync(question);
      setSommelierAnswer(result.answer);
    } catch (err) {
      setAskError((err as Error).message);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-6 text-2xl font-bold">New Wine</h1>

      <Tabs defaultValue="describe">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="describe">Describe it</TabsTrigger>
          <TabsTrigger value="photograph">Photograph label</TabsTrigger>
          <TabsTrigger value="ask">Ask sommelier</TabsTrigger>
        </TabsList>

        <TabsContent value="describe">
          <form onSubmit={(e) => void onDescribeSubmit(e)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="describePrompt">Describe the wine</Label>
              <Textarea
                id="describePrompt"
                placeholder="E.g. A bold Napa Cabernet with dark fruit and cedar..."
                rows={5}
                value={describePrompt}
                onChange={(e) => setDescribePrompt(e.target.value)}
              />
              {describeError && <p className="text-sm text-destructive">{describeError}</p>}
            </div>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Save Wine'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="photograph">
          <form onSubmit={(e) => void onImageSubmit(e)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="wineImages">Wine label photos</Label>
              <Input
                id="wineImages"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(e.target.files)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="wineImagePrompt">Additional instructions (optional)</Label>
              <Textarea
                id="wineImagePrompt"
                placeholder="E.g. Focus on food pairings..."
                rows={3}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={analyzeMutation.isPending}>
              {analyzeMutation.isPending ? 'Analyzing...' : 'Extract Wine from Photos'}
            </Button>
            {imageError && <p className="text-sm text-destructive">{imageError}</p>}
          </form>
        </TabsContent>

        <TabsContent value="ask">
          <form onSubmit={(e) => void onAskSubmit(e)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="question">Ask the sommelier</Label>
              <Textarea
                id="question"
                placeholder="E.g. What's a good wine to pair with grilled salmon?"
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              {askError && <p className="text-sm text-destructive">{askError}</p>}
            </div>
            <Button type="submit" disabled={askMutation.isPending}>
              {askMutation.isPending ? 'Asking...' : 'Ask'}
            </Button>
          </form>

          {sommelierAnswer && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Sommelier's Response</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{sommelierAnswer}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
