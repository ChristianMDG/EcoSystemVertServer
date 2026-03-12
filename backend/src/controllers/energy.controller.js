import { PrismaClient } from '@prisma/client';
import { calculateSolarSolution } from '../services/energy.service.js';

const prisma = new PrismaClient();

// Constantes pour les calculs
const SOLAR_CONSTANTS = {
  // Prix moyens à Madagascar (en Ar)
  PRIX_PANNEAU_PAR_UNITE: 350000, // 350 000 Ar par panneau
  PRIX_BATTERIE_PAR_KWH: 200000,  // 200 000 Ar par kWh
  PRIX_ONDULEUR: 450000,           // 450 000 Ar
  PRIX_INSTALLATION_PAR_M2: 50000, // 50 000 Ar par m²
  
  // Facteurs d'ensoleillement par région
  ENSOLEILLEMENT: {
    'Antananarivo': 1.0,
    'Toamasina': 0.92,
    'Mahajanga': 1.06,
    'Fianarantsoa': 0.94,
    'Toliara': 1.12,
    'Antsiranana': 1.04,
    'default': 1.0
  },
  
  // Performance des panneaux
  PRODUCTION_PAR_PANNEAU: 1.5, // kWh par jour par panneau
  PUISSANCE_PAR_PANNEAU: 0.4,  // kW par panneau
  SURFACE_PAR_PANNEAU: 1.8,    // m² par panneau
  
  // Économies
  PRIX_KWH: 500, // Prix du kWh en Ar
  
  // CO₂
  CO2_PAR_KWH: 0.5, // kg CO₂ économisé par kWh produit
};

// Créer une simulation
export const createSimulation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { surface, consommation, localisation, budget } = req.body;

    // Validation
    if (!surface || !consommation || !localisation) {
      return res.status(400).json({
        success: false,
        message: 'Surface, consommation et localisation sont requis'
      });
    }

    if (surface <= 0 || consommation <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Les valeurs doivent être positives'
      });
    }

    // Calculer la solution solaire
    const results = calculateSolarSolution({
      surface: parseFloat(surface),
      consommation: parseFloat(consommation),
      localisation,
      budget: budget ? parseFloat(budget) : null
    });

    // Sauvegarder dans la base de données
    const simulation = await prisma.energySimulation.create({
      data: {
        userId,
        surface: parseFloat(surface),
        consommation: parseFloat(consommation),
        localisation,
        budget: budget ? parseFloat(budget) : null,
        ...results
      }
    });

    // Générer des recommandations de produits
    const recommendations = await generateProductRecommendations(results);

    res.status(201).json({
      success: true,
      data: {
        simulation,
        recommendations
      }
    });

  } catch (error) {
    console.error('Erreur création simulation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la simulation',
      error: error.message
    });
  }
};

// Récupérer toutes les simulations d'un utilisateur
export const getUserSimulations = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 10, page = 1 } = req.query;

    const simulations = await prisma.energySimulation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.energySimulation.count({
      where: { userId }
    });

    res.json({
      success: true,
      data: {
        simulations,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur récupération simulations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des simulations'
    });
  }
};

// Récupérer une simulation spécifique
export const getSimulationById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const simulation = await prisma.energySimulation.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: 'Simulation non trouvée'
      });
    }

    // Générer les recommandations
    const recommendations = await generateProductRecommendations({
      nbPanneaux: simulation.nbPanneaux,
      capaciteBatterie: simulation.capaciteBatterie,
      estDansBudget: simulation.estDansBudget
    });

    res.json({
      success: true,
      data: {
        simulation,
        recommendations
      }
    });

  } catch (error) {
    console.error('Erreur récupération simulation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la simulation'
    });
  }
};

// Supprimer une simulation
export const deleteSimulation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await prisma.energySimulation.deleteMany({
      where: {
        id,
        userId
      }
    });

    res.json({
      success: true,
      message: 'Simulation supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression simulation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la simulation'
    });
  }
};

// Obtenir les statistiques de l'utilisateur
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const simulations = await prisma.energySimulation.findMany({
      where: { userId }
    });

    const stats = {
      totalSimulations: simulations.length,
      totalCO2: simulations.reduce((sum, s) => sum + (s.co2Economise || 0), 0),
      totalEconomies: simulations.reduce((sum, s) => sum + (s.economieAnnuelle || 0), 0),
      moyennePanneaux: simulations.length > 0 
        ? Math.round(simulations.reduce((sum, s) => sum + s.nbPanneaux, 0) / simulations.length)
        : 0,
      simulationsParMois: getSimulationsByMonth(simulations)
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

// Ajouter un feedback
export const addSimulationFeedback = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { simulationId } = req.params;
    const { rating, comment, usedForProject } = req.body;

    // Vérifier que la simulation appartient à l'utilisateur
    const simulation = await prisma.energySimulation.findFirst({
      where: {
        id: simulationId,
        userId
      }
    });

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: 'Simulation non trouvée'
      });
    }

    const feedback = await prisma.simulationFeedback.create({
      data: {
        simulationId,
        userId,
        rating,
        comment,
        usedForProject: usedForProject || false
      }
    });

    res.status(201).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('Erreur ajout feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout du feedback'
    });
  }
};

// Fonctions utilitaires
const generateProductRecommendations = async (results) => {
  const { nbPanneaux, capaciteBatterie, estDansBudget } = results;

  const products = [];

  // Panneaux solaires
  const panneaux = await prisma.energyProduct.findMany({
    where: { 
      type: 'panneau',
      inStock: true 
    },
    take: 2
  });

  if (panneaux.length > 0) {
    products.push(...panneaux);
  } else {
    // Produits par défaut si pas en base
    products.push(
      {
        id: 'default-1',
        name: `Kit Solaire Premium ${nbPanneaux}P`,
        description: `Pack complet avec ${nbPanneaux} panneaux monocristallins haute efficacité`,
        price: nbPanneaux * 350000,
        type: 'kit',
        rating: 4.8,
        reviews: 124,
        badge: 'Recommandé'
      },
      {
        id: 'default-2',
        name: `Batterie Lithium ${capaciteBatterie}kWh`,
        description: 'Batterie nouvelle génération avec 6000 cycles',
        price: capaciteBatterie * 200000,
        type: 'batterie',
        rating: 4.9,
        reviews: 89,
        badge: 'Meilleur rapport qualité/prix'
      },
      {
        id: 'default-3',
        name: 'Onduleur Hybride 5kW',
        description: 'Onduleur avec régulateur MPPT double entrée',
        price: 450000,
        type: 'onduleur',
        rating: 4.7,
        reviews: 56,
        badge: estDansBudget ? 'Dans votre budget' : 'Premium'
      }
    );
  }

  if (!estDansBudget) {
    products.push({
      id: 'default-4',
      name: 'Pack Économique 3P',
      description: "Solution d'entrée de gamme pour petits budgets",
      price: 950000,
      type: 'kit',
      rating: 4.5,
      reviews: 32,
      badge: 'Économique'
    });
  }

  return products;
};

const getSimulationsByMonth = (simulations) => {
  const months = {};
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    months[key] = 0;
  }

  simulations.forEach(sim => {
    const date = new Date(sim.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (months[key] !== undefined) {
      months[key]++;
    }
  });

  return Object.entries(months).map(([month, count]) => ({
    month,
    count
  }));
};