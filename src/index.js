import './index.html';
import './index.scss';

import { useFirebase } from './firebase/controllers/notesController';
import { v4 as uuid } from 'uuid';

const { getAllDates, addNewDay, removeDay, addTime, editTime } = useFirebase();

let selectedDay = null;

const LOADER = document.querySelector('.loader');
const ADD_BTN = document.querySelector('.add-btn');
//управление date-form
const DATE_FORM_WRAPPER = document.querySelector('.date-form-wrapper');
const DATE_FORM = document.querySelector('#date-form');
const DATE_FORM_CANCEL = document.querySelector('#date-form-cancel');
//управление time-form
const TIME_FORM_WRAPPER = document.querySelector('.time-form-wrapper');
const TIME_FORM = document.querySelector('#time-form');
const TIME_FORM_CANCEL = document.querySelector('#time-form-cancel');
const TIME_FORM_CONFIRM = document.querySelector('#time-form-confirm');

// открытие | закрытие date-form
ADD_BTN.onclick = () => {
  DATE_FORM_WRAPPER.classList.add('active');
}

DATE_FORM_CANCEL.onclick = () => {
  DATE_FORM_WRAPPER.classList.remove('active');
}

//создание новоего дня
DATE_FORM.onsubmit = async (e) => {
  e.preventDefault();
  LOADER.classList.add('active');
  DATE_FORM_WRAPPER.classList.remove('active');
  const selectedDate = e.target['date-input'].value;
  await addNewDay(selectedDate);
  render();
}

//удаление дня
const deleteDay = async (day) => {
  const confirm = window.confirm(`Удалить день на ${day.date}`);
  if (confirm) {
    LOADER.classList.add('active');
    await removeDay(day.id);
    render();
  }
};

// открытие | закрытие time-form
const openTimeForm = (day) => {
  TIME_FORM.onsubmit = (e) => addNewTime(e);
  TIME_FORM_WRAPPER.classList.add('active');
  selectedDay = day;
};

const closeTimeForm = () => {
  TIME_FORM_WRAPPER.classList.remove('active');
  TIME_FORM_CONFIRM.innerHTML = 'добавить';
  TIME_FORM.reset();
}
TIME_FORM_CANCEL.onclick = () => closeTimeForm();

//создание новой записи
const addNewTime = async (e) => {
  e.preventDefault();
  LOADER.classList.add('active');
  const form = e.target;
  const newTime = {
    id: uuid().slice(0, 10),
    time: form['time'].value,
    name: form['name'].value,
    phoneNumber: form['phoneNumber'].value,
    instagram: form['instagram'].value,
    comment: form['comment'].value,
  };
  closeTimeForm();
  await addTime(selectedDay.id, newTime);
  render();
};

const editSelectedTime = async (e, dayID, time) => {
  e.preventDefault();
  LOADER.classList.add('active');
  const form = e.target;
  const newTime = {
    id: time.id,
    time: form['time'].value,
    name: form['name'].value,
    phoneNumber: form['phoneNumber'].value,
    instagram: form['instagram'].value,
    comment: form['comment'].value,
  };
  closeTimeForm();
  await editTime(dayID, newTime);
  render();
}

const editTimeItem = (dayID, item) => {
  TIME_FORM.onsubmit = (e) => editSelectedTime(e, dayID, item);
  TIME_FORM['time'].value = item.time;
  TIME_FORM['name'].value = item.name;
  TIME_FORM['phoneNumber'].value = item.phoneNumber;
  TIME_FORM['instagram'].value = item.instagram;
  TIME_FORM['comment'].value = item.comment;
  TIME_FORM_CONFIRM.innerHTML = 'сохранить';
  TIME_FORM_WRAPPER.classList.add('active');
}

const sortByTime = (a, b) => {
  const aH = Number(a.time.slice(0, 2));
  const aM = Number(a.time.slice(3, 5));
  const bH = Number(b.time.slice(0, 2));
  const bM = Number(b.time.slice(3, 5));
  if (aH > bH) {
    return 1;
  } else if (aH < bH) {
    return -1;
  } else {
    if (aM > bM) {
      return 1;
    } else if (aM < bM) {
      return -1;
    } else {
      return 0;
    }
  }
}
// рендер дней
const render = async () => {
  LOADER.classList.add('active');
  const allDays = await getAllDates();
  const daysList = document.querySelector('.days-list');
  daysList.innerHTML = '';

  const daysListFragment = document.createDocumentFragment();

  allDays.forEach(day => {
    const dayItem = document.createElement('li');
    dayItem.className = 'day-item';
    dayItem.innerHTML = `
      <div class="day-item__header">
        <span class="day-item__date">${day.date}</span>
        <div class="day-item__btn-wrapper">
          <button id="day-item-del-btn" class="day-item__btn _remove"></button>
          <button id="day-item-add-btn" class="day-item__btn _add"></button>
        </div>
      </div>
      <ul class="day-item__list time-list">
      </ul>
    `;
    dayItem.onclick = (e) => {
      if (e.target.classList.contains('day-item__header')) {
        dayItem.classList.toggle('open');
      }
    }

    const deleteDayBtn = dayItem.querySelector('#day-item-del-btn');
    const addDayBtn = dayItem.querySelector('#day-item-add-btn');
    deleteDayBtn.onclick = () => deleteDay(day);
    addDayBtn.onclick = () => openTimeForm(day);

    const nodeTimeList = dayItem.querySelector('.time-list');

    const timeListFragment = document.createDocumentFragment();
    const timeList = Object.values(day.timeList);
    const sortTimeList = timeList.sort((a, b) => sortByTime(a, b));
    sortTimeList.forEach(item => {
      const timeItem = document.createElement('li');
      timeItem.className = 'time-list__item';
      timeItem.innerHTML = `
        <button id="${item.id}" class="time-list__edit-btn"></button>
        <div class="time-list__info-wrapper time-list-info">
          <span class="time-list-info__title">время:</span>
          <span>${item.time}</span>
        </div>
        <div class="time-list__info-wrapper time-list-info">
          <span class="time-list-info__title">имя:</span>
          <span>${item.name}</span>
        </div>
        <div class="time-list__info-wrapper time-list-info">
          <span class="time-list-info__title">телефон:</span>
          <a  href="tel:${item.phoneNumber}">позвонить</a>
        </div>
        <div class="time-list__info-wrapper time-list-info">
          <span class="time-list-info__title">instagram:</span>
          <a href="${item.instagram}">инс</a>
        </div>
        <div class="time-list__comment-wrapper time-list-info ">
          <span class="time-list-info__title">коментарий:</span>
          <span class="time-list-info__comment">${item.comment}</span>
        </div>
      `;

      timeListFragment.append(timeItem);
      const editBtn = timeItem.querySelector('.time-list__edit-btn');
      editBtn.onclick = () => {
        editTimeItem(day.id, item);
      }
    });

    nodeTimeList.append(timeListFragment);
    daysListFragment.append(dayItem);
  });
  daysList.append(daysListFragment);
  LOADER.classList.remove('active');
};

render();