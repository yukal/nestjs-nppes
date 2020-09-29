import { T_NPPESRecordAddresses } from "./nppes-record-addresses";
import { T_NPPESRecordBasic } from "./nppes-record-basic";
import { T_NPPESRecordIdentifiers } from "./nppes-record-identifiers";
import { T_NPPESRecordOtherNames } from "./nppes-record-othernames";
import { T_NPPESRecordPracticeLocations } from "./nppes-record-practicelocations";
import { T_NPPESRecordTaxonomies } from "./nppes-record-taxonomies";

export type T_NPPESRecord = {
  enumeration_type: string;
  last_updated_epoch: number;
  created_epoch: number;
  number: number;
  basic: T_NPPESRecordBasic;
  other_names: T_NPPESRecordOtherNames[];
  taxonomies: T_NPPESRecordTaxonomies[];
  identifiers: T_NPPESRecordIdentifiers[];
  addresses: T_NPPESRecordAddresses[];
  practiceLocations: T_NPPESRecordPracticeLocations[];
}
