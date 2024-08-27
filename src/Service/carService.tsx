import axios from "axios";
import { CarGetRespons } from "../model/carGetRespons";

const HOST: string = "http://localhost:3000/car/";

export class carService {
    
    async getAllCar() {
        const response = await axios.get(HOST );
      const papers: CarGetRespons[] = response.data;
      return papers;
    }

    async getViwCar1() {
        const response = await axios.get(HOST+"economiccar");
      const papers: CarGetRespons[] = response.data;
      return papers;
    }
    async getViwCar2() {
        const response = await axios.get(HOST+"expensiveCar");
      const papers: CarGetRespons[] = response.data;
      return papers;
    }
    async getViwCar3() {
        const response = await axios.get(HOST+"luxuriouscar");
      const papers: CarGetRespons[] = response.data;
      return papers;
    }

     async editCar(table:string,id:string,body:{serial_no: String; brand: String;model: String; manufacturer: String;price: number}) {
        const response = await axios.put(HOST+table+'/'+id,body);
      const papers: CarGetRespons[] = response.data;
      return papers;
    }
    
    async addCar(table:string,body:{serial_no: String; brand: String;model: String; manufacturer: String;price: number}) {
        const response = await axios.post(HOST+table+'/',body);
      const papers: CarGetRespons[] = response.data;
      return papers;
    }
  }