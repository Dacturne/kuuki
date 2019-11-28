import { ApiPaths } from "./ApiPaths";

/* If you require HTTPS, start the url with https:// */
export type PJPApiConfig = {
  domain?: string;
  paths?: ApiPaths;
};
