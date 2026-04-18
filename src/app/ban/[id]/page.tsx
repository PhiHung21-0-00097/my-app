"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils";
import toast from "react-hot-toast";
import { OrderAPI } from "@/lib/orders/orders.api";
import { MenuAPI } from "@/lib/menu/menu.api";
import { Receipt, SkipBack } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableAPI } from "@/lib/tables/table.api";
import { ScrollArea } from "@/components/ui/scroll-area";

type MenuItem = {
  _id: string;
  name: string;
  price: number;
};

export default function TableDetailPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [table, setTable] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 🔥 load menu
        const menuData = await MenuAPI.getAll();
        setMenu(menuData);

        // 🔥 load order theo bàn
        const order = await OrderAPI.getByTable(id as string);
        console.log("order", order);
        if (order?.items) {
          // convert về state selected
          const mapped = order.items.map((i: any) => ({
            _id: i.menuItemId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          }));

          setSelected(mapped);
        }
      } catch (err) {
        console.log("Không có order cũ");
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    TableAPI.getById(id as string).then(setTable);
  }, [id]);

  // ➕ thêm món
  const addItem = (item: MenuItem) => {
    setSelected((prev) => {
      const exist = prev.find((i) => i._id === item._id);

      if (exist) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: (i.quantity || 0) + 1 } : i,
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };
  // ➖ giảm món
  const removeItem = (item: MenuItem) => {
    setSelected((prev) =>
      prev
        .map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  // 💾 lưu order
  const handleSave = async () => {
    try {
      setLoading(true);

      await OrderAPI.create({
        tableId: id,
        items: selected,
      });

      toast.success("Đã lưu order thành công");
    } catch (err: any) {
      toast.error(err.message || "Lưu order thất bại");
    } finally {
      setLoading(false);
    }
  };

  // 💰 tính tiền
  const total = selected.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handlePay = async () => {
    try {
      setLoading(true);

      await OrderAPI.pay(id as string);

      toast.success("Thanh toán thành công");

      // reset UI
      setSelected([]);
      setOpen(false);

      // quay về trang chủ
      router.push("/trang-chu");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const QRURL = `https://img.vietqr.io/image/TPB-0943244904-compact2.png?amount=${total}&addInfo=Thanh Toan ${table?.name} &accountName=NGUYEN%20HOANG%20PHI%20HUNG`;

  return (
    <div className="p-6 bg-[#050505] min-h-screen text-white antialiased">
      {/* Header: Trở về & Tên bàn */}
      <div className="flex items-center justify-between mb-10">
        <Link
          href={"/trang-chu"}
          className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors"
        >
          <div className="p-2 border border-zinc-900 rounded-full group-hover:border-zinc-500 transition-all">
            <SkipBack className="w-4 h-4" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em]">
            Quay lại
          </span>
        </Link>

        <div className="text-right">
          <h1 className="mb-2 text-2xl font-extralight tracking-widest uppercase italic">
            {table?.name || "Loading..."}
          </h1>
          <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em]">
            Restaurant Luxury
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* CỘT 1 & 2: THỰC ĐƠN (MENU) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-[11px] uppercase tracking-[0.5em] text-zinc-500 font-bold">
              Thực đơn tinh hoa
            </h2>
            <div className="h-[1px] flex-1 bg-zinc-900" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {menu.map((item) => {
              const selectedItem = selected.find((i) => i._id === item._id);
              return (
                <div
                  key={item._id}
                  className="group relative bg-black border border-zinc-900 p-4 transition-all duration-500 hover:border-zinc-600"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-light tracking-wide text-zinc-200 group-hover:text-white">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-zinc-600 mt-1 font-mono tracking-tighter italic">
                        {formatVND(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center border border-zinc-800 bg-zinc-950 px-1 py-1">
                      <button
                        onClick={() => removeItem(item)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-600 hover:text-white transition-colors"
                      >
                        —
                      </button>
                      <span className="w-8 text-center text-[10px] font-bold text-white">
                        {selectedItem?.quantity || 0}
                      </span>
                      <button
                        onClick={() => addItem(item)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT 3: TÓM TẮT HOÁ ĐƠN (BILL) */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 flex flex-col h-fit border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex items-center gap-3 mb-8">
              <Receipt className="w-4 h-4 text-zinc-500" strokeWidth={1} />
              <h2 className="text-[11px] uppercase tracking-[0.4em] text-white">
                Digital Ledger
              </h2>
            </div>

            <ScrollArea className="flex-1 max-h-[400px] mb-6 pr-4">
              {selected.length === 0 ? (
                <p className="text-[10px] text-zinc-700 uppercase tracking-widest text-center py-10 italic">
                  Chưa chọn món...
                </p>
              ) : (
                <div className="space-y-4">
                  {selected.map((i, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-end border-b border-zinc-900 pb-2"
                    >
                      <div className="flex-1">
                        <p className="text-[11px] text-zinc-300">{i.name}</p>
                        <p className="text-[9px] text-zinc-600">
                          SL: {i.quantity}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {formatVND(i.price * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <div className="border-t border-zinc-800 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">
                  Tổng cộng
                </span>
                <span className="text-2xl font-extralight tracking-tighter text-white">
                  {formatVND(total)}
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full py-4 text-[10px] uppercase tracking-[0.3em] border border-zinc-800 hover:bg-zinc-900 transition-all text-zinc-400"
              >
                {loading ? "Synchronizing..." : "Update Order"}
              </button>
              <button
                onClick={() => setOpen(true)}
                className="w-full py-4 text-[10px] uppercase tracking-[0.3em] bg-white text-black font-bold hover:bg-zinc-200 transition-all"
              >
                Settle Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DIALOG THANH TOÁN - LUXURY QR */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md bg-black border border-zinc-800 p-0 overflow-hidden">
          <div className="p-8 border-b border-zinc-900 bg-zinc-950">
            <DialogHeader>
              <DialogTitle className="text-center text-[13px] uppercase tracking-[0.5em] text-white">
                Final Settlement
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
              {selected.map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between text-[11px] border-b border-zinc-900 pb-2 italic"
                >
                  <span className="text-zinc-500">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="text-zinc-300">
                    {formatVND(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600">
                Total Amount
              </span>
              <span className="text-xl font-bold text-white">
                {formatVND(total)}
              </span>
            </div>

            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">
                Scan for secure payment
              </p>
              <div className="relative group p-4 bg-white rounded-none">
                <img
                  src={QRURL}
                  alt="QR"
                  className="w-64 h-64 grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 border-[20px] border-white pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-950 flex gap-4">
            <Button
              variant="outline"
              className="flex-1 rounded-none border-zinc-800 text-[10px] uppercase tracking-widest hover:bg-zinc-900"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-none bg-white text-black font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-200"
              onClick={handlePay}
            >
              Confirm Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
