import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import HomestayList from './pages/HomestayList';
import HomestayDetail from './pages/HomestayDetail';
import About from './pages/About';
import BookingHistory from './pages/BookingHistory';
import Management from './pages/Management';
import AddHomestay from './pages/AddHomestay';
import HomestayDetailManagement from './pages/HomestayDetailManagement';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/homestays" element={<HomestayList />} />
              <Route path="/homestay/:id" element={<HomestayDetail />} />
              <Route path="/about" element={<About />} />
              
              {/* Protected Routes for Guests */}
              <Route 
                path="/bookings" 
                element={
                  <ProtectedRoute requiredRoles={['guest']}>
                    <BookingHistory />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes for Hosts and Admins */}
              <Route 
                path="/management" 
                element={
                  <ProtectedRoute requiredRoles={['host', 'admin']}>
                    <Management />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-homestay" 
                element={
                  <ProtectedRoute requiredRoles={['host', 'admin']}>
                    <AddHomestay />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/management/homestay/:id" 
                element={
                  <ProtectedRoute requiredRoles={['host', 'admin']}>
                    <HomestayDetailManagement />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </DataProvider>
      </AuthProvider>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;