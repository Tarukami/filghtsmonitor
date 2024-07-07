import { getPathTo, readJSONFile } from "./db.js";

type Subscription = {
  id: string;
  chatId: number;
  origin: string;
  destination: string;
  departureStart: string;
  departureRange: string;
  price: number;
  maxChanges: number;
};

const SUBSCRIPTIONS_PATH = getPathTo("subscriptions.json");

const getSubscriptionsFromDB = () => {
  return readJSONFile<Subscription[]>(SUBSCRIPTIONS_PATH) || [];
};

const getSubscriptionById = (id: string) => getSubscriptionsFromDB().find((s) => s.id === id);

const getSubscriptionsByChatId = (id: number) => {
  const subscriptions = getSubscriptionsFromDB();
  const result = [] as Subscription[];
  for (let s of subscriptions) {
    if (s.chatId === id) {
      result.push(s);
    }
  }

  return result;
};

export { getSubscriptionById, getSubscriptionsByChatId, type Subscription };
