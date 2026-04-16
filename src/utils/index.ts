export const formatVND = (amount: number) => {
  return (
    amount
      .toLocaleString("vi-VN") // 👉 tự thêm dấu .
      .replace(/,/g, ".") + "đ"
  );
};
