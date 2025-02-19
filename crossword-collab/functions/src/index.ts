import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Crossword } from "./types";
import { onCall } from "firebase-functions/v2/https";
import { User } from "./types";
import { HttpsError } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

// Create a new user
export const createUser = onCall(async (request) => {
  const { name } = request.data;
  const auth = request.auth;

  if (!auth) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  const userId = auth.uid;

  const newUser: User = {
    name,
    puzzlesCreated: []
  };

  try {
    await db.collection("users").doc(userId).set(newUser);
    return { userId, ...newUser };
  } catch (error) {
    throw new HttpsError("internal", "Failed to create user");
  }
});

// Get user metadata
export const getUser = onCall(async (request) => {
  const { userId } = request.data;
  const auth = request.auth;

  if (!auth) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    
    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User not found");
    }

    return { userId, ...userDoc.data() };
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Failed to fetch user");
  }
});

// Delete user
export const deleteUser = onCall(async (request) => {
  const auth = request.auth;

  if (!auth) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  const userId = auth.uid;

  try {
    // Delete user's crosswords
    const userRef = db.collection("users").doc(userId);
    const userData = (await userRef.get()).data() as User;
    
    // Delete all crosswords created by the user
    const batch = db.batch();
    for (const puzzleId of userData.puzzlesCreated) {
      batch.delete(db.collection("crosswords").doc(puzzleId));
    }
    
    // Delete the user document
    batch.delete(userRef);
    
    await batch.commit();
    
    // Delete the Firebase Auth user
    await admin.auth().deleteUser(userId);
    
    return { success: true };
  } catch (error) {
    throw new HttpsError("internal", "Failed to delete user");
  }
});

// Create a new crossword
export const createCrossword = onCall(async (request) => {
  const { words, dimensions, theme } = request.data;
  const auth = request.auth;

  if (!auth) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  const userId = auth.uid;

  try {
    // Create new crossword document
    const crosswordRef = db.collection("crosswords").doc();
    const now = admin.firestore.Timestamp.now();

    const newCrossword: Crossword = {
      words,
      dimensions,
      theme,
      createdBy: userId,
      owners: [userId],
      createdAt: now,
      updatedAt: now
    };

    // Update user's puzzlesCreated array
    const userRef = db.collection("users").doc(userId);
    
    const batch = db.batch();
    batch.set(crosswordRef, newCrossword);
    batch.update(userRef, {
      puzzlesCreated: admin.firestore.FieldValue.arrayUnion(crosswordRef.id)
    });

    await batch.commit();

    return { crosswordId: crosswordRef.id };
  } catch (error) {
    throw new HttpsError("internal", "Failed to create crossword");
  }
});

// Read a crossword
export const getCrossword = onCall(async (request) => {
  const { crosswordId } = request.data;
  const auth = request.auth;

  if (!auth) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  try {
    const crosswordDoc = await db.collection("crosswords").doc(crosswordId).get();

    if (!crosswordDoc.exists) {
      throw new HttpsError("not-found", "Crossword not found");
    }

    const crossword = crosswordDoc.data() as Crossword;

    return { crosswordId, ...crossword };
  } catch (error) {
    throw new HttpsError("internal", "Failed to get crossword");
  }
});

// Update a crossword
export const updateCrossword = onCall(async (request) => {
  const { crosswordId, updates } = request.data;
  const auth = request.auth;

  if (!auth) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  try {
    const crosswordDoc = await db.collection("crosswords").doc(crosswordId).get();

    if (!crosswordDoc.exists) {
      throw new HttpsError("not-found", "Crossword not found");
    }

    // Update the crossword document
    await crosswordDoc.ref.update({
      ...updates,
      updatedAt: admin.firestore.Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    throw new HttpsError("internal", "Failed to update crossword");
  }
});

// Delete a crossword
export const deleteCrossword = onCall(async (request) => {
  const { crosswordId } = request.data;
  const auth = request.auth;

  if (!auth) {
    throw new HttpsError("unauthenticated", "Must be authenticated");
  }

  try {
    const crosswordDoc = await db.collection("crosswords").doc(crosswordId).get();

    if (!crosswordDoc.exists) {
      throw new HttpsError("not-found", "Crossword not found");
    }

    // Delete the crossword document
    await crosswordDoc.ref.delete();

    return { success: true };
  } catch (error) {
    throw new HttpsError("internal", "Failed to delete crossword");
  }
});
