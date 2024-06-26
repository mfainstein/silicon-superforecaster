import { Scale } from "./scale";
import dotenv from "dotenv";
import { measurement } from "./measurement";
import { Population } from "./population";
import { Summary } from "./summary";
import { CalibrationMethod } from "./calibrate";

dotenv.config();

let population = new Population();
population.addAllModels(3, CalibrationMethod.TAVILY_SEARCH);
measurement("Israel will hold new elections by the end of 2024", Scale.Probability, population).then((response) => {
    Summary.create(response, Scale.Probability, true);
});

// next moves
// 1. Improve tooling (currently very basic) - should resolve the information once per model, with the aid of pre and post queries to the models
// 2. Ability to use as a cli tool
// 3. Express server side
// 4. React app dashboard 
