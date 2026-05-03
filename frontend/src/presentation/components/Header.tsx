import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/domain/stores/auth'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import { LogOut, LayoutDashboard, ArrowLeftRight, Tag } from 'lucide-react'
import logo from "@/assets/Logo.png"

export function Header() {
  const { user, logout, isAuthenticated } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transações', icon: ArrowLeftRight },
    { path: '/categories', label: 'Categorias', icon: Tag },
  ]

  if (!isAuthenticated) return null

  return (
    <header className="w-full bg-white border-b border-border px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <img src={logo} alt="Financy Logo" className="w-34 h-8" />
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ path, label }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'default' : 'ghost'}
                size="sm"
                className="text-sm"
              >
                {label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/profile">
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarFallback className="bg-primary text-white text-sm font-semibold">
                {user?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
