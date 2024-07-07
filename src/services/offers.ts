import { v4 as getUuid } from "uuid";
import { getPathTo, readJSONFile, writeJSONFile } from "./db.js";

type Offer = {
  id: string;
  subscription_id: string;
  value: number;
  return_date?: null;
  number_of_changes: number;
  gate: string;
  depart_date: string;
  updated: string;
};

type RawOffer = Omit<Offer, "id" | "updated">;

const OFFERS_PATH = getPathTo("offers.json");

const modifyToOffer = (rawOffer: RawOffer): Offer => {
  return {
    ...rawOffer,
    updated: new Date().toISOString(),
    id: getUuid(),
  };
};

const getOffersFromDB = () => {
  return readJSONFile<Offer[]>(OFFERS_PATH) || [];
};

const addOffersToDB = (rawOffers: RawOffer[]) => {
  try {
    const currentOffers = getOffersFromDB();
    const update = rawOffers.map(modifyToOffer);
    const newOffersFile = [...currentOffers, ...update];
    writeJSONFile(OFFERS_PATH, newOffersFile);

    return update;
  } catch (e) {
    console.error("addOffersToDB", e);
    throw new Error("Could not add offer to DB");
  }
};

export { getOffersFromDB, addOffersToDB, type Offer, type RawOffer };
