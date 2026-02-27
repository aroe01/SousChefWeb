import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RecipesPage } from './pages/RecipesPage';
import { RecipeNewPage } from './pages/RecipeNewPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { WinesPage } from './pages/WinesPage';
import { WineNewPage } from './pages/WineNewPage';
import { WineDetailPage } from './pages/WineDetailPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected — wrapped in Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/recipes" replace />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/new" element={<RecipeNewPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/wines" element={<WinesPage />} />
          <Route path="/wines/new" element={<WineNewPage />} />
          <Route path="/wines/:id" element={<WineDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
