import { UserData } from "interfaces/users";

export interface PostData {
  id: number;
  user: UserData;
  media: Media[];
  comments: CommentData[];
  description: string;
  likes: string[];
  is_like: boolean;
  created: string;
  modified: string;
}

export interface Media {
  id: number;
  url: string;
  url_string: string;
  media_type: string;
  post: number;
}

export interface CommentData {
  id: number;
  post: number;
  user: UserData;
  comment: string;
  created: string;
}
