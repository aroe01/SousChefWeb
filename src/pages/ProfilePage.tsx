import { useNavigate } from 'react-router-dom';
import { useCurrentUserQuery, useDeleteAccountMutation } from '../hooks/useUser';
import { useAuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
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

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { data: profile, isLoading } = useCurrentUserQuery();
  const deleteAccountMutation = useDeleteAccountMutation();

  async function handleDeleteAccount() {
    if (!profile) return;
    try {
      await deleteAccountMutation.mutateAsync(profile.id);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? 'User'} />
              <AvatarFallback className="text-xl">
                {user?.displayName?.[0]?.toUpperCase() ??
                  user?.email?.[0]?.toUpperCase() ??
                  'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.displayName ?? 'Anonymous'}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>

        {isLoading ? (
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Loading profile…
            </div>
          </CardContent>
        ) : profile ? (
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Member since:</span>{' '}
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        ) : null}
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={deleteAccountMutation.isPending}>
                {deleteAccountMutation.isPending ? 'Deleting…' : 'Delete Account'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your account, all recipes, and all wines. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => void handleDeleteAccount()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {deleteAccountMutation.error && (
            <p className="mt-2 text-sm text-destructive">
              {(deleteAccountMutation.error as Error).message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
