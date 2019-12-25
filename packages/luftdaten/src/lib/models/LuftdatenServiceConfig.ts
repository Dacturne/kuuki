import { ApiPaths } from "./ApiPaths";
import { IFetch } from "../interfaces/IFetch";

export type LuftdatenServiceConfig = {
  paths?: ApiPaths;
  fetch?: IFetch;
};
