import { MagaziePrintResponse } from "./MagaziePrintResponse";

export interface MagazieTotalResponse {
  articleName: string;
  articleCode: string;
  stockIn: number;
  stockOut: number;
  finalStock: number;
  stockProduction: number;
  locations: MagaziePrintResponse[];
}
