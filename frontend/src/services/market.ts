import api from "./api";

export interface MarketPrice {
  commodity: string;
  state: string;
  district: string;
  market: string;
  modal_price: string;
  min_price: string;
  max_price: string;
  arrival_date: string;
}

export const marketService = {

  // Dashboard (Top 5 prices)
  getDashboardPrices() {
    return api.get("/market/dashboard");
  },

  // Single commodity price
  getPrice(
    commodity: string,
    state: string
  ) {
    return api.get<MarketPrice>(
      "/market/price",
      {
        params: {
          commodity,
          state,
        },
      }
    );
  },

};