import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useDeviceType } from '../hooks/useDeviceType';
import {
  FaHome,
  FaUser,
  FaUsers,
  FaVenusMars,
  FaMapMarkerAlt,
  FaUserCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTools,
  FaCaretDown,
  FaCaretRight,
} from 'react-icons/fa';

export function Sidebar() {
  const router = useRouter();
  const { signOut } = useAuth();
  const deviceType = useDeviceType();
  const [isExpanded, setIsExpanded] = useState(deviceType !== 'mobile');
  const [isUtilExpanded, setIsUtilExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(deviceType !== 'mobile');
  }, [deviceType]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleUtilMenu = () => {
    setIsUtilExpanded(!isUtilExpanded);
  };

  const mainMenuItems = [
    { href: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { href: '/paciente', icon: FaUsers, label: 'Pacientes' },
  ];

  const utilMenuItems = [
    { href: '/sexo', icon: FaVenusMars, label: 'Sexos' },
    { href: '/endereco', icon: FaMapMarkerAlt, label: 'Endereços' },
    { href: '/usuario', icon: FaUserCog, label: 'Usuários' },
  ];

  const isUtilActive = utilMenuItems.some(item => router.pathname.startsWith(item.href));

  return (
    <div
      className={`bg-gray-800 text-white transition-all duration-300 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        {isExpanded ? (
          <h1 className="text-xl font-bold">Regulação</h1>
        ) : (
          <h1 className="text-xl font-bold">R</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-700 focus:outline-none"
        >
          {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      <nav className="mt-8">
        {mainMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 transition-colors duration-200 ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="text-xl" />
              {isExpanded && <span className="ml-4">{item.label}</span>}
            </Link>
          );
        })}

        {/* Menu Util */}
        <div className="mt-2">
          <button
            onClick={toggleUtilMenu}
            className={`flex items-center w-full px-4 py-3 transition-colors duration-200 ${
              isUtilActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <FaTools className="text-xl" />
            {isExpanded && (
              <>
                <span className="ml-4">Util</span>
                <div className="ml-auto">
                  {isUtilExpanded ? <FaCaretDown /> : <FaCaretRight />}
                </div>
              </>
            )}
          </button>

          {isExpanded && isUtilExpanded && (
            <div className="ml-8 mt-1">
              {utilMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = router.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-2 transition-colors duration-200 ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="ml-3">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          onClick={signOut}
          className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 rounded-lg"
        >
          <FaSignOutAlt className="text-xl" />
          {isExpanded && <span className="ml-4">Sair</span>}
        </button>
      </div>
    </div>
  );
} 