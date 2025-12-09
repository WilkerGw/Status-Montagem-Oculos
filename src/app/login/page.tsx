// src/app/login/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase"; // Banco Real
import Link from "next/link";
import Image from "next/image";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlId = searchParams.get("id") || "";

  const [orderId, setOrderId] = useState(urlId);
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlId) setOrderId(urlId);
  }, [urlId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Formatar CPF digitado para garantir comparação correta
    const cleanInputCpf = cpf
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");

    // Busca no Supabase (Filtrando por ID e CPF)
    const { data, error } = await supabase
      .from("orders")
      .select("id")
      .eq("id", orderId)
      .eq("cpf", cleanInputCpf)
      .single(); // Retorna apenas um

    if (error || !data) {
      setError("Dados incorretos. Verifique ID e CPF.");
      setLoading(false);
    } else {
      router.push(`/acompanhamento?id=${orderId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Rastrear Pedido
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Número do Pedido
            </label>
            <input
              type="text"
              className="w-full border p-3 rounded"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">CPF</label>
            <input
              type="text"
              className="w-full border p-3 rounded"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            disabled={loading}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900"
          >
            {loading ? "Verificando..." : "Rastrear"}
          </button>
        </form>
        
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
