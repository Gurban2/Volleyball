import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Layouts
import MainLayout from './components/layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import GamesListPage from './pages/GamesListPage';
import GameDetailsPage from './pages/GameDetailsPage';
import CreateGamePage from './pages/CreateGamePage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import DiagnosticPage from './pages/DiagnosticPage';

// Auth
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          {/* Публичные маршруты */}
          <Route index element={<HomePage />} />
          <Route path="games" element={<GamesListPage />} />
          <Route path="games/:id" element={<GameDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="access-denied" element={<AccessDeniedPage />} />
          <Route path="diagnostic" element={<DiagnosticPage />} />
          
          {/* Маршруты для авторизованных пользователей */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />
          </Route>
          
          {/* Страница заполнения профиля - доступна только авторизованным с незаполненным профилем */}
          <Route element={<ProtectedRoute allowIncompleteProfile={true} />}>
            <Route path="profile/complete" element={<CompleteProfilePage />} />
          </Route>
          
          {/* Маршруты для организаторов */}
          <Route element={<ProtectedRoute requireOrganizer={true} />}>
            <Route path="games/create" element={<CreateGamePage />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App; 