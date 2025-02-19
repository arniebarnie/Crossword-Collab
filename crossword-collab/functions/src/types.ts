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
  puzzlesCreated: string[];
}