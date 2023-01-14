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

export interface IGetFileInfo {
  fileSHA512Digest: string;
}

export interface IFileInfo {
  binData: any;
  fileName: string;
  digest: string;
  userId: string;
  _id: string;
  securityLevel: string;
}

export function getFileInfo(fileData: IGetFileInfo) {
  return instance.get<IFileInfo>("/file_info", {
    params: fileData,
  });
}

export interface IGetUserUrls {
  userEmail: string;
}

export function getUserFiles(data: IGetUserUrls) {
  return instance.get<IFileInfo[]>("/user_files", {
    params: data,
  });
}

export interface IDeleteFile {
  userEmail: string;
  fileSHA512Digest: string;
}

export function deleteFile(fileData: IDeleteFile) {
  return instance.post("/delete_file", fileData, {
    headers: {
      AccessToken: localStorage.getItem("accessToken") || "",
    },
  });
}
