import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Crossword, CrosswordMetadata } from "./types";
import { onCall } from "firebase-functions/v2/https";
import { GetUserCrosswordsData, GetCrosswordsByThemeData, GetCrosswordData, CreateCrosswordData, UpdateCrosswordData, DeleteCrosswordData } from "./types";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

admin.initializeApp();
const db = admin.firestore();

// Get crosswords by user ID
export const getUserCrosswords = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required"
    );
  }

  const userId = request.data.userId;
  const crosswordsSnapshot = await db
    .collection("crosswords")
    .where("createdBy", "==", userId)
    .get();

  const crosswords: CrosswordMetadata[] = [];
  crosswordsSnapshot.forEach((doc: QueryDocumentSnapshot) => {
    const data = doc.data();
    crosswords.push({
      id: doc.id,
      theme: data.theme,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
    });
  });

  return { crosswords };
});

// Get crosswords by theme
export const getCrosswordsByTheme = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required"
    );
  }

  const theme = request.data.theme;
  const crosswordsSnapshot = await db
    .collection("crosswords")
    .where("theme", "==", theme)
    .get();

  const crosswords: CrosswordMetadata[] = [];
  crosswordsSnapshot.forEach((doc: QueryDocumentSnapshot) => {
    const data = doc.data();
    crosswords.push({
      id: doc.id,
      theme: data.theme,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
    });
  });

  return { crosswords };
});

// Get crossword by ID
export const getCrossword = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required"
    );
  }

  const crosswordId = request.data.crosswordId;
  const crosswordDoc = await db.collection("crosswords").doc(crosswordId).get();

  if (!crosswordDoc.exists) {
    throw new functions.https.HttpsError("not-found", "Crossword not found");
  }

  return { crossword: { id: crosswordDoc.id, ...crosswordDoc.data() } };
});

// Create new crossword
export const createCrossword = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required"
    );
  }

  const userId = request.auth.uid;
  const { words, dimensions, theme } = request.data;

  const crosswordData: Omit<Crossword, "id"> = {
    words,
    dimensions,
    theme,
    createdBy: userId,
    owners: [userId],
    createdAt: admin.firestore.Timestamp.now(),
    updatedAt: admin.firestore.Timestamp.now(),
  };

  const docRef = await db.collection("crosswords").add(crosswordData);
  
  // Update user's puzzlesCreated
  await db.collection("users").doc(userId).update({
    puzzlesCreated: admin.firestore.FieldValue.arrayUnion(docRef.id),
  });

  return { id: docRef.id };
});

// Update crossword
export const updateCrossword = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required"
    );
  }

  const userId = request.auth.uid;
  const { crosswordId, words, dimensions, theme } = request.data;

  const crosswordRef = db.collection("crosswords").doc(crosswordId);
  const crossword = await crosswordRef.get();

  if (!crossword.exists) {
    throw new functions.https.HttpsError("not-found", "Crossword not found");
  }

  const crosswordData = crossword.data() as Crossword;
  if (!crosswordData.owners.includes(userId)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "User does not have permission to update this crossword"
    );
  }

  await crosswordRef.update({
    words,
    dimensions,
    theme,
    updatedAt: admin.firestore.Timestamp.now(),
  });

  return { success: true };
});

// Delete crossword
export const deleteCrossword = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required"
    );
  }

  const userId = request.auth.uid;
  const { crosswordId } = request.data;

  const crosswordRef = db.collection("crosswords").doc(crosswordId);
  const crossword = await crosswordRef.get();

  if (!crossword.exists) {
    throw new functions.https.HttpsError("not-found", "Crossword not found");
  }

  const crosswordData = crossword.data() as Crossword;
  if (!crosswordData.owners.includes(userId)) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "User does not have permission to delete this crossword"
    );
  }

  await crosswordRef.delete();
  
  // Remove crossword ID from user's puzzlesCreated
  await db.collection("users").doc(crosswordData.createdBy).update({
    puzzlesCreated: admin.firestore.FieldValue.arrayRemove(crosswordId),
  });

  return { success: true };
}); 