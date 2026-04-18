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
    <div className="min-h-screen bg-gray-500 p-4">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between bg-black p-4 rounded-none border-b border-zinc-900">
        {/* Logo Thương hiệu */}
        <div className="flex flex-col">
          <h1 className="text-xl font-extralight tracking-[0.3em] text-white uppercase italic">
            Restaurant{" "}
            <span className="font-bold not-italic text-zinc-500">Luxury</span>
          </h1>
          <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800 to-transparent mt-1" />
        </div>

        <div className="flex items-center gap-6">
          {/* Tổng số bàn - Badge tối giản */}
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-medium">
              System Capacity
            </span>
            <span className="text-sm font-light text-white tracking-tighter">
              {tables.length} Total Units
            </span>
          </div>

          {/* Nút Lịch sử - Biểu tượng quyền lực */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-full w-12 h-12 border-zinc-800 !bg-yellow-200 hover:bg-white hover:text-black transition-all duration-500 group"
              >
                <History
                  className="h-5 w-5 tracking-widest"
                  strokeWidth={1.5}
                />
                {paidOrders.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-300 text-[9px] font-bold text-black ring-2 ring-black">
                    {paidOrders.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l border-zinc-900 bg-[#050505] text-white"
            >
              {/* Header Lịch sử cố định */}
              <div className="p-2 border-b border-zinc-900 bg-black/50 backdrop-blur-md">
                <SheetHeader className="text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-3 border border-zinc-800 rounded-full">
                      <Receipt
                        className="h-5 w-5 text-zinc-400"
                        strokeWidth={1}
                      />
                    </div>
                    <div>
                      <SheetTitle className="text-lg font-extralight tracking-[0.2em] text-white uppercase">
                        Restaurant Luxury
                      </SheetTitle>
                      <p className="text-[10px] text-ưhwite uppercase tracking-widest mt-1 font-light">
                        Completed Transactions Today
                      </p>
                    </div>
                  </div>
                </SheetHeader>
              </div>

              {/* Danh sách cuộn */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full w-full">
                  <div className="px-6 py-4">
                    {paidOrders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-32 text-zinc-700">
                        {/* ... UI khi trống ... */}
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {paidOrders.map((order) => (
                          <div
                            key={order._id}
                            className="group relative border border-zinc-900 p-1 transition-all duration-500 hover:border-zinc-700 bg-black"
                          >
                            <CardHistoryPay order={order} />
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Padding bottom để không bị dính sát mép */}
                    <div className="h-20" />
                  </div>
                </ScrollArea>
              </div>

              {/* Footer Sheet */}
              <div className="p-6 border-t border-zinc-900 bg-black text-center">
                <p className="text-[8px] text-zinc-600 uppercase tracking-[0.4em]">
                  End of report
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 p-4">
        {tables.map((table) => {
          const hasCustomer = table.status === "occupied";
          const isPaying = table.status === "paying";

          // Cấu hình trạng thái theo tone Luxury
          let statusConfig = {
            label: "Available",
            color: "text-zinc-500",
            dot: "bg-zinc-800",
            accent: "border-zinc-800",
          };

          if (hasCustomer) {
            statusConfig = {
              label: "Occupied",
              color: "text-white",
              dot: "bg-white", // Thay vì đỏ, dùng trắng trên nền đen tạo sự quyền lực
              accent: "border-white",
            };
          }

          if (isPaying) {
            statusConfig = {
              label: "Processing",
              color: "text-amber-500",
              dot: "bg-amber-500",
              accent: "border-amber-500",
            };
          }

          return (
            <div
              key={table._id}
              className={`
          relative group overflow-hidden
          border ${statusConfig.accent} 
          ${hasCustomer ? "bg-zinc-900" : "bg-black"} 
          rounded-none p-5
          transition-all duration-500 ease-in-out
          hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]
        `}
            >
              {/* Chỉ báo trạng thái góc nhỏ */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot} animate-pulse`}
                  />
                  <span
                    className={`text-[9px] uppercase tracking-[0.2em] ${statusConfig.color}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-600 font-light">
                  #{table._id.slice(-3).toUpperCase()}
                </span>
              </div>

              {/* Tên bàn - Typography Mercedes style */}
              <h2 className="text-2xl font-extralight tracking-tighter text-white mb-8">
                {table.name}
              </h2>

              {/* Hệ thống nút bấm tối giản */}
              <div className="grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800 mb-3">
                <button
                  onClick={() => toggleCustomer(table)}
                  disabled={loadingId === table._id}
                  className={`
              py-3 text-[10px] uppercase tracking-widest transition-all
              ${
                hasCustomer
                  ? "bg-white text-black font-bold"
                  : "bg-black text-zinc-500 hover:text-white hover:bg-zinc-900"
              }
            `}
                >
                  {loadingId === table._id ? "..." : "Guest"}
                </button>

                <button
                  onClick={() => togglePaying(table)}
                  disabled={loadingId === table._id}
                  className={`
              py-3 text-[10px] uppercase tracking-widest transition-all
              ${
                isPaying
                  ? "bg-amber-500 text-black font-bold"
                  : "bg-black text-zinc-500 hover:text-white hover:bg-zinc-900"
              }
            `}
                >
                  {loadingId === table._id ? "..." : "Settle"}
                </button>
              </div>

              {/* Nút Xem chi tiết - Trong suốt & Tinh tế */}
              <button
                className="w-full py-2 text-[9px] uppercase tracking-[0.3em] text-zinc-400 border border-zinc-900 hover:border-zinc-500 hover:text-white transition-all"
                onClick={() => router.push(`/ban/${table._id}`)}
              >
                View Details
              </button>

              {/* Hiệu ứng đường kẻ mờ khi hover */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-500 group-hover:w-full" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
