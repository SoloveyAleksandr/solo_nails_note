import './index.html';
import './index.scss';

import { useFirebase } from './firebase/controllers/notesController';
import { async } from '@firebase/util';

const { getAllDates, addNewDay, removeDay } = useFirebase();

const LOADER = document.querySelector('.loader');
const ADD_BTN = document.querySelector('.add-btn');
const DATE_FORM_WRAPPER = document.querySelector('.date-form-wrapper');
const DATE_FORM = document.querySelector('#date-form');
const DATE_FORM_CANCEL = document.querySelector('#date-form-cancel');

// открытие | закрытие формы даты
ADD_BTN.onclick = () => {
  DATE_FORM_WRAPPER.classList.add('active');
}

DATE_FORM_CANCEL.onclick = () => {
  DATE_FORM_WRAPPER.classList.remove('active');
}

DATE_FORM.onsubmit = async (e) => {
  e.preventDefault();
  LOADER.classList.add('active');
  DATE_FORM_WRAPPER.classList.remove('active');
  const selectedDate = e.target['date-input'].value;
  await addNewDay(selectedDate);
  render();
}

const deleteDay = async (day) => {
  const confirm = window.confirm(`Удалить день на ${day.date}`);
  if (confirm) {
    LOADER.classList.add('active');
    await removeDay(day.id);
    render();
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
        <button class="day-item__btn _minus"></button>
        <button class="day-item__btn"></button>
        </div>
      </div>
      <ul class="day-item__list time-list">
      </ul>
    `;
    const deleteDayBtn = dayItem.querySelector('.day-item__btn');
    deleteDayBtn.onclick = () => deleteDay(day);
    const nodeTimeList = dayItem.querySelector('.time-list');

    const timeListFragment = document.createDocumentFragment();
    const timeList = Object.values(day.timeList);
    timeList.forEach(item => {
      const timeItem = document.createElement('li');
      timeItem.className = 'time-list__item';
      const itemContent = `
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
      timeItem.innerHTML = itemContent;

      timeListFragment.append(timeItem);
    });
    nodeTimeList.append(timeListFragment);
    daysListFragment.append(dayItem);
  });
  daysList.append(daysListFragment);
  LOADER.classList.remove('active');
};

render();