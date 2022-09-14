import { v4 as uuid } from 'uuid';

export function Day(date) {
  this.id = uuid().slice(0, 7);
  this.date = date.split('-').reverse().join('.');
  this.timeList = {};
};

export const sortDays = (a, b) => {
  const A = {
    day: Number(a.slice(0, 2)),
    month: Number(a.slice(3, 6)),
    year: Number(a.slice(6, 10)),
  }
  const B = {
    day: Number(b.slice(0, 2)),
    month: Number(b.slice(3, 6)),
    year: Number(b.slice(6, 10)),
  }

  if (A.year > B.year) {
    return 1;
  } else if (A.year < B.year) {
    return -1;
  } else {
    if (A.month > B.month) {
      return 1;
    } else if (A.month < B.month) {
      return -1;
    } else {
      if (A.day > B.day) {
        return 1;
      } else if (A.day < B.day) {
        return -1;
      } else {
        return 0;
      }
    }
  }
};