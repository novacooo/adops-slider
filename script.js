const images = [
  'https://picsum.photos/720/200?random=1',
  'https://picsum.photos/720/200?random=2',
  'https://picsum.photos/720/200?random=3',
  'https://picsum.photos/720/200?random=4',
];
const intervalInSeconds = 3;
const options = {
  type: 'fade',
  rewind: true,
  autoplay: true,
  interval: intervalInSeconds * 1000,
  resetProgress: false,
  pagination: false,
};

document.addEventListener('DOMContentLoaded', () => {
  const sliderEl = document.querySelector('#slider');
  const listEl = sliderEl.querySelector('.splide__track > .splide__list');
  const leftGrowerEl = document.querySelectorAll('.grower')[0];
  const rightGrowerEl = document.querySelectorAll('.grower')[1];
  const barsWrapperEl = document.querySelector('.bars-wrapper');
  const progressEl = document.querySelector('.carousel-progress');

  images.forEach((image, index) => {
    const itemEl = document.createElement('li');
    itemEl.classList.add('splide__slide');

    const wrapperEl = document.createElement('div');
    wrapperEl.classList.add('slide-wrapper');
    wrapperEl.style.backgroundImage = `url('${image}')`;

    const barEl = document.createElement('div');
    barEl.classList.add('bar');
    barEl.classList.add(`bar-${index}`);

    itemEl.appendChild(wrapperEl);
    listEl.appendChild(itemEl);
    barsWrapperEl.appendChild(barEl);
  });

  const splide = new Splide(sliderEl, options);

  splide.on('mounted move', function () {
    const index = splide.index;
    const length = images.length;

    progressEl.style.paddingLeft = `${index * 8}px`;
    progressEl.style.paddingRight = `${(length - index - 1) * 8}px`;

    leftGrowerEl.style.flexGrow = index;
    rightGrowerEl.style.flexGrow = length - index - 1;

    for (let i = 0; i < length; i++) {
      const barEl = splide.root.querySelector(`.bar-${i}`);
      barEl.style.backgroundColor = i >= index ? '#fff' : '#4287f5';
    }
  });

  splide.mount();
});
