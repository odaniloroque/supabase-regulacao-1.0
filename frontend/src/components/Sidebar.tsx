import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FaUserInjured, 
  FaVenusMars, 
  FaMapMarkerAlt, 
  FaUsers,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

export function Sidebar() {
  const router = useRouter();
  const { signOut } = useAuth();

  const menuItems = [
    {
      title: 'Pacientes',
      icon: FaUserInjured,
      href: '/pacientes',
    },
    {
      title: 'Sexos',
      icon: FaVenusMars,
      href: '/sexos',
    },
    {
      title: 'Endereços',
      icon: FaMapMarkerAlt,
      href: '/enderecos',
    },
    {
      title: 'Usuários',
      icon: FaUsers,
      href: '/usuarios',
    },
  ];

  return (
    <div className="bg-primary min-h-screen w-64 p-4">
      <div className="text-white text-2xl font-bold mb-8">Sistema de Regulação</div>
      
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center text-white p-3 rounded-lg mb-2 hover:bg-accent transition-colors ${
                router.pathname.startsWith(item.href) ? 'bg-accent' : ''
              }`}
            >
              <Icon className="mr-3" />
              {item.title}
            </Link>
          );
        })}

        <button
          onClick={signOut}
          className="flex items-center text-white p-3 rounded-lg mb-2 hover:bg-accent transition-colors w-full"
        >
          <FaSignOutAlt className="mr-3" />
          Sair
        </button>
      </nav>
    </div>
  );
} 