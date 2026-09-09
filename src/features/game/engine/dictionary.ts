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
  const cahcedDictionary = dictionaryCache.get(language)
  if (cahcedDictionary) return cahcedDictionary

  const words = await loadWordList(language)
  const dictionary = new Set(words.map((w) => w.toUpperCase()))
  dictionaryCache.set(language, dictionary)
  return dictionary
}

/**
 * Load the specific dictionary based on the language. Allow for expansion to
 * other languages ​​by providing different language types.
 */
async function loadWordList(language: SupportedLanguage): Promise<string[]> {
  switch (language) {
    case 'en': {
      const module = await import('an-array-of-english-words')
      return module.default
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
