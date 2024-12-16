# Sử dụng Node.js phiên bản tối ưu (ví dụ: 18-alpine)
FROM node:18-alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép tệp package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn của ứng dụng vào container
COPY . .

# Xây dựng ứng dụng Next.js (tạo thư mục .next)
RUN npm run build

# Mở cổng ứng dụng (mặc định của Next.js là 3000)
EXPOSE 3000

# Lệnh khởi động ứng dụng
CMD ["npm", "start"]
