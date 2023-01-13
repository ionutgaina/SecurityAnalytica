import { instance } from "../constants";

export interface IDeleteUser {
  userEmail: string;
}

export function deleteUser(user: IDeleteUser) {
  return instance.post("/delete_user", user, {
    headers: {
      "AccessToken": localStorage.getItem("accessToken") || "",
    },
  });
}
