import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import AdminPackageForm from './pages/AdminPackageForm';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#21262d',
              color: '#e5c98e',
              border: '1px solid #30363d',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#3d9c71', secondary: '#21262d' } },
            error: { iconTheme: { primary: '#f87171', secondary: '#21262d' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/packages" element={<Layout><Packages /></Layout>} />
          <Route path="/packages/:id" element={<Layout><PackageDetail /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected — logged-in users */}
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <Layout><MyBookings /></Layout>
            </ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/admin" element={
            <AdminRoute>
              <Layout><AdminDashboard /></Layout>
            </AdminRoute>
          } />
          <Route path="/admin/packages/new" element={
            <AdminRoute>
              <Layout><AdminPackageForm /></Layout>
            </AdminRoute>
          } />
          <Route path="/admin/packages/:id/edit" element={
            <AdminRoute>
              <Layout><AdminPackageForm /></Layout>
            </AdminRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <p className="font-display text-8xl text-sand-700 mb-4">404</p>
                  <h1 className="font-display text-3xl text-sand-300 mb-2">Page not found</h1>
                  <p className="text-sand-500 mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              </div>
            </Layout>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
