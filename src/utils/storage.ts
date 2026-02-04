import type { Settings, LLMProvider } from '../types';

export async function getSettings(): Promise<Settings> {
  return new Promise<Settings>((resolve) => {
    chrome.storage.sync.get(['apiKeys', 'selectedTier', 'preferences'], (result: Settings) => {
      resolve(result);
    });
  });
}

export async function saveSettings(settings: Settings): Promise<void> {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set(settings, () => {
      resolve();
    });
  });
}

export async function getAPIKey(provider: LLMProvider): Promise<string | undefined> {
  const settings = await getSettings();
  return settings.apiKeys?.[provider];
}

export async function saveAPIKey(provider: LLMProvider, key: string): Promise<void> {
  const settings = await getSettings();
  const apiKeys = settings.apiKeys || {};
  apiKeys[provider] = key;
  await saveSettings({ ...settings, apiKeys });
}
