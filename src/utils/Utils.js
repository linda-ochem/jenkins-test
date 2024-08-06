import resolveConfig from "tailwindcss/resolveConfig";

export const tailwindConfig = () => {
  // Tailwind config
  return resolveConfig("./src/css/tailwind.config.js");
};

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

export const formatThousands = (value) =>
  Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 3,
    notation: "compact",
  }).format(value);

export const getCurrency = (cur) => {
  switch (cur) {
    case "GBP":
    case "gbp":
      return "£";
    case "USD":
    case "USD":
      return "$";
    case "CAD":
      return "C$";
    case "NGN":
    case "ngn":
      return "₦";
    case "CEDIS":
    case "cedis":
    case "Cedis":
    case "GHS":
    case "ghs":
      return "GH₵";
    case "zmw":
    case "ZMW":
    case "KWACHA":
    case "kwacha":
    case "Kwacha":
      return "ZMW";
    default:
      return "";
  }
};

// export const formatAmount = (amount, n, x) => {
//   const re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
//   return amount?.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
// };

export const formatAmount = (amount, n, x) => {
  if (typeof amount !== "number") return null;

  const [integer, fraction = ""] = amount.toString().split(".");
  const re = `\\d(?=(\\d{${x || 3}})+(\\.|$))`;
  const formattedInteger = integer.replace(new RegExp(re, "g"), "$&,");

  return n > 0
    ? `${formattedInteger}.${fraction.padEnd(n, "0").slice(0, n)}`
    : formattedInteger;
};

export const replaceUnderscoreWithSpace = (text) => {
  // Check if the input text is a string
  if (typeof text !== "string") {
    console.error("Input is not a string");
    return text;
  }

  // Replace underscores with spaces using the replace method
  const newText = text.replace(/_/g, " ");

  return newText;
};
