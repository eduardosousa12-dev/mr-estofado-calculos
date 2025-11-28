import { PresetEstofado } from '../types';

export const PRESETS_ESTOFADOS: PresetEstofado[] = [
  {
    tipo: 'sofa-2-lugares',
    nome: 'Sofá 2 lugares',
    dimensoes: { largura: 150, comprimento: 90, profundidade: 80 },
  },
  {
    tipo: 'sofa-3-lugares',
    nome: 'Sofá 3 lugares',
    dimensoes: { largura: 200, comprimento: 90, profundidade: 80 },
  },
  {
    tipo: 'colchao-solteiro',
    nome: 'Colchão Solteiro',
    dimensoes: { largura: 190, comprimento: 90, profundidade: 25 },
  },
  {
    tipo: 'colchao-casal',
    nome: 'Colchão Casal',
    dimensoes: { largura: 190, comprimento: 140, profundidade: 25 },
  },
  {
    tipo: 'colchao-queen',
    nome: 'Colchão Queen',
    dimensoes: { largura: 200, comprimento: 160, profundidade: 30 },
  },
  {
    tipo: 'colchao-king',
    nome: 'Colchão King',
    dimensoes: { largura: 200, comprimento: 190, profundidade: 30 },
  },
  {
    tipo: 'poltrona',
    nome: 'Poltrona',
    dimensoes: { largura: 80, comprimento: 80, profundidade: 90 },
  },
  {
    tipo: 'cadeira-estofada',
    nome: 'Cadeira Estofada',
    dimensoes: { largura: 50, comprimento: 50, profundidade: 80 },
  },
  {
    tipo: 'puff',
    nome: 'Puff',
    dimensoes: { largura: 60, comprimento: 60, profundidade: 40 },
  },
];

export const TIPOS_ESTOFADO_LABELS: Record<string, string> = {
  'sofa-2-lugares': 'Sofá 2 lugares',
  'sofa-3-lugares': 'Sofá 3 lugares',
  'sofa-l': 'Sofá L',
  'sofa-retratil': 'Sofá Retrátil',
  'colchao-solteiro': 'Colchão Solteiro',
  'colchao-casal': 'Colchão Casal',
  'colchao-queen': 'Colchão Queen',
  'colchao-king': 'Colchão King',
  'poltrona': 'Poltrona',
  'cadeira-estofada': 'Cadeira Estofada',
  'puff': 'Puff',
  'cabeceira': 'Cabeceira',
  'banco-carro': 'Banco de Carro',
  'outro': 'Outro',
};

export const NIVEL_SUJIDADE_LABELS: Record<string, string> = {
  leve: 'Leve',
  moderado: 'Moderado',
  pesado: 'Pesado',
  extremo: 'Extremo',
};

