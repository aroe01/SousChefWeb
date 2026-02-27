import { Link } from 'react-router-dom';
import { useRecipesQuery } from '../hooks/useRecipes';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export function RecipesPage() {
  const { data: recipes, isLoading, error } = useRecipesQuery();

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
        Failed to load recipes: {(error as Error).message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Recipes</h1>
        <Button asChild>
          <Link to="/recipes/new">+ New Recipe</Link>
        </Button>
      </div>

      {recipes?.length === 0 && (
        <div className="py-24 text-center text-muted-foreground">
          <p className="mb-4 text-lg">No recipes yet.</p>
          <Button asChild variant="secondary">
            <Link to="/recipes/new">Create your first recipe</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes?.map((recipe) => (
          <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardHeader>
                <CardTitle className="line-clamp-2">{recipe.title}</CardTitle>
                {recipe.description && (
                  <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {recipe.cooking_time && (
                  <Badge variant="secondary">{recipe.cooking_time}</Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
