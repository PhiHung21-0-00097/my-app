import { Api } from "../api";

export const AuthAPI = {
  login: (username: string, password: string) =>
    Api.post("/auth/login", { username, password }),
};
