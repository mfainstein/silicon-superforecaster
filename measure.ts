import { ChatOpenAI } from "@langchain/openai";
import { createModel, Model } from "./model";
import { resolveOutputParser, resolveScaleFormat, resolveScaleSystemPrompt, Scale } from "./scale";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";
import { CalibrationMethod } from "./calibrate";
dotenv.config();

export async function measure(prompt: string, model: Model, scale:Scale, calibratedTemplate:string): Promise<any> {
    let modelInstance = createModel(model);
    // let toolResponse = tool? JSON.parse(await call(tool, prompt)) : undefined;
    // let toolPrompt = toolResponse? "Recent information to consider: "+ toolResponse[0].content : "";
    // console.log(toolPrompt);
    // modelInstance.bind(resolveScaleFormat(scale));
    let basicPrompt = ChatPromptTemplate.fromTemplate(calibratedTemplate);
    let parser = resolveOutputParser(scale);
    //@ts-ignore
    const chain = RunnableSequence.from([basicPrompt, modelInstance, parser]); 
    return chain.invoke({ question: prompt, format_instructions: parser.getFormatInstructions() });
}
