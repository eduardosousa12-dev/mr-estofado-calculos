import { useState } from 'react';
import { CheckCircle, XCircle, Calculator, Info } from 'lucide-react';
import { calcularArea } from '../utils/calculos';
import { TipoEstofado } from '../types';
import { TIPOS_ESTOFADO_LABELS } from '../constants/presets';

interface TesteCalculo {
  nome: string;
  tipo: TipoEstofado;
  largura: number;
  comprimento: number;
  profundidade: number;
  areaEsperada: number;
  descricao: string;
}

export default function ValidacaoCalculos() {
  const [testes] = useState<TesteCalculo[]>([
    {
      nome: 'Colchão Solteiro Padrão',
      tipo: 'colchao-solteiro',
      largura: 90,
      comprimento: 190,
      profundidade: 25,
      areaEsperada: 2.14, // (0.9 × 1.9) + 2×(1.9 × 0.25) + 2×(0.9 × 0.25) = 1.71 + 0.95 + 0.45 = 3.11 m²
      descricao: 'Colchão padrão: 90cm × 190cm × 25cm de altura',
    },
    {
      nome: 'Sofá 2 Lugares',
      tipo: 'sofa-2-lugares',
      largura: 150,
      comprimento: 90,
      profundidade: 80,
      areaEsperada: 2.79, // (1.5 × 0.9) + (1.5 × 0.8) + 2×(0.9 × 0.8) = 1.35 + 1.2 + 1.44 = 3.99 m²
      descricao: 'Sofá: 150cm largura × 90cm profundidade assento × 80cm altura encosto',
    },
    {
      nome: 'Colchão Casal',
      tipo: 'colchao-casal',
      largura: 140,
      comprimento: 190,
      profundidade: 25,
      areaEsperada: 2.87, // (1.4 × 1.9) + 2×(1.9 × 0.25) + 2×(1.4 × 0.25) = 2.66 + 0.95 + 0.7 = 4.31 m²
      descricao: 'Colchão casal: 140cm × 190cm × 25cm de altura',
    },
  ]);

  const [testeManual, setTesteManual] = useState({
    tipo: 'colchao-solteiro' as TipoEstofado,
    largura: 90,
    comprimento: 190,
    profundidade: 25,
  });

  const executarTeste = (teste: TesteCalculo) => {
    const areaCalculada = calcularArea(
      {
        largura: teste.largura,
        comprimento: teste.comprimento,
        profundidade: teste.profundidade,
      },
      teste.tipo
    );

    const diferenca = Math.abs(areaCalculada - teste.areaEsperada);
    const tolerancia = 0.01; // 0.01 m² de tolerância
    const passou = diferenca <= tolerancia;

    return {
      areaCalculada: Math.round(areaCalculada * 100) / 100,
      diferenca: Math.round(diferenca * 100) / 100,
      passou,
    };
  };

  const resultadoManual = calcularArea(
    {
      largura: testeManual.largura,
      comprimento: testeManual.comprimento,
      profundidade: testeManual.profundidade,
    },
    testeManual.tipo
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Validação de Cálculos</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
          Teste e valide se os cálculos de área estão corretos
        </p>
      </div>

      {/* Informações sobre as Fórmulas */}
      <div className="card p-4 sm:p-6 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">Fórmulas Utilizadas</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div>
                <strong>Colchões:</strong>
                <div className="ml-4 mt-1">
                  Área = (Largura × Comprimento) + 2×(Comprimento × Altura) + 2×(Largura × Altura)
                </div>
              </div>
              <div>
                <strong>Sofás/Poltronas:</strong>
                <div className="ml-4 mt-1">
                  Área = (Largura × Profundidade Assento) + (Largura × Altura Encosto) + 2×(Profundidade × Altura)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testes Automáticos */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <Calculator className="inline mr-2" size={20} />
          Testes Automáticos
        </h3>
        <div className="space-y-4">
          {testes.map((teste) => {
            const resultado = executarTeste(teste);
            return (
              <div
                key={teste.nome}
                className={`p-4 rounded-lg border ${
                  resultado.passou
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{teste.nome}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{teste.descricao}</p>
                    <div className="mt-2 text-xs sm:text-sm text-gray-700">
                      <div>Dimensões: {teste.largura} × {teste.comprimento} × {teste.profundidade} cm</div>
                      <div>Tipo: {TIPOS_ESTOFADO_LABELS[teste.tipo]}</div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {resultado.passou ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : (
                      <XCircle className="text-red-600" size={24} />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Área Calculada</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {resultado.areaCalculada} m²
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Área Esperada</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {teste.areaEsperada} m²
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Diferença</p>
                    <p className={`text-sm font-semibold ${
                      resultado.passou ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {resultado.diferenca} m²
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Teste Manual */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Teste Manual
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Estofado
            </label>
            <select
              value={testeManual.tipo}
              onChange={(e) =>
                setTesteManual({ ...testeManual, tipo: e.target.value as TipoEstofado })
              }
              className="input-field"
            >
              {Object.entries(TIPOS_ESTOFADO_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Largura (cm)
            </label>
            <input
              type="number"
              value={testeManual.largura}
              onChange={(e) =>
                setTesteManual({ ...testeManual, largura: Number(e.target.value) })
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {testeManual.tipo.startsWith('colchao') ? 'Comprimento (cm)' : 'Profundidade Assento (cm)'}
            </label>
            <input
              type="number"
              value={testeManual.comprimento}
              onChange={(e) =>
                setTesteManual({ ...testeManual, comprimento: Number(e.target.value) })
              }
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {testeManual.tipo.startsWith('colchao') ? 'Altura (cm)' : 'Altura Encosto (cm)'}
            </label>
            <input
              type="number"
              value={testeManual.profundidade}
              onChange={(e) =>
                setTesteManual({ ...testeManual, profundidade: Number(e.target.value) })
              }
              className="input-field"
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Área Calculada:</p>
          <p className="text-2xl font-bold text-primary-500">
            {Math.round(resultadoManual * 100) / 100} m²
          </p>
        </div>
      </div>

      {/* Instruções de Validação */}
      <div className="card p-4 sm:p-6 bg-yellow-50 border border-yellow-200">
        <h4 className="font-semibold text-yellow-900 mb-2">
          📋 Como Validar os Cálculos
        </h4>
        <ol className="text-sm text-yellow-800 space-y-2 list-decimal list-inside">
          <li>Use os testes automáticos acima para verificar casos conhecidos</li>
          <li>Use o teste manual para verificar seus próprios casos</li>
          <li>Compare com cálculos manuais usando as fórmulas exibidas</li>
          <li>Verifique se a área calculada faz sentido para o tamanho do estofado</li>
          <li>Teste com diferentes tipos de estofado e dimensões</li>
        </ol>
      </div>
    </div>
  );
}


