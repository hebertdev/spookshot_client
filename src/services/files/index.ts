import { axiosInstanceBackend } from "helpers/axios";
import { FileData } from "interfaces/files";

export async function uploadFileAPI(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axiosInstanceBackend.post<FileData>(
    "/files/",
    formData
  );
  return data;
}

export async function getFilesAPI() {
  const { data } = await axiosInstanceBackend.get<FileData[]>("/files/");
  return data;
}

export async function getFileAPI(id: number | string) {
  const { data } = await axiosInstanceBackend.get<FileData>(`/files/${id}/`);
  return data;
}

export async function transformFileAPI(id: number | string, params: any) {
  const { data } = await axiosInstanceBackend.post(
    `/files/${id}/effects-transformation/`,
    params
  );
  return data;
}

export async function halloweenBgAPI(id: number | string, params: any) {
  const { data } = await axiosInstanceBackend.post(
    `/files/${id}/effects-halloween/`,
    params
  );
  return data;
}

export async function videoScreamerAPI(id: number | string, params: any) {
  const { data } = await axiosInstanceBackend.post(
    `/files/${id}/effects-video-screamer/`,
    params
  );
  return data;
}

export async function savedTransformationsAPI(
  id: number | string,
  content: { description: string; url: string; public_id: string }
) {
  const { data } = await axiosInstanceBackend.post(
    `/files/${id}/save-transformation/`,
    content
  );
  return data;
}
