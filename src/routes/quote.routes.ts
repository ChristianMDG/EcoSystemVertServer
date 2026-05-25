// routes/quote.routes.ts
// EcoVert Mada - Routes des devis

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import {
  requestQuoteController,
  getMyQuotesController,
  getQuoteByIdController,
  updateMyQuoteStatusController,
  getPriceFloorsController
} from "../controllers/quote.controller";

const router = Router();

// ──────────────────────────────────────────
// PUBLIC
// ──────────────────────────────────────────

// Consulter les prix planchers par type d'énergie
router.get("/quotes/price-floors", getPriceFloorsController);

// ──────────────────────────────────────────
// CLIENT (authentifié)
// ──────────────────────────────────────────

// Demander un devis IA
router.post(
  "/quotes",
  authMiddleware,
  authorize(["client", "admin"]),
  requestQuoteController
);

// Lister ses propres devis
router.get(
  "/quotes/my",
  authMiddleware,
  authorize(["client", "admin"]),
  getMyQuotesController
);

// Voir un devis par ID (client voit seulement le sien, admin voit tout)
router.get(
  "/quotes/:id",
  authMiddleware,
  authorize(["client", "admin"]),
  getQuoteByIdController
);

// Accepter / Refuser un devis (client et admin)
router.patch(
  "/quotes/:id/status",
  authMiddleware,
  authorize(["client", "admin"]),
  updateMyQuoteStatusController
);

// Admin routes are handled in admin.routes.ts (under /api prefix)

export default router;
