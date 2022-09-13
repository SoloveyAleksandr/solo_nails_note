import { collection, getDocs } from "firebase/firestore";
import { db } from "..";


export const useFirebase = () => {
  const getAllDates = async () => {
    try {
      const days = [];
      const daySnap = await getDocs(collection(db, 'day'));
      daySnap.forEach(el => {
        days.push(el.data());
      });
      return days;
    } catch (e) {
      console.log(e);
    }
  };

  return {
    getAllDates,
  };
};
