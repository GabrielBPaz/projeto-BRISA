import React, { useState } from 'react';
import { Clock, TrendingUp, AlertCircle, CheckCircle2, Plus, X } from 'lucide-react';

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBid, setNewBid] = useState({
    name: '',
    contractNumber: '',
    startDate: '',
    endDate: '',
    value: '',
    description: ''
  });

  const stats = [
    {
      name: 'Licitações Ativas',
      value: '8',
      icon: TrendingUp,
      change: '+4.75%',
      changeType: 'positive'
    },
    {
      name: 'Próximos Prazos',
      value: '3',
      icon: Clock,
      change: '2 esta semana',
      changeType: 'neutral'
    },
    {
      name: 'Em Atraso',
      value: '1',
      icon: AlertCircle,
      change: '-2',
      changeType: 'positive'
    },
    {
      name: 'Concluídas',
      value: '24',
      icon: CheckCircle2,
      change: '+3',
      changeType: 'positive'
    }
  ];

  const kanbanColumns = [
    {
      title: 'Pendente',
      items: [
        { id: 1, name: 'Licitação Hospital Regional', deadline: '2025-04-01', status: 'pending' },
        { id: 2, name: 'Reforma Escola Municipal', deadline: '2025-03-25', status: 'pending' }
      ]
    },
    {
      title: 'Em Andamento',
      items: [
        { id: 3, name: 'Construção Posto de Saúde', deadline: '2025-05-15', status: 'in_progress' },
        { id: 4, name: 'Pavimentação Rua Principal', deadline: '2025-04-10', status: 'in_progress' }
      ]
    },
    {
      title: 'Concluído',
      items: [
        { id: 5, name: 'Reforma Praça Central', deadline: '2025-03-01', status: 'completed' }
      ]
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBid(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we'll add the logic to save the new bid
    console.log('New bid:', newBid);
    setIsModalOpen(false);
    setNewBid({
      name: '',
      contractNumber: '',
      startDate: '',
      endDate: '',
      value: '',
      description: ''
    });
  };

  return (
    <div className="relative">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral das suas licitações e atividades
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6"
            >
              <dt>
                <div className="absolute rounded-md bg-blue-50 p-3">
                  <Icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  {stat.change}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Licitações em Andamento</h2>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          {kanbanColumns.map((column) => (
            <div key={column.title} className="rounded-lg bg-white p-4 shadow">
              <h3 className="mb-4 text-sm font-medium text-gray-500">{column.title}</h3>
              <div className="space-y-3">
                {column.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow"
                  >
                    <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                    <p className="mt-2 text-xs text-gray-500">
                      Prazo: {new Date(item.deadline).toLocaleDateString('pt-BR')}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${
                            item.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : item.status === 'in_progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }
                        `}
                      >
                        {item.status === 'pending'
                          ? 'Pendente'
                          : item.status === 'in_progress'
                          ? 'Em Andamento'
                          : 'Concluído'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Fechar</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Nova Licitação
                  </h3>
                  <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nome da Licitação
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={newBid.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="contractNumber" className="block text-sm font-medium text-gray-700">
                          Número do Contrato
                        </label>
                        <input
                          type="text"
                          name="contractNumber"
                          id="contractNumber"
                          value={newBid.contractNumber}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Data de Início
                          </label>
                          <input
                            type="date"
                            name="startDate"
                            id="startDate"
                            value={newBid.startDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            Data de Término
                          </label>
                          <input
                            type="date"
                            name="endDate"
                            id="endDate"
                            value={newBid.endDate}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                          Valor
                        </label>
                        <input
                          type="number"
                          name="value"
                          id="value"
                          value={newBid.value}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          required
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Descrição
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          value={newBid.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                        >
                          Criar Licitação
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}