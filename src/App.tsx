import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CodeDetailPage from './pages/CodeDetailPage';
import APITestPage from './pages/APITestPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/code/:id" element={<CodeDetailPage />} />
        <Route path="/api-test" element={<APITestPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
