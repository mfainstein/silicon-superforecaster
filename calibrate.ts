import { createModel, Model } from "./model";
import { resolveScaleSystemPrompt, Scale } from "./scale";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Chat } from "openai/resources";
import { searchTavily } from "./tools/tavily-client";

export enum CalibrationMethod {
    TAVILY_SEARCH = 'tavily-search',
    // EXA_SEARCH = 'exa-search',
    WIKIPEDIA_QUERY = 'wikipedia-query',
    NONE = 'none',
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function invoke(method: CalibrationMethod, prompt: string): Promise<string[]> {
    switch (method) {
        case CalibrationMethod.TAVILY_SEARCH:
            const { TavilySearchResults } = require("@langchain/community/tools/tavily_search");
            let saerch = new TavilySearchResults({ maxResults: 10 });
            let searchResponse: string = await saerch.call(prompt.replace(/"/g, ''));
            let arrayResponse = JSON.parse(searchResponse);
            return arrayResponse.map((result: any) => { return result.content });
        case CalibrationMethod.WIKIPEDIA_QUERY:
            const { WikipediaQueryRun } = require("@langchain/community/tools/wikipedia_query_run");
            let wiki = new WikipediaQueryRun({
                topKResults: 3,
                maxDocContentLength: 3000,
            });
            let response = [await wiki.call(prompt)];
            return response;
        case CalibrationMethod.NONE:
            return [""];
    }
}

function mergeSources(sources: string[]): string {
    //i want to join the sources with a Source <INDEX> prefix
    return sources.map((source, index) => {
        return `======================== Source ${index + 1} ======================== : ${source} =========================`;
    }).join("\n");
}

const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    return date.toLocaleString('he-IL', options);
};

export async function calibrate(model: Model, scale: Scale, method: CalibrationMethod, prompt: string, spinnies: any): Promise<any> {
    spinnies.update(model, { text: 'Calibrating... ' + model, color: 'blue' });
    let modelInstance = createModel(model);
    let calibrationPrompt = ChatPromptTemplate.fromTemplate(
        "Here's a query: {question}. What factual (short) query would you use to search the internet to get RECENT DATA (for " + formatDate(new Date()) + "!! that would help you evaluate/predict the above query? Output the query only! DO NOT TRY TO GET ODDS DATA, BUT PAST FACTUAL DATA. \n"
    );
    const chain = RunnableSequence.from([calibrationPrompt, modelInstance, new StringOutputParser()]);
    const calibrationPromptResponse = await chain.invoke({ question: prompt });
    let methodResponse = await invoke(method, calibrationPromptResponse);
    if (methodResponse.length === 0) {
        throw new Error("No response from calibration method");
    }
    let summaryPrompt = ChatPromptTemplate.fromTemplate(
        "Here is a query:{question}\n" +
        "Summarize the following to a paragraph of facts that can help answer the above query: \n ========== \n" + mergeSources(methodResponse)
    );
    const summaryChain = RunnableSequence.from([summaryPrompt, modelInstance, new StringOutputParser()]);
    const summaryPromptResponse = await summaryChain.invoke({ question: prompt });
    let calibratedPrompt = methodResponse && summaryPrompt ? "Recent information to consider: " + summaryPromptResponse : "";
    let template = resolveScaleSystemPrompt(scale) + "\nthe query:{question}" + "\n" + calibratedPrompt
    return template
}

