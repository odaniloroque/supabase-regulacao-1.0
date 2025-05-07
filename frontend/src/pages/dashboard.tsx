import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-4 md:p-6 lg:p-8">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-gray-800">Dashboard</h1>
        
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Card de Boas-vindas */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 col-span-full">
            <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-800">
              Bem-vindo, {user?.nome}!
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Este é o painel de controle do Sistema de Regulação. Use o menu lateral para navegar entre as diferentes seções.
            </p>
          </div>

          {/* Card de Estatísticas */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Pacientes</h3>
            <p className="text-3xl font-bold text-primary">0</p>
            <p className="text-sm text-gray-500 mt-2">Total de pacientes cadastrados</p>
          </div>

          {/* Card de Atividades Recentes */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Atividades Recentes</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Nenhuma atividade recente</p>
            </div>
          </div>

          {/* Card de Ações Rápidas */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Ações Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-accent transition-colors text-sm">
                Novo Paciente
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-sm">
                Ver Relatórios
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 