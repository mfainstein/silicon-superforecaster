import { Model } from "./model";
import { Scale } from "./scale";
import dotenv from "dotenv";
import { measurement } from "./measurement";
import { Population } from "./population";
import { Summary } from "./summary";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

dotenv.config();

let population = new Population();
population.addAllModels(7);
measurement("What are the chances that humans will land on Mars by 2030?", Scale.Probability, population).then((response) => {
    Summary.create(response, Scale.Probability);
});




// const tool = new WikipediaQueryRun({
//   topKResults: 3,
//   maxDocContentLength: 10000,
// });

// const res = tool.call("OpenAI announces it has achieved AGI in 2024?").then((response) => {
//     console.log(response);
// });

// console.log(res);

// next step:
// add commander so it can be installed as a command line app
// add a way to specify the prompt and the scale from the command line
// also there should be a way to configure the .env keys from the command line

