import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'; 

// CRITICAL: Ensure this function accepts TWO arguments: formData AND imageUrl
export const createPickupRequest = async (formData, imageUrl) => {
  try {
    await addDoc(collection(db, "pickups"), {
      ...formData,
      // CRITICAL: This line saves the huge text string to the database
      imageUrl: imageUrl || "", 
      status: "Pending",
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error };
  }
};

export const deletePickup = async (pickupId) => {
  try {
    await deleteDoc(doc(db, 'pickups', pickupId));
    return { success: true };
  } catch (error) {
    console.error('[pickupService] delete failed:', error);
    return { success: false, error };
  }
};