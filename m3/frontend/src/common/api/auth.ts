import axios from "axios";
import { API_URL } from "../constants";

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

const instance = axios.create({
  baseURL: API_URL,
  headers: {'Content-Type': 'application/json'},
});

export function register(user: IUserRegister) {
  return instance.post("/signup", user);
}

export function login(user: IUserLogin) {
  return instance.post("/login", user);
}

export function hasToken() {
  return !!localStorage.getItem("accessToken");
}