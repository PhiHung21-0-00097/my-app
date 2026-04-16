"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/utils";
import toast from "react-hot-toast";
import { OrderAPI } from "@/lib/orders/orders.api";
import { MenuAPI } from "@/lib/menu/menu.api";
import { SkipBack } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableAPI } from "@/lib/tables/table.api";

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
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between">
        {/* add icon back */}
        <Link href={"/trang-chu"}>
          <SkipBack />
        </Link>

        <h1 className="text-lg font-bold ">
          🪑 {table?.name || "Đang tải..."}
        </h1>
      </div>

      {/* MENU */}
      <div className="space-y-3 mb-4">
        {menu.map((item) => {
          const selectedItem = selected.find((i) => i._id === item._id);

          return (
            <div
              key={item._id}
              className="bg-white p-3 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">{formatVND(item.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => removeItem(item)}
                  className="px-2 bg-gray-200 rounded"
                >
                  -
                </button>

                <span>{selectedItem?.quantity || 0}</span>

                <button
                  onClick={() => addItem(item)}
                  className="px-2 bg-green-500 text-white rounded"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BILL */}
      <div className="bg-white p-4 rounded-xl shadow mb-4">
        <h2 className="font-bold mb-2">🧾 Hoá đơn</h2>

        {selected.map((i, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>
              {i.name} x{i.quantity}
            </span>
            <span>{formatVND(i.price * i.quantity)}</span>
          </div>
        ))}

        <div className="mt-2 font-bold flex justify-between">
          <span>Tổng</span>
          <span>{formatVND(total)}</span>
        </div>
      </div>

      {/* ACTION */}
      <div className="flex gap-2">
        <Button className="flex-1" onClick={handleSave}>
          {loading ? "Đang lưu" : "Lưu"}
        </Button>

        <Button
          className="flex-1 bg-yellow-400 text-black"
          onClick={() => setOpen(true)}
        >
          Thanh toán
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl max-w-md bg-gray-500">
          <DialogHeader>
            <DialogTitle className="text-center text-lg">
              🧾 Hoá đơn
            </DialogTitle>
          </DialogHeader>

          {/* LIST MÓN */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {selected.map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm border-b pb-1"
              >
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span className="font-medium">
                  {formatVND(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between font-bold text-lg mt-3 border-t pt-2">
            <span>Tổng</span>
            <span className="text-green-600">{formatVND(total)}</span>
          </div>
          {/* 🔥 QR CODE */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-sm text-gray-500">Quét mã để thanh toán</p>

            <div className="bg-white p-3 rounded-xl shadow">
              <img src={QRURL} alt="QR Thanh toán" className="w-80 h-80" />
            </div>
          </div>
          {/* ACTION */}
          <DialogFooter className="flex flex-row justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className=""
              onClick={() => setOpen(false)}
            >
              Huỷ
            </Button>

            <Button className=" bg-green-600" onClick={handlePay}>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
