import { StockType } from "../enums/StockType";
import { SubStockType } from "../enums/SubStockType";

export interface UpdateStockRequest {
  locationCode: string; 
  articleCode: string;
  stockType: StockType; 
  subStockType: SubStockType; 
  orderNumber: string; 
  quantity: number;
  necessary: number; 
}
