// Constantes pour les calculs
const SOLAR_CONSTANTS = {
  PRIX_PANNEAU_PAR_UNITE: 350000,
  PRIX_BATTERIE_PAR_KWH: 200000,
  PRIX_ONDULEUR: 450000,
  PRIX_INSTALLATION_PAR_M2: 50000,
  
  ENSOLEILLEMENT: {
    'Antananarivo': 1.0,
    'Toamasina': 0.92,
    'Mahajanga': 1.06,
    'Fianarantsoa': 0.94,
    'Toliara': 1.12,
    'Antsiranana': 1.04,
    'default': 1.0
  },
  
  PRODUCTION_PAR_PANNEAU: 1.5,
  PUISSANCE_PAR_PANNEAU: 0.4,
  SURFACE_PAR_PANNEAU: 1.8,
  
  PRIX_KWH: 500,
  CO2_PAR_KWH: 0.5,
};

export const calculateSolarSolution = (input) => {
  const { surface, consommation, localisation, budget } = input;

  // 1. Calculer le nombre de panneaux nécessaires
  const consommationParMois = consommation * 30;
  const nbPanneauxBase = Math.ceil(consommation / SOLAR_CONSTANTS.PRODUCTION_PAR_PANNEAU);
  
  // Ajuster selon la surface disponible
  const nbPanneauxMax = Math.floor(surface / SOLAR_CONSTANTS.SURFACE_PAR_PANNEAU);
  const nbPanneaux = Math.min(nbPanneauxBase, Math.max(1, nbPanneauxMax));

  // 2. Calculer la capacité de batterie
  const capaciteBatterie = Math.ceil(consommation * 0.7 * 10) / 10; // Arrondi à 1 décimale

  // 3. Calculer la puissance installée
  const puissanceInstallee = (nbPanneaux * SOLAR_CONSTANTS.PUISSANCE_PAR_PANNEAU).toFixed(1);

  // 4. Facteur d'ensoleillement
  const facteurEnsoleillement = SOLAR_CONSTANTS.ENSOLEILLEMENT[localisation] || SOLAR_CONSTANTS.ENSOLEILLEMENT.default;

  // 5. Production
  const productionReelle = nbPanneaux * SOLAR_CONSTANTS.PRODUCTION_PAR_PANNEAU * facteurEnsoleillement;
  const productionJournaliere = Math.round(productionReelle * 10) / 10;
  const productionAnnuelle = Math.round(productionReelle * 365);

  // 6. Coût estimé
  const coutPanneaux = nbPanneaux * SOLAR_CONSTANTS.PRIX_PANNEAU_PAR_UNITE;
  const coutBatteries = capaciteBatterie * SOLAR_CONSTANTS.PRIX_BATTERIE_PAR_KWH;
  const coutInstallation = surface * SOLAR_CONSTANTS.PRIX_INSTALLATION_PAR_M2;
  const coutOnduleur = SOLAR_CONSTANTS.PRIX_ONDULEUR;
  
  let coutEstime = coutPanneaux + coutBatteries + coutOnduleur + coutInstallation;
  // Arrondir aux 100 000 Ar près
  coutEstime = Math.round(coutEstime / 100000) * 100000;

  // 7. Économies
  const economieAnnuelle = Math.round(productionAnnuelle * SOLAR_CONSTANTS.PRIX_KWH / 1000) * 1000;

  // 8. Retour sur investissement
  const retourInvestissement = parseFloat((coutEstime / economieAnnuelle).toFixed(1));

  // 9. CO₂ économisé
  const co2Economise = Math.round(productionAnnuelle * SOLAR_CONSTANTS.CO2_PAR_KWH);

  // 10. Surface utilisée
  const surfaceUtilisee = (nbPanneaux * SOLAR_CONSTANTS.SURFACE_PAR_PANNEAU).toFixed(1);

  // 11. Taux d'autonomie
  const autonomie = Math.min(100, Math.round((productionJournaliere / consommation) * 100));

  // 12. Dans le budget ?
  const estDansBudget = !budget || coutEstime <= budget * 1.2;

  return {
    nbPanneaux,
    capaciteBatterie,
    puissanceInstallee: parseFloat(puissanceInstallee),
    coutEstime,
    economieAnnuelle,
    retourInvestissement,
    co2Economise,
    surfaceUtilisee: parseFloat(surfaceUtilisee),
    productionJournaliere,
    productionAnnuelle,
    autonomie,
    facteurEnsoleillement,
    estDansBudget
  };
};

export const getEnergyTips = (localisation, consommation) => {
  const tips = [
    {
      id: 1,
      title: 'Optimisez votre consommation',
      content: "Éteignez les appareils en veille pour économiser jusqu'à 10% d'énergie.",
      icon: 'zap'
    },
    {
      id: 2,
      title: 'Nettoyage des panneaux',
      content: 'Des panneaux propres produisent 15-20% d\'énergie en plus.',
      icon: 'sun'
    },
    {
      id: 3,
      title: 'Batterie optimale',
      content: 'Maintenez votre batterie entre 20% et 80% pour prolonger sa durée de vie.',
      icon: 'battery'
    }
  ];

  // Ajouter des conseils spécifiques selon la région
  if (localisation === 'Antsiranana' || localisation === 'Mahajanga') {
    tips.push({
      id: 4,
      title: 'Protection contre la chaleur',
      content: 'Dans votre région, assurez une bonne ventilation des panneaux pour éviter la surchauffe.',
      icon: 'wind'
    });
  }

  if (consommation > 10) {
    tips.push({
      id: 5,
      title: 'Audit énergétique',
      content: 'Votre consommation est élevée. Un audit pourrait identifier des économies supplémentaires.',
      icon: 'trending-up'
    });
  }

  return tips;
};

export const calculateROIDetails = (coutEstime, economieAnnuelle) => {
  const annees = [1, 2, 3, 5, 10, 15, 20];
  
  return annees.map(annee => ({
    annee,
    economiesCumulees: economieAnnuelle * annee,
    retourSurInvestissement: annee >= coutEstime / economieAnnuelle,
    ratio: ((economieAnnuelle * annee) / coutEstime).toFixed(2)
  }));
};

export const compareSolutions = (solution1, solution2) => {
  return {
    investissement: {
      solution1: solution1.coutEstime,
      solution2: solution2.coutEstime,
      difference: solution2.coutEstime - solution1.coutEstime,
      meilleure: solution1.coutEstime < solution2.coutEstime ? 'solution1' : 'solution2'
    },
    production: {
      solution1: solution1.productionAnnuelle,
      solution2: solution2.productionAnnuelle,
      difference: solution2.productionAnnuelle - solution1.productionAnnuelle,
      meilleure: solution1.productionAnnuelle > solution2.productionAnnuelle ? 'solution1' : 'solution2'
    },
    retourInvestissement: {
      solution1: solution1.retourInvestissement,
      solution2: solution2.retourInvestissement,
      meilleure: solution1.retourInvestissement < solution2.retourInvestissement ? 'solution1' : 'solution2'
    },
    recommandation: getRecommendation(solution1, solution2)
  };
};

const getRecommendation = (s1, s2) => {
  const score1 = (s1.productionAnnuelle / s1.coutEstime) * 100;
  const score2 = (s2.productionAnnuelle / s2.coutEstime) * 100;
  
  if (score1 > score2) {
    return {
      meilleure: 'solution1',
      raison: 'Meilleur rapport production/prix'
    };
  } else {
    return {
      meilleure: 'solution2',
      raison: 'Meilleur rapport production/prix'
    };
  }
};