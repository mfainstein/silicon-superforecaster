import { ChatOpenAI } from "@langchain/openai";
import { createModel, Model } from "./model";
import { resolveOutputParser, resolveScaleFormat, resolveScaleSystemPrompt, resolveSchema, Scale } from "./scale";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";
dotenv.config();

export async function measure(prompt: string, scale: Scale, model: Model): Promise<any> {
    let modelInstance = createModel(model);
    modelInstance.bind(resolveScaleFormat(scale));
    //modelInstance.bind(resolveSchema(scale));
    let basicPrompt = ChatPromptTemplate.fromTemplate(
        resolveScaleSystemPrompt(scale) + "\nthe query:{question}"
    );
    // const basicPrompt = ChatPromptTemplate.fromMessages([
    //     ["system", resolveScaleSystemPrompt(scale)],
    //     ["user", prompt],
    // ]);
    //const outputParser = new StringOutputParser();
    let parser = resolveOutputParser(scale);
    //@ts-ignore
    const chain = RunnableSequence.from([basicPrompt, modelInstance, parser]); 
    return chain.invoke({ question: prompt, format_instructions: parser.getFormatInstructions() });
}
