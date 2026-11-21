export const TIPOS_RENDA_FIXA = new Set([
  "RENDA_FIXA",
  "TESOURO_PREFIXADO",
  "TESOURO_SELIC",
  "TESOURO_IPCA",
]);

export function calcularPosicao(operacoes) {
  let quantidade = 0;
  let custo = 0;
  let resultadoRealizado = 0;

  for (const operacao of operacoes) {
    const unidades = Number(operacao.quantidade);
    const preco = Number(operacao.preco_unitario);
    const cambio = Number(operacao.cambio_brl);
    const custos = Number(operacao.custos);
    const valorEmReais = unidades * preco * cambio;

    if (["COMPRA", "APORTE"].includes(operacao.tipo)) {
      quantidade += unidades;
      custo += valorEmReais + custos;
    } else {
      if (quantidade <= 0) continue;
      const unidadesVendidas = Math.min(unidades, quantidade);
      const custoMedio = custo / quantidade;
      resultadoRealizado += valorEmReais - custos - custoMedio * unidadesVendidas;
      custo -= custoMedio * unidadesVendidas;
      quantidade -= unidadesVendidas;
    }
  }

  return {
    quantidade: Math.max(0, quantidade),
    custo: Math.max(0, custo),
    resultadoRealizado,
  };
}
