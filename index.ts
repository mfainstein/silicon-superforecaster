import { Scale } from "./scale";
import dotenv from "dotenv";
import { measurement } from "./measurement";
import { Population } from "./population";
import { Summary } from "./summary";
import { CalibrationMethod } from "./calibrate";

dotenv.config();

let population = new Population();
population.addStrongModels(3, CalibrationMethod.TAVILY_SEARCH);
// export const HARD_CODED_CALIBRATION = "Based on the provided sources, there is no clear indication that Israel will win the 2024 Eurovision Song Contest. The sources mention several countries as favorites to win, including Ireland, Switzerland, Ukraine, and Croatia. The bookmakers' odds suggest that these countries have the highest chances of winning the competition. However, the sources do not specifically mention Israel as a strong contender for the 2024 Eurovision victory. It is important to note that the odds and predictions can change as the competition progresses, and the ultimate winner will be determined by the performances and votes received during the contest.";
export const HARD_CODED_CALIBRATION = "";
measurement("Israel will hold new elections by the end of 2024", Scale.Probability, population).then((response) => {
    Summary.create(response, Scale.Probability, true);
});

// next moves
// 1. Improve tooling (currently very basic) - should resolve the information once per model, with the aid of pre and post queries to the models
// 2. Ability to use as a cli tool
// 3. Express server side
// 4. React app dashboard 
