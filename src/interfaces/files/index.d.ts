export interface FileData {
  id: number;
  versions: any[];
  name: string;
  public_id: string;
  url: string;
  type_file: string;
  json_field: JSONField;
  created: Date;
  modified: Date;
  user: number;
  folder: null;
}

export interface JSONField {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: Date;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  original_filename: string;
  api_key: string;
  derived: any[];
}
