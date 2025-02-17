import { Timestamp } from "firebase-admin/firestore";

export interface Word {
  answer: string;
  clue: string;
  direction: "across" | "down";
  start: {
    x: number;
    y: number;
  };
}

export interface Crossword {
  id: string;
  words: Word[];
  dimensions: {
    length: number;
    width: number;
  };
  theme: string;
  createdBy: string;
  owners: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface User {
  name: string;
  login: string;
  puzzlesCreated: string[];
}

export interface CrosswordMetadata {
  id: string;
  theme: string;
  createdBy: string;
  createdAt: Timestamp;
}

export interface GetUserCrosswordsData {
  userId: string;
}

export interface GetCrosswordsByThemeData {
  theme: string;
}

export interface GetCrosswordData {
  crosswordId: string;
}

export interface CreateCrosswordData {
  words: Word[];
  dimensions: { length: number; width: number };
  theme: string;
}

export interface UpdateCrosswordData {
  crosswordId: string;
  words: Word[];
  dimensions: { length: number; width: number };
  theme: string;
}

export interface DeleteCrosswordData {
  crosswordId: string;
} 