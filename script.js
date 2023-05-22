const { slides, interval, accent, heightRatio, trackingPixels } = settings;

const accentColor = accent ?? '#4287f5';

const options = {
  type: 'fade',
  rewind: true,
  autoplay: true,
  interval: interval * 1000,
  resetProgress: false,
  pagination: false,
  pauseOnHover: false,
  pauseOnFocus: false,
  heightRatio,
};

document.addEventListener('DOMContentLoaded', () => {
  const sliderEl = document.querySelector('#slider');
  const listEl = sliderEl.querySelector('.splide__track > .splide__list');
  const leftGrowerEl = document.querySelectorAll('.grower')[0];
  const rightGrowerEl = document.querySelectorAll('.grower')[1];
  const barsWrapperEl = document.querySelector('.bars-wrapper');
  const progressEl = document.querySelector('.carousel-progress');
  const progressBarEl = document.querySelector('.splide__progress__bar');

  progressBarEl.style.backgroundColor = accentColor;

  trackingPixels.forEach((pixel) => {
    const frame = document.createElement('iframe');
    frame.src = pixel;
    frame.width = '1';
    frame.height = '1';
    frame.style.display = 'none';
    document.body.appendChild(frame);
  });

  slides.forEach(
    ({ image, atl, buttonText, buttonPosition, clickTag, onlyAtl }, index) => {
      const itemEl = document.createElement('li');
      itemEl.classList.add('splide__slide');

      const wrapperJustifyContent = buttonPosition ?? 'flex-start';
      const wrapperEl = document.createElement('div');
      wrapperEl.classList.add('slide-wrapper');
      wrapperEl.style.backgroundImage = `url('${image}')`;
      wrapperEl.style.justifyContent = wrapperJustifyContent;

      const barEl = document.createElement('div');
      barEl.classList.add('bar');
      barEl.classList.add(`bar-${index}`);

      if (typeof atl !== 'undefined') {
        const buttonWrapper = document.createElement('div');
        const button = document.createElement('button');
        const text = document.createElement('span');

        buttonWrapper.classList.add('button-wrapper');
        button.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 96 960 960" width="40"><path d="M479.883 866.74q-18.55 0-31.253-12.787-12.703-12.786-12.703-31.286V620.073H233.333q-18.5 0-31.286-12.82-12.787-12.82-12.787-31.37t12.787-31.253q12.786-12.703 31.286-12.703h202.594V329.333q0-18.5 12.82-31.286 12.82-12.787 31.37-12.787t31.253 12.787q12.703 12.786 12.703 31.286v202.594h202.594q18.5 0 31.286 12.82 12.787 12.82 12.787 31.37t-12.787 31.253q-12.786 12.703-31.286 12.703H524.073v202.594q0 18.5-12.82 31.286-12.82 12.787-31.37 12.787Z"/></svg>';
        text.textContent = buttonText ?? 'Dodaj';

        button.addEventListener('click', () => {
          window.open(atl, 'blank');
        });

        buttonWrapper.appendChild(button);
        buttonWrapper.appendChild(text);
        wrapperEl.appendChild(buttonWrapper);
      }

      if (clickTag || onlyAtl) {
        const bannerLink = onlyAtl && !!atl ? atl : clickTag;

        wrapperEl.style.cursor = 'pointer';

        wrapperEl.addEventListener('click', () => {
          window.open(bannerLink, 'blank');
        });
      }

      itemEl.appendChild(wrapperEl);
      listEl.appendChild(itemEl);
      barsWrapperEl.appendChild(barEl);
    }
  );

  const splide = new Splide(sliderEl, options);

  splide.on('mounted move', function () {
    const index = splide.index;
    const length = slides.length;

    progressEl.style.paddingLeft = `${index * 8}px`;
    progressEl.style.paddingRight = `${(length - index - 1) * 8}px`;

    leftGrowerEl.style.flexGrow = index;
    rightGrowerEl.style.flexGrow = length - index - 1;

    for (let i = 0; i < length; i++) {
      const barEl = splide.root.querySelector(`.bar-${i}`);
      barEl.style.backgroundColor = i >= index ? '#fff' : accentColor;
    }
  });

  splide.mount();
});
