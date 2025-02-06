import Article from "@/core/articles/model/Article";
import Location from "@/core/locations/model/Location";
import { StockType } from "../enums/StockType";
import { SubStockType } from "../enums/SubStockType";


export interface Stock {
  id: number; 
  orderNumber: string; 
  quantity: number; 
  necessary: number;
  transactionDate: string; 
  stockType: StockType;
  subStockType: SubStockType; 
  article: Article; 
  location: Location; 
}
