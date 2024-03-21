# Obsidian Maestro -- use [Maestro](https://github.com/Doriandarko/maestro) from Obsidian
![hero](https://media.discordapp.net/attachments/1047006708813271100/1219776508864893088/DALLE_Mar_19_Landscape_Robot_Maestro_1.webp?ex=660c8866&is=65fa1366&hm=c49736c7547a81e3fa5ae63ed099a62496b2bbc6489cc2381e8833f815d3aa97&=&format=webp&width=3220&height=1840)

# Installation step
1. Install [BRAT](https://obsidian.md/plugins?id=obsidian42-brat) plugin (since this repo is not on Obsidian store yet, you need to use the beta testing tool to install it. Alternatively, refers to the [Obsidian developer docs](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin) to see how to directly install in your device and skip step 2)

2. Add https://github.com/joshuakto/obsidian-maestro to the list of plugin using BRAT
3. Set up a python environment according to [Maestro README](https://github.com/Doriandarko/maestro)
4. Input your anthropic api key and the correct python path in the Maestro plugin settings.

	![Screenshot 2024-03-22 at 3 42 28 AM](https://github.com/joshuakto/obsidian-maestro/assets/34743132/5fabf76f-432e-4733-8e0f-987a1a071dad)
5. Copy [maestro.py](https://raw.githubusercontent.com/joshuakto/obsidian-maestro/main/maestro.py) to the base of the vault
6. Click the robot icon to give Maestro an objective

   <img width="321" alt="Screenshot 2024-03-22 at 3 36 03 AM" src="https://github.com/joshuakto/obsidian-maestro/assets/34743132/4bab7a63-f642-46c2-a0f8-f74908b001a6">

### **Note**: This plugin is in early alpha, please backup your vault before using it.

This Python script demonstrates an AI-assisted task breakdown and execution workflow using the Anthropic API. It utilizes two AI models, Opus and Haiku, to break down an objective into sub-tasks, execute each sub-task, and refine the results into a cohesive final output.

## Features

- Breaks down an objective into manageable sub-tasks using the Opus model
- Executes each sub-task using the Haiku model
- Provides the Haiku model with memory of previous sub-tasks for context
- Refines the sub-task results into a final output using the Opus model
- Generates a detailed exchange log capturing the entire task breakdown and execution process
- Saves the exchange log to a Markdown file for easy reference
- Utilizes an improved prompt for the Opus model to better assess task completion
- Introduces a specific phrase, "The task is complete:", to indicate when the objective is fully achieved

## Prerequisites

To run this script, you need to have the following:

- Python installed
- Anthropic API key
- Required Python packages: `anthropic` and `rich`

## Installation

1. Clone the repository or download the script file.
2. Install the required Python packages by running the following command:

```bash
pip install anthropic rich
```

3. Replace the placeholder API key in the script with your actual Anthropic API key:

```python
client = Anthropic(api_key="YOUR_API_KEY_HERE")
```

## Usage

1. Open a terminal or command prompt and navigate to the directory containing the script.
2. Run the script using the following command:

```bash
python maestro.py
```

3. Enter your objective when prompted:

```bash
Please enter your objective: Your objective here
```

The script will start the task breakdown and execution process. It will display the progress and results in the console using formatted panels.

Once the process is complete, the script will display the refined final output and save the full exchange log to a Markdown file with a filename based on the objective.

## Code Structure

The script consists of the following main functions:

- `opus_orchestrator(objective, previous_results=None)`: Calls the Opus model to break down the objective into sub-tasks or provide the final output. It uses an improved prompt to assess task completion and includes the phrase "The task is complete:" when the objective is fully achieved.
- `haiku_sub_agent(prompt, previous_haiku_tasks=None)`: Calls the Haiku model to execute a sub-task prompt, providing it with the memory of previous sub-tasks.
- `opus_refine(objective, sub_task_results)`: Calls the Opus model to review and refine the sub-task results into a cohesive final output.

The script follows an iterative process, repeatedly calling the opus_orchestrator function to break down the objective into sub-tasks until the final output is provided. Each sub-task is then executed by the haiku_sub_agent function, and the results are stored in the task_exchanges and haiku_tasks lists.

The loop terminates when the Opus model includes the phrase "The task is complete:" in its response, indicating that the objective has been fully achieved.

Finally, the opus_refine function is called to review and refine the sub-task results into a final output. The entire exchange log, including the objective, task breakdown, and refined final output, is saved to a Markdown file.

## Customization

You can customize the script according to your needs:

- Adjust the max_tokens parameter in the client.messages.create() function calls to control the maximum number of tokens generated by the AI models.
- Change the models to what you prefer, like replacing Haiku with Sonnet or Opus.
- Modify the console output formatting by updating the rich library's Panel and Console configurations.
- Customize the exchange log formatting and file extension by modifying the relevant code sections.

## License

This script is released under the MIT License.

## Acknowledgements

- Anthropic for providing the AI models and API.
- Rich for the beautiful console formatting.
