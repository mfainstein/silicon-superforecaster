import { getAllModels, Model } from "./model";

export class Population {
    population: ModelPopulation[] = [];
    constructor() {
        this.population = [];
    }
    public addModel(model: Model, repetitions: number) {
        let currentRepetitions = this.population.find((m) => m.model === model)?.repetitions;
        if (currentRepetitions) {
            repetitions += currentRepetitions;
        }
        else {
            this.population.push({ model, repetitions });
        }
    }
    public addAllModels(repetitions: number) {
        for (let model of getAllModels()) {
            this.addModel(model as Model, repetitions);
        }
    }

    public addStrongModels(repetitions: number) {
        this.addModel(Model.GPT4, repetitions);
        this.addModel(Model.CLAUDE_OPUS, repetitions);
        this.addModel(Model.GEMINI_PRO, repetitions);
    }

    public get(): ModelPopulation[] {
        return this.population;
    }
}
type ModelPopulation = {
    model: Model;
    repetitions: number;
}