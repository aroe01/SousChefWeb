import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useRecipeQuery, useUpdateRecipeMutation, useDeleteRecipeMutation } from '../hooks/useRecipes';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import type { RecipeUpdate } from '../types/api';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const recipeId = Number(id);
  const navigate = useNavigate();
  const { data: recipe, isLoading, error } = useRecipeQuery(recipeId);
  const updateMutation = useUpdateRecipeMutation();
  const deleteMutation = useDeleteRecipeMutation();

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<RecipeUpdate>({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="py-24 text-center">
        <p className="text-destructive">{error ? (error as Error).message : 'Recipe not found'}</p>
        <Link to="/recipes" className="mt-4 inline-block underline">
          Back to recipes
        </Link>
      </div>
    );
  }

  function startEdit() {
    setEditData({
      title: recipe!.title,
      description: recipe!.description ?? '',
      cooking_time: recipe!.cooking_time ?? '',
      ingredients: recipe!.ingredients,
      instructions: recipe!.instructions,
    });
    setEditing(true);
  }

  async function saveEdit() {
    await updateMutation.mutateAsync({ id: recipeId, data: editData });
    setEditing(false);
  }

  async function handleDelete() {
    await deleteMutation.mutateAsync(recipeId);
    navigate('/recipes', { replace: true });
  }

  // instructions is a newline-separated string from the backend
  const instructionLines = recipe.instructions
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

  // ingredients may come back as a single-element array containing a raw
  // PostgreSQL array literal e.g. {"item1","item2"} — parse it if so
  const ingredients = (() => {
    const raw = recipe.ingredients;
    if (raw.length === 1) {
      const item = raw[0].trim();
      if (item.startsWith('{') && item.endsWith('}')) {
        try {
          return JSON.parse(item.replace(/^\{/, '[').replace(/\}$/, ']')) as string[];
        } catch {
          // fall through
        }
      }
    }
    return raw;
  })();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <Link to="/recipes" className="text-sm text-muted-foreground hover:underline">
          Recipes
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm">{recipe.title}</span>
      </div>

      {editing ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Title</Label>
            <Input
              value={editData.title ?? ''}
              onChange={(e) => setEditData((d) => ({ ...d, title: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Description</Label>
            <Textarea
              value={editData.description ?? ''}
              rows={3}
              onChange={(e) => setEditData((d) => ({ ...d, description: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Cooking Time</Label>
            <Input
              placeholder="e.g. 30 minutes"
              value={editData.cooking_time ?? ''}
              onChange={(e) => setEditData((d) => ({ ...d, cooking_time: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Ingredients (one per line)</Label>
            <Textarea
              value={(editData.ingredients ?? []).join('\n')}
              rows={6}
              onChange={(e) =>
                setEditData((d) => ({
                  ...d,
                  ingredients: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                }))
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Instructions</Label>
            <Textarea
              value={editData.instructions ?? ''}
              rows={8}
              onChange={(e) => setEditData((d) => ({ ...d, instructions: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => void saveEdit()} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
          {updateMutation.error && (
            <p className="text-sm text-destructive">{(updateMutation.error as Error).message}</p>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold">{recipe.title}</h1>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm" onClick={startEdit}>
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete recipe?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The recipe will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => void handleDelete()}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {recipe.cooking_time && (
            <div className="mb-4">
              <Badge variant="secondary">{recipe.cooking_time}</Badge>
            </div>
          )}

          {recipe.description && (
            <p className="mb-6 text-muted-foreground">{recipe.description}</p>
          )}

          <div className="mb-6">
            <h2 className="mb-3 text-xl font-semibold">Ingredients</h2>
            <div className="space-y-1">
              {ingredients.map((ing, i) => (
                <p key={i}>{ing}</p>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold">Instructions</h2>
            <div className="space-y-2">
              {instructionLines.map((step, i) => (
                <p key={i}>{step}</p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
