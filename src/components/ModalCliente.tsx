import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Cliente } from '../types';

interface ModalClienteProps {
  cliente: Cliente | null;
  onSalvar: (cliente: Cliente) => void;
  onFechar: () => void;
}

export default function ModalCliente({ cliente, onSalvar, onFechar }: ModalClienteProps) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [email, setEmail] = useState('');
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome);
      setTelefone(cliente.telefone || '');
      setEndereco(cliente.endereco || '');
      setEmail(cliente.email || '');
      setObservacoes(cliente.observacoes || '');
    } else {
      setNome('');
      setTelefone('');
      setEndereco('');
      setEmail('');
      setObservacoes('');
    }
  }, [cliente]);

  const handleSalvar = () => {
    if (!nome.trim()) {
      alert('Informe o nome do cliente');
      return;
    }

    const novoCliente: Cliente = {
      id: cliente?.id || crypto.randomUUID(),
      nome: nome.trim(),
      telefone: telefone.trim() || undefined,
      endereco: endereco.trim() || undefined,
      email: email.trim() || undefined,
      observacoes: observacoes.trim() || undefined,
      servicos: cliente?.servicos || [],
      createdAt: cliente?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSalvar(novoCliente);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            {cliente ? 'Editar Cliente' : 'Novo Cliente'}
          </h3>
          <button
            onClick={onFechar}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors text-gray-600 dark:text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Cliente *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="input-field"
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="input-field"
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="cliente@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Endereço
            </label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="input-field"
              placeholder="Rua, número, bairro..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Observações sobre o cliente..."
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex justify-end gap-3">
          <button onClick={onFechar} className="btn-secondary">
            Cancelar
          </button>
          <button onClick={handleSalvar} className="btn-primary">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

