import { Api } from "../api";

export const OrderAPI = {
  create: (data: any) => Api.post("/orders", data),

  getByTable: (tableId: string) => Api.get(`/orders/table/${tableId}`),

  pay: (orderId: string) => Api.patch(`/orders/${orderId}/pay`, {}),
};
