import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Wallet, User, LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-brand-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="text-2xl font-bold hover:text-brand-100 transition-colors">
            Trueqq
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <NotificationBell />
            
            {/* Balance */}
            <div className="flex items-center gap-2 bg-brand-700 px-4 py-2 rounded-lg">
              <Wallet size={20} />
              <span className="font-semibold">{user?.trueqqBalance || 0} Trueqqs</span>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-3">
              <Link 
                to="/profile"
                className="flex items-center gap-2 hover:bg-brand-700 px-3 py-2 rounded-lg transition-colors"
              >
                <User size={20} />
                <span>{user?.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-brand-700 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}