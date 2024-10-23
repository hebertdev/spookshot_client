import { axiosInstanceBackend } from "helpers/axios";

//interfaces
import { UserData, UserAuth, ProfileDetailsData } from "interfaces/users";

interface Credentials {
  email: string;
  password: string;
}

interface PasswordChange {
  old_password: string;
  new_password: string;
}

export async function loginAPI(credentials: Credentials) {
  const { data } = await axiosInstanceBackend.post<UserAuth>("/users/login/", {
    email: credentials.email,
    password: credentials.password,
  });

  return data;
}

export async function signupAPI(usuario: any) {
  const { data } = await axiosInstanceBackend.post("/users/signup/", usuario);
  return data;
}

export async function deleteTokenAPI() {
  const { data } = await axiosInstanceBackend.get("/users/delete/token/");
  return data;
}

export async function whoamiAPI() {
  const { data } = await axiosInstanceBackend.get<UserData>(
    "/users/whoami/me/"
  );
  return data;
}

export async function editProfileAPI(user: UserData, profile: any) {
  const { data } = await axiosInstanceBackend.patch<UserData>(
    `/users/${user.username}/profile_edit/`,
    profile
  );
  return data;
}

export async function editUserAPI(user: UserData, usuario: any) {
  const { data } = await axiosInstanceBackend.patch(
    `/users/${user.username}/`,
    usuario
  );
  return data;
}

export async function editPasswordAPI(password: PasswordChange) {
  const { data } = await axiosInstanceBackend.put(
    "/change_password/",
    password
  );
  return data;
}

export async function profileDetailsAPI(username: string, headers: any) {
  const { data } = await axiosInstanceBackend.get<ProfileDetailsData>(
    `/users/${username}/`,
    {
      headers: headers,
    }
  );
  return data;
}

export async function getUserPostsAPI(username: string) {
  const { data } = await axiosInstanceBackend.get(`/users/${username}/posts/`);
  return data;
}
