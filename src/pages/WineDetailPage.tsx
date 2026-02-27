import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useWineQuery, useUpdateWineMutation, useDeleteWineMutation } from '../hooks/useWines';
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
import type { WineUpdate } from '../types/api';

export function WineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const wineId = Number(id);
  const navigate = useNavigate();
  const { data: wine, isLoading, error } = useWineQuery(wineId);
  const updateMutation = useUpdateWineMutation();
  const deleteMutation = useDeleteWineMutation();

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<WineUpdate>({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !wine) {
    return (
      <div className="py-24 text-center">
        <p className="text-destructive">{error ? (error as Error).message : 'Wine not found'}</p>
        <Link to="/wines" className="mt-4 inline-block underline">
          Back to wines
        </Link>
      </div>
    );
  }

  function startEdit() {
    setEditData({
      name: wine!.name,
      varietal: wine!.varietal ?? '',
      region: wine!.region ?? '',
      vintage: wine!.vintage ?? undefined,
      tasting_notes: wine!.tasting_notes ?? '',
      food_pairings: wine!.food_pairings,
    });
    setEditing(true);
  }

  async function saveEdit() {
    await updateMutation.mutateAsync({ id: wineId, data: editData });
    setEditing(false);
  }

  async function handleDelete() {
    await deleteMutation.mutateAsync(wineId);
    navigate('/wines', { replace: true });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <Link to="/wines" className="text-sm text-muted-foreground hover:underline">
          Wines
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm">{wine.name}</span>
      </div>

      {editing ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input
              value={editData.name ?? ''}
              onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Varietal</Label>
              <Input
                value={editData.varietal ?? ''}
                onChange={(e) => setEditData((d) => ({ ...d, varietal: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Region</Label>
              <Input
                value={editData.region ?? ''}
                onChange={(e) => setEditData((d) => ({ ...d, region: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Vintage</Label>
              <Input
                type="number"
                placeholder="e.g. 2019"
                value={editData.vintage ?? ''}
                onChange={(e) =>
                  setEditData((d) => ({ ...d, vintage: Number(e.target.value) || undefined }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Tasting Notes</Label>
            <Textarea
              value={editData.tasting_notes ?? ''}
              rows={4}
              onChange={(e) => setEditData((d) => ({ ...d, tasting_notes: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Food Pairings (one per line)</Label>
            <Textarea
              value={(editData.food_pairings ?? []).join('\n')}
              rows={4}
              onChange={(e) =>
                setEditData((d) => ({
                  ...d,
                  food_pairings: e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                }))
              }
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
            <h1 className="text-3xl font-bold">{wine.name}</h1>
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
                    <AlertDialogTitle>Delete wine?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. The wine will be permanently deleted.
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

          <div className="mb-6 flex flex-wrap gap-2">
            {wine.vintage && <Badge variant="secondary">{wine.vintage}</Badge>}
            {wine.varietal && <Badge variant="outline">{wine.varietal}</Badge>}
            {wine.region && <Badge variant="outline">{wine.region}</Badge>}
          </div>

          {wine.tasting_notes && (
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold">Tasting Notes</h2>
              <p className="text-muted-foreground">{wine.tasting_notes}</p>
            </div>
          )}

          {wine.food_pairings.length > 0 && (
            <div>
              <h2 className="mb-2 text-xl font-semibold">Food Pairings</h2>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {wine.food_pairings.map((pairing, i) => (
                  <li key={i}>{pairing}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
