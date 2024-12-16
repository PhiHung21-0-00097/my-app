FROM node:alpine

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Copy file package.json và package-lock.json (nếu có) để cài đặt dependencies
COPY package*.json /app/

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ ứng dụng (bao gồm cả thư mục src)
COPY . /app/

# Thiết lập thư mục làm việc trong src (nếu app.js nằm trong thư mục src)
WORKDIR /app/src

# Mở cổng mà ứng dụng sẽ chạy (ví dụ: 3000)
EXPOSE 3000

# Lệnh để chạy ứng dụng của bạn
CMD ["node", "app.js"]
