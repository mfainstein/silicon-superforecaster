import { Model } from "./model";
import { Scale } from "./scale";
import dotenv from "dotenv";
import { measurement } from "./measurement";
import { Population } from "./population";

dotenv.config();

let population = new Population();
population.addAllModels(5);

measurement("What is the probability that the world population would double by 2050?", Scale.Probability, population).then((response) => {
    console.log(response);
});

