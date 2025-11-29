# Mr Estofado Cálculos

Aplicação web para empresas de higienização de estofados calcularem automaticamente a quantidade de produtos químicos necessários, considerando dimensões do estofado, tipo de peça e nível de sujidade.

## 🚀 Funcionalidades

### MVP (Versão Inicial)

- ✅ Cadastro de produtos químicos com tabelas de diluição
- ✅ Calculadora automática de diluição baseada em dimensões
- ✅ Presets de estofados comuns (sofás, colchões, etc.)
- ✅ Histórico de cálculos realizados
- ✅ Interface responsiva e mobile-first
- ✅ Armazenamento local (localStorage)

## 🛠️ Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **React Router** - Roteamento
- **Lucide React** - Ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📱 Como Usar

### 1. Cadastrar Produtos

1. Acesse a página **Produtos**
2. Clique em **Novo Produto**
3. Preencha:
   - Nome do produto
   - Fabricante (opcional)
   - Tabela de diluição para cada nível de sujidade (formato: `1:20`)
   - Tipos de estofado compatíveis
   - Observações (opcional)

### 2. Realizar Cálculo

1. Acesse a página **Calculadora**
2. Selecione um preset rápido ou informe manualmente:
   - Tipo de estofado
   - Dimensões (largura, comprimento, profundidade)
   - Nível de sujidade
3. Selecione os produtos a utilizar
4. Clique em **Calcular**

### 3. Visualizar Resultado

O resultado mostra:
- Área total em m²
- Quantidade total de solução necessária
- Para cada produto:
  - Quantidade de produto concentrado
  - Quantidade de água
  - Proporção utilizada

### 4. Salvar no Histórico

No resultado, clique em **Salvar** para armazenar o cálculo no histórico.

## 🧮 Lógica de Cálculo

### Área do Estofado

**Para sofás e poltronas:**
```
Área = (Largura × Profundidade) + (2 × Altura × Profundidade) + (Largura × Altura)
```

**Para colchões:**
```
Área = (Largura × Comprimento) + (2 × Comprimento × Altura) + (2 × Largura × Altura)
```

### Quantidade de Solução

```
Litros de solução = Área (m²) × Fator de consumo
```

**Fatores de consumo:**
- Leve: 0,3 L/m²
- Moderado: 0,4 L/m²
- Pesado: 0,5 L/m²
- Extremo: 0,6 L/m²

### Diluição

Se a diluição cadastrada é `1:20` (1 parte produto para 20 partes água):
```
Produto (ml) = Litros de solução × 1000 / 21
Água (ml) = Litros de solução × 1000 - Produto (ml)
```

## 📋 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Layout.tsx
│   └── ModalProduto.tsx
├── constants/        # Constantes e presets
│   ├── presets.ts
│   └── fatores.ts
├── pages/            # Páginas da aplicação
│   ├── Dashboard.tsx
│   ├── Calculadora.tsx
│   ├── Resultado.tsx
│   ├── Produtos.tsx
│   └── Historico.tsx
├── services/         # Serviços (storage, API, etc.)
│   └── storage.ts
├── types/            # Tipos TypeScript
│   └── index.ts
├── utils/            # Funções utilitárias
│   └── calculos.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🔮 Próximas Funcionalidades (V2)

- Sistema de login e sincronização na nuvem
- Cadastro de clientes
- Geração de orçamentos em PDF
- Relatórios de consumo mensal
- Integração com estoque
- Modo offline (PWA)

## 📄 Licença

Este projeto é privado e de uso interno.


