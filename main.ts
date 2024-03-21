// import { Plugin, PluginSettingTab, Setting, Modal, App } from 'obsidian';
// import { exec } from 'child_process';

// interface MaestroPluginSettings {
//   apiKey: string;
// }

// const DEFAULT_SETTINGS: MaestroPluginSettings = {
//   apiKey: '',
// };

// class ObjectiveModal extends Modal {
//   plugin: MaestroPlugin;
//   objectiveInput: HTMLTextAreaElement;
//   outputContainer: HTMLElement;

//   constructor(app: App, plugin: MaestroPlugin) {
//     super(app);
//     this.plugin = plugin;
//   }

//   onOpen() {
//     const { contentEl } = this;
//     contentEl.createEl('h2', { text: 'Enter Objective' });

//     this.objectiveInput = contentEl.createEl('textarea', {
//       attr: {
//         placeholder: 'Enter your objective',
//       },
//     });

//     this.outputContainer = contentEl.createEl('div', { cls: 'maestro-output' });

//     const buttonContainer = contentEl.createEl('div', { cls: 'maestro-button-container' });
//     const submitButton = buttonContainer.createEl('button', { text: 'Submit', cls: 'maestro-submit-button' });
//     submitButton.addEventListener('click', this.handleSubmit.bind(this));

//     const closeButton = buttonContainer.createEl('button', { text: 'Close', cls: 'maestro-close-button' });
//     closeButton.addEventListener('click', this.close.bind(this));
//   }

//   onClose() {
//     const { contentEl } = this;
//     contentEl.empty();
//   }

//   async handleSubmit() {
//     const objective = this.objectiveInput.value.trim();
//     if (!objective) {
//       this.displayMessage('Please enter an objective.', 'error');
//       return;
//     }

//     const apiKey = this.plugin.settings.apiKey;
//     if (!apiKey) {
//       this.displayMessage('Please set your API key in the plugin settings.', 'error');
//       return;
//     }

//     try {
//       const output = await this.runMaestroScript(objective, apiKey);
//       this.displayMessage(`Maestro script output:\n${output}`, 'success');
//     } catch (error) {
//       this.displayMessage(`Error: ${error.message}`, 'error');
//     }
//   }

//   displayMessage(message: string, type: 'error' | 'success') {
//     this.outputContainer.empty();
//     this.outputContainer.createEl('p', { text: message, cls: `maestro-${type}-message` });
//   }

//   async runMaestroScript(objective: string, apiKey: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//       exec(`python ./maestro.py "${objective}" "${apiKey}"`, (error, stdout, stderr) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(stdout.trim());
//         }
//       });
//     });
//   }
// }

// export default class MaestroPlugin extends Plugin {
//   settings: MaestroPluginSettings;

//   async onload() {
//     await this.loadSettings();

//     this.addRibbonIcon('dice', 'Open Objective Modal', () => {
//       new ObjectiveModal(this.app, this).open();
//     });

//     this.addSettingTab(new MaestroSettingTab(this.app, this));
//   }

//   async loadSettings() {
//     this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
//   }

//   async saveSettings() {
//     await this.saveData(this.settings);
//   }
// }

// class MaestroSettingTab extends PluginSettingTab {
//   plugin: MaestroPlugin;

//   constructor(app: App, plugin: MaestroPlugin) {
//     super(app, plugin);
//     this.plugin = plugin;
//   }

//   display(): void {
//     const { containerEl } = this;
//     containerEl.empty();
//     containerEl.createEl('h2', { text: 'Maestro Plugin Settings' });

//     new Setting(containerEl)
//       .setName('API Key')
//       .setDesc('Enter your API key')
//       .addText(text => text
//         .setPlaceholder('Enter your API key')
//         .setValue(this.plugin.settings.apiKey)
//         .onChange(async (value) => {
//           this.plugin.settings.apiKey = value;
//           await this.plugin.saveSettings();
//         }));
//   }
// }


import { Plugin, Modal, App, Setting, Notice, FileSystemAdapter, PluginSettingTab } from 'obsidian';
// const child_process = require('child_process');
import {spawn} from "child_process";

class ObjectiveModal extends Modal {
  private objectiveTextArea: HTMLTextAreaElement;
  // private apiKeyInput: HTMLInputElement;
  private outputContainer: HTMLElement;
  private plugin: MaestroPlugin;

  constructor(app: App, plugin: MaestroPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.createEl('h2', { text: 'Objective Generator' });

    this.objectiveTextArea = contentEl.createEl('textarea', {
      attr: {
        placeholder: 'Enter a description of your objective',
      },
    });

    // this.apiKeyInput = contentEl.createEl('input', {
    //   attr: {
    //     type: 'password',
    //     placeholder: 'Enter your API key',
    //   },
    // });

    const submitButton = contentEl.createEl('button', { text: 'Submit' });
    submitButton.addEventListener('click', this.handleSubmit.bind(this));

    this.outputContainer = contentEl.createEl('div', { cls: 'maestro-output' });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }

  async handleSubmit() {
    const objectiveText = this.objectiveTextArea.value.trim();
    // const apiKey = this.apiKeyInput.value.trim();

    if (!objectiveText) {
      this.displayMessage('Please enter the objective.', 'error');
      return;
    }

    try {
      await this.runMaestroScript(objectiveText)
      // const consoleOutput = await this.runMaestroScript(objectiveText);//, apiKey);
      // this.displayMessage(consoleOutput, 'success');
    } catch (error) {
      this.displayMessage(`Error: ${error.message}`, 'error');
    }
  }

  // async runMaestroScript(objective: string, apiKey: string): Promise<string> {
//   async runMaestroScript(objective: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const child = child_process.spawn('python3', ['./maestro.py', objective]);
//       let output = '';

//       child.stdout.on('data', (data) => {
//         output += data.toString();
//       });

//       child.stderr.on('data', (data) => {
//         output += data.toString();
//       });

//       child.on('close', (code) => {
//         if (code === 0) {
//           resolve(output);
//         } else {
//           reject(new Error(`Maestro script exited with code ${code}`));
//         }
//       });

//       child.on('error', (err) => {
//         reject(err);
//       });
//     });
//   }

//   displayMessage(message: string, type: 'error' | 'success') {
//     this.outputContainer.empty();
//     this.outputContainer.createEl('pre', { text: message, cls: `maestro-${type}-message` });
//   }
// }


async runMaestroScript(objective: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      '/Users/joshuaching/miniforge3/envs/llm/bin/python', 
      [`${(this.app.vault.adapter as FileSystemAdapter).getBasePath()}/maestro.py`, objective, this.plugin.settings.apiKey],
      {cwd: (this.app.vault.adapter as FileSystemAdapter).getBasePath()});
    // const child = spawn('/Users/joshuaching/miniforge3/envs/llm/bin/python', ['-c', `print('hello' + input('input here:'))`]);
    // console.log(child)
    console.log(`cursor basename`)
    console.log(this.app.vault.getFileByPath("Cursor.md")?.basename)
    // child.stdin.write(objective);
    // child.stdin.end();

    child.stdout.on('data', async (data) => {
      console.log("datastdout")
      console.log(new TextDecoder('utf-8').decode(data))
      this.displayMessage(data.toString(), 'success', true); // Update to append the message
    });

    child.stderr.on('data', (data) => {
      console.log("datastderr")
      console.log(data)
      console.log(new TextDecoder('utf-8').decode(data))
      this.displayMessage(data.toString(), 'error', true); // Update to append the message
    });

    child.on('close', (code, signal) => {
      if (code === 0) {
        console.log("hello")
        console.log(signal)
        resolve();
      } else {
        console.log("signal")
        console.log(signal)
        reject(new Error(`Maestro script exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      console.log("error")
      console.log(err)
      reject(err);
    });
  });
}

// Modify the displayMessage method to optionally append messages
displayMessage(message: string, type: 'error' | 'success', append: boolean = false) {
  if (!append) {
    this.outputContainer.empty();
  }
  // Use `createEl` to append new messages if `append` is true, otherwise replace content
  this.outputContainer.createEl('pre', { text: message, cls: `maestro-${type}-message` });
}
}

const DEFAULT_SETTINGS = {
  apiKey: '',
};

export default class MaestroPlugin extends Plugin {
  settings: MaestroSettings;


  async onload() {
    await this.loadSettings();
    this.addRibbonIcon('dice', 'Open Objective Generator', () => {
      new ObjectiveModal(this.app, this).open();
    });
    this.addSettingTab(new MaestroSettingTab(this.app, this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    console.log('Saving settings');
    console.log(this.settings);
    return await this.saveData(this.settings);
    
  }
  
}




type MaestroSettings = {
  apiKey: string;
}


class MaestroSettingTab extends PluginSettingTab {
  plugin: MaestroPlugin;

  constructor(app: App, plugin: MaestroPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Maestro Plugin Settings' });

    new Setting(containerEl)
      .setName('API Key')
      .setDesc('Enter your API key')
      .addText(text => text
        .setPlaceholder('Enter your API key')
        .setValue(this.plugin.settings.apiKey)
        .onChange(async (value) => {
          this.plugin.settings.apiKey = value;
          await this.plugin.saveSettings();
        }));
  }
}