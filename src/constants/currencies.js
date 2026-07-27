export const currencies = ["USD", "EUR", "NIS", "RUR"];

// Currencies the v2 pricing engine can convert (auto-charge). RUR is accepted
// for offline payments but has no conversion rate, so it's excluded here — used
// for v2 fixed-price coupons.
export const pricingCurrencies = ["USD", "EUR", "NIS"];
