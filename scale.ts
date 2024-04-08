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
            return "Provide the option that best describes the outcome.\n{format_instructions}\n"
        default:
            return "Provide a numerical value that best describes the outcome. Respond with the number only, without any additional text or explanation."
    }
}

export function resolveSchema(scale: Scale) {
    switch (scale) {
        case Scale.Options:
            {
                const functionSchema = [
                    {
                        name: "option",
                        description: "An option pair, consisting of an option identifier and the value of the option. For instance: (1) Yes",
                        parameters: {
                            type: "object",
                            properties: {
                                option: {
                                    type: "string",
                                    description: "The option identifier, for instance (1)",
                                },
                                value: {
                                    type: "string",
                                    description: "The value of the option",
                                },
                            },
                            required: ["option", "value"],
                        },
                    },
                ];
                return {
                    functions: functionSchema,
                    function_call: { name: "option" },
                }
            }
        case Scale.Probability:
            return {}
        default:
            return {}

    }
}

export function resolveOutputParser(scale: Scale) {
    switch (scale) {
        case Scale.Options:
            return StructuredOutputParser.fromNamesAndDescriptions({
                optionIdentifier: "The identifier of the selected option",
                optionValue: "The value of the selected option",
            });
        case Scale.Probability:
            return StructuredOutputParser.fromZodSchema(
                z.object({
                    probability: z.number().min(0).max(100).describe("The probability of the described outcome occurring as a number between 0 and 100"),
                    confidenceLevel: z.number().min(0).max(100).optional().describe("The confidence level of the probability estimate as a number between 0 and 100"),
                })
            );
        // return StructuredOutputParser.fromNamesAndDescriptions({
        //     probability: "The probability of the described outcome occurring as a number between 0 and 100",
        // });
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