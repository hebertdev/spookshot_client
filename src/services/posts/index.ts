import { axiosInstanceBackend } from "helpers/axios";
import { PostData } from "interfaces/posts";

export async function getPostsAPI() {
  const { data } = await axiosInstanceBackend.get<PostData[]>("/posts/");
  return data;
}

type MediaX = "image" | "video";

type PostObject = {
  description: string;
  media: string[];
  type_media: MediaX;
};

export async function newPostAPI(object: PostObject) {
  const { data } = await axiosInstanceBackend.post<PostData>(`/posts/`, object);
  return data;
}

export async function getPostDetailsAPI(id: number | string, headers: any) {
  const { data } = await axiosInstanceBackend.get(`/posts/${id}/`, {
    headers: headers,
  });
  return data;
}

export async function addLikePostAPI(id: number) {
  const { data } = await axiosInstanceBackend.post(`/posts/${id}/add-like/`);
  return data;
}

export async function removeLikePostAPI(id: number) {
  const { data } = await axiosInstanceBackend.post(`/posts/${id}/remove-like/`);
  return data;
}

export async function addCommentPostAPI(id: number, comment: string) {
  const { data } = await axiosInstanceBackend.post(
    `/posts/${id}/add-comment/`,
    {
      comment: comment,
    }
  );
  return data;
}
