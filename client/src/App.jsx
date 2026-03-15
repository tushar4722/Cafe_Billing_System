import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import BillingScreen from './pages/BillingScreen';
import KitchenDisplay from './pages/KitchenDisplay';
import Reports from './pages/Reports';
import Inventory from './pages/Inventory';
import MenuManagement from './pages/MenuManagement';
import RecipeManagement from './pages/RecipeManagement';
import StaffManagement from './pages/StaffManagement';
import CashierDashboard from './pages/CashierDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/reports" element={
          <ProtectedRoute roles={['admin']}>
            <Reports />
          </ProtectedRoute>
        } />

        <Route path="/admin/inventory" element={
          <ProtectedRoute roles={['admin']}>
            <Inventory />
          </ProtectedRoute>
        } />

        <Route path="/admin/menu" element={
          <ProtectedRoute roles={['admin']}>
            <MenuManagement />
          </ProtectedRoute>
        } />

        <Route path="/admin/recipes" element={
          <ProtectedRoute roles={['admin']}>
            <RecipeManagement />
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute roles={['admin']}>
            <StaffManagement />
          </ProtectedRoute>
        } />

        <Route path="/cashier" element={
          <ProtectedRoute roles={['cashier', 'admin']}>
            <CashierDashboard />
          </ProtectedRoute>
        } />

        <Route path="/billing" element={
          <ProtectedRoute roles={['cashier', 'admin', 'staff']}>
            <BillingScreen />
          </ProtectedRoute>
        } />

        <Route path="/kitchen" element={
          <ProtectedRoute roles={['kitchen', 'admin']}>
            <KitchenDisplay />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
