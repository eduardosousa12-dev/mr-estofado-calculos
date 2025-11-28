import { DimensoesEstofado, TipoEstofado, NivelSujidade, Produto, ResultadoProduto, ResultadoCalculo, CalculoInput } from '../types';
import { FATOR_AGUA_POR_M2 } from '../constants/fatores';

/**
 * Calcula a área total do estofado em m²
 * 
 * Dimensões:
 * - largura: largura do estofado (cm)
 * - comprimento: comprimento do estofado (cm) - para colchões é o comprimento, para sofás é a profundidade do assento
 * - profundidade: altura/profundidade (cm) - para colchões é a altura, para sofás é a altura do encosto
 * 
 * Fórmulas validadas:
 * - Colchões: Área = (topo) + (laterais comprimento) + (laterais largura)
 *   = (largura × comprimento) + 2 × (comprimento × altura) + 2 × (largura × altura)
 * 
 * - Sofás/Poltronas: Área = (assento) + (encosto) + (laterais)
 *   = (largura × profundidade_assento) + (largura × altura_encosto) + 2 × (profundidade_assento × altura_encosto)
 *   Onde: comprimento = profundidade do assento, profundidade = altura do encosto
 */
export function calcularArea(
  dimensoes: DimensoesEstofado,
  tipoEstofado: TipoEstofado
): number {
  const { largura, comprimento, profundidade } = dimensoes;
  
  // Converter cm para m
  const l = largura / 100;        // Largura em metros
  const c = comprimento / 100;    // Comprimento (colchões) ou Profundidade do assento (sofás) em metros
  const h = profundidade / 100;  // Altura em metros (altura do colchão ou altura do encosto do sofá)

  // Colchões: topo + laterais
  if (tipoEstofado.startsWith('colchao')) {
    // Área = topo + 2 laterais (comprimento) + 2 laterais (largura)
    // Topo: largura × comprimento
    // Laterais comprimento: 2 × (comprimento × altura)
    // Laterais largura: 2 × (largura × altura)
    const areaTopo = l * c;
    const areaLateraisComprimento = 2 * (c * h);
    const areaLateraisLargura = 2 * (l * h);
    return areaTopo + areaLateraisComprimento + areaLateraisLargura;
  }

  // Sofás, poltronas e outros: assento + encosto + laterais
  // Assento: largura × profundidade (comprimento)
  // Encosto: largura × altura (profundidade)
  // Laterais: 2 × (profundidade × altura)
  const areaAssento = l * c;           // Largura × Profundidade do assento
  const areaEncosto = l * h;           // Largura × Altura do encosto
  const areaLaterais = 2 * (c * h);    // 2 × (Profundidade × Altura)
  return areaAssento + areaEncosto + areaLaterais;
}

/**
 * Calcula a quantidade de água necessária em litros (fixa baseada na área)
 * A água não varia com o nível de sujidade - só o produto varia
 */
export function calcularQuantidadeAgua(area: number): number {
  return area * FATOR_AGUA_POR_M2;
}

/**
 * Calcula a diluição de um produto específico
 *
 * A proporção "1:X" significa: para cada 1 parte de produto, usa X partes de água
 * Exemplo: 1:10 com 1000ml de água = 100ml de produto (1000 ÷ 10)
 *
 * A ÁGUA é fixa baseada na área (ou no rendimentoPorM2 se definido)
 * O PRODUTO varia conforme a diluição
 */
export function calcularDiluicaoProduto(
  produto: Produto,
  quantidadeAguaPadrao: number,
  nivelSujidade: NivelSujidade,
  area: number
): ResultadoProduto | null {
  // Encontrar a diluição para o nível de sujidade
  const diluicao = produto.diluicoes.find(d => d.nivel === nivelSujidade);

  if (!diluicao) {
    return null;
  }

  // Parse da proporção (ex: "1:20")
  // O segundo número é o fator de diluição
  const partes = diluicao.proporcao.split(':').map(Number);
  const fatorDiluicao = partes[1] || partes[0]; // Usa o segundo número, ou o primeiro se só tiver um

  // Determinar a quantidade de ÁGUA (fixa baseada na área):
  // - Se o produto tiver rendimentoPorM2, usa: área × rendimentoPorM2 (em ml)
  // - Caso contrário, usa o cálculo padrão baseado na área
  let quantidadeAguaMl: number;
  if (produto.rendimentoPorM2 && produto.rendimentoPorM2 > 0) {
    quantidadeAguaMl = area * produto.rendimentoPorM2;
  } else {
    quantidadeAguaMl = quantidadeAguaPadrao * 1000;
  }

  // Calcular quantidade de produto: água ÷ fator de diluição
  // Exemplo: 1000ml de água com diluição 1:10 = 100ml de produto
  const quantidadeProduto = quantidadeAguaMl / fatorDiluicao;

  return {
    produtoId: produto.id,
    produtoNome: produto.nome,
    quantidadeProduto: Math.round(quantidadeProduto * 100) / 100, // 2 casas decimais
    quantidadeAgua: Math.round(quantidadeAguaMl * 100) / 100,
    proporcao: diluicao.proporcao,
  };
}

/**
 * Calcula o resultado completo do cálculo
 */
export function calcularResultado(
  input: CalculoInput,
  produtos: Produto[]
): ResultadoCalculo {
  const area = calcularArea(input.dimensoes, input.tipoEstofado);
  const quantidadeAgua = calcularQuantidadeAgua(area);

  // Calcular para cada produto selecionado
  const resultadosProdutos: ResultadoProduto[] = input.produtosSelecionados
    .map(produtoId => {
      const produto = produtos.find(p => p.id === produtoId);
      if (!produto) return null;
      return calcularDiluicaoProduto(produto, quantidadeAgua, input.nivelSujidade, area);
    })
    .filter((r): r is ResultadoProduto => r !== null);

  // Tempo estimado: ~5 minutos por m² (opcional)
  const tempoEstimado = Math.ceil(area * 5);

  return {
    id: crypto.randomUUID(),
    input,
    areaTotal: Math.round(area * 100) / 100,
    quantidadeSolucao: Math.round(quantidadeAgua * 100) / 100,
    resultadosProdutos,
    tempoEstimado,
    createdAt: new Date().toISOString(),
  };
}

