import { ChatAnthropic } from "@langchain/anthropic";
import { ChatOpenAI } from "@langchain/openai";
import { Replicate } from "@langchain/community/llms/replicate";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export enum Model {
    GPT3 = 'gpt-3.5',
    GPT4 = 'gpt-4',
    CLAUDE_OPUS = 'claude-3-opus',
    CLAUDE_SONNET = 'claude-3-sonnet',
    GEMINI_PRO = 'gemini-pro',
    // LLAMA_2_13B = "llama-2-13b",
    // LLAMA_2_70B = "llama-2-70b",
}

export function getAllModels(): Model[] {
    // Use Object.values to get all enum values and assert the returned array type to Model[]
    let allValues = Object.values(Model) as Model[];
    return allValues;
}

export function getValueByIndex(index: number): string | undefined {
    const values = Object.values(Model); // Get all enum values
    return values[index];
}

export function createModel(model: Model): any {
    switch (model) {
        case Model.GPT3:
            return new ChatOpenAI({
                modelName: "gpt-3.5-turbo",
            });
        case Model.GPT4:
            return new ChatOpenAI({
                modelName: "gpt-4-1106-preview",
            });
        case Model.CLAUDE_OPUS:
            return new ChatAnthropic({
                modelName: "claude-3-opus-20240229",
            });
        case Model.CLAUDE_SONNET:
            return new ChatAnthropic({
                modelName: "claude-3-sonnet-20240229",
            });
        case Model.GEMINI_PRO:
            return new ChatAnthropic({
                modelName: "claude-3-sonnet-20240229",
            });
        case Model.GEMINI_PRO:
            return new ChatGoogleGenerativeAI({
                modelName: "gemini-pro",
            });
        // case Model.LLAMA_2_13B:
        //     return new Replicate({
        //         model: "meta/llama-2-13b:078d7a002387bd96d93b0302a4c03b3f15824b63104034bfa943c63a8f208c38",
        //         maxRetries: 0,
        //     });
        // case Model.LLAMA_2_70B:
        //     return new Replicate({
        //         model: "meta/llama-2-70b:a52e56fee2269a78c9279800ec88898cecb6c8f1df22a6483132bea266648f00",
        //         maxRetries: 0,
        //     });
        default:
            return new ChatOpenAI({
                modelName: "gpt-3.5-turbo",
            });

    }

}