import { API_URL, instance } from "../constants";
import { getUserEmail } from "./auth";

export interface IAddFile {
  userEmail: string;
  binData: any;
  fileName: string;
}

export function addFile(data: IAddFile) {
  return instance.post("/add_file", data, {
    headers: {
      AccessToken: localStorage.getItem("accessToken") || "",
    },
  });
}

