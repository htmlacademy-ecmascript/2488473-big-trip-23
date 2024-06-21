import AbstractView from '../framework/view/abstract-view';

function createPhotoTemplate (photos) {
  let result = '';

  if (photos.length > 0) {
    photos.forEach((elem) => {
      result += (`
        <img class="event__photo" src="${elem.src}" alt="Event photo">
      `);
    });

    return (`
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${result}
      </div>
    </div>
    `);
  } else {
    return '<div></div>';
  }
}

export default class DestinationPhotoView extends AbstractView {
  #photos = null;

  constructor(photos) {
    super();
    this.#photos = photos;
  }

  get template () {
    return createPhotoTemplate(this.#photos);
  }
}
