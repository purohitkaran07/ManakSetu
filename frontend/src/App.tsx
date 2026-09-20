import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { StandardsPage } from './pages/StandardsPage';
import { StandardDetailPage } from './pages/StandardDetailPage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import { HistoryPage } from './pages/HistoryPage';
import { AboutPage } from './pages/AboutPage';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="analyze" element={<AnalyzePage />} />
          <Route path="standards" element={<StandardsPage />} />
          <Route path="standards/:id" element={<StandardDetailPage />} />
          <Route path="graph" element={<KnowledgeGraphPage />} />
          <Route path="knowledge-graph" element={<KnowledgeGraphPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
