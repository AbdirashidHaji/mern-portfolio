import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SkillsPage from './pages/SkillsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProjectFormPage from './pages/admin/ProjectFormPage';
import SkillFormPage from './pages/admin/SkillFormPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginPage />} />
              
              {/* Protected Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects/new"
                element={
                  <ProtectedRoute>
                    <ProjectFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects/edit/:id"
                element={
                  <ProtectedRoute>
                    <ProjectFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/skills/new"
                element={
                  <ProtectedRoute>
                    <SkillFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/skills/edit/:id"
                element={
                  <ProtectedRoute>
                    <SkillFormPage />
                  </ProtectedRoute>
                }
              />
              
              {/* 404 - Redirect to Home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;