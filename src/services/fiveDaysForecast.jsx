import publicAxios from "../config/axios";

export const fiveDaysForecastRequest = async () => {
  return publicAxios.get("/");
};
