export type SupportedLanguage = 'en'

// Contains all loaded languages. language -> set of words.
const dictionaryCache = new Map<SupportedLanguage, Set<string>>()

/**
 * When this is called for the first time, loading may take longer,
 * but next time, dictionary is always retrieved directly from the cache.
 * @returns lang dictionary - a set of words
 */
export async function loadDictionary(
  language: SupportedLanguage,
): Promise<Set<string>> {
  const cachedDictionary = dictionaryCache.get(language)
  if (cachedDictionary) return cachedDictionary

  const dictionary = await buildDictionary(language)
  dictionaryCache.set(language, dictionary)
  return dictionary
}

/**
 * To add or remove a word from dictionary, edit accepted-words.txt directly
 */
async function buildDictionary(
  language: SupportedLanguage,
): Promise<Set<string>> {
  switch (language) {
    case 'en': {
      const { default: wordListText } =
        await import('./data/accepted-words.txt?raw')
      const words = wordListText
        .split('\n')
        .map((word) => word.trim())
        .filter(Boolean)
      return new Set(words)
    }
    default: {
      const exhaustiveCheck: never = language
      throw new Error(`Unsupported dictionary language: ${exhaustiveCheck}`)
    }
  }
}

export function isValidWord(dictionary: Set<string>, word: string): boolean {
  return dictionary.has(word.toUpperCase())
}
