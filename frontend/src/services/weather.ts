import api from "./api";

export interface WeatherResponse {
  city: string;
  temperature: number;
  humidity: number;
  condition: string;
  description: string;
  wind_speed: number;
  icon?: string;
}

export const weatherService = {

  // Current weather using city name
  getCurrent(city: string) {
    return api.get<WeatherResponse>("/weather/current", {
      params: { city },
    });
  },

  // Current weather using latitude & longitude
  getCurrentByLocation(lat: number, lon: number) {
    return api.get<WeatherResponse>("/weather/current-location", {
      params: { lat, lon },
    });
  },

  // 5-day forecast
  getForecast(lat: number, lon: number) {
    return api.get("/weather/forecast", {
      params: { lat, lon },
    });
  },

  // Convert city → coordinates
  getCoordinates(city: string) {
    return api.get("/weather/geocode", {
      params: { city },
    });
  },

};