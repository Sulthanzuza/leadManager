import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LeadForm from './pages/LeadForm';
import LeadDetail from './pages/LeadDetail';
import { Lead } from './types/lead';
import { fetchLeads } from './services/api';

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLeads = async () => {
      try {
        setLoading(true);
        const data = await fetchLeads();
        setLeads(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to fetch leads. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getLeads();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route 
          index 
          element={
            <Dashboard 
              leads={leads} 
              setLeads={setLeads} 
              loading={loading} 
              error={error} 
            />
          } 
        />
        <Route path="leads/new" element={<LeadForm setLeads={setLeads} />} />
        <Route 
          path="leads/:id" 
          element={
            <LeadDetail
              leads={leads}
              setLeads={setLeads}
            />
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;