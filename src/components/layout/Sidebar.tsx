import { BookOpen, Home, LogOut, Users } from 'react-feather';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';
import styles from './Sidebar.module.css';
import urbanoLogo from '../../assets/urbano-logo-white.png';
interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const history = useHistory();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  return (
    <div className={`sidebar ${className}`}>
      <Link to="/" className="no-underline">
        <img src={urbanoLogo} alt="Urbano Logo" className={styles.logo} />
      </Link>
      <nav className={styles.navContainer}>
        <SidebarItem to="/">
          <Home /> Dashboard
        </SidebarItem>
        <SidebarItem to="/courses">
          <BookOpen /> Courses
        </SidebarItem>
        {authenticatedUser.role === 'admin' ? (
          <SidebarItem to="/users">
            <Users /> Users
          </SidebarItem>
        ) : null}
      </nav>
      <button
        className="text-red-300 rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none hover:text-red-500"
        onClick={handleLogout}
      >
        <LogOut /> Logout
      </button>
    </div>
  );
}
