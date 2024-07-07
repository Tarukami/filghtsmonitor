import { v4 as getUuid } from "uuid";
import { getPathTo, readJSONFile, writeJSONFile } from "./db.js";

type Notification = {
  id: string;
  offer_id: string;
  updated: string;
};

type RawNotification = Omit<Notification, "id" | "updated">;

const NOTIFICATIONS_PATH = getPathTo("notifications.json");

const addIdAndUpdated = (raw: RawNotification): Notification => ({
  ...raw,
  updated: new Date().toISOString(),
  id: getUuid(),
});

const getNotificationsFromDB = () => {
  return readJSONFile<Notification[]>(NOTIFICATIONS_PATH) || [];
};

const getNotificationsBySubscriptionId = (id: string) => {
  const notifications = getNotificationsFromDB();
  const result = [] as Notification[];
  for (let n of notifications) {
    if (n.offer_id === id) {
      result.push(n);
    }
  }

  return result;
};

const addNotificationToDB = (notification: RawNotification) => {
  try {
    const current = getNotificationsFromDB();
    const update = addIdAndUpdated(notification);
    const newNotificationsFile = [...current, update];

    writeJSONFile(NOTIFICATIONS_PATH, newNotificationsFile);

    return update;
  } catch (e) {
    console.error("addNotificationToDB", e);
    throw new Error("Could not add notification to DB");
  }
};

export { getNotificationsBySubscriptionId, addNotificationToDB, type Notification };
