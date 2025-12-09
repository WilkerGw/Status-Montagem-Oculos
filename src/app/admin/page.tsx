// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Order, STATUS_LIST, StatusType } from '../../utils/types';
import { supabase } from '../../lib/supabase'; // Importa o banco real
import Link from 'next/link';
import Header from '../../components/Header';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Login States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Dashboard States
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCpf, setNewCpf] = useState('');

  // 1. Verificar se já está logado ao abrir a página
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        setIsAuthenticated(true);
        fetchOrders();
    }
    setLoading(false);
  }

  // 2. Buscar pedidos do Banco de Dados
  async function fetchOrders() {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false }); // Mais recentes primeiro

    if (error) {
        console.error('Erro ao buscar:', error);
    } else {
        setOrders(data as Order[]);
    }
  }

  // 3. Login Real com Supabase
  const handleAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
      });

      if (error) {
          alert('Erro no login: ' + error.message);
          setLoading(false);
      } else {
          setIsAuthenticated(true);
          fetchOrders();
          setLoading(false);
      }
  };

  const logout = async () => {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setOrders([]);
  }

  // 4. Criar Pedido no Banco
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newCpf) return;

    const cleanCpf = newCpf.replace(/\D/g, '');
    if (cleanCpf.length < 11) {
        alert("CPF inválido");
        return;
    }

    const newId = Math.floor(1000 + Math.random() * 9000).toString();
    const now = new Date().toLocaleString('pt-BR');
    const initialStatus = STATUS_LIST[0];

    const newOrder = {
      id: newId,
      customer_name: newCustomerName, // Note que no banco usei snake_case, mas o JS mapeia se precisar
      // Vamos ajustar o objeto para bater com a tabela ou mapear manual
      customerName: newCustomerName, // O supabase aceita JSON, mas ideal é bater coluna
      cpf: formatCPF(cleanCpf),
      currentStatus: initialStatus,
      history: [{ status: initialStatus, date: now }]
    };

    // Ajuste para inserir com os nomes exatos das colunas do banco
    const { error } = await supabase.from('orders').insert([{
        id: newId,
        customer_name: newCustomerName,
        cpf: formatCPF(cleanCpf),
        current_status: initialStatus,
        history: [{ status: initialStatus, date: now }]
    }]);

    if (error) {
        alert('Erro ao criar: ' + error.message);
    } else {
        // Atualiza a lista local
        fetchOrders();
        setNewCustomerName('');
        setNewCpf('');
        setIsModalOpen(false);
        alert(`Pedido criado!\nID: ${newId}`);
    }
  };

  // 5. Atualizar Status no Banco
  const updateStatus = async (orderId: string, newStatus: StatusType) => {
    const now = new Date().toLocaleString('pt-BR');
    
    // Pega o pedido atual para adicionar ao histórico
    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder) return;

    const newHistory = [...currentOrder.history, { status: newStatus, date: now }];

    const { error } = await supabase
        .from('orders')
        .update({ 
            current_status: newStatus,
            history: newHistory
        })
        .eq('id', orderId);

    if (error) {
        alert('Erro ao atualizar: ' + error.message);
    } else {
        fetchOrders(); // Recarrega dados
    }
  };

  // 6. Deletar no Banco
  const handleDeleteOrder = async (id: string) => {
    if (confirm('Tem certeza?')) {
        const { error } = await supabase.from('orders').delete().eq('id', id);
        if (error) alert('Erro ao deletar');
        else fetchOrders();
    }
  }

  // Utilitários
  const copyLink = (id: string) => {
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/login?id=${id}`;
      navigator.clipboard.writeText(link);
      alert(`Link copiado!\n${link}`);
  };

  const formatCPF = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  }

  // --- RENDERIZAÇÃO (LOGIN) ---
  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Acesso Gerencial</h2>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" className="w-full border border-gray-300 rounded-md p-3 mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" className="w-full border border-gray-300 rounded-md p-3 mt-1" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900">Entrar</button>
                    <Link href="/" className="block text-center text-sm text-blue-600 mt-4">Voltar para o Início</Link>
                </form>
            </div>
        </div>
      );
  }

  // --- RENDERIZAÇÃO (DASHBOARD) ---
  // A estrutura visual é idêntica à anterior, só mudamos os nomes das variáveis que vêm do banco
  // O Supabase retorna customer_name (snake_case), precisamos garantir que o Admin exiba certo.
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Painel de Produção</h1>
          <div className="flex gap-2">
            <button onClick={logout} className="px-4 py-2 text-red-600 border border-red-200 rounded">Sair</button>
            <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded shadow">+ Novo Pedido</button>
          </div>
        </div>

        {orders.length === 0 ? <div className="text-center py-10 bg-white rounded shadow">Nenhum pedido encontrado.</div> : (
          <div className="grid gap-4 md:grid-cols-1">
             {/* Renderização Simplificada para facilitar a cópia - serve para Desktop e Mobile */}
             {orders.map((order: any) => (
                <div key={order.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-lg">{order.customer_name}</h3> {/* Note: customer_name do banco */}
                        <p className="text-sm text-gray-500">ID: {order.id} • CPF: {order.cpf}</p>
                        <button onClick={() => copyLink(order.id)} className="text-xs text-blue-600 font-bold mt-1 block">🔗 Copiar Link</button>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto">
                         <span className={`px-2 py-1 text-xs font-bold rounded-full whitespace-nowrap ${order.current_status === 'Óculos entregue' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {order.current_status}
                         </span>
                         <select 
                            className="border p-2 rounded text-sm w-full md:w-auto" 
                            value={order.current_status}
                            onChange={(e) => updateStatus(order.id, e.target.value as StatusType)}
                         >
                            {STATUS_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                         <button onClick={() => handleDeleteOrder(order.id)} className="text-red-500 p-2">🗑️</button>
                    </div>
                </div>
             ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="font-bold text-lg mb-4">Novo Pedido</h3>
                <form onSubmit={handleCreateOrder} className="space-y-4">
                    <input type="text" placeholder="Nome" className="w-full border p-2 rounded" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} required />
                    <input type="text" placeholder="CPF" className="w-full border p-2 rounded" value={newCpf} onChange={e => setNewCpf(formatCPF(e.target.value))} maxLength={14} required />
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border p-2 rounded">Cancelar</button>
                        <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">Criar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}