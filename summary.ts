import { Scale } from "./scale";

export class Summary {
    private static toFixed(input: number) {
        let roundedString: string = input.toFixed(2); // This will be "24.44" as a string

        // Convert the string back to a number using the unary plus operator
        let roundedNumber: number = +roundedString;
        return roundedNumber;
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
            return { key: modelName, value: this.toFixed(avg), style: bg('blue') };
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
            return { key: modelName, value: this.toFixed(avg), style: bg('red') };
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
            return { key: modelName, value: this.toFixed(standardDeviation), style: bg('blue') };
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

    public static create(data: any[], scale: Scale): void {
        switch (scale) {
            case Scale.Probability:
                {
                    const ervy = require('ervy')
                    const { bar, pie, bullet, donut, gauge, scatter } = ervy
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
                }
                break;
            case Scale.Options:
            // here there should be graphs by model
            // each graph should present the options
            // and confidence level in the end by model
            default:
        }

    }
}