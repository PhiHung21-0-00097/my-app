import { Api } from "../api";

export const TableAPI = {
  getAll: () => Api.get("/tables"),

  updateStatus: (id: string, status: string) =>
    Api.patch(`/tables/${id}/status`, { status }),

  getById: (id: string) => Api.get(`/tables/${id}`),
};
