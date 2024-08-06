export const CurrencyInput = ({ values, setValues }) => {
  return (
    <div>
      <label
        htmlFor="price"
        className="block text-sm font-medium text-gray-700"
      >
        Amount
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">
            {values.currency === "USD" && "$"}
            {values.currency === "NGN" && "₦"}
            {values.currency === "GHS" && "¢"}
            {values.currency === "ZMW" && "zmw"}
            {values.currency === "GBP" && "£"}
          </span>
        </div>
        <input
          type="text"
          name="price"
          className="focus:ring-blue-900 focus:border-blue-900 block w-full pl-11 pr-12 sm:text-sm border-gray-300 rounded-md"
          value={values.amount}
          onChange={(e) => setValues({ ...values, amount: e.target.value })}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <label htmlFor="currency" className="sr-only">
            Currency
          </label>
          <select
            name="currency"
            className="focus:ring-blue-900 focus:border-blue-900 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
            value={values.currency}
            onChange={(e) => setValues({ ...values, currency: e.target.value })}
          >
            <option value="NGN">NGN</option>
            <option value="GHS">GHS</option>
            <option value="USD">USD</option>
            <option value="ZMW">ZMW</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
      </div>
    </div>
  );
};
