// services/quote.service.ts
// EcoVert Mada - Service de génération de devis intelligent

import prisma from "../config/prisma";
import { EnergyType, QuoteStatus } from "@prisma/client";

// ============================================================
// FOURCHETTES DE PRIX MINIMUMS PAR TYPE D'ÉNERGIE (en Ariary)
// ============================================================

export const ENERGY_PRICE_FLOORS: Record<EnergyType, { min: number; label: string; description: string }> = {
  SOLAR: {
    min: 500_000,
    label: "Énergie Solaire",
    description: "Panneaux photovoltaïques pour conversion directe du soleil en électricité"
  },
  WIND: {
    min: 1_000_000,
    label: "Énergie Éolienne",
    description: "Éoliennes pour zones venteuses (côtes, hauts plateaux)"
  },
  HYBRID: {
    min: 1_500_000,
    label: "Système Hybride Solaire + Éolien",
    description: "Combinaison panneaux solaires et éolienne pour une autonomie maximale"
  },
  HYDRO: {
    min: 2_000_000,
    label: "Hydro-électricité",
    description: "Micro-centrale hydraulique pour zones avec cours d'eau"
  },
  BIOMASS: {
    min: 800_000,
    label: "Biomasse / Biogaz",
    description: "Production d'énergie à partir de déchets organiques ou agricoles"
  }
};

// Catégories de produits par type d'énergie
const ENERGY_PRODUCT_CATEGORIES: Record<EnergyType, string[]> = {
  SOLAR: ["Solar", "Solar Kit", "Battery", "Inverter", "Accessories"],
  WIND: ["Battery", "Inverter", "Accessories"],
  HYBRID: ["Solar", "Battery", "Inverter", "Solar Kit", "Accessories"],
  HYDRO: ["Battery", "Inverter", "Accessories"],
  BIOMASS: ["Heating", "Accessories"]
};

export interface QuoteRequestInput {
  userId: string;
  energyType: EnergyType;
  usageDescription: string;
  location: string;
  monthlyBudget?: number;
  surfaceArea?: number;
  dailyConsumption?: number;
  numberOfPeople?: number;
  hasExistingSystem?: boolean;
  additionalNotes?: string;
}

// ============================================================
// CALCUL DE LA FOURCHETTE DE PRIX
// ============================================================

function calculatePriceRange(
  energyType: EnergyType,
  numberOfPeople: number = 3,
  dailyConsumption: number = 0,
  surfaceArea: number = 0
): { min: number; max: number; recommendedPower: number } {
  const floor = ENERGY_PRICE_FLOORS[energyType].min;

  // Puissance recommandée estimée en kW
  let basePower = 1.0; // kW par défaut
  if (dailyConsumption > 0) {
    // Calcul basé sur la consommation: consommation / (heures ensoleillement moy. Madagascar = 5h)
    basePower = dailyConsumption / 5000;
  } else if (numberOfPeople > 0) {
    // Estimation: 300-500 Wh par personne par jour
    basePower = (numberOfPeople * 400) / 5000;
  } else if (surfaceArea > 0) {
    // Estimation: 10W par m² en moyenne
    basePower = surfaceArea * 10 / 1000;
  }

  // Arrondir à 0.5 kW supérieur
  const recommendedPower = Math.max(0.5, Math.ceil(basePower * 2) / 2);

  // Facteur multiplicateur selon le type
  const multipliers: Record<EnergyType, { min: number; max: number }> = {
    SOLAR:   { min: 800_000,   max: 1_200_000 },  // par kW
    WIND:    { min: 1_200_000, max: 2_000_000 },
    HYBRID:  { min: 1_500_000, max: 2_500_000 },
    HYDRO:   { min: 2_000_000, max: 3_500_000 },
    BIOMASS: { min: 900_000,   max: 1_500_000 },
  };

  const m = multipliers[energyType];
  let estimatedMin = Math.max(floor, recommendedPower * m.min);
  let estimatedMax = recommendedPower * m.max;

  // Majoration si système neuf (pas de système existant)
  estimatedMin = Math.round(estimatedMin / 1000) * 1000;
  estimatedMax = Math.round(estimatedMax / 1000) * 1000;

  return { min: estimatedMin, max: estimatedMax, recommendedPower };
}

// ============================================================
// SÉLECTION DES PRODUITS RECOMMANDÉS
// ============================================================

async function selectRecommendedProducts(
  energyType: EnergyType,
  priceRange: { min: number; max: number; recommendedPower: number }
) {
  const categories = ENERGY_PRODUCT_CATEGORIES[energyType];

  const availableProducts = await prisma.product.findMany({
    where: {
      category: { in: categories },
      stock: { gt: 0 }
    },
    orderBy: { price: "asc" }
  });

  const recommended: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    reason: string;
  }> = [];

  let runningTotal = 0;
  const maxBudget = priceRange.max;

  // Priorité : panneaux solaires ou équipements principaux
  const mainProducts = availableProducts.filter(p =>
    ["Solar", "Solar Kit"].includes(p.category)
  );
  const supportProducts = availableProducts.filter(p =>
    ["Battery", "Inverter"].includes(p.category)
  );
  const accessories = availableProducts.filter(p =>
    ["Accessories", "Lighting", "Cooling", "Heating", "Agriculture"].includes(p.category)
  );

  // Ajouter kit principal
  if (mainProducts.length > 0) {
    const main = mainProducts[0];
    const qty = Math.min(
      Math.ceil(priceRange.recommendedPower / 0.3), // 300W par panneau
      Math.floor(maxBudget * 0.5 / main.price),
      main.stock
    );
    const q = Math.max(1, qty);
    if (runningTotal + main.price * q <= maxBudget) {
      recommended.push({
        productId: main.id,
        quantity: q,
        unitPrice: main.price,
        reason: `Équipement principal - ${q}x ${main.name} pour ${priceRange.recommendedPower} kW`
      });
      runningTotal += main.price * q;
    }
  }

  // Ajouter batterie si budget le permet
  if (supportProducts.length > 0) {
    for (const sp of supportProducts) {
      if (runningTotal + sp.price <= maxBudget) {
        recommended.push({
          productId: sp.id,
          quantity: 1,
          unitPrice: sp.price,
          reason: `Indispensable pour stockage/conversion de l'énergie - ${sp.name}`
        });
        runningTotal += sp.price;
      }
    }
  }

  // Ajouter accessoires dans le budget restant
  for (const acc of accessories) {
    if (runningTotal + acc.price <= maxBudget) {
      recommended.push({
        productId: acc.id,
        quantity: 1,
        unitPrice: acc.price,
        reason: `Accessoire recommandé - ${acc.name}`
      });
      runningTotal += acc.price;
    }
  }

  return recommended;
}

// ============================================================
// GÉNÉRATION DU TEXTE D'ANALYSE (sans IA externe)
// ============================================================

function generateAnalysisText(
  input: QuoteRequestInput,
  priceRange: { min: number; max: number; recommendedPower: number },
  recommendedItems: Array<{ productId: string; quantity: number; unitPrice: number; reason: string; }>
): string {
  const energyInfo = ENERGY_PRICE_FLOORS[input.energyType];
  const formatPrice = (n: number) => n.toLocaleString("fr-MG") + " Ar";

  const lines = [
    `## Analyse de votre demande de devis`,
    ``,
    `**Type d'énergie :** ${energyInfo.label}`,
    `${energyInfo.description}.`,
    ``,
    `### Vos besoins analysés`,
    `- **Localisation :** ${input.location}`,
    input.numberOfPeople ? `- **Nombre de personnes :** ${input.numberOfPeople}` : "",
    input.surfaceArea ? `- **Surface :** ${input.surfaceArea} m²` : "",
    input.dailyConsumption ? `- **Consommation journalière estimée :** ${input.dailyConsumption} Wh/jour` : "",
    input.hasExistingSystem ? `- **Système existant :** Oui (upgrade possible)` : `- **Installation neuve :** Oui`,
    ``,
    `### Recommandation technique`,
    `- **Puissance recommandée :** ${priceRange.recommendedPower} kW`,
    `- **Fourchette de prix :** ${formatPrice(priceRange.min)} – ${formatPrice(priceRange.max)}`,
    ``,
    `### Justification de la fourchette`,
    `Le prix minimum de ${formatPrice(ENERGY_PRICE_FLOORS[input.energyType].min)} correspond au seuil minimal `,
    `pour une installation ${energyInfo.label} fonctionnelle et conforme aux normes de qualité EcoVert Mada.`,
    `La fourchette haute intègre les coûts d'installation, de câblage, de protection et de maintenance initiale.`,
    ``,
    `### Produits inclus dans ce devis`,
    ...recommendedItems.map((item, i) => `${i + 1}. ${item.reason}`),
    ``,
    `### Notes importantes`,
    `- Ce devis est valable 30 jours à compter de la date de génération.`,
    `- Des ajustements peuvent être nécessaires après visite technique sur site.`,
    `- La garantie EcoVert Mada couvre les équipements pendant 2 ans.`,
    input.additionalNotes ? `\n**Notes spéciales :** ${input.additionalNotes}` : ""
  ];

  return lines.filter(l => l !== "").join("\n");
}

// ============================================================
// SERVICE PRINCIPAL : CRÉER UN DEVIS
// ============================================================

export const createQuote = async (input: QuoteRequestInput) => {
  // 1. Calculer la fourchette de prix
  const priceRange = calculatePriceRange(
    input.energyType,
    input.numberOfPeople,
    input.dailyConsumption,
    input.surfaceArea
  );

  // 2. Sélectionner les produits recommandés
  const recommendedItems = await selectRecommendedProducts(input.energyType, priceRange);

  // 3. Générer l'analyse
  const aiAnalysis = generateAnalysisText(input, priceRange, recommendedItems);

  // 4. Calculer la date d'expiration (30 jours)
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  // 5. Créer le devis en base
  const quote = await prisma.quote.create({
    data: {
      userId: input.userId,
      energyType: input.energyType,
      usageDescription: input.usageDescription,
      location: input.location,
      monthlyBudget: input.monthlyBudget,
      surfaceArea: input.surfaceArea,
      dailyConsumption: input.dailyConsumption,
      numberOfPeople: input.numberOfPeople,
      hasExistingSystem: input.hasExistingSystem ?? false,
      additionalNotes: input.additionalNotes,
      status: QuoteStatus.GENERATED,
      estimatedMinPrice: priceRange.min,
      estimatedMaxPrice: priceRange.max,
      recommendedPower: priceRange.recommendedPower,
      aiAnalysis,
      validUntil,
      items: {
        create: recommendedItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          reason: item.reason
        }))
      }
    },
    include: {
      items: {
        include: { product: true }
      },
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  return quote;
};

// ============================================================
// LIRE UN DEVIS
// ============================================================

export const getQuoteById = async (id: string, userId: string, isAdmin: boolean) => {
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } }
    }
  });

  if (!quote) return null;
  if (!isAdmin && quote.userId !== userId) return null;

  return quote;
};

// ============================================================
// LISTER LES DEVIS D'UN UTILISATEUR
// ============================================================

export const getUserQuotes = async (userId: string, page: number, limit: number) => {
  const skip = (page - 1) * limit;

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: { select: { id: true, name: true, image: true } } } }
      }
    }),
    prisma.quote.count({ where: { userId } })
  ]);

  return {
    data: quotes,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

// ============================================================
// ADMIN : LISTER TOUS LES DEVIS
// ============================================================

export const getAllQuotes = async (page: number, limit: number, status?: QuoteStatus) => {
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const [quotes, total] = await Promise.all([
    prisma.quote.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { id: true, name: true } } } }
      }
    }),
    prisma.quote.count({ where })
  ]);

  return {
    data: quotes,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

// ============================================================
// METTRE À JOUR LE STATUT D'UN DEVIS
// ============================================================

export const updateQuoteStatus = async (id: string, status: QuoteStatus) => {
  return prisma.quote.update({
    where: { id },
    data: { status },
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } }
    }
  });
};

// ============================================================
// OBTENIR LES PRIX PLANCHERS (référence client)
// ============================================================

export const getPriceFloors = () => {
  return Object.entries(ENERGY_PRICE_FLOORS).map(([type, info]) => ({
    energyType: type as EnergyType,
    ...info
  }));
};
