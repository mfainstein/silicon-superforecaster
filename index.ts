import { Model } from "./model";
import { Scale } from "./scale";
import dotenv from "dotenv";
import { measurement } from "./measurement";
import { Population } from "./population";
import { Summary } from "./summary";

dotenv.config();

let population = new Population();
population.addAllModels(5);
measurement("What is the probability that there are more than 3000 professional piano tuners in Chicago", Scale.Probability, population).then((response) => {
    Summary.create(response, Scale.Probability);
});

