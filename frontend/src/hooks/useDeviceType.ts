import { useState, useEffect } from 'react';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    // Verifica o tipo de dispositivo inicial
    checkDeviceType();

    // Adiciona listener para mudanças de tamanho da tela
    window.addEventListener('resize', checkDeviceType);

    // Limpa o listener quando o componente é desmontado
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  return deviceType;
} 