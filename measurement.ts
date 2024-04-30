import { Scale } from "./scale";
import { getValueByIndex, Model } from "./model";
import { measure } from "./measure";
import { Population } from "./population";
import { calibrate, CalibrationMethod } from "./calibrate";
type Measurement = {
    model: Model;
    scale: Scale;
    result: any;
}
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function measureSequentiallyWithDelay(prompt: string, scale: Scale, model: Model, repetitions: number, calibrationMethod:CalibrationMethod, spinnies:any, delayMs: number = 1000): Promise<any[]> {
    let results = [];
    spinnies.add(model, { text: 'Calibrating... '+model, color: 'blue' });
    let calibration = await calibrate(model, scale, calibrationMethod, prompt);
    console.log("Calibration done: "+calibration);
    for (let i = 0; i < repetitions; i++) {
        spinnies.update(model, { text: 'Measuring... '+model+" "+(i)+"/"+repetitions, color: 'blue' });
        // Call the promise-returning function
        let result = "N/A";
        try {
            result = await measure(prompt, model, scale, calibration);
        }
        catch (e) {
            console.log(e);
            result = "N/A"
        }
        results.push({ result: JSON.stringify(result), model: model });
        // Wait for the specified delay before continuing to the next iteration
        await delay(delayMs);
    }
    spinnies.succeed(model, { text: 'Measuring... '+model+" done ("+repetitions+")", color: 'green' });
    return results;
}

export async function measurement(prompt: string, scale: Scale, population: Population): Promise<any> {
    console.log("Measuring: "+prompt);
    let sequentialMeasurements: Promise<any>[] = [];
    let Spinnies = require('spinnies');
    const spinnies = new Spinnies();
    for (let modelPopulation of population.get()) {
        sequentialMeasurements.push((measureSequentiallyWithDelay(prompt, scale, modelPopulation.model, modelPopulation.repetitions, modelPopulation.calibrationMethod, spinnies)));
    }
    let results = await Promise.all(sequentialMeasurements);
    return results;
}