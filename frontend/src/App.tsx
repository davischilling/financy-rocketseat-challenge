import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from '@/presentation/components/Layout'
import { Login } from '@/presentation/pages/Auth/Login'
import { Signup } from '@/presentation/pages/Auth/Signup'
import { Dashboard } from '@/presentation/pages/Dashboard'
import { TransactionsPage } from '@/presentation/pages/Transactions'
import { CategoriesPage } from '@/presentation/pages/Categories'
import { ProfilePage } from '@/presentation/pages/Profile'
import { useAuthStore } from '@/domain/stores/auth'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

function App() {
  useEffect(() => {
    const { token, isAuthenticated, refresh, logout } = useAuthStore.getState()
    if (!isAuthenticated || !token) return
    try {
      // base64url → base64 before decoding
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
      const { exp } = JSON.parse(atob(base64))
      if (exp * 1000 < Date.now()) {
        refresh().then((success) => { if (!success) logout() })
      }
    } catch {
      logout()
    }
  }, [])

  return (
    <Layout>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  )
}

export default App
