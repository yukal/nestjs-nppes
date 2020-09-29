import { T_NPPESRecord } from "./nppes-record";
import { T_NPPESResponseError } from "./nppes-response-error";

export type T_NPPESResponse = {
  Errors?: T_NPPESResponseError[];
  results?: T_NPPESRecord[];
  result_count?: number;
}
