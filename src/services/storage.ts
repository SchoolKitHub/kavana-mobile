import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScannedItem } from '../data/mockScenarios';

const STORAGE_KEY = '@kavana_saved_words';

export async function getSavedWords(): Promise<ScannedItem[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to load saved words:', e);
    return [];
  }
}

export async function saveWord(word: ScannedItem): Promise<boolean> {
  try {
    const saved = await getSavedWords();
    // Check if already saved
    if (saved.some(item => item.hebrew === word.hebrew)) {
      return true; // Already saved
    }
    const updated = [word, ...saved];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Failed to save word:', e);
    return false;
  }
}

export async function deleteWord(hebrew: string): Promise<ScannedItem[]> {
  try {
    const saved = await getSavedWords();
    const filtered = saved.filter(item => item.hebrew !== hebrew);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Failed to delete word:', e);
    return [];
  }
}
