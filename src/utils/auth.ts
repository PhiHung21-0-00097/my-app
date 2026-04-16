const TOKEN_KEY = "access_token";

// lưu token
export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// lấy token
export const getToken = () => {
  if (typeof window === "undefined") return null; // tránh lỗi SSR
  return localStorage.getItem(TOKEN_KEY);
};

// xoá token (logout)
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// check login
export const isLoggedIn = () => {
  return !!getToken();
};
