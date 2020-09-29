export type T_NPPESRecordBasic = {
  name_prefix?: string;
  name: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  credential?: string;
  gender: "M" | "F";
  sole_proprietor?: "NO" | "YES";
  enumeration_date: string;
  last_updated: string;
  status?: string;
}
