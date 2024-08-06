import routes from "../routes";
import CardTransactions from "./CardTransactions";
import Dashboard from "./Dashboard";
import FoundersCardWaitlist from "./FoundersCardWaitlist";
import Logon from "./Logon";
import PageNotFound from "./PageNotFound";
import TransactionDetails from "./TransactionDetails";
import ExchangeRates from "../partials/tabcomponents/ExchangeRates";
import Updates from "./Updates";
import UserUpdate from "./UserUpdate";
import PendingAcctNumber from "./PendingAcctNumber";
import PaymentHistories from "./PaymentHistories";
import Transactions from "./Transactions";
import FboTransactions from "./FboTransactions";
import AdminPanel from "./AminPanel";
import AdminLogs from "../partials/tabcomponents/AdminLogs";
import BlacklistedUsers from "../partials/tabcomponents/BlacklistedUsers";
import Referrers from "../partials/tabcomponents/Referrers";
import RefBonusWithdrawal from "../partials/tabcomponents/RefBonusWithdrawal";
import Referals from "./Referals";
import Providers from "../partials/tabcomponents/Providers";
import PendingKYC from "./PendingKYC";
import ElementUsers from "./ElementUsers";

export const notLoggedIn = [
  { el: Logon, path: routes.logon, children: [] },
  { el: PageNotFound, path: routes["*"], children: [] },
];

export const userRoutes = [
  ...notLoggedIn,
  {
    el: Dashboard,
    path: routes.dashboard,
    children: [{ el: Users, path: routes.users_list, children: [] }],
  },
  { el: Updates, path: routes.app_updates, children: [] },
  {
    el: PaymentHistories,
    path: routes.payment_histories,
    children: [
      { el: Transactions, path: routes.transactions, children: [] },
      { el: FboTransactions, path: routes.fbo_transactions, children: [] },
    ],
  },
  {
    el: AdminPanel,
    path: routes.admin_panel,
    children: [
      { el: AdminLogs, path: routes.admin_log, children: [] },
      { el: BlacklistedUsers, path: routes.blacklisted_users, children: [] },
      { el: Providers, path: routes.providers, children: [] },
    ],
  },
  {
    el: Referals,
    path: routes.referrals,
    children: [
      { el: Referrers, path: routes.referrers, children: [] },
      {
        el: RefBonusWithdrawal,
        path: routes.ref_bonus_withdrawals,
        children: [],
      },
    ],
  },
  { el: TransactionDetails, path: routes.card_transactions, children: [] },
  { el: CardTransactions, path: routes.card_transactions, children: [] },
  { el: FoundersCardWaitlist, path: routes.founders_waitlist, children: [] },
  { el: PhysicalCardWaitlist, path: routes.physical_waitlist, children: [] },
  { el: ExchangeRates, path: routes.exchange_rates, children: [] },
  { el: UserUpdate, path: routes.user_updates, children: [] },
  { el: ElementUsers, path: routes.element_user, children: [] },
  { el: PendingAcctNumber, path: routes.pendingacct_requests, children: [] },
  { el: PendingKYC, path: routes.pending_kyc, children: [] },
];
