// Banco de dados de produtos com códigos EAN-13
// Formato: EAN-13 (13 dígitos) → Produto com informações sustentáveis

export interface Product {
  ean: string; // EAN-13 ou código curto enviado pelo teclado do ESP32 no protótipo
  name: string;
  category: string;
  bin: 'azul' | 'vermelho' | 'verde' | 'amarelo' | 'laranja' | 'marrom' | 'roxo' | 'preto';
  description: string;
  disposalInstructions: string[];
  decompositionTime: string;
  environmental: {
    co2Saved: number; // kg de CO2 evitado ao reciclar
    waterSaved: number; // litros de água economizada
    energySaved: number; // kWh de energia poupada
    treesSaved: number; // árvores salvas (em fração)
  };
  recyclable: boolean;
  tips: string[];
}

export const products: Product[] = [
  // DEMO PRODUCT
  {
    ean: '1234561234567',
    name: 'Garrafa PET 2L',
    category: 'Plástico',
    bin: 'vermelho',
    description: 'Garrafa de plástico PET transparente para bebidas',
    disposalInstructions: [
      'Remova o rótulo e a tampa',
      'Enxague a garrafa com água',
      'Amasse a garrafa para economizar espaço',
      'Coloque na lixeira vermelha (plástico)',
    ],
    decompositionTime: '400 a 500 anos',
    environmental: {
      co2Saved: 2.5, // kg
      waterSaved: 7, // litros
      energySaved: 0.3, // kWh
      treesSaved: 0.02, // árvores
    },
    recyclable: true,
    tips: [
      'Plástico PET é um dos mais recicláveis',
      'Pode ser transformado em camisetas, mochilas e até fibra de carpete',
      'Reciclar 1 garrafa economiza energia equivalente a 3 horas de TV',
    ],
  },

  {
    ean: '123456',
    name: 'Caneta esferográfica',
    category: 'Plástico e uso escolar',
    bin: 'preto',
    description: 'Caneta esferográfica de materiais mistos, com corpo plástico e componentes metálicos.',
    disposalInstructions: [
      'Separe a tampa, o tubo de tinta e outras partes quando possível',
      'Não coloque a caneta inteira na coleta comum de plástico, pois ela combina materiais diferentes',
      'Encaminhe para um ponto de coleta de instrumentos de escrita ou programa especializado',
      'Se não houver coleta especializada na sua região, descarte como não reciclável conforme a orientação local',
    ],
    decompositionTime: 'Cerca de 400 anos para os componentes plásticos',
    environmental: {
      co2Saved: 0.02,
      waterSaved: 0.5,
      energySaved: 0.01,
      treesSaved: 0.0001,
    },
    recyclable: false,
    tips: [
      'Prefira canetas recarregáveis para reduzir o descarte de corpos plásticos',
      'Guarde várias canetas usadas e procure campanhas de coleta de instrumentos de escrita',
      'Os valores de impacto são estimativas educativas do protótipo, não uma medição do produto específico',
    ],
  },

  // ADICIONE MAIS PRODUTOS AQUI COM SEUS CÓDIGOS EAN-13
  // Exemplo:
  // {
  //   ean: '1234567890123',
  //   name: 'Lata de Refrigerante 350ml',
  //   category: 'Metal',
  //   bin: 'amarelo',
  //   ...
  // }
];

// Função para buscar produto por EAN-13
export function findProductByEAN(ean: string): Product | undefined {
  // O ESP32 pode enviar um código curto no protótipo; leitores comerciais usam EAN-13.
  const normalizedCode = ean.trim();
  if (!/^\d{6,13}$/.test(normalizedCode)) {
    return undefined;
  }
  return products.find((p) => p.ean === normalizedCode);
}

// Função para calcular impacto ambiental de múltiplos produtos
export function calculateEnvironmentalImpact(productEans: string[]) {
  let totalCO2 = 0;
  let totalWater = 0;
  let totalEnergy = 0;
  let totalTrees = 0;

  productEans.forEach((ean) => {
    const product = findProductByEAN(ean);
    if (product) {
      totalCO2 += product.environmental.co2Saved;
      totalWater += product.environmental.waterSaved;
      totalEnergy += product.environmental.energySaved;
      totalTrees += product.environmental.treesSaved;
    }
  });

  return {
    co2Saved: Math.round(totalCO2 * 100) / 100,
    waterSaved: Math.round(totalWater * 100) / 100,
    energySaved: Math.round(totalEnergy * 100) / 100,
    treesSaved: Math.round(totalTrees * 100) / 100,
  };
}

// Função para gerar conquistas baseado no histórico
export function generateAchievements(recycledCount: number, activeDays: number) {
  const achievements = [];

  if (recycledCount >= 1) achievements.push({ id: 'first', name: 'Primeiro Passo', icon: '🌱' });
  if (recycledCount >= 10) achievements.push({ id: 'ten', name: 'Reciclador Iniciante', icon: '♻️' });
  if (recycledCount >= 50) achievements.push({ id: 'fifty', name: 'Eco Guerreiro', icon: '🌍' });
  if (recycledCount >= 100) achievements.push({ id: 'hundred', name: 'Campeão da Reciclagem', icon: '🏆' });
  if (activeDays >= 7) achievements.push({ id: 'week', name: 'Semana Ativa', icon: '📅' });
  if (activeDays >= 30) achievements.push({ id: 'month', name: 'Mês Consistente', icon: '⭐' });

  return achievements;
}
