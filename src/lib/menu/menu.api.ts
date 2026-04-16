import { Api } from "../api";

export const MenuAPI = {
  getAll: () => Api.get("/menu"),
};
