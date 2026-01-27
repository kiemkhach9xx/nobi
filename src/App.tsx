import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CodeDetailPage from './pages/CodeDetailPage';
import APITestPage from './pages/APITestPage';

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/code/:codeId" element={<CodeDetailPage />} />
          <Route path="/api-test" element={<APITestPage />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
