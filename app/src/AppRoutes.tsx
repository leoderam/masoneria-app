import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './features/auth/AuthContext'
import { Layout } from './components/layout/Layout'

import { Home } from './pages/public/Home'
import { Login, Register } from './pages/public/Auth'
import { About } from './pages/public/About'
import { Store } from './pages/public/Store'
import { SerMason } from './pages/public/SerMason'
import { FAQ } from './pages/public/FAQ'
import { Contact } from './pages/public/Contact'
import { Dashboard } from './pages/private/Dashboard'
import { Library } from './pages/private/Library'
import { AdminManagement } from './pages/private/Admin'

// Pages (to be created)

function ProtectedRoute({ children, minGrade = 1 }: { children: React.ReactNode, minGrade?: number }) {
    const { user, memberships } = useAuth()

    if (!user) return <Navigate to="/login" />

    // Basic grade check (at least one membership with required grade)
    const hasAccess = memberships.some(m => m.grade >= minGrade)
    if (!hasAccess && minGrade > 0) {
        return <div>Acceso Denegado: Se requiere grado {minGrade}</div>
    }

    return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
    const { memberships } = useAuth()
    const isAdmin = memberships.some(m => m.is_logia_admin || m.is_super_admin)

    if (!isAdmin) return <Navigate to="/dashboard" />

    return <>{children}</>
}

export function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/ser-mason" element={<SerMason />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contacto" element={<Contact />} />
                <Route path="/store" element={<Store />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* Private Routes */}
            <Route element={<Layout />}>
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/library" element={
                    <ProtectedRoute minGrade={1}>
                        <Library />
                    </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminManagement />
                    </AdminRoute>
                } />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}
