// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Order, STATUS_LIST, StatusType } from '../../utils/types';
import { getOrders, saveOrders } from '../../utils/storage';
import Link from 'next/link';
import Header from '../../components/Header';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Novos estados para o formulário
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCpf, setNewCpf] = useState(''); // Mudamos de Password para CPF

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_auth');
    if (isAuth === 'true') {
        setIsAuthenticated(true);
        loadOrders();
    }
  }, []);

  const loadOrders = () => {
    const data = getOrders();
    setOrders(data);
  }

  const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (adminPassword === 'admin123') {
          setIsAuthenticated(true);
          localStorage.setItem('admin_auth', 'true');
          loadOrders();
      } else {
          alert('Senha de administrador incorreta!');
      }
  };

  const logout = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('admin_auth');
  }

  const copyLink = (id: string) => {
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/login?id=${id}`;
      navigator.clipboard.writeText(link);
      alert(`Link copiado!\n\n${link}`);
  };

  // Função auxiliar para formatar CPF na visualização
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  }

  const updateStatus = (orderId: string, newStatus: StatusType) => {
    const now = new Date().toLocaleString('pt-BR');
    const updatedOrders = orders.map((order) => {
      if (order.id !== orderId) return order;
      if (order.currentStatus === newStatus) return order;
      return {
        ...order,
        currentStatus: newStatus,
        history: [...order.history, { status: newStatus, date: now }],
      };
    });
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newCpf) return;

    // Remove pontos e traços para salvar apenas números (mais seguro)
    const cleanCpf = newCpf.replace(/\D/g, '');

    if (cleanCpf.length < 11) {
        alert("Por favor, insira um CPF válido.");
        return;
    }

    const newId = Math.floor(1000 + Math.random() * 9000).toString();
    const now = new Date().toLocaleString('pt-BR');
    const initialStatus = STATUS_LIST[0];
    
    const newOrder: Order = {
      id: newId,
      customerName: newCustomerName,
      cpf: formatCPF(cleanCpf), // Salva formatado para ficar bonito na tabela
      currentStatus: initialStatus,
      history: [{ status: initialStatus, date: now }]
    };

    const updatedList = [...orders, newOrder];
    setOrders(updatedList);
    saveOrders(updatedList);
    
    setNewCustomerName('');
    setNewCpf('');
    setIsModalOpen(false);
    
    alert(`Pedido criado!\nCliente: ${newCustomerName}\nCPF: ${formatCPF(cleanCpf)}`);
  };

  const handleDeleteOrder = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
        const updatedList = orders.filter(o => o.id !== id);
        setOrders(updatedList);
        saveOrders(updatedList);
    }
  }

  if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Acesso Gerencial</h2>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha do Admin</label>
                        <input type="password" className="w-full border border-gray-300 rounded-md p-3 mt-1" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="admin123" />
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900">Entrar</button>
                    <Link href="/" className="block text-center text-sm text-blue-600 mt-4">Voltar para o Início</Link>
                </form>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Painel de Produção</h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">Gerencie os pedidos.</p>
          </div>
          
          <div className="w-full md:w-auto flex gap-2">
            <button onClick={logout} className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50">Sair</button>
            <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm">+ Novo Pedido</button>
          </div>
        </div>

        {orders.length === 0 ? (
           <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow">Nenhum pedido encontrado.</div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{order.customerName}</span>
                            <span className="text-xs text-gray-500 font-mono">ID: #{order.id}</span>
                            {/* Mostra CPF formatado */}
                            <span className="text-xs text-gray-400">CPF: {order.cpf || 'Não cadastrado'}</span>
                            
                            <button onClick={() => copyLink(order.id)} className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors w-fit p-1 -ml-1 rounded hover:bg-blue-50">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                                Copiar Link
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.currentStatus === 'Óculos entregue' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{order.currentStatus}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                           <div className="flex items-center gap-2">
                                <select className="block w-full max-w-[200px] pl-3 pr-8 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md border bg-white" value={order.currentStatus} onChange={(e) => updateStatus(order.id, e.target.value as StatusType)}>
                                {STATUS_LIST.map((status) => (<option key={status} value={status}>{status}</option>))}
                                </select>
                                <button onClick={() => handleDeleteOrder(order.id)} className="text-red-400 hover:text-red-600 p-2">🗑️</button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden flex flex-col gap-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-full">
                      <h3 className="text-lg font-bold text-gray-900">{order.customerName}</h3>
                      <p className="text-sm text-gray-500 font-mono">ID: {order.id} • CPF: {order.cpf}</p>
                      <button onClick={() => copyLink(order.id)} className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-semibold active:text-blue-800 p-1 -ml-1 rounded active:bg-blue-50">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>
                          Copiar Link
                      </button>
                    </div>
                    <button onClick={() => handleDeleteOrder(order.id)} className="text-red-500 p-1">🗑️</button>
                  </div>
                  <div className="mb-3">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 ${order.currentStatus === 'Óculos entregue' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{order.currentStatus}</span>
                  </div>
                  <div className="w-full">
                    <label className="text-xs text-gray-500 mb-1 block">Atualizar Status:</label>
                    <select className="block w-full p-2 text-sm border-gray-300 rounded-md border bg-gray-50" value={order.currentStatus} onChange={(e) => updateStatus(order.id, e.target.value as StatusType)}>
                    {STATUS_LIST.map((status) => (<option key={status} value={status}>{status}</option>))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* MODAL NOVO PEDIDO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Novo Pedido</h3>
                <form onSubmit={handleCreateOrder} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
                        <input type="text" required className="w-full border border-gray-300 rounded-md p-3" placeholder="Ex: Ana Souza" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF do Cliente</label>
                        <input 
                            type="text" 
                            required 
                            className="w-full border border-gray-300 rounded-md p-3" 
                            placeholder="000.000.000-00" 
                            value={newCpf} 
                            onChange={e => {
                                // Máscara simples para facilitar digitação
                                const v = formatCPF(e.target.value);
                                setNewCpf(v);
                            }} 
                            maxLength={14}
                        />
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-gray-700">Cancelar</button>
                        <button type="submit" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-md font-medium">Criar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}