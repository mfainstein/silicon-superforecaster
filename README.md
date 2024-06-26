# Silicon-Superforecaster

**silicon-superforecaster** harnesses the collective intelligence of multiple large language models (LLMs) to deliver predictive insights and judgments across a wide array of topics. Drawing inspiration from the human brain's capability to serve as a judgement tool, silicon-superforecaster operates on a similar principle, utilizing LLMs as measuring devices. 

## Mars by 2030?
Measuring: What are the chances that humans will land on Mars by 2030?
![Prediction of the chances that humans will land on Mars by 2030](https://github.com/mfainstein/silicon-superforecaster/blob/main/screenshots/ProbabilityLandOnMars2030.png)

## SpaceX Starship Launches in 2024?
Measuring: How many SpaceX Starship launches reach space in 2024? (1) 1 (2) 2 (3) 3 (4) 4 (5) 5+
![Prediction of how many SpaceX Starship launches reach space in 2024](https://github.com/mfainstein/silicon-superforecaster/blob/main/screenshots/SpaceXStarshipLaunches2024.png)

## Background

silicon-superforecaster seeks to optimize decision-making through the aggregation of diverse LLM insights, guided by the principles outlined in "Superforecasters" and "Noise." This approach advocates for leveraging collective intelligence over individual expert analysis, integrating the analytical depth of LLMs to produce a balanced synthesis of expert insights and broad-based predictions.

## Example Predictions and Judgments for Silicon-Forecaster

To showcase silicon-superforecaster's versatility in generating predictions and judgments across various domains, here are some example modifications to `index.ts`. These examples utilize both the `Scale.Probability` and `Scale.Options` to illustrate the platform's wide-ranging analytical capabilities.

### Scale.Probability Examples
1. **Politics**:
   Evaluate the probability of Israel holding new elections by the end of 2024.
    ```typescript
    let population = new Population();
    population.addAllModels(5);
    measurement("Israel will hold new elections by the end of 2024", Scale.Probability, population).then((response) => {
        Summary.create(response, Scale.Probability, true /* verbose */);
    });
    ```

2. **Technology Adoption Rate**:
   Evaluate the probability of quantum computing becoming mainstream in consumer electronics by 2030.

    ```typescript
    let population = new Population();
    population.addAllModels(5);
    measurement("What is the probability of mainstream adoption of quantum computing in consumer electronics by 2030?", Scale.Probability, population).then((response) => {
        Summary.create(response, Scale.Probability);
    });
    ```

3. **Environmental Goals**:
   Assess the likelihood of meeting the Paris Agreement's global warming limit by 2050.

    ```typescript
    let population = new Population();
    population.addAllModels(20);
    measurement("What is the probability of achieving the Paris Agreement's goal of limiting global warming to 1.5 degrees Celsius above pre-industrial levels by 2050?", Scale.Probability, population).then((response) => {
        Summary.create(response, Scale.Probability);
    });
    ```

### Scale.Options Examples

3. **Future of Work**:
   Identify which sector is poised for the greatest growth due to automation in the next decade.

    ```typescript
    let population = new Population();
    population.addStrongModels(20);
    measurement("Which sector will experience the most significant growth due to automation in the next decade: (1) technology (2) healthcare (3) education (4) manufacturing?", Scale.Options, population).then((response) => {
        Summary.create(response, Scale.Options);
    });
    ```

4. **Space Exploration Milestones**:
   Predict the next major milestone in space exploration by 2030.

    ```typescript
    let population = new Population();
    population.addModel(Model.GPT4, 10);
    population.addModel(Model.CLAUDE_SONNET, 10);
    measurement("What will be the next major milestone in space exploration by 2030: (1) returning humans to the moon (2) launching a manned mission to Mars (3) discovering extraterrestrial life (4) establishing a permanent space station?", Scale.Options, population).then((response) => {
        Summary.create(response, Scale.Options);
    });
    ```
## Process outline
* Setup phase: The platform is initialized with the necessary configurations and models.
* Calibration phase: The models are calibrated to ensure the most recent data is available. 
  * Model creates a query to fetch the most recent data through the chosen tool
  * Fetch the most recent data using the generated query
  * Model summarizes the data for the purpose of judging / forecasting
* Measurement phase: The calibrated models provide their predictions and judgments on the specified topic.
* Summary phase: The platform synthesizes the outputs from the models into various histograms and summaries for user consumption.

## Core Components

- `index.ts`: Facilitates user interactions and manages the overall workflow of the platform.
- `measure.ts`: Defines the framework for quantifying predictions and judgments, ensuring that outcomes from different populations of LLM judges are standardized and comparable.
- `measurement.ts`: Handles the collection and documentation of outputs from specific populations of LLM judges, applying the standardization criteria to produce structured, comparable insights.
- `calibrate.ts`: Calibration phase per model (currently support Wiki & Tavily Search) to get the most recent data available.
- `model.ts`: Coordinates the input and integration of outputs from multiple LLMs.
- `population.ts`: Describes the "population object," detailing the collective of LLM judges, including their distribution and management for particular measurements.
- `scale.ts`: Provides mechanisms for adjusting the scope and scale of predictions for uniform analysis across different contexts.
- `summary.ts`: Compiles the outputs into accessible summaries for users, synthesizing diverse model insights.

## Getting Started

To begin using Silicon-Forecaster:

1. Clone the repository and install dependencies:
   ```bash
   git clone <repository-url>
   cd silicon-superforecaster
   npm install

## Create a `.env` File
it is important to create a `.env` file in the root directory of the project. The `.env` file should contain the following environment variables:

```
OPENAI_API_KEY=<your_key>
ANTHROPIC_API_KEY=<your_key>
REPLICATE_API_TOKEN=<your_key>
GOOGLE_API_KEY=<your_key>
TAVILY_API_KEY=<your_key>
```
