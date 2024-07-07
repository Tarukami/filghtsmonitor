import { getPathTo, readJSONFile } from "./db.js";

type Account = {
  chatId: number;
  paidFor: string;
};

const ACCOUNTS_PATH = getPathTo("accounts.json");

const getAccountsFromDB = () => {
  return readJSONFile<Account[]>(ACCOUNTS_PATH) || [];
};

const getActiveAccounts = () => {
  const accounts = getAccountsFromDB();

  return accounts.filter((a) => new Date() < new Date(a.paidFor));
};

export { getActiveAccounts };
