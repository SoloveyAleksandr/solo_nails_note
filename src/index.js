import './index.html';
import './index.scss';

import { useFirebase } from './firebase/controllers/notesController';

const { getAllDates } = useFirebase();

const loader = document.querySelector('.loader');

const render = async () => {
  loader.classList.add('active');
  const DAYS = await getAllDates();
  const daysList = document.querySelector('.days-list');

  const daysListFragment = document.createDocumentFragment();

  DAYS.forEach(day => {
    const dayItem = document.createElement('li');
    dayItem.className = 'day-item';
    dayItem.innerHTML = `
      <div class="day-item__header">
        <span class="day-item__date">${day.date}</span>
        <button class="day-item__btn"></button>
      </div>
      <ul class="day-item__list time-list">
      </ul>
    `;
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
          <span>${item.phoneNumber}</span>
        </div>
        <div class="time-list__info-wrapper time-list-info">
          <span class="time-list-info__title">instagram:</span>
          <span>${item.instagram}</span>
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
  loader.classList.remove('active');
};

render();