import { Link } from 'react-router-dom';
import { useWinesQuery } from '../hooks/useWines';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function WinesPage() {
  const { data: wines, isLoading, error } = useWinesQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 text-center text-destructive">
        Failed to load wines: {(error as Error).message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Wines</h1>
        <Button asChild>
          <Link to="/wines/new">+ New Wine</Link>
        </Button>
      </div>

      {wines?.length === 0 && (
        <div className="py-24 text-center text-muted-foreground">
          <p className="mb-4 text-lg">No wines yet.</p>
          <Button asChild variant="secondary">
            <Link to="/wines/new">Add your first wine</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wines?.map((wine) => (
          <Link key={wine.id} to={`/wines/${wine.id}`} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="line-clamp-2">{wine.name}</CardTitle>
                {wine.producer && (
                  <CardDescription className="line-clamp-1">{wine.producer}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {wine.vintage && <Badge variant="secondary">{wine.vintage}</Badge>}
                {wine.varietal && <Badge variant="outline">{wine.varietal}</Badge>}
                {wine.region && <Badge variant="outline">{wine.region}</Badge>}
                {wine.rating && (
                  <Badge variant="secondary">{wine.rating.toFixed(1)} / 5</Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
