// controllers/quote.controller.ts
// EcoVert Mada - Contrôleur des devis

import { Request, Response } from "express";
import * as quoteService from "../services/quote.service";
import { EnergyType, QuoteStatus } from "@prisma/client";

// ============================================================
// CLIENT : Demander un nouveau devis
// ============================================================

export const requestQuoteController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Non autorisé" });
    }

    const {
      energyType,
      usageDescription,
      location,
      monthlyBudget,
      surfaceArea,
      dailyConsumption,
      numberOfPeople,
      hasExistingSystem,
      additionalNotes
    } = req.body;

    // Validation des champs obligatoires
    if (!energyType) {
      return res.status(400).json({
        success: false,
        error: "Le type d'énergie est requis",
        availableTypes: Object.values(EnergyType)
      });
    }

    if (!Object.values(EnergyType).includes(energyType)) {
      return res.status(400).json({
        success: false,
        error: `Type d'énergie invalide. Valeurs acceptées : ${Object.values(EnergyType).join(", ")}`
      });
    }

    if (!usageDescription || usageDescription.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: "Veuillez décrire vos besoins (minimum 10 caractères)"
      });
    }

    if (!location || location.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: "La localisation est requise"
      });
    }

    const quote = await quoteService.createQuote({
      userId: req.user.userId,
      energyType: energyType as EnergyType,
      usageDescription: usageDescription.trim(),
      location: location.trim(),
      monthlyBudget: monthlyBudget ? Number(monthlyBudget) : undefined,
      surfaceArea: surfaceArea ? Number(surfaceArea) : undefined,
      dailyConsumption: dailyConsumption ? Number(dailyConsumption) : undefined,
      numberOfPeople: numberOfPeople ? Number(numberOfPeople) : undefined,
      hasExistingSystem: Boolean(hasExistingSystem),
      additionalNotes: additionalNotes?.trim()
    });

    return res.status(201).json({
      success: true,
      message: "Devis généré avec succès",
      data: quote
    });

  } catch (err: any) {
    console.error("Erreur génération devis:", err);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la génération du devis"
    });
  }
};

// ============================================================
// CLIENT : Lister ses propres devis
// ============================================================

export const getMyQuotesController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Non autorisé" });
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 10);

    const result = await quoteService.getUserQuotes(req.user.userId, page, limit);

    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================
// CLIENT/ADMIN : Voir un devis par ID
// ============================================================

export const getQuoteByIdController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Non autorisé" });
    }

    const { id } = req.params;
    const isAdmin = req.user.role === "admin";

    const quote = await quoteService.getQuoteById(id, req.user.userId, isAdmin);

    if (!quote) {
      return res.status(404).json({ success: false, error: "Devis introuvable" });
    }

    return res.status(200).json({ success: true, data: quote });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================
// CLIENT : Accepter ou refuser un devis
// ============================================================

export const updateMyQuoteStatusController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Non autorisé" });
    }

    const { id } = req.params;
    const { status } = req.body;

    const isAdmin = req.user.role === "admin";

    // Le client ne peut qu'accepter ou refuser ; l'admin peut tout statut
    const allowedForClient = [QuoteStatus.ACCEPTED, QuoteStatus.REJECTED];
    const allowedForAdmin = Object.values(QuoteStatus);
    const allowed = isAdmin ? allowedForAdmin : allowedForClient;

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Statut invalide. Valeurs acceptées : ${allowed.join(", ")}`
      });
    }

    // Vérifier que le devis existe (admin voit tout, client voit seulement le sien)
    const existing = await quoteService.getQuoteById(id, req.user.userId, isAdmin);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Devis introuvable" });
    }

    if (!isAdmin && existing.status === QuoteStatus.EXPIRED) {
      return res.status(400).json({ success: false, error: "Ce devis est expiré" });
    }

    const updated = await quoteService.updateQuoteStatus(id, status);

    return res.status(200).json({
      success: true,
      message: status === QuoteStatus.ACCEPTED ? "Devis accepté !" : "Devis refusé",
      data: updated
    });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================
// ADMIN : Lister tous les devis
// ============================================================

export const adminGetAllQuotesController = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
    const status = req.query.status as QuoteStatus | undefined;

    if (status && !Object.values(QuoteStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Statut invalide. Valeurs : ${Object.values(QuoteStatus).join(", ")}`
      });
    }

    const result = await quoteService.getAllQuotes(page, limit, status);

    return res.status(200).json({ success: true, ...result });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================
// ADMIN : Changer le statut d'un devis
// ============================================================

export const adminUpdateQuoteStatusController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(QuoteStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Statut invalide. Valeurs : ${Object.values(QuoteStatus).join(", ")}`
      });
    }

    const updated = await quoteService.updateQuoteStatus(id, status);

    return res.status(200).json({
      success: true,
      message: "Statut du devis mis à jour",
      data: updated
    });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// ============================================================
// PUBLIC : Consulter les prix planchers par type d'énergie
// ============================================================

export const getPriceFloorsController = async (_req: Request, res: Response) => {
  try {
    const floors = quoteService.getPriceFloors();
    return res.status(200).json({
      success: true,
      message: "Prix minimums recommandés par type d'énergie",
      data: floors
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
