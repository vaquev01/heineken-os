/**
 * REAL SIMULADOR DATA - from SIMULADOR DE PROPOSTA ASSAÍ Outubro'25.xlsx
 */

export interface Fabrica {
  fabrica: string;
  ordemVendas: number | string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadualSt: number | string;
  endereco: string;
  numero: number | string;
  bairro: string;
  cep: number | string;
  cidade: string;
}

export const FABRICAS: Fabrica[] = [
  {
    "fabrica": "Itu",
    "ordemVendas": 5000,
    "razaoSocial": "HNK BR INDUSTRIA DE BEBIDAS LTDA.",
    "cnpj": "50.221.019/0001-36",
    "inscricaoEstadualSt": 387000650117,
    "endereco": "Av Primo Schincariol",
    "numero": 2222,
    "bairro": "Chácara Flórida",
    "cep": 13312250,
    "cidade": "Itu "
  },
  {
    "fabrica": "Jacarei",
    "ordemVendas": 5238,
    "razaoSocial": "HNK BR INDUSTRIA DE BEBIDAS LTDA.",
    "cnpj": "50.221.019/0104-41",
    "inscricaoEstadualSt": 392558326113,
    "endereco": "Av Presidente Humberto de Alencar Castelo Branco",
    "numero": 2911,
    "bairro": "Conjunto Habitacional Marinho",
    "cep": 12321150,
    "cidade": "Jacareí"
  },
  {
    "fabrica": "Araraquara",
    "ordemVendas": 5239,
    "razaoSocial": "HNK BR INDUSTRIA DE BEBIDAS LTDA.",
    "cnpj": "50.221.019/0105-22",
    "inscricaoEstadualSt": 181661963118,
    "endereco": "Av Marginal 01",
    "numero": 701,
    "bairro": "Chácara Catani",
    "cep": 14808080,
    "cidade": "Araraquara"
  },
  {
    "fabrica": "Ponta Grossa",
    "ordemVendas": 5231,
    "razaoSocial": "HNK BR INDUSTRIA DE BEBIDAS LTDA.",
    "cnpj": "50.221.019/0097-88",
    "inscricaoEstadualSt": "911.300.50.81",
    "endereco": "Av Tocantins",
    "numero": 199,
    "bairro": "Cara-Cara",
    "cep": 84043610,
    "cidade": "Ponta Grossa"
  }
];

// Investment summary
export const INVESTIMENTOS = [
  {
    "PRODUTO": "CERVEJA AMSTEL LN 355ML ",
    "Total Investimento Liberado": 0.25,
    "Investimento solicitado pelo Assaí": 0.8
  },
  {
    "PRODUTO": "CERVEJA HEINEKEN 269ML",
    "Total Investimento Liberado": 0.18,
    "Investimento solicitado pelo Assaí": 0.4
  }
];

// Cliente info
export const CLIENTE_ASSAI = {
  nome: "ASSAÍ",
  periodo: "Outubro 2025",
  totalProposta: 64 // rows
};
