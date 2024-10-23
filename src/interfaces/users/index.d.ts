import { PostData } from "interfaces/posts";
export interface UserAuth {
  user: User;
  access_token: string;
}

export interface UserDataAPI {
  user: User;
}

export interface UserData {
  username: string;
  first_name: string;
  last_name: string;
  profile: Profile;
  email: string;
}

export interface Profile {
  avatar: string;
  bio: string;
  link: string;
}

export interface ProfileDetailsData {
  user: UserData;
  posts: PostData[];
}
