import axios from "axios";
import { SalesGetResponsTsx } from "../model/salesGetrespons";
import { EmpGetRespons } from "../model/empGetRespons";

const HOST: string = "http://localhost:3000/sales/";
export class salesService {
    async getAllSales() {
        const response = await axios.get(HOST );
      const papers: SalesGetResponsTsx[] = response.data;
      return papers;
    }

    async getempSalesbyCout(month:string,year:string,cout:string) {
        const response = await axios.get(HOST+month+'/'+year+"/"+cout );
      const papers: EmpGetRespons[] = response.data;
      return papers;
    }



}