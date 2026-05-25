-- Migration: add_quotes
-- EcoVert Mada - Module Devis

-- Enums
CREATE TYPE "EnergyType" AS ENUM ('SOLAR', 'WIND', 'HYBRID', 'HYDRO', 'BIOMASS');
CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'GENERATED', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- Table quotes
CREATE TABLE "quotes" (
    "id"                TEXT NOT NULL,
    "userId"            TEXT NOT NULL,
    "energyType"        "EnergyType" NOT NULL,
    "usageDescription"  TEXT NOT NULL,
    "location"          TEXT NOT NULL,
    "monthlyBudget"     DOUBLE PRECISION,
    "surfaceArea"       DOUBLE PRECISION,
    "dailyConsumption"  DOUBLE PRECISION,
    "numberOfPeople"    INTEGER,
    "hasExistingSystem" BOOLEAN NOT NULL DEFAULT false,
    "additionalNotes"   TEXT,
    "status"            "QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedMinPrice" DOUBLE PRECISION,
    "estimatedMaxPrice" DOUBLE PRECISION,
    "recommendedPower"  DOUBLE PRECISION,
    "aiAnalysis"        TEXT,
    "validUntil"        TIMESTAMP(3),
    "created_at"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- Table quote_items
CREATE TABLE "quote_items" (
    "id"          TEXT NOT NULL,
    "quoteId"     TEXT NOT NULL,
    "productId"   TEXT NOT NULL,
    "quantity"    INTEGER NOT NULL,
    "unitPrice"   DOUBLE PRECISION NOT NULL,
    "reason"      TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- Foreign keys
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quoteId_fkey"
    FOREIGN KEY ("quoteId") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
