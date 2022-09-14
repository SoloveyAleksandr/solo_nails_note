import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "..";
import { Day, sortDays } from "../services/dayService";


export const useFirebase = () => {
  const dayRef = collection(db, 'day');
  const getAllDates = async () => {
    try {
      const days = [];
      const daySnap = await getDocs(dayRef);
      daySnap.forEach(el => {
        days.push(el.data());
      });
      return days.sort((a, b) => sortDays(a.date, b.date));
    } catch (e) {
      console.log(e);
    }
  };

  const addNewDay = async (date) => {
    try {
      const newDay = new Day(date);
      await setDoc(doc(dayRef, newDay.id), { ...newDay });
    } catch (e) {
      console.log(e);
    }
  };

  const removeDay = async (id) => {
    try {
      await deleteDoc(doc(dayRef, id));
    } catch (e) {
      console.log(e);
    }
  };

  const updateDay = async (dayID, timeID, fillName, value) => {
    try {
      await updateDoc(doc(dayRef, dayID), {
        [`timeList.${timeID}.${fillName}`]: value,
      })
    } catch (e) {
      console.log(e);
    }
  }

  return {
    getAllDates,
    addNewDay,
    removeDay,
    updateDoc,
    updateDay,
  };
};
