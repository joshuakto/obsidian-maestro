import { Plugin, Modal, App, Setting, FileSystemAdapter, PluginSettingTab } from 'obsidian';
import {spawn} from "child_process";

class ObjectiveModal extends Modal {
  private objectiveTextArea: HTMLTextAreaElement;
  private outputContainer: HTMLElement;
  private plugin: MaestroPlugin;

  constructor(app: App, plugin: MaestroPlugin) {
    super(app);
    this.modalEl.addClass('maestro-modal');
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.addClass('maestro-modal')
    contentEl.createEl('div', { cls: "maestro-banner" });

    this.objectiveTextArea = contentEl.createEl('textarea', {
      attr: {
        placeholder: 'Enter a description of your objective',
      },
    });

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


async runMaestroScript(objective: string): Promise<void> {
  // TODO change to using instance of to check
  const basepath = (this.app.vault.adapter as FileSystemAdapter).getBasePath()
  return new Promise((resolve, reject) => {
    const child = spawn(
      this.plugin.settings.pythonPath,
      [`${basepath}/maestro.py`, objective, this.plugin.settings.apiKey], 
      {cwd: basepath});
    // Use child.stdin for interactive input
    // child.stdin.write(objective);
    // child.stdin.end();

    child.stdout.on('data', async (data) => {
      console.log(new TextDecoder('utf-8').decode(data))
      this.displayMessage(data.toString(), 'success', true); // Update to append the message
    });

    child.stderr.on('data', (data) => {
      console.error(new TextDecoder('utf-8').decode(data))
      this.displayMessage(data.toString(), 'error', true); // Update to append the message
    });

    child.on('close', (code, signal) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Maestro script exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

// Modify the displayMessage method to optionally append messages
displayMessage(message: string, type: 'error' | 'success', append = false) {
  if (!append) {
    this.outputContainer.empty();
  }
  // // Use `createEl` to append new messages if `append` is true, otherwise replace content
  // this.outputContainer.createEl('pre', { text: message, cls: `maestro-${type}-message` });
  // Convert rich text formatting to HTML (basic example for bold)
  const formattedMessage = message.replace(/\[bold\](.*?)\[\/bold\]/g, '<strong>$1</strong>');

  // Create a new element to contain the message
  const messageEl = this.outputContainer.createEl('pre', { cls: `maestro-${type}-message` });
  messageEl.innerHTML = formattedMessage; // Set the inner HTML to include formatting
  
}
}

const DEFAULT_SETTINGS = {
  apiKey: '',
};

export default class MaestroPlugin extends Plugin {
  settings: MaestroSettings;


  async onload() {
    await this.loadSettings();
    this.addRibbonIcon('bot', 'Open Objective Generator', () => {
      new ObjectiveModal(this.app, this).open();
    });
    this.addSettingTab(new MaestroSettingTab(this.app, this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    return await this.saveData(this.settings);
  } 
}

type MaestroSettings = {
  apiKey: string;
  pythonPath: string;
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

    new Setting(containerEl)
      .setName('Python executable')
      .setDesc('Enter your python path, make sure rich and anthropic pip packages are installed.')
      .addText(text => text
        .setPlaceholder('Path to your python executable')
        .setValue(this.plugin.settings.pythonPath)
        .onChange(async (value) => {
          this.plugin.settings.pythonPath = value;
          await this.plugin.saveSettings();
        }));
  }
}