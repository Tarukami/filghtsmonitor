import axios, { AxiosRequestConfig } from "axios";

import { config } from "../config.js";
import { type Subscription } from "./subscriptions.js";
import { type RawOffer } from "./offers.js";

type AviasalesPrice = Omit<RawOffer, "subscription_id">;
type AviasalesResponse = {
  prices: AviasalesPrice[];
  errors?: unknown;
};

const filterByMaxChanges = (offers: AviasalesPrice[], maxChanges) => {
  return offers.filter(({ number_of_changes }) => number_of_changes <= maxChanges);
};

const fetchAviasalesPrices = async (subscription: Subscription): Promise<AviasalesPrice[]> => {
  const { MIN_PRICES_URL } = config;
  const { origin, destination, departureRange, departureStart, maxChanges } = subscription;

  const requestConfig: AxiosRequestConfig = {
    params: {
      origin_iata: origin,
      destination_iata: destination,
      depart_start: departureStart,
      depart_range: departureRange,
      affilate: true,
      market: "ru",
    },
  };

  try {
    const { data } = await axios.get<AviasalesResponse>(MIN_PRICES_URL, requestConfig);

    return data.prices;
  } catch (e) {
    console.error(e);
    throw new Error("fetchAviasalesPrices");
  }
};

const getOffersForSubscription = async (subscription: Subscription) => {
  try {
    const aviasalesPrices = await fetchAviasalesPrices(subscription);
    const filteredByChanges = filterByMaxChanges(aviasalesPrices, subscription.maxChanges);

    const priceToOffer = (price: AviasalesPrice): RawOffer => ({ ...price, subscription_id: subscription.id });
    return filteredByChanges.map(priceToOffer);
  } catch (e) {
    console.error(e);
    throw new Error("getOffersForSubscription");
  }
};

export { getOffersForSubscription };
