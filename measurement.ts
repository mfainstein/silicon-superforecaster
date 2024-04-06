import { Scale } from "./scale";
import { getValueByIndex, Model } from "./model";
import { measure } from "./measure";
import { Population } from "./population";


type Measurement = {
    model: Model;
    scale: Scale;
    result: any;
}
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function measureSequentiallyWithDelay(prompt: string, scale: Scale, model: Model, repetitions: number, delayMs: number = 1000): Promise<any[]> {
    let results = [];
    for (let i = 0; i < repetitions; i++) {
        // Call the promise-returning function
        let result = "N/A";
        try {
            result = await measure(prompt, scale, model);
        }
        catch (e) {
            console.log(e);
            result = "N/A"
        }
        results.push({ result: JSON.stringify(result), model: model });

        // Wait for the specified delay before continuing to the next iteration
        await delay(delayMs);
    }
    return results;
}

export async function measurement(prompt: string, scale: Scale, population: Population): Promise<any> {
    console.log("Measuring: "+prompt);
    let sequentialMeasurements: Promise<any>[] = [];
    for (let modelPopulation of population.get()) {
        sequentialMeasurements.push(measureSequentiallyWithDelay(prompt, scale, modelPopulation.model, modelPopulation.repetitions));
    }
    let results = await Promise.all(sequentialMeasurements);
    return results;
}