import { Scale } from "./scale";

export class Summary {
    private static toFixed(input: number) {
        let roundedString: string = input.toFixed(2); // This will be "24.44" as a string

        // Convert the string back to a number using the unary plus operator
        let roundedNumber: number = +roundedString;
        return roundedNumber;
    }

    public static calculateOptionCount(data: any[]): any {

        const ervy = require('ervy')
        const { fg } = ervy
        let styles = [fg('cyan', '+ '), fg('magenta', '- '), fg('yellow', '0 '), fg('red', '* '), fg('green', 'x '), fg('blue', 'o '), fg('white', '# ')]
        const optionValuesCount: any = {};

        const optionValuesArray = data.map(group => {
            const optionValues = group.map((entry: any) => JSON.parse(entry.result).optionValue);
            // count instances of each optionValues
            return optionValues;
        });
        // sum up appearances of each optionValue inside optionValues
        for (let optionValues of optionValuesArray) {
            for (let optionValue of optionValues) {
                if (optionValuesCount[optionValue]) {
                    optionValuesCount[optionValue]++;
                } else {
                    optionValuesCount[optionValue] = 1;
                }
            }
        }
        let graphResults = [];
        let i = 0;
        for (let optionValue in optionValuesCount) {
            // TODO: make sure there enough styles for all the optionValues
            graphResults.push({ key: optionValue, value: optionValuesCount[optionValue], style: styles[i] });
            i++;
        }
        return graphResults;
    }

    public static calculateAverageByModel(data: any[]): any {

        const results = data.map(group => {
            // Assuming all entries in a group are from the same model
            const ervy = require('ervy')
            const { bg } = ervy
            const modelName = group[0].model;

            // Extract probabilities and parse them
            const probabilities = group.map((entry: any) => JSON.parse(entry.result).probability);

            // Calculate average
            const avg = probabilities.filter((prob: any) => prob != "N/A").reduce((acc: any, curr: any) => acc + curr, 0) / probabilities.length;
            return { key: modelName, value: this.toFixed(avg) || 0, style: bg('blue') };
        });
        return results;
    }

    public static calculateAverageConfidenceLevelByModel(data: any[]): any {

        const results = data.map(group => {
            // Assuming all entries in a group are from the same model
            const ervy = require('ervy')
            const { bg } = ervy
            const modelName = group[0].model;

            // Extract probabilities and parse them
            const confidenceLevels = group.map((entry: any) => JSON.parse(entry.result).confidenceLevel);

            // Calculate average
            const avg = confidenceLevels.filter((prob: any) => prob != "N/A").reduce((acc: any, curr: any) => acc + curr, 0) / confidenceLevels.length;
            return { key: modelName, value: this.toFixed(avg) || 0, style: bg('red') };
        });
        return results;
    }

    public static listReasoning(data: any[]): any {
        const results = data.map(group => {
            // Assuming all entries in a group are from the same model
            const modelName = group[0].model;
            const reasoning = group.map((entry: any) => JSON.parse(entry.result)?.reasoning);
            return { key: modelName, value: reasoning };
        });
        return results;
    }

    public static calculateStandardDeviationByModel(data: any[]): any {

        const results = data.map(group => {
            // Assuming all entries in a group are from the same model
            const modelName = group[0].model;

            // Extract probabilities and parse them
            const probabilities = group.map((entry: any) => JSON.parse(entry.result).probability);

            // Calculate average
            const avg = probabilities.filter((prob: any) => prob != "N/A").reduce((acc: any, curr: any) => acc + curr, 0) / probabilities.length;

            // Calculate variance
            const variance = probabilities.reduce((acc: any, curr: any) => acc + Math.pow(curr - avg, 2), 0) / probabilities.length;
            let standardDeviation = Math.sqrt(variance);
            const ervy = require('ervy')
            const { bg } = ervy
            return { key: modelName, value: this.toFixed(standardDeviation) || 0, style: bg('blue') };
        });
        return results;
    }
    public static calculateTotals(data: any[]): any {

        // Flatten all probabilities into a single array
        const allProbabilities = data.flatMap(group =>
            group.map((entry: any) => JSON.parse(entry.result).probability)
        );

        // Calculate total average
        const totalAvg = allProbabilities.filter((prob: any) => prob != "N/A").reduce((acc, curr) => acc + curr, 0) / allProbabilities.length;

        // Calculate total variance
        const totalVariance = allProbabilities.reduce((acc, curr) =>
            acc + Math.pow(curr - totalAvg, 2), 0) / allProbabilities.length;

        // Calculate total standard deviation
        const totalStandardDeviation = Math.sqrt(totalVariance);
        return { totalAverage: this.toFixed(totalAvg), totalVariance: this.toFixed(totalVariance), totalStandardDeviation: this.toFixed(totalStandardDeviation) };
    };

    public static create(data: any[], scale: Scale, verbose: boolean = false): void {
        const ervy = require('ervy')
        const { bar, pie, bullet, donut, gauge, scatter } = ervy
        switch (scale) {
            case Scale.Probability:
                {

                    let barAverageData = this.calculateAverageByModel(data);
                    let barStandardDeviationData = this.calculateStandardDeviationByModel(data)
                    let barAverageConfidenceLevelData = this.calculateAverageConfidenceLevelByModel(data)
                    console.log("Average by Model: ");
                    console.log(bar(barAverageData, { barWidth: 20 }));
                    console.log("Standard Deviation by Model: ");
                    console.log(bar(barStandardDeviationData, { barWidth: 20 }));
                    console.log("Average Confidence Level by Model: ");
                    console.log(bar(barAverageConfidenceLevelData, { barWidth: 20 }));
                    let totals = this.calculateTotals(data);
                    console.log("Average: " + totals.totalAverage + " Variance: " + totals.totalVariance + " Standard Deviation: " + totals.totalStandardDeviation);
                    if (verbose) {
                        console.log("Reasoning: ");
                        console.log(this.listReasoning(data));
                    }
                }
                break;
            case Scale.Options:
                // here there should be graphs by model
                // each graph should present the options
                console.log("Options Count: ");
                let countByModel = this.calculateOptionCount(data);
                console.log(donut(countByModel));
                console.log("Average Confidence Level by Model: ");
                let barAverageConfidenceLevelData = this.calculateAverageConfidenceLevelByModel(data)
                console.log(bar(barAverageConfidenceLevelData, { barWidth: 20 }));
                if (verbose) {
                    console.log("Reasoning: ");
                    console.log(this.listReasoning(data));
                }
            default:
        }

    }
}