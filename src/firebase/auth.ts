import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

import { auth } from "./firebaseConfig";

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const registerWithEmail = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Email registration error: ", error);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<User | null> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google sign-in error: ", error);
    throw error;
  }
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Email sign-in error: ", error);
    throw error;
  }
};

export const updateUserProfile = async (
  user: User,
  displayName: string | null,
  photoURL: string | null
) => {
  try {
    await updateProfile(user, { displayName, photoURL });
    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
};

export const updateUserEmail = async (user: User, newEmail: string) => {
  try {
    await updateEmail(user, newEmail);
    console.log("User email updated successfully");
  } catch (error) {
    console.error("Error updating user email: ", error);
    throw error;
  }
};

export const updateUserPassword = async (user: User, newPassword: string) => {
  try {
    await updatePassword(user, newPassword);
    console.log("User password updated successfully");
  } catch (error) {
    console.error("Error updating user password: ", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Sign out error: ", error);
    throw error;
  }
};
