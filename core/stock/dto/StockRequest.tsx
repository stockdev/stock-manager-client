import Article from "@/core/articles/model/Article";
import Location from "@/core/locations/model/Location";
import { StockType } from "../enums/StockType";
import { SubStockType } from "../enums/SubStockType";

export interface StockResponse {
    id: number; 
    location: Location; 
    article: Article; 
    stockType: StockType; 
    subStockType: SubStockType; 
    orderNumber: string; 
    quantity: number;
    necessary: number; 
    transactionDate: string; 
  }