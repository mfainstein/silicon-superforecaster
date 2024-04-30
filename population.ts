import { getAllModels, Model } from "./model";
import { CalibrationMethod } from "./calibrate";

export class Population {
    population: ModelPopulation[] = [];
    constructor() {
        this.population = [];
    }
    public addModel(model: Model, repetitions: number, calibrationMethod: CalibrationMethod) {
        let currentRepetitions = this.population.find((m) => m.model === model)?.repetitions;
        if (currentRepetitions) {
            repetitions += currentRepetitions;
        }
        else {
            this.population.push({ model, repetitions, calibrationMethod });
        }
    }

    public addAllModels(repetitions: number, calibrationMethod: CalibrationMethod) {
        for (let model of getAllModels()) {
            this.addModel(model as Model, repetitions, calibrationMethod);
        }
    }

    public addStrongModels(repetitions: number, calibrationMethod: CalibrationMethod) {
        this.addModel(Model.GPT4, repetitions, calibrationMethod);
        this.addModel(Model.CLAUDE_OPUS, repetitions, calibrationMethod);
        this.addModel(Model.GEMINI_PRO, repetitions, calibrationMethod);
    }

    public get(): ModelPopulation[] {
        return this.population;
    }
}
type ModelPopulation = {
    model: Model;
    repetitions: number;
    calibrationMethod: CalibrationMethod;
}