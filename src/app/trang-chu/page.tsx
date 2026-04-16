"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TableAPI } from "@/lib/tables/table.api";
import { History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
        <h1 className="text-lg font-bold">🍽️ Bàn ăn</h1>
        <div className="flex">
          <span className="text-sm text-gray-500">{tables.length} bàn</span>
          {/* add iocn history */}

          <Sheet>
            <SheetTrigger>
              <Button className="ml-2">
                <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <History />
                </Badge>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-500">
              <SheetHeader>
                <SheetTitle>Lịch sử</SheetTitle>
                <SheetDescription>Lịch sử các bàn đã sử dụng</SheetDescription>
              </SheetHeader>
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
