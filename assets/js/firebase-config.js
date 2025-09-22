// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlQFqmGGBIrttrC6Ids-bppFpeOOfWXVU",
  authDomain: "helionis.firebaseapp.com",
  databaseURL: "https://helionis-default-rtdb.firebaseio.com",
  projectId: "helionis",
  storageBucket: "helionis.firebasestorage.app",
  messagingSenderId: "112789846576",
  appId: "1:112789846576:web:5a8049942a7c559ca98bf5",
  measurementId: "G-8W0GMB0F73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
const provider = new GoogleAuthProvider();

// Google Sign In
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Check if user profile exists, if not create basic profile
    const userRef = ref(database, 'users/' + user.uid);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists()) {
      await set(userRef, {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        address: {
          street: '',
          city: '',
          zipCode: '',
          country: 'Deutschland'
        }
      });
    }
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

// Sign Out
export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Save user profile data
export async function saveUserProfile(userId, profileData) {
  try {
    const userRef = ref(database, 'users/' + userId);
    await set(userRef, {
      ...profileData,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
}

// Get user profile data
export async function getUserProfile(userId) {
  try {
    const userRef = ref(database, 'users/' + userId);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting profile:', error);
    throw error;
  }
}

// Auth state observer
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser;
}

export { auth, database };
