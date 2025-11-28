import { Servico } from '../types';
import { carregarProdutos, carregarHistorico } from '../services/storage';

/**
 * Calcula o custo dos produtos baseado em um cálculo realizado
 */
export function calcularCustoProdutos(calculoId: string): number {
  const historico = carregarHistorico();
  const produtos = carregarProdutos();
  
  const calculo = historico.find(c => c.id === calculoId);
  if (!calculo) return 0;

  let custoTotal = 0;

  calculo.resultadosProdutos.forEach(resultadoProduto => {
    const produto = produtos.find(p => p.id === resultadoProduto.produtoId);
    if (!produto) return;

    // Converter quantidade de produto para a unidade de medida do produto
    let quantidadeNaUnidade = resultadoProduto.quantidadeProduto;
    
    if (produto.unidadeMedida === 'litros') {
      // Se o produto é vendido por litro, converter ml para litros
      quantidadeNaUnidade = resultadoProduto.quantidadeProduto / 1000;
    }

    // Calcular custo: quantidade × custo por unidade
    const custoProduto = quantidadeNaUnidade * produto.custoPorUnidade;
    custoTotal += custoProduto;
  });

  return Math.round(custoTotal * 100) / 100; // 2 casas decimais
}

/**
 * Calcula o lucro de um serviço
 */
export function calcularLucro(servico: Servico): number {
  const custoTotal = servico.custoProdutos + (servico.custoMaoDeObra || 0);
  const receita = servico.precoVenda || 0;
  return receita - custoTotal;
}

