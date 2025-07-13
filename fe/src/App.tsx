import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
                  <ProtectedRoute requiredRole="guest">
                    <BookingHistory />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes for Hosts */}
              <Route 
                path="/management" 
                element={
                  <ProtectedRoute requiredRole="host">
                    <Management />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add-homestay" 
                element={
                  <ProtectedRoute requiredRole="host">
                    <AddHomestay />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/management/homestay/:id" 
                element={
                  <ProtectedRoute requiredRole="host">
                    <HomestayDetailManagement />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Layout>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;