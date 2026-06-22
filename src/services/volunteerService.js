import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const joinMovement = async (data) => {
  try {
    await addDoc(collection(db, 'volunteers'), {
      ...data,
      role: data.role || 'Volunteer',
      status: 'New',
      joinedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error joining movement:', error);
    return { success: false, error };
  }
};

export const joinAsGatherer = async (data) => {
  try {
    await addDoc(collection(db, 'gatherers'), {
      ...data,
      status: 'New',
      joinedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error joining as gatherer:', error);
    return { success: false, error };
  }
};
