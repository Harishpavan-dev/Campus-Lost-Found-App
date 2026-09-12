import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import ItemDetailPage from './pages/ItemDetailPage';
import ReportItemPage from './pages/ReportItemPage';
import MyReportsPage from './pages/MyReportsPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Core 6 MVP Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/report/:type" element={<ReportItemPage />} />
          <Route path="/my-reports" element={<MyReportsPage />} />

          {/* Shortcuts & Fallbacks */}
          <Route path="/dashboard" element={<Navigate to="/my-reports" replace />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
