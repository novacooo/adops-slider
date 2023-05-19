import {
  $,
  changeATLBackgroundColor,
  getButton,
  insertCss,
  makeEvent,
  runPixels,
} from './adUtils.js';

function showBanner() {
  // HANDLE CSS
  const hasButton = Settings.HasButton;
  // insert default css
  insertCss('./banner_style.css');
  // modify css if ATL banner
  if (hasButton) {
    mraid.addEventListener(
      'changeATLBackgroundColor',
      changeATLBackgroundColor
    );
    $('atl-container').style.display = 'block';
    $('collapsed-image').style.left = '20%';
    $('collapsed-image').style.width = '80%';
    $('expanded-image').style.left = '20%';
    $('expanded-image').style.width = '80%';
  }

  // BASIC BANNER LOGIC

  // get required DOM elements
  const element = $('banner-container');
  const basic = $('collapsed-container');
  const bannerCollapsed = $('collapsed-image');

  // get required settings
  const isExpand = Settings.IsExpand;
  const onlyAtl = Settings.OnlyATL;
  const clickTag = !onlyAtl ? Settings.ClickTag : Settings.ATL; // if onlyAtl clicktag == ATL

  // fire the impression tracking pixels, from a list
  runPixels(Settings.TrackingPixels, document.body);

  // assign creative image
  bannerCollapsed.src = Settings.Collapsed;

  // handle click in collapsed creative
  bannerCollapsed.addEventListener('click', function () {
    window.open(clickTag, 'blank');
  });

  //ATL BUTTON LOGIC
  if (hasButton) {
    // get atl button image element
    const atlImage = $('atl-img');
    const atlContainer = $('atl-container');
    // assing atl button creative
    atlImage.src = getButton(Settings.Button);
    // handle click in atl button
    atlContainer.addEventListener('click', function () {
      window.open(Settings.ATL, 'blank');
    });
  }

  // EXPAND LOGIC
  if (isExpand) {
    // get required DOM elements
    const resized = $('expanded-container');
    const bannerExpanded = $('expanded-image');
    // assign creative img
    bannerExpanded.src = Settings.Expanded;

    // HANDLE EXPANDING
    mraid.addEventListener('stateChange', handleStateChangeEvent);
    mraid.addEventListener('sasReceiveMessage', handleSasMessage);

    // handle banner state
    function handleSasMessage(content) {
      switch (content) {
        case 'setCollapsed':
          if (mraid.getState() !== 'resized') return;
          mraid.close();
          break;
        case 'setExpanded':
          if (mraid.getState() !== 'default') return;
          mraid.resize();
          break;
      }
    }

    // send a proper message to the app when state changes, run pixels
    function handleStateChangeEvent(state) {
      switch (state) {
        case 'default':
          element.dispatchEvent(makeEvent('collapsed'));
          resized.style.display = 'none';
          mraid.sasSendMessage('collapsed');
          runPixels(Settings.CollapsePixels, element);
          break;
        case 'resized':
          element.dispatchEvent(makeEvent('expanded'));
          resized.style.display = 'block';
          mraid.sasSendMessage('expanded');
          runPixels(Settings.ExpandPixels, element);
          break;
      }
    }

    // get sizes
    const adViewWidth = mraid.getScreenSize().width;
    const bannerInputWidth = parseInt(Settings.Width); // parseInt in case someoen provided other type
    const bannerInputHeight = parseInt(Settings.CollapsedHeight);
    const expandInputHeight = parseInt(Settings.ExpandedHeight);

    // calculate sizes
    const standardRatio = bannerInputWidth / bannerInputHeight;
    const expandRatio = bannerInputWidth / expandInputHeight;
    const realBannerWidth = adViewWidth;
    const realBannerHeight = Math.ceil(adViewWidth / standardRatio);
    const expandBannerHeight = Math.ceil(adViewWidth / expandRatio);

    // set resize properties for expanded
    mraid.setResizeProperties({
      width: adViewWidth,
      height: expandBannerHeight,
      offsetX: 0,
      offsetY: 0,
      allowOffscreen: false,
      customClosePosition: 'none',
    });

    // make expanded creative clickable
    bannerExpanded.addEventListener('click', function () {
      if (mraid.getState() !== 'resized') return;
      mraid.close();
      window.open(clickTag, 'blank');
    });

    // send message to the app
    mraid.sasSendMessage(
      'canExpand_' +
        adViewWidth +
        'x' +
        realBannerHeight +
        '_' +
        adViewWidth +
        'x' +
        expandBannerHeight
    );
  }
}

if (mraid.getState() === 'loading') {
  mraid.addEventListener('ready', showBanner);
} else {
  showBanner();
}
