# SousChefWeb — Claude Code Reference

## Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm run lint     # ESLint
npm run preview  # Preview production build locally
```

## Stack

- **React 19 + Vite + TypeScript** — framework
- **shadcn/ui + Tailwind CSS v4** — UI components (components in `src/components/ui/`)
- **Firebase Client SDK** — Google OAuth authentication
- **TanStack Query v5** — server state / data fetching
- **React Router v7** — client-side routing
- **react-hook-form + zod** — form validation

## Project Structure

```
src/
  lib/
    firebase.ts          # Firebase app + auth + googleProvider
    api.ts               # Typed fetch wrapper (injects Bearer token)
    utils.ts             # shadcn cn() utility
  hooks/
    useAuth.ts           # Firebase onAuthStateChanged hook
    useRecipes.ts        # TanStack Query hooks for recipes
    useWines.ts          # TanStack Query hooks for wines
    useUser.ts           # TanStack Query hooks for user profile
  context/
    AuthContext.tsx      # AuthProvider + useAuthContext
  components/
    ProtectedRoute.tsx   # Redirects unauthenticated users to /login
    Layout.tsx           # Top nav + page shell for protected routes
    ui/                  # shadcn/ui components (auto-generated, do not edit)
  pages/
    LoginPage.tsx
    RecipesPage.tsx      # Recipe list grid
    RecipeDetailPage.tsx # View / edit / delete single recipe
    RecipeNewPage.tsx    # Create recipe via text or image upload
    WinesPage.tsx        # Wine list grid
    WineDetailPage.tsx   # View / edit / delete single wine
    WineNewPage.tsx      # Create wine via text, image, or sommelier Q&A
    ProfilePage.tsx      # User info + delete account
  types/
    api.ts               # TypeScript interfaces matching backend Pydantic schemas
  App.tsx                # React Router route definitions
  main.tsx               # QueryClient + AuthProvider mount point
```

## Auth Flow

1. User clicks "Sign in with Google" on `/login`
2. Firebase popup completes → `onAuthStateChanged` fires with `User`
3. `AuthContext` stores the user; `ProtectedRoute` allows access
4. Every API call: `auth.currentUser.getIdToken()` → `Authorization: Bearer <token>`
5. Backend validates the Firebase ID token via Firebase Admin SDK

## API Conventions

- Base URL: `VITE_API_BASE_URL` (default `http://localhost:8000`)
- All endpoints require `Authorization: Bearer <firebase-id-token>`
- Multipart (image upload): pass `FormData` directly — do NOT set `Content-Type`
- Named API functions live in `src/lib/api.ts`

## Adding New API Hooks

1. Add named fetch function to `src/lib/api.ts`
2. Add TanStack Query hook to the appropriate `src/hooks/use*.ts` file
3. Use the hook in the page component

## Adding New Pages

1. Create `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx` (wrap in `<ProtectedRoute>` if auth required)
3. Add nav link in `src/components/Layout.tsx` if needed

## Environment Variables

Required in `.env.local` (never commit real values):
```
VITE_API_BASE_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

Set these in Vercel project settings for production.

## Backend API Endpoints

> **Source of truth:** The backend implementation lives in the sibling directory `../SousChefBackend`. Read files there for authoritative API schemas, route definitions, and Pydantic models. **Do not modify any files in `../SousChefBackend`.**

### Recipes
- `GET    /api/v1/recipes/`         — list all
- `POST   /api/v1/recipes/`         — create (JSON body: RecipeCreate)
- `POST   /api/v1/recipes/analyze`  — extract from images (FormData: files[], prompt?)
- `GET    /api/v1/recipes/{id}`     — get single
- `PUT    /api/v1/recipes/{id}`     — update (JSON body: RecipeUpdate)
- `DELETE /api/v1/recipes/{id}`     — delete

### Wines
- `GET    /api/v1/wines/`           — list all
- `POST   /api/v1/wines/`           — create (JSON body: WineCreate)
- `POST   /api/v1/wines/analyze`    — extract from images (FormData: files[], prompt?)
- `POST   /api/v1/wines/ask`        — sommelier Q&A (JSON body: {question: string})
- `GET    /api/v1/wines/{id}`       — get single
- `PUT    /api/v1/wines/{id}`       — update (JSON body: WineUpdate)
- `DELETE /api/v1/wines/{id}`       — delete

### Users
- `GET    /api/v1/users/me`         — current user profile
- `DELETE /api/v1/users/{id}`       — delete account (also call Firebase deleteUser())
