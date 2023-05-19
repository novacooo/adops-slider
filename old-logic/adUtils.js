// get DOM element by id shortcut
export function $(x) {
  return document.getElementById(x);
}

// link css spreadsheet in header
export function insertCss(url) {
  // create link element in DOM header
  const head = document.head;
  const link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;
  head.appendChild(link);
}

// run impression tracking pixels from an array
export function runPixels(pixels, el) {
  // make an array if someone passed string by accident
  if (typeof pixels === 'string') {
    pixels = [pixels];
  }

  // create iframe in DOM for every passed pixel
  Array.from(pixels).forEach((pixel) => {
    const frame = document.createElement('iframe');
    frame.src = pixel;
    frame.width = '1';
    frame.height = '1';
    el.appendChild(frame);
  });
}

// create button creative url
export function getButton(button) {
  return `https://ocs-pl.oktawave.com/v1/AUTH_0766c9f9-3aa7-4a69-83ac-7625429eb50e/ListonicStatic/assets/Templates/Buttons/${button.toLowerCase()}.png`;
}

// change background color around add to list button
export function changeATLBackgroundColor(hex) {
  if (hex != undefined) {
    $('atl-container').style.backgroundColor = hex;
  }
}

// make event helper function
export function makeEvent(name) {
  const event = new Event(name, {
    bubbles: true,
    cancelable: true,
  });
  return event;
}
