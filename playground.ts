import { Scale } from "./scale";
import dotenv from "dotenv";
import { measurement } from "./measurement";
import { Population } from "./population";
import { Summary } from "./summary";
import { calibrate, CalibrationMethod, invoke } from "./calibrate";
import { Model } from "./model";

dotenv.config();
let prompt = "Bitcoin reaching 62k dollars this year";
// let calibration = invoke(CalibrationMethod.TAVILY_SEARCH, prompt).then((response) => {
//     console.log(response);
// });
let calibration = calibrate(Model.GPT4, Scale.Probability, CalibrationMethod.TAVILY_SEARCH, prompt).then((response) => {
    console.log(response);
} );