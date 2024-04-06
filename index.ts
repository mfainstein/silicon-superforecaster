import { Model } from "./model";
import { Scale } from "./scale";
import dotenv from "dotenv";
import { measurement } from "./measurement";
import { Population } from "./population";

dotenv.config();

let population = new Population();
population.addAllModels(5);

measurement("What is the probability of an earthquake with a magnitude of 7 or higher on the Richter scale occurring in Israel before 2100?", Scale.Probability, population).then((response) => {
    console.log(response);
});

