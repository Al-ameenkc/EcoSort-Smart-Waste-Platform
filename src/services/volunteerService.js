import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; 

export const joinMovement = async (data) => {
  try {
    await addDoc(collection(db, "volunteers"), {
      ...data,
      status: "New", // Mark as new so you see it in Admin later
      joinedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Error joining movement:", error);
    return { success: false, error };
  }
};