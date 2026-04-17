import { formatVND } from "@/utils";
import { Badge } from "@/components/ui/badge"; // Nhớ check lại path của Shadcn Badge
import { useState, useEffect } from "react";
import { TableAPI } from "@/lib/tables/table.api";

export default function CardHistoryPay({ order }: { order: any }) {
  const [tableName, setTableName] = useState<string>("");

  useEffect(() => {
    // Nếu tableId là object (đã populate) thì lấy luôn name
    if (typeof order.tableId === "object" && order.tableId?.name) {
      setTableName(order.tableId.name);
      return;
    }

    // Nếu tableId là string (ID), tiến hành gọi API lấy chi tiết bàn
    const fetchTableName = async () => {
      try {
        if (order.tableId) {
          const tableData = await TableAPI.getById(order.tableId);
          console.log("tableData", tableData);
          setTableName(tableData.name);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tên bàn:", error);
        setTableName("N/A");
      }
    };

    fetchTableName();
  }, [order.tableId]);

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-4 transition-all hover:shadow-md">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />

      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              #{order._id.slice(-5).toUpperCase()}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <h4 className="font-bold text-slate-900 truncate">
            {/* Hiển thị tên bàn đã fetch được, nếu chưa có thì hiện "Đang tải..." hoặc ID */}
            {tableName ? `${tableName}` : "Đang tải..."}
          </h4>
        </div>

        <div className="text-right flex flex-col items-end">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-emerald-500/10 text-emerald-600 mb-2">
            Thành công
          </div>
          <span className="text-lg font-black text-slate-900">
            {formatVND(order.total)}
          </span>
        </div>
      </div>
      <div className=" space-y-1.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Chi tiết món:
        </p>
        <div className="grid grid-cols-2  gap-1">
          {order.items?.map((item: any) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-slate-50 bg-slate-900/50 px-2 py-1 rounded-md group/item  transition-colors"
            >
              <span className="text-[11px] font-medium  text-slate-300 truncate mr-2">
                {item.name}
              </span>
              <span className="text-[10px] font-bold bg-green-600 border px-1.5 py-0.5 rounded shadow-sm text-white">
                x{item.quantity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
