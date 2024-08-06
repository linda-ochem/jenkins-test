import {
  // sendPutRequest,
  sendPostRequest2,
  sendGetRequest2,
  // sendDeleteRequest2,
  sendPutRequest2,
  // sendPostRequest,
  sendGetRequest,
  sendGetRequestElement,
  sendPostRequestElement,
} from "./requests.js";
import routes from "./routes.js";

export const login = async (email, password) => {
  return await sendPostRequest2("/admin/authentication/login", {
    email,
    password,
  });
};

export const updatePassword = async (adminId, password, confirmPassword) => {
  return await sendPostRequest2("/admin/access/update-password", {
    adminId,
    password,
    confirmPassword,
  });
};

export const inviteToAdmin = async (email, roleId) => {
  return await sendPostRequest2("/admin/access/update-password", {
    email,
    roleId,
  });
};

export const logout = async () => {
  window.location.replace(routes.logon);
  // window.location.reload()
};

// All Airtime Analytics
export const getLoggedInUser = async () => {
  return (await sendGetRequest2("/auth/logged-in-user", {})).data.data;
};

// User Profiles(live formerly staging)
export const getProfile2 = async (userId) => {
  let endpoint = `/admin/customers?&userId=${userId}`;

  const { data } = await sendGetRequest2(endpoint);

  return data;
};

// get visa types and prices
export const getVisaTypes = async () => {
  let endpoint = `/admin/fetch-visa-prices`;

  const { data } = await sendGetRequest2(endpoint);

  return data;
};

// get file categories
export const getFileVisaAnalytics = async () => {
  let endpoint = `/admin/visa-forms-analytics`;

  const { data } = await sendGetRequest2(endpoint);

  return data;
};

// get file categories
export const getFileCategories = async () => {
  let endpoint = `/admin/fetch-visa-file-lists`;

  const { data } = await sendGetRequest2(endpoint);

  return data;
};

export const fetchBulkSumElement = async (currency) => {
  let endpoint = `/admin/dashboard-sum?element=true&currency=${currency}`;

  const { data } = await sendGetRequest2(endpoint);

  return data;
};

export const fetchBulkSum = async (currency) => {
  let endpoint = `/admin/dashboard-sum?currency=${currency}`;

  const { data } = await sendGetRequest2(endpoint);

  return data;
};

export const fetchMapUsers = async (period) => {
  let endpoint = `/admin/user-graph?period=${period}`;

  const { data } = await sendGetRequest2(endpoint);

  return data;
};

export const fetchMapUsersElement = async (period) => {
  let endpoint = `/admin/user-graph?element=true&period=${period}`;

  const { data } = await sendGetRequest2(endpoint);

  return data;
};

export const fetchDailyBalanceElement = async (
  currency,
  startDate,
  endDate
) => {
  let endpoint = `/admin/dashboard-sum?element=true&currency=${currency}`;
  let queryParams = [];

  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { data };
};

export const fetchDailyBalance = async (currency, startDate, endDate) => {
  let endpoint = `/admin/dashboard-sum?currency=${currency}`;
  let queryParams = [];

  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { data };
};

export const fetchMapRevenuesElement = async (period, currency, type) => {
  let endpoint = `/admin/transaction-graph?element=true&period=${period}`;
  let queryParams = [];

  if (currency) {
    queryParams.push(`currency=${currency}`);
  }
  if (type) {
    queryParams.push(`type=${type}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { data };
};

export const fetchMapRevenues = async (period, currency, type) => {
  let endpoint = `/admin/transaction-graph?period=${period}`;
  let queryParams = [];

  if (currency) {
    queryParams.push(`currency=${currency}`);
  }
  if (type) {
    queryParams.push(`type=${type}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { data };
};

export const getProfiles2 = async (
  page,
  searchQuery,
  userId,
  kycLevel,
  endDate,
  startDate,
  firstName,
  lastName
) => {
  let endpoint = `/admin/customers?page=${page}&limit=50`;
  let queryParams = [];

  if (kycLevel) {
    queryParams.push(`kycLevel=${kycLevel}`);
  }
  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }
  if (firstName) {
    queryParams.push(`firstName=${firstName}`);
  }
  if (lastName) {
    queryParams.push(`lastName=${lastName}`);
  }
  if (userId) {
    queryParams.push(`userId=${userId}`);
  }

  if (searchQuery) {
    // Treat the searchQuery as the combined search term
    queryParams.push(`search=${searchQuery}`);
  } else {
    // If searchQuery is not provided, split it into firstName and lastName
    const queryParts = searchQuery.trim().split(" ");
    if (queryParts.length >= 2) {
      queryParams.push(`firstName=${queryParts[0]}`);
      queryParams.push(`lastName=${queryParts[1]}`);
    }
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  // const transformedData = data.data.data.map(
  //   ({ firstName, lastName, ...rest }) => ({
  //     fullName: firstName + " " + lastName,
  //     ...rest,
  //   })
  // );
  // return { ...data, transformedData };
  return { data };
};

// User Profiles(live formerly staging)
export const getElementProfiles2 = async (
  page,
  searchQuery,
  userId,
  kycLevel,
  endDate,
  startDate,
  firstName,
  lastName
) => {
  let endpoint = `/admin/customers?page=${page}&limit=50&element=true`;
  // let endpoint = `/admin/fetchAllElementsAccount?page=${page}&limit=50`;
  let queryParams = [];

  if (kycLevel) {
    queryParams.push(`kycLevel=${kycLevel}`);
  }
  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }
  if (firstName) {
    queryParams.push(`firstName=${firstName}`);
  }
  if (lastName) {
    queryParams.push(`lastName=${lastName}`);
  }
  if (userId) {
    queryParams.push(`userId=${userId}`);
  }

  if (searchQuery) {
    // Treat the searchQuery as the combined search term
    queryParams.push(`search=${searchQuery}`);
  } else {
    // If searchQuery is not provided, split it into firstName and lastName
    const queryParts = searchQuery.trim().split(" ");
    if (queryParts.length >= 2) {
      queryParams.push(`firstName=${queryParts[0]}`);
      queryParams.push(`lastName=${queryParts[1]}`);
    }
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  // const { data } = await sendGetRequestElement(endpoint);
  const { data } = await sendGetRequest2(endpoint);

  const transformedData = data.data.map(({ firstName, lastName, ...rest }) => ({
    fullName: firstName + " " + lastName,
    ...rest,
  }));
  return { ...data, transformedData };
  // return data
};

// User transactions(live formerly staging)

export const getTransactions2 = async (
  page,
  type,
  searchQuery,
  startDate,
  endDate,
  firstName,
  lastName,
  currency,
  status
) => {
  let endpoint = `/admin/transactions?page=${page}&limit=50`;
  let queryParams = [];

  if (type) {
    queryParams.push(`type=${type}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }
  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (currency) {
    queryParams.push(`currency=${currency}`);
  }
  if (status) {
    queryParams.push(`status=${status}`);
  }
  if (firstName) {
    queryParams.push(`firstName=${firstName}`);
  }
  if (lastName) {
    queryParams.push(`lastName=${lastName}`);
  }

  if (searchQuery) {
    // Treat the searchQuery as the combined search term
    queryParams.push(`search=${searchQuery}`);
  } else {
    // If searchQuery is not provided, split it into firstName and lastName
    const queryParts = searchQuery.trim().split(" ");
    if (queryParts.length >= 2) {
      queryParams.push(`firstName=${queryParts[0]}`);
      queryParams.push(`lastName=${queryParts[1]}`);
    }
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  const transformedData = data.data.map(({ firstName, lastName, ...rest }) => ({
    fullName: firstName + " " + lastName,
    ...rest,
  }));
  return { ...data, transformedData };
  // return { data };
};

// User transactions(live formerly staging)

export const getBillsPaymentTransactions2 = async (
  page,
  type,
  searchQuery,
  endDate,
  startDate,
  firstName,
  lastName
) => {
  let endpoint = `/admin/bill-payments?page=${page}&limit=50`;
  let queryParams = [];

  if (type) {
    queryParams.push(`type=${type}`);
  }
  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }
  if (firstName) {
    queryParams.push(`firstName=${firstName}`);
  }
  if (lastName) {
    queryParams.push(`lastName=${lastName}`);
  }

  if (searchQuery) {
    // Treat the searchQuery as the combined search term
    queryParams.push(`search=${searchQuery}`);
  } else {
    // If searchQuery is not provided, split it into firstName and lastName
    const queryParts = searchQuery.trim().split(" ");
    if (queryParts.length >= 2) {
      queryParams.push(`firstName=${queryParts[0]}`);
      queryParams.push(`lastName=${queryParts[1]}`);
    }
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { data };
};

// User transfers(live formerly staging)
export const getTransfers2 = async (
  page,
  type,
  searchQuery,
  endDate,
  startDate
) => {
  let endpoint = `/dashboard/Transactions?page=${page}&limit=50&type=${type}`;
  let queryParams = [];

  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }

  if (searchQuery) {
    // Treat the searchQuery as the combined search term
    queryParams.push(`search=${searchQuery}`);
  } else {
    // If searchQuery is not provided, split it into firstName and lastName
    const queryParts = searchQuery.trim().split(" ");
    if (queryParts.length >= 2) {
      queryParams.push(`firstName=${queryParts[0]}`);
      queryParams.push(`lastName=${queryParts[1]}`);
    }
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  const transformedData = data.data.data.map(
    ({ firstName, lastName, ...rest }) => ({
      fullName: firstName + " " + lastName,
      ...rest,
    })
  );
  return { ...data, transformedData };
};

// single user transactions(live formerly staging)
export const getSingleTransactions2 = async (
  id,
  page,
  searchQuery,
  endDate,
  startDate
) => {
  let endpoint = `/admin/transactions?userId=${id}&page=${page}&limit=50`;
  let queryParams = [];

  // console.log("id from actions", id);

  if (searchQuery) {
    queryParams.push(`search=${searchQuery}`);
  }
  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { ...data };
};

// search any user profiles on superadmin mode (live)
export const searchAnyUser = async (page, searchQuery) => {
  const { data } = await sendGetRequest2(
    `/dashboard/users?page=${page}&limit=20&search=${searchQuery}`
  );

  const transformedData = data.data.data.map(
    ({ firstName, lastName, ...rest }) => ({
      fullName: firstName + " " + lastName,
      ...rest,
    })
  );
  return { ...data, transformedData };
};

// User Profile
export const searchUserProfile = async (identifier) => {
  let { data } = await sendGetRequest2(
    `/dashboard/searchUser?search=${identifier}`
  );

  return data;
};

export const searchUserProfileById = async (identifier) => {
  let { data } = await sendGetRequest2(
    `/dashboard/searchUserById?userId=${identifier}`
  );

  return data;
};

export const getTotals = async () => {
  const { data } = await sendGetRequest2(`/admin/wallet-sum`);
  return data;
};

// Transactions
export const getTransactions = async (page) => {
  const { data } = await sendGetRequest2(
    `/admin/transactions?page=${page}&page_limit=100`
  );
  return data;
};

export const getUserWallet = async (userId) => {
  const { data } = await sendGetRequest2(`/admin/wallet/${userId}`);
  return data;
};

export const getUserVisaFiles = async (userId) => {
  const { data } = await sendGetRequest2(
    `/admin/fetch-single-visa-documents-admin?userId=${userId}`
  );
  return data;
};
export const updateVisaFile = async (maindata) => {
  const { data } = await sendPutRequest2(
    `/admin/update-visa-documents`,
    maindata
  );
  return data;
};

export const updateVisaPaymentStatus = async (maindata) => {
  const { data } = await sendPutRequest2(
    `/admin/admin-approve-visa-payment`,
    maindata
  );
  return data;
};

export const updateProfile = async (maindata) => {
  const { data } = await sendPutRequest2(`/admin/edit-profile`, maindata);
  return data;
};

//Get virtual card Transactions stripe
export const getVirtualCardTransactionsStripe = async () => {
  const { data } = await sendGetRequest2(`/dashboard/stripe/cardTransactions`);
  return data;
};

//Get virtual card Transactions (live formerly staging)
export const getVirtualCardConversion2 = async (
  page,
  searchQuery,
  type,
  endDate,
  startDate,
  status
) => {
  // let endpoint = `/dashboard/all-Virtual-Cards?page=${page}&page_limit=100&providerName=Checkbook`;
  let endpoint = `/admin/virtual-card-list?page=${page}&page_limit=100&providerName=tyrus`;
  let queryParams = [];

  if (type) {
    queryParams.push(`type=${type}`);
  }
  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }
  if (status) {
    queryParams.push(`status=${status}`);
  }

  if (searchQuery) {
    // Treat the searchQuery as the combined search term
    queryParams.push(`search=${searchQuery}`);
  }
  //  else {
  //   // If searchQuery is not provided, split it into firstName and lastName
  //   const queryParts = searchQuery.trim().split(" ");
  //   if (queryParts.length >= 2) {
  //     queryParams.push(`firstName=${queryParts[0]}`);
  //     queryParams.push(`lastName=${queryParts[1]}`);
  //   }
  // }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  const transformedData = data.data?.map(
    ({ firstName, lastName, ...rest }) => ({
      fullName: firstName + " " + lastName,
      ...rest,
    })
  );
  return { ...data, transformedData };
};

//Get virtual card  Transactions for a user (live formerly staging)
export const getVirtualCardTransactionForUser2 = async (
  page,
  userId,
  type,
  searchQuery,
  endDate,
  startDate,
  status
) => {
  let endpoint = `/admin/virtual-card-transactions?page=${page}&page_limit=100&providerName=tyrus`;
  // let endpoint = `/dashboard/all-virtual-card-transactions?page=${page}&page_limit=100&providerName=Checkbook`;
  let queryParams = [];

  if (type) {
    queryParams.push(`type=${type}`);
  }
  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }
  if (status) {
    queryParams.push(`status=${status}`);
  }
  if (userId) {
    queryParams.push(`userId=${userId}`);
  }

  if (searchQuery) {
    // Treat the searchQuery as the combined search term
    queryParams.push(`search=${searchQuery}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  const transformedData = data.data.map(({ firstName, lastName, ...rest }) => ({
    fullName: firstName + " " + lastName,
    ...rest,
  }));
  return { ...data, transformedData };
};

//Get virtual card Transactions
export const getVirtualCardConversion = async (providerName) => {
  const { data } = await sendGetRequest2(
    `/admin/virtual-card-list?providerName=${providerName}`
  );
  return data;
};

// Merchant Payments
export const getMerchantPayments = async (
  page,
  searchQuery,
  userId,
  refId,
  paymentId,
  status,
  search
) => {
  let endpoint = `/admin/migration-payments?page=${page}&limit=100`;
  let queryParams = [];

  if (userId) {
    queryParams.push(`type=${userId}`);
  }
  if (refId) {
    queryParams.push(`endDate=${refId}`);
  }
  if (paymentId) {
    queryParams.push(`startDate=${paymentId}`);
  }
  if (status) {
    queryParams.push(`status=${status}`);
  }
  if (search) {
    queryParams.push(`status=${search}`);
  }

  if (searchQuery) {
    // Treat the searchQuery as the combined search term
    queryParams.push(`search=${searchQuery}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { data };
};

// export const getMerchantPayments = async (page) => {
//   const { data } = await sendGetRequest2(
//     `/dashboard/merchant-payments?page=${page}&page_limit=100`
//   );
//   return data;
// };

// Pending KYC Documents
export const getPendingKYC = async (page) => {
  const { data } = await sendGetRequest2(
    `/admin/customers?page=${page}&page_limit=50&kycDocumentStatus=PENDING`
  );

  return data;
};

// Element Pending KYC Documents
export const getElementPendingKYC = async (page) => {
  const { data } = await sendGetRequest2(
    `/admin/customers?page=${page}&page_limit=50&elementkycStatus=PENDING`
  );

  return data;
};

// KYC Documents
export const getKYCDocuments = async (page) => {
  const { data } = await sendGetRequest2(
    `/dashboard/kyc-documents?page=${page}&page_limit=100`
  );

  return data;
};

//PROVIDER PAGE
export const getAllProviders = async (page) => {
  const { data } = await sendGetRequest2(
    `/admin/customers?userType=PROVIDER&page=${page}&page_limit=100`
  );

  return data;
};

// Savings Transactions
export const getSafelocks = async (page) => {
  const { data } = await sendGetRequest2(
    `/admin/safe-locks?page=${page}&limit=20`
  );
  return data;
};

export const getSingleSafelocks = async (userId, page) => {
  const { data } = await sendGetRequest2(
    `/admin/safe-locks?userId=${userId}&page=${page}&limit=20`
    // `/safe-lock/list?userId=${userId}&page=${page}&limit=20`
  );
  return data;
};

export const getVisaForms = async (page) => {
  const { data } = await sendGetRequest2(
    `/admin/fetch-all-visa-documents?page=${page}&page_limit=100`
  );
  return data;
};

export const getSavingsTransactions = async (page) => {
  const { data } = await sendGetRequest2(
    `/admin/safe-lock-activities?page=${page}&page_limit=100`
  );
  return data;
};
export const getSingleSavingsTransactions = async (userId, page) => {
  const { data } = await sendGetRequest2(
    // `/safe-lock/history?userId=${userId}&page=${page}&page_limit=100`
    `/admin/safe-lock-activities?userId=${userId}&page=${page}&page_limit=100`
  );
  return data;
};

export const getSavingsPlans = async (page) => {
  const { data } = await sendGetRequest2(`/admin/safe-plans`);
  return data;
};

// Transfers
export const getTransfers = async (page) => {
  const { data } = await sendGetRequest2(
    `/dashboard/alltransfers?page=${page}&page_limit=100`
  );
  return data;
};

export const getUserTransfers = async (userId) => {
  // console.log("transfer ID...", userId);
  const { data } = await sendGetRequest2(`/wallet/user-transfers/${userId}`);
  return data;
};

export const getUserMerchantTransactions = async (userId) => {
  // console.log("transfer ID...", userId);
  const { data } = await sendGetRequest2(`/merchant/user/${userId}`);
  return data;
};

// Transfers
export const getCountry = async (page) => {
  const { data } = await sendGetRequest2(`/AllCountryContents`);

  return data;
};

// Bulk Mail
export const sendBulkMail = async ({ subject, confirmEmailMsg }) => {
  const { data } = await sendPostRequest2("/send-bulk-email", {
    confirmEmailMsg,
    subject,
  });

  return data;
};

// Bulk Mail by SA
export const sendSAMailingForm = async ({ subject, confirmEmailMsg }) => {
  const { data } = await sendPostRequest2("/bulk-email-by-SA", {
    confirmEmailMsg,
    subject,
  });

  return data;
};

// Push Notification
export const sendPushNotification = async ({ subject, confirmPushMsg }) => {
  const { data } = await sendPostRequest2("/push-notification", {
    confirmPushMsg,
    subject,
  });

  return data;
};

// Blacklist User
export const blackListUser = async (customerId, reason) => {
  await sendPutRequest2("/admin/blacklist-and-unblock-user", {
    customerId,
    reason,
  });
};

// Unblock User
export const unblockUser = async (customerId, reason) => {
  await sendPutRequest2("/admin/blacklist-and-unblock-user", {
    customerId,
    reason,
  });
};

// Update User
export const updateUserWallet = async (
  userId,
  currency,
  remark,
  amount,
  action
) => {
  await sendPutRequest2("/admin/wallet-update", {
    userId,
    currency,
    remark,
    amount,
    action,
  });
};

// Deduct User
export const deductUserWallet = async (
  email,
  Currency,
  remark,
  amount,
  decrement
) => {
  await sendPostRequest2("/dashboard/update-wallet", {
    amount,
    Currency,
    remark,
    email,
    decrement,
  });
};

// Deduct Withdraw Switch
export const withdrawalSwitch = async (status) => {
  await sendPostRequest2("/dashboard/withdrawalSwitch", {
    status,
  });
};

// Exchange rate
export const setExchangeRate = async (value, amount) => {
  // console.log(value, amount);
  await sendPutRequest2("/admin/update-fx", {
    value,
    amount,
  });
};

// Update
export const updateCardBalance = async (email, amount) => {
  await sendPostRequest2("/dashboard/updateVirtualCardBalance", {
    amount,
    email,
  });
  1;

  //return data;
};

export const monoUpdateCardBalance = async (userId, amount, cardId) => {
  await sendPostRequest2("/mono/admin/fund_card", {
    amountInUsdCent: amount * 100,
    userId,
    cardId,
  });

  //return data;
};

// Create New Country
export const setNewCountry = async (CountryName, description, image) => {
  const item = {
    CountryName,
    description,
    image,
  };

  var form_data = new FormData();

  for (var key in item) {
    form_data.append(key, item[key]);
  }

  await sendPostRequest2("/NewCountry/Create", form_data);
};

// Post Country Topics
export const setCountryTopics = async (
  Country,
  description,
  CountryId,
  image
) => {
  const item = {
    Country,
    description,
    CountryId,
    image,
  };

  var form_data = new FormData();

  for (var key in item) {
    form_data.append(key, item[key]);
  }

  await sendPostRequest2("/countryContents/PostTopics", form_data);
};

export const adminUploadKyc = async (userId, image) => {
  await sendPostRequest2("/admin/upload-and-approve-kyc-document", {
    userId,
    image,
  });
};

// Approve Kyc
export const approveKyc = async (userId) => {
  await sendPutRequest2("/admin/update-kyc-two", {
    userId,
    status: "APPROVED",
  });
};

// Disapprove Kyc
export const disApproveKyc = async (userId, reason) => {
  await sendPutRequest2("/admin/update-kyc-two", {
    userId,
    status: "DISAPPROVED",
    reason,
  });
};
// Approve Element Kyc
export const approveElementKyc = async (userId) => {
  await sendPutRequest2("/admin/update-kyc-element", {
    userId,
    status: "APPROVED",
  });
};

// Disapprove Kyc
export const disApproveElementKyc = async (userId, reason) => {
  await sendPutRequest2("/admin/update-kyc-element", {
    userId,
    status: "DISAPPROVED",
    reason,
  });
};

// Approve provider
export const approveProvider = async (email) => {
  await sendPostRequest2("/provider/ApproveProvider", {
    email,
  });
};

// Approve provider
export const assignAdmin = async (email, adminType) => {
  await sendPostRequest2("/dashboard/AssignUserType", {
    email,
    adminType,
  });
};

// Disapprove provider
export const disApproveProvider = async (email) => {
  await sendPostRequest2("/provider/DisapproveProvider", {
    email,
  });
};

// send bulk payment reminder
export const bulkPaymentReminder = async () => {
  await sendPostRequest2("/admin/send-bulk-invoice-reminder");
};

// send single payment reminder
export const singlePaymentReminder = async (formId) => {
  await sendPostRequest2("/admin/send-individual-invoice-reminder", {
    formId,
  });
};

// send single payment reminder
export const selectedPaymentReminder = async (data) => {
  await sendPostRequest2("/admin/send-bulk-invoice-reminder-select", {
    data,
  });
};

// send single payment reminder
export const selectedPaymentApproval = async (id, paymentStatus) => {
  await sendPostRequestElement("/admin/admin-approve-visa-payment", {
    id,
    paymentStatus,
  });
};

// Transaction History
export const getTransactionHistory = async ({ page, email }) => {
  return (
    await sendPostRequest2(
      `/dashboard/checkUserTransactionHistory?page=${page}&page_limit=100`,
      {
        email,
      }
    )
  ).data;
};

// Transaction History
export const getTotal = async (email) => {
  return (
    await sendPostRequest2(
      "/dashboard/checkUserTransactionHistory?}&page_limit=100",
      {
        email,
      }
    )
  ).data.data;
};

// Weekly User History
export const getNumberOfUsers = async () => {
  const response = await sendGetRequest2(`/useranalytics/weekly`);
  return response.data.data;
};

// All Airtime Analytics
export const getAirtimeAnalytics = async () => {
  return (await sendGetRequest2("/airtimeanalytics/count", {})).data.data;
};

// Weekly Airtime Analysis
export const getAirtimeWeeklyAnalytics = async () => {
  return (await sendGetRequest2("/airtimeanalytics/weekly", {})).data.data;
};

// All Marchant Activities
export const getMarchantRegistration = async () => {
  return (await sendGetRequest2("/merchantanalytics/count", {})).data.data;
};

// Weekly Marchant Analysis
export const getMarchantWeeklyAnalytics = async () => {
  return (await sendGetRequest2("/merchantanalytics/weekly", {})).data.data;
};

// Weekly Airtime Analysis
export const getSavingAllAnalytics = async () => {
  return (await sendGetRequest2("/savingsanalytics/count", {})).data.data;
};

// Weekly Airtime Analysis
export const getSavingWeeklyAnalytics = async () => {
  return (await sendGetRequest2("/savingsanalytics/weekly", {})).data.data;
};

// All Savings Transaction Analysis
export const getAllSavingsTransactions = async () => {
  return (await sendGetRequest2("/savingtransactionanalytics/count", {})).data
    .data;
};

// Weekly Savings Transaction Analysis
export const getWeeklySavingsTransactions = async () => {
  return (await sendGetRequest2("/savingtransactionanalytics/weekly", {})).data;
};

// All Transfer Analysis
export const getAllTransferTransactions = async () => {
  return (await sendGetRequest2("/transferanalytics/count", {})).data.data;
};

// Weekly Transfer Analysis
export const getWeeklyTransferTransactions = async () => {
  return (await sendGetRequest2("/transferanalytics/weekly", {})).data.data;
};

// All VirtualCard Reservation Analysis Analysis
export const getAllVirtualCardReservation = async () => {
  return (await sendGetRequest2("/virtualcardsanalytics/count", {})).data.data;
};

// Weekly Virtual Card Reservation Analysis
export const getWeeklyVirtualCardReservation = async () => {
  return (await sendGetRequest2("/virtualcardsanalytics/weekly", {})).data.data;
};

// All Virtual Card Transaction Analysis
export const getAllVirtualCardTransactions = async () => {
  return (await sendGetRequest2("/virtualcardsanalytics/count", {})).data.data;
};

// Weekly Vurtual Transaction Analysis
export const getWeeklyVirtualCardTransactions = async () => {
  return (await sendGetRequest2("/virtualcardsanalytics/weekly", {})).data.data;
};

// Juice balance
export const getJuiceIntegratorBalance = async () => {
  return (await sendGetRequest2("/dashboard/juice/integratorBalance", {})).data
    .data;
};

// Juice wire balance
export const getJuiceWireBalance = async () => {
  return (await sendGetRequest2("/dashboard/juice/USD-Wire-Balance", {})).data
    .data.floatDetails.data;
};

// Assign Providus Account Number
export const assignProvidusAccountNumber = async (
  requestId,
  accountNumber,
  status
) => {
  return await sendPutRequest2("/admin/assign-account-number", {
    requestId,
    accountNumber,
    status,
  });
};

// Approve or decline withdrawal requests
export const approveDeclineWithdrawalRequestsStaging = async (
  requestId,
  status
) => {
  return await sendPostRequest2("/withdrawal/approval ", {
    requestId,
    status,
  });
};

export const approveDeclineWithdrawalRequests = async (
  requestId,
  status,
  reason
) => {
  return await sendPostRequest2("/admin/withdrawal/approval", {
    requestId,
    status,
    reason,
  });
};
export const approveDeclineBreakSafeRequests = async (requestId, status) => {
  return await sendPutRequest2("admin/update-break-safe-requests", {
    requestId,
    status,
  });
};

// Start Subsription
export const adminStartSubscription = async (value) => {
  return await sendPostRequest2(
    "/dashboard/userPlan/adminStartSubscription",
    value
  );
};

// Resend Password
export const adminResendPasswordEmail = async (value) => {
  return await sendPostRequest2("/auth/forgot-password-admin", value);
};

// Assign Providus Account Number
export const adminRecordMerchantTransaction = async (
  type,
  amount,
  currency,
  email
) => {
  return await sendPostRequest2(
    "/merchant/record_payment",
    type,
    amount,
    currency,
    email
  );
};

// Assign Providus Account Number
export const adminAddUserToWaitlist = async (formData) => {
  return await sendPostRequest2("/usaccount/admin_waitlist", formData);
};

// Get admin cards
export const getCustomerCards = async (userId) => {
  return await sendGetRequest2(`/admin/virtual-card-list?userId=${userId}`);
};

// Get admin cards
export const getCardTransactions = async (cardId) => {
  return await sendGetRequest2(
    `/dashboard/getCardTransactionsByCardId/${cardId}`
  );
};

// Get admin cards
export const getCardDetails = async (cardId) => {
  return await sendGetRequest2(
    `/juice/getUserCardTransactions/${cardId.cardId}`
  );
};

// Get admin cards
export const freezJuiceCard = async (cardId) => {
  return await sendPutRequest2(`/dashboard/juice/unfreezeJuiceCard/${cardId}`);
};

// Get admin cards
export const unfreezJuiceCard = async (cardId) => {
  return await sendPutRequest2(`/dashboard/juice/unfreezeJuiceCard/${cardId}`);
};

// Get pending acct requests
export const getAllPendingAccountRequests = async (page, status, search) => {
  let endpoint = `/admin/account-numbers?page=${page}&limit=50`;
  let queryParams = [];

  if (status) {
    queryParams.push(`status=${status}`);
  }
  if (search) {
    queryParams.push(`search=${search}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { data };
};

// Get petitions requests
export const getPetitionRequests = async (
  page,
  visaType,
  status,
  search,
  paymentStatus,
  reviewStatus
) => {
  let endpoint = `/admin/fetch-all-visa-documents?type=petition&page=${page}&limit=50`;
  let queryParams = [];

  if (status) {
    queryParams.push(`status=${status}`);
  }
  if (search) {
    queryParams.push(`search=${search}`);
  }
  if (visaType) {
    queryParams.push(`visaType=${visaType}`);
  }
  if (paymentStatus) {
    queryParams.push(`paymentStatus=${paymentStatus}`);
  }

  if (reviewStatus) {
    queryParams.push(`reviewStatus=${reviewStatus}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { data };
};

// Get STV Payments
export const getSTVRequests = async (
  page,
  visaType,
  status,
  search,
  paymentStatus,
  reviewStatus
) => {
  let endpoint = `/admin/fetch-all-visa-documents?type=stv&page=${page}&limit=50`;
  let queryParams = [];

  if (status) {
    queryParams.push(`status=${status}`);
  }
  if (search) {
    queryParams.push(`search=${search}`);
  }
  if (visaType) {
    queryParams.push(`visaType=${visaType}`);
  }

  if (paymentStatus) {
    queryParams.push(`paymentStatus=${paymentStatus}`);
  }

  if (reviewStatus) {
    queryParams.push(`reviewStatus=${reviewStatus}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { data };
};

export const getAllWithdrawalRequests = async (
  page,
  status,
  search,
  userId,
  currency,
  accountNumber,
  trxRef,
  endDate,
  startDate
) => {
  let endpoint = `/withdrawal-requests/search?page=${page}&limit=50`;
  let queryParams = [];

  if (userId) {
    queryParams.push(`userId=${userId}`);
  }
  if (currency) {
    queryParams.push(`currency=${currency}`);
  }
  if (accountNumber) {
    queryParams.push(`accountNumber=${accountNumber}`);
  }
  if (trxRef) {
    queryParams.push(`trxRef=${trxRef}`);
  }
  if (status) {
    queryParams.push(`status=${status}`);
  }
  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }

  if (search) {
    // Treat the searchQuery as the combined search term
    queryParams.push(`search=${search}`);
  } else {
    // If searchQuery is not provided, split it into firstName and lastName
    const queryParts = search?.trim().split(" ");
    if (queryParts?.length >= 2) {
      queryParams.push(`firstName=${queryParts[0]}`);
      queryParams.push(`lastName=${queryParts[1]}`);
    }
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest(endpoint);

  return { data };
};

// total withdrawal Amount
export const totlaWithdrawalAmount = async (currency) => {
  return await sendGetRequest2(`/withdrawal-requests-sum?currency=${currency}`);
};

// Update Dollar Limits
export const updateDollarLimit = async (limitAmountInCent) => {
  return await sendPutRequest2(`/user/dollar_limit`, limitAmountInCent);
};

// Get admin cards
export const virtualCardCredit = async (email, cardId, amountInUsdCent) => {
  return await sendPostRequest2(
    `/mono/admin/fund_card`,
    email,
    cardId,
    amountInUsdCent
  );
};

export const virtualCardDebit = async (cardId, amount) => {
  return await sendPostRequest2(`/admin/card/debit-v1-card`, {
    cardId,
    amount,
  });
};

// verify 2fa
export const Send2FACode = async (code, adminId) => {
  return await sendPostRequest2(`/admin/confirm-2fa`, { code, adminId });
};

// Resend 2FA
export const Resend2FACode = async () => {
  return await sendPostRequest2(`/admin/resend-2fa`);
};

// Get admin cards
export const deactivate2FA = async (email) => {
  return await sendPostRequest2(`/factorAuth/disable`, email);
};

// Get admin cards
export const activate2FA = async (email) => {
  return await sendPostRequest2(`/factorAuth/Enable`, email);
};

// Get admin cards
export const getAllAirtimeTransactions = async () => {
  return await sendGetRequest2(`/dashboard/All-Airtime-Recharge`);
};

// Get admin cards  fetchReferersSearch
export const fetchReferers = async (page) => {
  return await sendGetRequest2(
    `/admin/referrals?page=${page}&page_limit=100`
    // `/dashboard/fetchReferers?page=${page}&page_limit=100`
  );
};

// Pay element  fetchReferersSearch
export const PayElementReferers = async (data) => {
  return await sendPostRequestElement(
    `/admin/element/ApproveElementReferrals`,
    data
  );
};

// generateReport vesti
export const generateReportVesti = async (data) => {
  return await sendPostRequest2(`/admin/report/testTransactionReportPDF`, data);
};

// generateReport element
export const generateReport = async (data) => {
  return await sendPostRequestElement(
    `/admin/report/testTransactionReportPDF`,
    data
  );
};

// Get element  fetchReferersSearch
export const fetchElementReferers = async () => {
  return await sendGetRequestElement(
    `/element/dashboard/fetchReferers`
    // `/element/dashboard/fetchAllReferal?page=${page}&page_limit=100`
  );
};
// Get element fetchReferersRequest
export const fetchElementBonusRequests = async () => {
  return await sendGetRequestElement(`/element/admin/all_bonus_requests`);
};

export const fetchReferersSearch = async (referralSearch) => {
  return await sendGetRequest2(
    `/dashboard/fetchReferersSearch?referralEmail=${referralSearch}`
  );
};

// Get admin cards
export const getUserAirtimeTransactions = async (userId) => {
  return await sendGetRequest2(
    `/dashboard/Single-User-Airtime-Recharge/${userId}`
  );
};

// Get admin cards
export const initiateSWIFTWirePayout = async (
  userId,
  swift_code,
  account_number,
  amountCents,
  billing_address,
  country,
  account_holder_name,
  postalCode,
  district,
  city,
  bank_name,
  bank_zip,
  bank_city,
  bank_state,
  bank_address,
  email,
  remark
) => {
  return await sendPostRequest2(`/dashboard/juice/initiateSWIFTWirePayout`, {
    userId,
    swift_code,
    account_number,
    amountCents,
    billing_address,
    country,
    account_holder_name,
    postalCode,
    district,
    city,
    bank_name,
    bank_zip,
    bank_city,
    bank_state,
    bank_address,
    email,
    remark,
  });
};

// Get admin cards
export const initiateBICWirePayout = async (
  bic_code,
  account_number,
  amountCents,
  billing_address,
  country,
  account_holder_name,
  postalCode,
  district,
  city,
  bank_name,
  bank_zip,
  bank_city,
  bank_state,
  bank_address,
  email,
  remark
) => {
  return await sendPostRequest2(`/dashboard/juice/initiateBICWirePayout`, {
    bic_code,
    account_number,
    amountCents,
    billing_address,
    country,
    account_holder_name,
    postalCode,
    district,
    city,
    bank_name,
    bank_zip,
    bank_city,
    bank_state,
    bank_address,
    email,
    remark,
  });
};

// Get admin cards
export const initiateWirePayout = async (
  bank_state,
  routing_number,
  amountCents,
  billing_address,
  country,
  account_holder_name,
  postalCode,
  district,
  city,
  bank_name,
  bank_zip,
  bank_city,
  account_number,
  bank_address,
  email,
  remark
) => {
  return await sendPostRequest2(`/dashboard/juice/initiateWirePayout`, {
    bank_state,
    routing_number,
    amountCents,
    billing_address,
    country,
    account_holder_name,
    postalCode,
    district,
    city,
    bank_name,
    bank_zip,
    bank_city,
    account_number,
    bank_address,
    email,
    remark,
  });
};

// Get admin cards
export const getAllVirtualCardWaitlist = async (page) => {
  return await sendGetRequest2(
    `/vc/waitlist_applications?status=PENDING&page=${page}&page_limit=100`
  );
};

// Get all Founders card
export const AllFoundersCardUsers = async () => {
  return await sendGetRequest2(`/dashboard/founders-users`);
};

// export const getAllFoundersCardTransactions = async () => {
//   return await sendGetRequest2(`/dashboard/founders-users-transactions`);
// };

export const updateVirtualCardWaitlist = async (userId, status) => {
  return await sendPutRequest2(`/vc/waitlist_status_update`, userId, status);
};

export const updateNairaLimit = async (limitAmountInCent) => {
  return await sendPutRequest2(
    `/user/naira_withdrawal_limit`,
    limitAmountInCent
  );
};

// Old Get admin
// export const getAllAdminAccount = async () => {
//   return await sendGetRequest2(`/user/all_admin`);
// };

// New Get admin
export const getAllAdminAccount = async (page) => {
  return await sendGetRequest2(`/admin/lists?page=${page}&limit=50`);
};

// Role update
export const updateAdminRole = async (data) => {
  return await sendPutRequest2(`/admin/edit-member-profile`, data);
};

// Get admin Roles(new)
export const getAdminRoles = async () => {
  return await sendGetRequest2(`/admin/role/lists`);
};

// Get admin Roles(new)
export const sendAdminInvite = async (data) => {
  return await sendPostRequest2(`/admin/add-new-member`, data);
};

// Create Roles
export const adminCreateRole = async (data) => {
  return await sendPostRequest2(`/admin/role/create`, data);
};

// delete Admin
export const deleteAdmin = async (data) => {
  return await sendPutRequest2(`/admin/remove-admin`, data);
};

// Create Roles
export const CreatePlan = async (data) => {
  return await sendPostRequest2(`/admin/safe-lock/create-plan`, data);
};

// Create Roles
export const createPlanCategory = async (data) => {
  return await sendPostRequest2(`/admin/safe-lock/create-plan-category`, data);
};

// Create Roles
export const updateCategory = async (data) => {
  return await sendPostRequest2(`/admin/role/create`, data);
};

// Get admin
export const getAllAdminLogs = async (page) => {
  return await sendGetRequest2(
    `/admin/activity-log?page=${page}&page_limit=100`
  );
};

// Get exchange Rates(new-live)
export const getAllRates2 = async () => {
  return await sendGetRequest2(`/admin/vesti-fx?currency=USD`);
};

// Get exchange Rates(new)
export const getEveryRates2 = async () => {
  return await sendGetRequest2(`/app-config/list?source=vesti`);
};

// update instant withdrawal limits
export const updateInstantWithdrawalLimit = async (userId, value, key) => {
  return await sendPutRequest2(`/admin/update-transaction-limits`, {
    userId,
    value: value * 100,
    key,
  });
};
// Get admin cards
export const updateDailyWithdrawalLimit = async (userId, value, key) => {
  return await sendPutRequest2(`/admin/update-transaction-limits`, {
    userId,
    value: value * 100,
    key,
  });
};

// Get admin cards
export const updateInstantTransferLimit = async (userId, value, key) => {
  return await sendPutRequest2(`/admin/update-transaction-limits`, {
    userId,
    value: value * 100,
    key,
  });
};

// Get admin cards
export const updateDailyTransferLimit = async (userId, value, key) => {
  return await sendPutRequest2(`/admin/update-transaction-limits`, {
    userId,
    value: value * 100,
    key,
  });
};

export const getAllGlobalGengCards = async (page) => {
  return await sendGetRequest2(
    `/admin/physical-card-list?page=${page}&limit=50`
  );
};
export const getAllConnected = async (page) => {
  return await sendGetRequest2(
    `/admin/fetchPlatformConnectedAccount?page=${page}&limit=50`
  );
};

//safelock export URL
export const getAllSafelockExport = async (
  page,
  savingsId,
  userId,
  startDate,
  endDate,
  status,
  currency,
  paymentChannel
) => {
  let endpoint = `/admin//admin/safe-locks-export?page=${page}&limit=50`;
  let queryParams = [];

  if (savingsId) {
    queryParams.push(`savingsId=${savingsId}`);
  }
  if (userId) {
    queryParams.push(`userId=${userId}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }

  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (status) {
    queryParams.push(`status=${status}`);
  }
  if (currency) {
    queryParams.push(`currency=${currency}`);
  }
  if (paymentChannel) {
    queryParams.push(`paymentChannel=${paymentChannel}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { ...data };
};

//Get global-geng card  requests for users (live formerly staging)
export const getAllGlobalGengCards2 = async (
  page,
  transactionStatus,
  searchQuery,
  endDate,
  startDate,
  // userId,
  physicalCardId,
  state,
  email
) => {
  let endpoint = `/admin/physical-card-list?page=${page}&limit=50`;
  let queryParams = [];

  if (state) {
    queryParams.push(`state=${state}`);
  }
  if (endDate) {
    queryParams.push(`endDate=${endDate}`);
  }
  if (startDate) {
    queryParams.push(`startDate=${startDate}`);
  }
  if (transactionStatus) {
    queryParams.push(`status=${transactionStatus}`);
  }
  // if (userId) {
  //   queryParams.push(`userId=${userId}`);
  // }
  if (email) {
    queryParams.push(`email=${email}`);
  }
  if (physicalCardId) {
    queryParams.push(`physicalCardId=${physicalCardId}`);
  }

  if (searchQuery) {
    // Treat the searchQuery as the combined search term
    queryParams.push(`search=${searchQuery}`);
  } else {
    // If searchQuery is not provided, split it into firstName and lastName
    const queryParts = searchQuery.trim().split(" ");
    if (queryParts.length >= 2) {
      queryParams.push(`firstName=${queryParts[0]}`);
      queryParams.push(`lastName=${queryParts[1]}`);
    }
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  const transformedData = data.data.map(({ firstName, lastName, ...rest }) => ({
    fullName: firstName + " " + lastName,
    ...rest,
  }));
  return { ...data, transformedData };
};

export const updateGlobalGengCard = async (cardId, cardStatus, cardTempPin) => {
  return await sendPutRequest2(`/admin/physical-card-update`, {
    cardId,
    status: cardStatus,
    tempResetPin: cardTempPin,
  });
};

export const getMonoIssuingWalletBalance = async (page) => {
  return await sendGetRequest2(`/mono/vest-mono-wallet-balance/usd`);
};

// Get admin cards
export const generateMonoReference = async (fundingAmount) => {
  return await sendPostRequest2(`/mono/fund-vest-mono-wallet`, {
    amountInKoboCent: fundingAmount * 100,
    currency: "usd",
  });
};

export const monoReport = async (page) => {
  return await sendGetRequest2(`/dashboard/mono_card_details`);
};

export const monoCreatedCards = async (page) => {
  return await sendGetRequest2(`/mono/cards`);
};

export const identityPassBalance = async (page) => {
  return await sendGetRequest2(`/identity/balance`);
};

export const blacklistedUsersApi = async (page) => {
  return await sendGetRequest2(
    `/admin/customers?page=${page}&page_limit=100&blacklisted=true`
  );
};

export const updateUserProfiles = async (
  customerId,
  firstName,
  lastName,
  phoneNumber
) => {
  return await sendPutRequest2(`/admin/update-customer-profile`, {
    customerId,
    firstName,
    lastName,
    phoneNumber,
  });
};

export const approveTermsAndCondition = async (cardId) => {
  return await sendPostRequest2(`/stripe/acceptConnectCapability`, cardId);
};

export const monoLiveRates = async () => {
  return await sendGetRequest2(`/mono/rates`);
};

export const kycInputVerification = async (
  type,
  identityNumber,
  state,
  last_name
) => {
  return await sendPostRequest2("/identity/admin_verify", {
    identityNumber,
    state,
    last_name,
    type,
  });
};

export const L1kycApproval = async (email, verificationRef, type) => {
  return await sendPostRequest2("/identity/admin_approve_l1", {
    email,
    verificationRef,
    type,
  });
};

export const getAllPendingFBOTransactions = async (page) => {
  return await sendGetRequest2(
    `/fbio/admin/pending-transacts?page=${page}&page_limit=100`
  );
};

// export const getAllFBOTransactions = async (page) => {
//   return await sendGetRequest2(
//     `/fbio/transactions?page=${page}&page_limit=100&forFbo=true&trxStatus&trxType&trxRef&userId&nairaToUsd=true`
//   );
// };

export const getAllFBOTransactions = async (
  page,
  forFbo,
  nairaToUsd,
  trxStatus,
  searchQuery,
  trxType,
  trxRef,
  userId
) => {
  let endpoint = `/fbio/transactions?page=${page}&page_limit=100`;
  let queryParams = [];

  if (searchQuery) {
    queryParams.push(`search=${searchQuery}`);
  }
  if (forFbo) {
    queryParams.push(`forFbo=${forFbo}`);
  }
  if (userId) {
    queryParams.push(`userId=${userId}`);
  }
  if (trxStatus) {
    queryParams.push(`trxStatus=${trxStatus}`);
  }
  if (trxType) {
    queryParams.push(`trxType=${trxType}`);
  }
  if (trxRef) {
    queryParams.push(`trxRef=${trxRef}`);
  }

  if (nairaToUsd) {
    queryParams.push(`nairaToUsd=${nairaToUsd}`);
  }

  if (queryParams.length > 0) {
    endpoint += `&${queryParams.join("&")}`;
  }

  const { data } = await sendGetRequest2(endpoint);

  return { ...data };
};

export const updateFBOTransaction = async (
  trxRefence,
  newUserId,
  trxRefStatus
) => {
  return await sendPutRequest2(`admin/update-fbo-transaction`, {
    userId: newUserId,
    status: trxRefStatus,
    trxRef: trxRefence,
  });
};

export const depositUpdate = async (status, trxRef, userId) => {
  return await sendPutRequest2(`/admin/update-element-deposit-transaction`, {
    status,
    trxRef,
    userId,
  });
};

export const withdrawalUpdate = async (status, trxRef, userId) => {
  return await sendPutRequest2(`admin/update-element-withdrawal-transaction`, {
    status,
    trxRef,
    userId,
  });
};

// Get admin cards
export const connectStripeCreateAccount = async (email) => {
  return await sendPostRequest2(
    `/admin/stripe/connectStripeCreateAccount/${email}`
  );
};

// get fbo balance
export const FBOBalance = async () => {
  return await sendGetRequest2(`/fbio/account_info`);
};

// Get admin cards
export const createTreasuryAccountNumber = async (email) => {
  return await sendPostRequest2(
    `/admin/stripe/createTreasuryAccountNumber/${email}`
  );
};

// Get admin cards
export const createStripeVirtualCard = async (email) => {
  return await sendPostRequest2(
    `/admin/stripe/createStripeVirtualCard/${email}`
  );
};

// Get admin cards
export const FreezeAndUnfreeze = async (customerId, reason) => {
  return await sendPutRequest2(`/admin/freeze-and-unfreeze-user`, {
    customerId,
    reason,
  });
  // return await sendPostRequest2(`/dashboard/freeze-account`, { email });
};

// Get admin cards
export const AdminSpecificEmailsToUser = async (email, title, body) => {
  return await sendPostRequest2(`/admin/specific_user_email`, {
    email,
    title,
    body,
  });
};

// Get admin cards
export const AdminApproveReferralBonus = async (requestId, status) => {
  return await sendPutRequest2(`/admin/referral-bonus-update`, {
    requestId,
    status,
  });
};

// update visa payment status
export const AdminUpdateVisaPaymentStatus = async (
  requestId,
  paymentStatus
) => {
  return await sendPostRequest2(`/admin/admin-approve-visa-payment`, {
    requestId,
    paymentStatus,
  });
};

// Get admin cards
export const AdminRetrieveReferralBonusRequests = async (page) => {
  return await sendGetRequest2(
    `/admin/referral-bonus-requests?page=${page}&page_limit=100`
  );
};

export const AdminLogout = async () => {
  return await sendPutRequest2(`/auth/logout`, {});
};

// Get admin cards
export const AdminGetAllFrozenAccounts = async (page) => {
  return await sendGetRequest2(`/dashboard/freeze`);
};

// Get admin cards
export const createCardHolderADMINTemporary = async (
  cardPin,
  businessName,
  userfirstName,
  userlastName,
  email,
  limit,
  cardTypes,
  phoneNumber,
  approval,
  billingAddressLine1,
  billingAddressCity,
  billingAddressState,
  billingAddressPostalCode
) => {
  return await sendPostRequest2(
    `/admin/stripe/createCardHolderADMINTemporary`,
    {
      cardPin,
      businessName,
      userfirstName,
      userlastName,
      email,
      limit,
      cardTypes,
      phoneNumber,
      approval,
      billingAddressLine1,
      billingAddressCity,
      billingAddressState,
      billingAddressPostalCode,
    }
  );
};

export const FundCBCard = async (amountInCent, email, description) => {
  return await sendPostRequest2(`/vc/4/admin/fund`, {
    amountInCent,
    email,
    description,
  });
};

export const FundTyCard = async (cardId, amount) => {
  return await sendPostRequest2(`/admin/card/fund-v1-card`, {
    amount,
    cardId,
  });
};

export const fboBalance = async () => {
  return await sendGetRequest2(`/admin/fbo/balance`);
  // return await sendGetRequest2(`/fbio/account_info`);
};

export const fboCompletedTransactions = async () => {
  return await sendGetRequest2(`/fbio/admin-completed-trx`);
};

export const fboConversions = async () => {
  return await sendGetRequest2(`/fbio/conversions`);
};

// fbio/admin-completed-trx
