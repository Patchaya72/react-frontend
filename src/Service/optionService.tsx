import axios from "axios";
import { OptionsGetRespons } from "../model/optionsGetRespons";
import { CarAllopionsGetResponsTsx } from "../model/carAllopionsGetRespons";

const HOST: string = "http://localhost:3000/option/";
export class optionService {
    async getAllCarbyOpt() {
        const response = await axios.get(HOST );
      const papers: OptionsGetRespons[] = response.data;
      return papers;
    }

    async getAllCarOpt() {
        const response = await axios.get(HOST+"getAllCarOpt" );
      const papers: CarAllopionsGetResponsTsx[] = response.data;
      return papers;
    }
}