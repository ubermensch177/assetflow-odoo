import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import {
  Login,
  Dashboard,
  Organization,
  Assets,
  Allocation,
  Booking,
  Maintenance,
  Audit,
  Reports,
  Notifications,
  AssetDetails
} from './pages';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes Wrapper (Layout) */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="organization" element={<Organization />} />
          <Route path="assets" element={<Assets />} />
          <Route path="assets/:id" element={<AssetDetails />} />
          <Route path="allocation" element={<Allocation />} />
          <Route path="booking" element={<Booking />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="audit" element={<Audit />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
