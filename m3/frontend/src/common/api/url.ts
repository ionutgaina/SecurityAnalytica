import { instance } from "../constants";

export interface IAddUrl {
  userEmail: string;
  urlAddress: string;
}

export function addUrl(data: IAddUrl) {
  return instance.post("/add_url", data, {
    headers: {
      AccessToken: localStorage.getItem("accessToken") || "",
    },
  });
}

export interface IGetUrlInfo {
  urlAddress: string;
}

export interface IUrlInfo {
  addr: string;
  aliases: string[];
  securityLevel: string;
  userId: string;
  _id: string;
}

export function getUrlInfo(urlData: IGetUrlInfo) {
  return instance.get<IUrlInfo>("/url_info", {
    params: urlData,
  });
}

export interface IGetUserUrls {
  userEmail: string;
}

// export interface IUserUrls {
//   urls: IUrlInfo[];
// }

export function getUserUrls(userData: IGetUserUrls) {
  return instance.get<IUrlInfo[]>("/user_urls", {
    params: userData,
  });
}

export interface IDeleteUrl {
  userEmail: string;
  urlAddress: string;
}

export function deleteUrl(urlData: IDeleteUrl) {
  return instance.delete("/delete_url", {
    data: urlData,
    headers: {
      AccessToken: localStorage.getItem("accessToken") || "",
    },
  });
}
