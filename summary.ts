import { Scale } from "./scale";

export class Summary {
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
            return { key: modelName, value: avg, style: bg('blue'), left:300, padding:300};
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
            return { key: modelName, value: avg, style: bg('red'), left:300, padding:300};
        });
        return results;
    }

    public static calculateVarianceByModel(data: any[]): any {

        const results = data.map(group => {
            // Assuming all entries in a group are from the same model
            const modelName = group[0].model;

            // Extract probabilities and parse them
            const probabilities = group.map((entry: any) => JSON.parse(entry.result).probability);

            // Calculate average
            const avg = probabilities.filter((prob: any) => prob != "N/A").reduce((acc: any, curr: any) => acc + curr, 0) / probabilities.length;

            // Calculate variance
            const variance = probabilities.reduce((acc: any, curr: any) => acc + Math.pow(curr - avg, 2), 0) / probabilities.length;
            const ervy = require('ervy')
            const { bg } = ervy
            return { key: modelName, value: variance, style: bg('blue'), left:300, padding:300 };
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

        return { totalAverage: totalAvg, totalVariance: totalVariance };
    };

    public static create(data: any[], scale: Scale): void {
        switch (scale) {
            case Scale.Probability:
                {
                    const ervy = require('ervy')
                    const { bar, pie, bullet, donut, gauge, scatter } = ervy
                    let barAverageData = this.calculateAverageByModel(data);
                    let barVarianceData = this.calculateVarianceByModel(data)
                    let barAverageConfidenceLevelData = this.calculateAverageConfidenceLevelByModel(data)
                    console.log("Average by Model: ");
                    console.log(bar(barAverageData));
                    console.log("Variance by Model: ");
                    console.log(bar(barVarianceData));
                    console.log("Average Confidence Level by Model: ");
                    console.log(bar(barAverageConfidenceLevelData));
                    let totals = this.calculateTotals(data);
                    console.log("Average: " + totals.totalAverage + " Variance: " + totals.totalVariance);
                }
                break;
            case Scale.Options:
            default:
        }

    }
}