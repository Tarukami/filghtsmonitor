import "dotenv/config";
import { informActiveAccountsAboutBestPrices, informActiveAccountsAboutSubscriptions } from "./tasks/index.js";

void informActiveAccountsAboutSubscriptions();
void informActiveAccountsAboutBestPrices();
