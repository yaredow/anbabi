export type DictionaryApiResponse = {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  origin?: string;
  meanings: Meaning[];
};

export type Phonetic = {
  text?: string;
  audio?: string;
};

export type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
};

export type Definition = {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
};

export type WikipediaPage = {
  pageid: number;
  ns: number;
  title: string;
  extract?: string;
  contentmodel?: string;
  lastrevid?: number;
};

export type WikipediaApiResponse = {
  query: {
    pages: {
      [pageid: string]: {
        pageid: number;
        ns: number;
        title: string;
        extract?: string;
        contentmodel?: string;
        lastrevid?: number;
      };
    };
  };
};

export type LanguageDetectionResponse = {
  data: {
    detections: {
      language: string; // ISO 639-1 language code, e.g., "en"
      isReliable: boolean; // Indicates whether the detection is reliable
      confidence: number; // Confidence score (0-100)
    }[];
  };
};

export enum Role {
  User = "user",
  ROLE = "model",
}
