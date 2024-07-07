import { bot } from "../bot.js";
import { config } from "../config.js";
import { getActiveAccounts } from "../services/accounts.js";
import { getOffersForSubscription } from "../services/aviasales.js";
import { addNotificationToDB } from "../services/notifications.js";
import { addOffersToDB, type Offer } from "../services/offers.js";

import { type Subscription, getSubscriptionsByChatId, getSubscriptionById } from "../services/subscriptions.js";
import { isPromiseFullfilled } from "../utils/promises.js";

const informAboutSubscriptions = async (chatId: number) => {
  const subscriptions = getSubscriptionsByChatId(chatId);
  const msg = `Привет! Твои подписки:\n${JSON.stringify(subscriptions)}`;

  try {
    await bot.api.sendMessage(chatId, msg);
  } catch (e) {
    console.error("informAboutSubscriptions", e);
  }
};

const isOfferMatchesPrice = (offer: Offer) => {
  const subscription = getSubscriptionById(offer.subscription_id);

  return offer.value < subscription.price;
};

const informAboutMatch = async (offer: Offer) => {
  const subscription = getSubscriptionById(offer.subscription_id);
  const prefix = `Вы искали билет дешеле ${subscription.price}`;
  const route = `${subscription.origin}-${subscription.destination}`;
  const offerPrice = offer.value;
  const company = offer.gate;
  const date = offer.depart_date;
  const msg = `${prefix} для ${route} на ${date} - ${offerPrice} от ${company}`;
  try {
    await bot.api.sendMessage(subscription.chatId, msg);
    addNotificationToDB({ offer_id: offer.id });
  } catch (e) {
    console.error("informAboutMatch", e);
  }
};

const informActiveAccountsAboutSubscriptions = async () => {
  const activeAccounts = getActiveAccounts();
  const tasks = activeAccounts.map((a) => informAboutSubscriptions(a.chatId));
  await Promise.allSettled(tasks);
};

const informActiveAccountsAboutBestPrices = async () => {
  const { BOT_TIMEOUT = 600_000 } = config;

  const activeAccounts = getActiveAccounts();
  const activeSubscriptions = activeAccounts.reduce((result, account) => {
    const subscriptions = getSubscriptionsByChatId(account.chatId);
    return [...result, ...subscriptions];
  }, [] as Subscription[]);

  const fetchTasks = activeSubscriptions.map(getOffersForSubscription);
  const fetchResults = await Promise.allSettled(fetchTasks);
  const fetchResultsOk = fetchResults.filter(isPromiseFullfilled);
  const fetchResultsOkValues = fetchResultsOk.map(({ value }) => value);
  const offersAddedToDB = fetchResultsOkValues.map(addOffersToDB);
  const offers = offersAddedToDB.reduce((result, value) => [...result, ...value], []);
  const offersFilteredByPrice = offers.filter(isOfferMatchesPrice);

  const informUsersTasks = offersFilteredByPrice.map(informAboutMatch);

  await Promise.allSettled(informUsersTasks);

  setTimeout(informActiveAccountsAboutBestPrices, BOT_TIMEOUT);
};

export { informActiveAccountsAboutSubscriptions, informActiveAccountsAboutBestPrices };

/**
 * активные подписки
 * запрашиваем для каждой подписки данные с авиасейлз
 * фильтруем запросы которые по какой то причине упали
 * выбираем лучшее предложение из присланных с учётом требований подписки
 * записываем его в БД
 * идем по списку записанных в БД офферов
 */
