import { instance } from "../constants";

export interface IUserRegister {
  userEmail: string;
  username: string;
  password: string;
  name?:string;
  desc?:string;
}

export interface IUserLogin {
  userEmail: string;
  password: string;
}

export function register(user: IUserRegister) {
  return instance.post("/signup", user);
}

export function login(user: IUserLogin) {
  return instance.post("/login", user);
}

export function hasToken() {
  return !!localStorage.getItem("accessToken");
}

export function getUserEmail() {
  return localStorage.getItem("userEmail") || "";
}