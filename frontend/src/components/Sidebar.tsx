import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  FaUserInjured, 
  FaVenusMars, 
  FaMapMarkerAlt, 
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaCog
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useDeviceType } from '../hooks/useDeviceType';

export function Sidebar() {
  const router = useRouter();
  const { signOut } = useAuth();
  const deviceType = useDeviceType();
  const [isExpanded, setIsExpanded] = useState(deviceType !== 'mobile');
  const [isUtilExpanded, setIsUtilExpanded] = useState(false);

  // Atualiza o estado quando o tipo de dispositivo muda
  useEffect(() => {
    setIsExpanded(deviceType !== 'mobile');
  }, [deviceType]);

  const menuItems = [
    {
      title: 'Pacientes',
      icon: FaUserInjured,
      href: '/pacientes',
    },
    {
      title: 'Util',
      icon: FaCog,
      subItems: [
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
      ],
    },
  ];

  return (
    <div className={`bg-primary min-h-screen transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-20'
    } p-4 relative`}>
      {/* Botão de toggle - visível apenas em mobile */}
      {deviceType === 'mobile' && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-4 bg-accent text-white p-1 rounded-full hover:bg-accent/80 transition-colors"
        >
          <FaBars size={16} />
        </button>
      )}

      {/* Título */}
      <div className={`text-white font-bold mb-8 transition-all duration-300 ${
        isExpanded ? 'text-2xl' : 'text-lg text-center'
      }`}>
        {isExpanded ? 'Sistema de Regulação' : 'SR'}
      </div>
      
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          
          if (item.subItems) {
            return (
              <div key={item.title} className="mb-2">
                <button
                  onClick={() => setIsUtilExpanded(!isUtilExpanded)}
                  className={`flex items-center text-white p-3 rounded-lg w-full hover:bg-accent transition-colors ${
                    !isExpanded && 'justify-center'
                  }`}
                  title={!isExpanded ? item.title : undefined}
                >
                  <Icon className={isExpanded ? 'mr-3' : 'mx-auto'} size={isExpanded ? 20 : 24} />
                  {isExpanded && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isUtilExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
                
                {isUtilExpanded && isExpanded && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center text-white p-2 rounded-lg hover:bg-accent transition-colors ${
                            router.pathname.startsWith(subItem.href) ? 'bg-accent' : ''
                          }`}
                        >
                          <SubIcon className="mr-3" size={18} />
                          <span>{subItem.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center text-white p-3 rounded-lg mb-2 hover:bg-accent transition-colors ${
                router.pathname.startsWith(item.href) ? 'bg-accent' : ''
              }`}
              title={!isExpanded ? item.title : undefined}
            >
              <Icon className={isExpanded ? 'mr-3' : 'mx-auto'} size={isExpanded ? 20 : 24} />
              {isExpanded && <span>{item.title}</span>}
            </Link>
          );
        })}

        <button
          onClick={signOut}
          className={`flex items-center text-white p-3 rounded-lg mb-2 hover:bg-accent transition-colors w-full ${
            !isExpanded && 'justify-center'
          }`}
          title={!isExpanded ? 'Sair' : undefined}
        >
          <FaSignOutAlt className={isExpanded ? 'mr-3' : 'mx-auto'} size={isExpanded ? 20 : 24} />
          {isExpanded && <span>Sair</span>}
        </button>
      </nav>
    </div>
  );
} 