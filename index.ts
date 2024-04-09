import { Model } from "./model";
import { Scale } from "./scale";
import dotenv from "dotenv";
import { measurement } from "./measurement";
import { Population } from "./population";
import { Summary } from "./summary";

dotenv.config();

let population = new Population();
population.addAllModels(5);
measurement("What is the probability that the context window (for LLMs) measured by tokens will double by January 2025?", Scale.Probability, population).then((response) => {
    Summary.create(response, Scale.Probability);
});

// next step:
// add commander so it can be installed as a command line app
// add a way to specify the prompt and the scale from the command line
// also there should be a way to configure the .env keys from the command line

