"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TableAPI } from "@/lib/tables/table.api";
import { Hash, History, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { OrderAPI } from "@/lib/orders/orders.api";
import { formatVND } from "@/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import CardHistoryPay from "@/components/common/CardHistoryPay";

type Table = {
  _id: string;
  name: string;
  status: "empty" | "occupied" | "paying";
};

export default function HomePage() {
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [paidOrders, setPaidOrders] = useState<any[]>([]);

  // 🔥 load từ backend
  useEffect(() => {
    const loadTables = async () => {
      try {
        setLoading(true);
        const data = await TableAPI.getAll();
        setTables(data);
      } catch (err) {
        console.error("Load tables error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  useEffect(() => {
    const loadPaidOrders = async () => {
      try {
        const data = await OrderAPI.getPaidOrders();
        setPaidOrders(data);
      } catch (err) {
        console.error("Load paid orders error:", err);
      }
    };

    loadPaidOrders();
  }, []);

  const updateStatus = async (table: Table, status: string) => {
    try {
      setLoadingId(table._id);

      const updated = await TableAPI.updateStatus(table._id, status);

      setTables((prev) => prev.map((t) => (t._id === table._id ? updated : t)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };
  // 🔴 toggle khách
  const toggleCustomer = (table: Table) => {
    const newStatus = table.status === "occupied" ? "empty" : "occupied";

    updateStatus(table, newStatus);
  };
  // 🟡 toggle tính tiền
  const togglePaying = (table: Table) => {
    const newStatus = table.status === "paying" ? "occupied" : "paying";

    updateStatus(table, newStatus);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">🍽️ Otis Luxury</h1>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full p-3 bg-blue-500 text-white"
          >
            {tables.length} bàn
          </Badge>
          {/* add iocn history */}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="relative rounded-full w-10 h-10 bg-yellow-500 text-white"
              >
                <History className="h-6 w-6" />
                {paidOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {paidOrders.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l bg-gray-500"
            >
              {/* Header cố định */}
              <div className="p-2 text-white border-b ">
                <SheetHeader className="text-left">
                  <div className="flex items-center gap-3">
                    <div>
                      <SheetTitle className="text-xl font-bold text-white">
                        Lịch sử thanh toán
                      </SheetTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hóa đơn đã hoàn tất trong ngày
                      </p>
                    </div>
                  </div>
                </SheetHeader>
              </div>

              {/* Danh sách cuộn */}
              <ScrollArea className="flex-1 p-6">
                {paidOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
                    <Receipt className="h-12 w-12 mb-4" />
                    <p className="text-sm">Chưa có giao dịch nào</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {paidOrders.map((order) => (
                      <div
                        key={order._id}
                        className="group relative overflow-hidden rounded-xl border bg-card  transition-all hover:shadow-md  bg-white text-black"
                      >
                        {/* Dải màu trang trí bên trái */}
                        <CardHistoryPay order={order} />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {tables.map((table) => {
          // 🔥 convert status → UI cũ của bạn
          const hasCustomer = table.status === "occupied";
          const isPaying = table.status === "paying";

          let border = "border-gray-300";
          let bg = "bg-white";
          let text = "Trống";
          let badge = "bg-gray-200 text-gray-700";

          if (hasCustomer) {
            border = "border-red-400";
            bg = "bg-red-50";
            text = "Có khách";
            badge = "bg-red-500 text-white";
          }

          if (isPaying) {
            border = "border-yellow-400";
            bg = "bg-yellow-50";
            text = "Tính tiền";
            badge = "bg-yellow-400 text-black";
          }

          return (
            <div
              key={table._id}
              className={`
                border ${border} ${bg}
                rounded-2xl p-3
                shadow-sm
                active:scale-95
                transition
              `}
            >
              {/* Top */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-sm">{table.name}</h2>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${badge}`}
                >
                  {text}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => toggleCustomer(table)}
                  disabled={loadingId === table._id}
                  className={`flex-1 text-xs py-2 rounded-lg ${
                    hasCustomer ? "bg-red-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {loadingId === table._id ? "..." : "Khách"}
                </button>

                <button
                  onClick={() => togglePaying(table)}
                  disabled={loadingId === table._id}
                  className={`flex-1 text-xs py-2 rounded-lg ${
                    isPaying ? "bg-yellow-400 text-black" : "bg-gray-200"
                  }`}
                >
                  {loadingId === table._id ? "..." : "Tính tiền"}
                </button>
              </div>

              {/* Xem */}
              <Button
                className="w-full h-9 text-sm rounded-xl"
                onClick={() => router.push(`/ban/${table._id}`)}
              >
                Xem
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
