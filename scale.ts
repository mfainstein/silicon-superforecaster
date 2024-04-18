import { MessageContent } from "openai/resources/beta/threads/messages/messages";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

export enum Scale {
    Probability = 'probability',
    Options = 'options',
}

export function resolveScaleSystemPrompt(sacle: Scale): string {
    switch (sacle) {
        case Scale.Probability:
            return "Provide a numerical probability between 0 and 100 that represents the likelihood of the described outcome occurring. \n{format_instructions}\n. Use base rate information and other available data, estimation and evaluation techniques."
        case Scale.Options:
            return "Provide the option (exact option ONLY from the options provided) that best describes the outcome.\n{format_instructions}\n. Use base rate information and other available data, estimation and evaluation techniques."
        default:
            return "Provide a numerical probability between 0 and 100 that represents the likelihood of the described outcome occurring. \n{format_instructions}\n. Use base rate information and other available data, estimation and evaluation techniques."
    }
}

export function resolveOutputParser(scale: Scale) {
    switch (scale) {
        case Scale.Options:
            return StructuredOutputParser.fromZodSchema(
                z.object({
                    optionIdentifier:  z.string().describe("The identifier of the selected option"),
                    optionValue: z.string().describe("The value of the selected option"),
                    reasoning: z.string().describe("The explanation for optionß choice"),
                    confidenceLevel: z.number().min(0).max(100).describe("The confidence level of the probability estimate as a number between 0 and 100"),
                })
            );
        case Scale.Probability:
            return StructuredOutputParser.fromZodSchema(
                z.object({
                    probability: z.number().min(0).max(100).describe("The probability of the described outcome occurring as a number between 0 and 100"),
                    confidenceLevel: z.number().min(0).max(100).describe("The confidence level of the probability estimate as a number between 0 and 100"),
                    reasoning: z.string().describe("The explanation for the probability choice"),
                })
            );
    }
}


export function resolveScaleFormat(scale: Scale) {
    switch (scale) {
        case Scale.Probability:
            return {
                response_format: {
                    type: "number",
                }
            };
        case Scale.Options:
            return {
                response_format: {
                    type: "string",
                },
            };
        default:
            return {
                response_format: {
                    type: "number",
                },
            }
    }

}