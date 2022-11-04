const $ = require('jquery');
require('bootstrap');

// https://github.com/jaames/iro.js
const iro = require('@jaames/iro');
// https://github.com/iconfu/svg-inject
const SVGInject = require('@iconfu/svg-inject');
// https://github.com/gka/chroma.js
const chroma = require('chroma-js');

/** **********************************************************************
     *                        Key Variables
     ************************************************************************ */
const APP_TITLE = 'Material Design 3 Color Simulator';
const APP_URL = 'https://github.com/mettyw/Material3ColorSimulator';
const colorMap = {
  colorPrimary: {
    l: 'Primary',
    v: '#6200EE',
  },
  colorOnPrimary: {
    l: 'OnPrimary',
    v: '#FFFFFF',
  },
  colorPrimaryContainer: {
    l: 'PrimaryContainer',
    v: '#3700B3',
  },
  colorOnPrimaryContainer: {
    l: 'OnPrimaryContainer',
    v: '#FFFFFF',
  },
  colorSecondary: {
    l: 'Secondary',
    v: '#03DAC6',
  },
  colorOnSecondary: {
    l: 'OnSecondary',
    v: '#000000',
  },
  colorSecondaryContainer: {
    l: 'SecondaryContainer',
    v: '#018786',
  },
  colorOnSecondaryContainer: {
    l: 'OnSecondaryContainer',
    v: '#000000',
  },
  colorBackground: {
    l: 'Background',
    v: '#FFFBFE',
  },
  colorOnBackground: {
    l: 'OnBackground',
    v: '#1C1B1F',
  },
  colorSurface: {
    l: 'Surface',
    v: '#FAFAFD',
  },
  colorOnSurface: {
    l: 'OnSurface',
    v: '#1C1B1F',
  },
  colorSurfaceVariant: {
    l: 'SurfaceVariant',
    v: '#E7E0EC',
  },
  colorOnSurfaceVariant: {
    l: 'OnSurfaceVariant',
    v: '#49454E',
  },
  colorError: {
    l: 'Error',
    v: '#B3261E',
  },
  colorOnError: {
    l: 'OnError',
    v: '#FFFFFF',
  },
  colorErrorContainer: {
    l: 'ErrorContainer',
    v: '#F9DEDC',
  },
  colorOnErrorContainer: {
    l: 'OnErrorContainer',
    v: '#410E0B',
  },
  colorSurfaceInverse: {
    l: 'SurfaceInverse',
    v: '#313033',
  },
  colorOnSurfaceInverse: {
    l: 'OnSurfaceInverse',
    v: '#F4EFF4',
  },
  colorOutline: {
    l: 'Outline',
    v: '#79747E',
  },
  colorPrimaryInverse: {
    l: 'PrimaryInverse',
    v: '#D0BCFF',
  },
  /*
       "colorOutlineVariant": { "l": "OutlineVariant", "v": "#C4C7C5" },
       "colorShadow" : {"l" : "Shadow", "v" : "#000000"},
       "colorSurfaceTint" : {"l" : "SurfaceTint", "v" : "#6750A4"},
       "colorSurfaceTintColor" : {"l" : "SurfaceTintColor", "v" : "#9C4048"},
       "colorTertiary" : {"l" : "Tertiary", "v" : "#7D5260"},
       "colorOnTertiary" : {"l" : "OnTertiary", "v" : "#FFFFFF"},
       "colorTertiaryContainer" : {"l" : "TertiaryContainer", "v" : "#FFD8E4"},
       "colorOnTertiaryContainer" : {"l" : "OnTertiaryContainer", "v" : "#370B1E"},
       "colorScrim" : {"l" : "Scrim", "v" : "#000000"},
       */
};

/** **********************************************************************
      *                        3rd Party Component init
      ************************************************************************ */

const colorPicker = new iro.ColorPicker('#iropicker', {
  width: 200,
  margin: 20,
  borderWidth: 4,
  layoutDirection: 'horizontal',
});

/** **********************************************************************
      *                        Function definitions
      ************************************************************************ */

function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  while (color.length <= 6) color += letters[(Math.floor(Math.random() * letters.length))];
  return color;
}

function randomDarkColor() {
  const letters = '0123456789';
  let color = '#';
  while (color.length <= 6) color += letters[(Math.floor(Math.random() * letters.length))];
  return color;
}

function randomLightColor() {
  const letters = '89ABCDEF';
  let color = '#';
  while (color.length <= 6) color += letters[(Math.floor(Math.random() * letters.length))];
  return color;
}

function textColorClassForBackground(bgColor) {
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);
  // see http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  if (hsp > 127.5) {
    return 'cssColorOnLight';
  }
  return 'cssColorOnDark';
}

function generateColorExport() {
  let result = `<!-- colors.xml generated with ${APP_TITLE} - ${APP_URL} -->\n`;
  result += '<resources>\n';
  Object.keys(colorMap).forEach((key) => {
    result += `   <color name="mytheme_light_${key}">${colorMap[key].v}</color>\n`;
  });
  result += '</resources>\n';
  return result;
}

function generateThemeExport() {
  let result = `<!-- themes.xml generated with ${APP_TITLE} - ${APP_URL} -->\n`;
  result += '<resources>\n';
  result += '  <style name="AppTheme" parent="Theme.Material3.Light.NoActionBar">\n';
  Object.keys(colorMap).forEach((key) => {
    if (key === 'colorBackground') {
      result += `    <item name="android:${key}">@color/mytheme_light_${key}</item>\n`;
    } else {
      result += `    <item name="${key}">@color/mytheme_light_${key}</item>\n`;
    }
  });
  result += '  </style>\n';
  result += '</resources>\n';
  return result;
}

function reloadColor(key) {
  const color = colorMap[key].v.toUpperCase();
  $(`#swatch-${key}`).css('background-color', color);
  $(`.swatchLabel-${key}`).removeClass('cssColorOnLight');
  $(`.swatchLabel-${key}`).removeClass('cssColorOnDark');
  $(`.swatchLabel-${key}`).addClass(textColorClassForBackground(color));
  $(`#swatchValue-${key}`).text(color);
  $(`svg .${key}`).each((i, obj) => {
    const svgelement = obj;
    svgelement.style.fill = color;
  });
  $('#exportColors').val(generateColorExport());
  $('#exportThemes').val(generateThemeExport());

  $('#colorDialogColorName').text(colorMap[key].l);
  $('#colorDialogColorValue').val(color);
  $('#colorDialogColorKey').text(key);

  if (key === 'colorPrimary') {
    const hsvColor = chroma(colorMap.colorPrimary.v).hsv();
    const hue = hsvColor[0];
    const sat = hsvColor[1] * 100;
    $('#colorPrimary-0').css('backgroundColor', `hsl(${hue}, ${sat}%, 0%)`);
    $('#colorPrimary-10').css('backgroundColor', `hsl(${hue}, ${sat}%, 10%)`);
    $('#colorPrimary-20').css('backgroundColor', `hsl(${hue}, ${sat}%, 20%)`);
    $('#colorPrimary-30').css('backgroundColor', `hsl(${hue}, ${sat}%, 30%)`);
    $('#colorPrimary-40').css('backgroundColor', `hsl(${hue}, ${sat}%, 40%)`);
    $('#colorPrimary-50').css('backgroundColor', `hsl(${hue}, ${sat}%, 50%)`);
    $('#colorPrimary-60').css('backgroundColor', `hsl(${hue}, ${sat}%, 60%)`);
    $('#colorPrimary-70').css('backgroundColor', `hsl(${hue}, ${sat}%, 70%)`);
    $('#colorPrimary-80').css('backgroundColor', `hsl(${hue}, ${sat}%, 80%)`);
    $('#colorPrimary-90').css('backgroundColor', `hsl(${hue}, ${sat}%, 90%)`);
    $('#colorPrimary-95').css('backgroundColor', `hsl(${hue}, ${sat}%, 95%)`);
    $('#colorPrimary-99').css('backgroundColor', `hsl(${hue}, ${sat}%, 99%)`);
    $('#colorPrimary-100').css('backgroundColor', `hsl(${hue}, ${sat}%, 100%)`);
  }
  if (key === 'colorSecondary') {
    const hsvColorSec = chroma(colorMap.colorSecondary.v).hsv();
    const hueSec = hsvColorSec[0];
    const satSec = hsvColorSec[1] * 100;
    $('#colorSecondary-0').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 0%)`);
    $('#colorSecondary-10').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 10%)`);
    $('#colorSecondary-20').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 20%)`);
    $('#colorSecondary-30').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 30%)`);
    $('#colorSecondary-40').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 40%)`);
    $('#colorSecondary-50').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 50%)`);
    $('#colorSecondary-60').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 60%)`);
    $('#colorSecondary-70').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 70%)`);
    $('#colorSecondary-80').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 80%)`);
    $('#colorSecondary-90').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 90%)`);
    $('#colorSecondary-95').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 95%)`);
    $('#colorSecondary-99').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 99%)`);
    $('#colorSecondary-100').css('backgroundColor', `hsl(${hueSec}, ${satSec}%, 100%)`);
  }
}

function assignColor(key, color) {
  if (key === '') return;
  if (colorMap[key].v === color) return;
  colorMap[key].v = chroma(color).hex('rgb');
  $('#colorDialogColorValue').val(color);
  colorPicker.color.hexString = color;

  reloadColor(key);
}

colorPicker.on('color:change', (color) => {
  // log the current color as a HEX string
  const hex = color.hexString.toUpperCase();
  $('#colorDialogColorValue').val(hex);
  const key = $('#colorDialogColorKey').text();
  assignColor(key, hex);
});

SVGInject.setOptions({
  afterInject() {
    // initialize all color values on document load
    Object.keys(colorMap).forEach((key) => {
      reloadColor(key);
    });
  },
});

$(document).ready(
  () => {
    /** **********************************************************************
          *                        Generate UI
          ************************************************************************ */

    $('#githublink').attr('href', APP_URL);

    Object.keys(colorMap).forEach((key) => {
      const swatchKey = `swatch-${key}`;
      const swatchLabelKey = `swatchLabel-${key}`;
      const swatchValueKey = `swatchValue-${key}`;
      // set up color swatch
      $('#color-swatches-content').append(
        `<div class="swatch w-50 d-inline-flex flex-column p-1" id="${swatchKey}"" >`
         + ` <div class="flex-grow-1 fw-bolder ${swatchLabelKey}">${colorMap[key].l}</div>`
         + ' <div class="d-flex justify-content-between flex-grow-1">'
         + '   <div class=" swatchcontent " > '
         + '   </div> '
         + `   <div class=" ${swatchLabelKey}" id="${swatchValueKey}">${colorMap[key].v}</div>`
         + '  </div> '
         + '</div>',
      );
      reloadColor(key);
    });

    /** **********************************************************************
          *                        Action Handlers
          ************************************************************************ */

    // make color swatch flash if user clicks on ui component with that class in SVG
    $('body').on('click', 'rect,text,path,circle', function svgClickHandler() {
      const attrs = $(this).attr('class');
      if (typeof attrs === 'undefined') return;
      const classList = attrs.split(/\s+/);
      classList.forEach((className) => {
        if (!className.startsWith('color')) return;
        $(`#swatch-${className}`).fadeOut(100).fadeIn(100).fadeOut(100)
          .fadeIn(100);
      });
    });
    // make ui components in SVG flash if user clicks on swatch with that class
    $('body').on('click', '.swatch', function swatchClickHandler() {
      const key = $(this).attr('id').replace('swatch-', '');
      $('#colorDialogColorName').text(colorMap[key].l);
      $('#colorDialogColorKey').text(key);
      $('#colorDialogPreviousValue').text(colorMap[key].v);
      $('#colorDialogColorValue').val(colorMap[key].v);
      colorPicker.color.hexString = colorMap[key].v;
      $('#color-swatches-content').hide();
      $('#color-picker-content').show();
      $(`.${key}`).fadeOut(100).fadeIn(100).fadeOut(100)
        .fadeIn(100);
    });
    // add invalid marker if text edit contains no parseable color
    $('#colorDialogColorValue').focusout(function colorInputFocusoutHandler() {
      const hexColorRegExp = /^#[0-9A-F]{6}$/i;
      const key = $('#colorDialogColorKey').text();
      const value = $(this).val();
      if (hexColorRegExp.test(value)) {
        $(this).removeClass('is-invalid');
        assignColor(key, value);
      } else {
        $(this).addClass('is-invalid');
      }
    });

    $('.tonalPaletteItem').click(function tonalPaletteItemClickHander() {
      const key = $('#colorDialogColorKey').text();
      const color = chroma($(this).css('backgroundColor')).hex('rgb');
      $('#colorDialogColorValue').val(color);
      colorPicker.color.hexString = color;
      assignColor(key, color);
    });

    $('#btnRandomizeColor').click(() => {
      const key = $('#colorDialogColorKey').text();
      const color = randomColor();
      assignColor(key, color);
    });
    $('#btnResetColor').click(() => {
      const key = $('#colorDialogColorKey').text();
      const color = $('#colorDialogPreviousValue').text();
      assignColor(key, color);
    });
    $('#btnColorPicker').click(() => {
      $('#color-swatches-content').hide();
      $('#color-picker-content').show();
    });
    $('#btnClosePanel, #btnColorPickerBack').click(() => {
      $('#color-swatches-content').show();
      $('#color-picker-content').hide();
    });
    $('#btnLocateColor').click(() => {
      const key = $('#colorDialogColorKey').text();
      $(`.${key}`).fadeOut(100).fadeIn(100).fadeOut(100)
        .fadeIn(100);
    });
    $('#btnCopyClipboard').click(() => {
      const key = $('#colorDialogColorKey').text();
      const value = colorMap[key].v;
      navigator.clipboard.writeText(value).then(
        () => {
          $('#copyToast').toast('show');
        },
        () => {
          // eslint-disable-next-line no-alert
          window.alert('Opps! Your browser does not support the Clipboard API');
        },
      );
    });
    $('#btnRandomizeAll').click(() => {
      let color;
      color = randomColor();
      assignColor('colorPrimary', color);
      color = randomDarkColor();
      assignColor('colorOnPrimary', color);
      color = randomColor();
      assignColor('colorPrimaryContainer', color);
      color = randomDarkColor();
      assignColor('colorOnPrimaryContainer', color);
      color = randomColor();
      assignColor('colorSecondary', color);
      color = randomDarkColor();
      assignColor('colorOnSecondary', color);
      color = randomColor();
      assignColor('colorSecondaryContainer', color);
      color = randomDarkColor();
      assignColor('colorOnSecondaryContainer', color);

      color = randomLightColor();
      assignColor('colorBackground', color);
      color = randomDarkColor();
      assignColor('colorOnBackground', color);
      color = randomLightColor();
      assignColor('colorSurface', color);
      color = randomDarkColor();
      assignColor('colorOnSurface', color);

      color = '#BA1A1A';
      assignColor('colorError', color);
      color = '#FFFFFF';
      assignColor('colorOnError', color);
      color = '#FFDAD6';
      assignColor('colorErrorContainer', color);
      color = '#410002';
      assignColor('colorOnErrorContainer', color);

      color = randomLightColor();
      assignColor('colorSurfaceVariant', color);
      color = randomDarkColor();
      assignColor('colorOnSurfaceVariant', color);
      color = randomDarkColor();
      assignColor('colorOutline', color);
      color = randomDarkColor();
      assignColor('colorOutlineVariant', color);

      color = randomDarkColor();
      assignColor('colorSurfaceInverse', color);
      color = randomLightColor();
      assignColor('colorOnSurfaceInverse', color);
      color = randomDarkColor();
      assignColor('colorPrimaryInverse', color);
    });
  },
);
