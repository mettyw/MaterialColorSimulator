// Import our custom CSS
import '../scss/styles.scss';

import $ from 'jquery';
import 'bootstrap';
// https://github.com/jaames/iro.js
import iro from '@jaames/iro';
// https://github.com/iconfu/svg-inject
import SVGInject from '@iconfu/svg-inject';
// https://github.com/gka/chroma.js
import chroma from 'chroma-js';

import { APP_URL } from './constants';
import colorMap from './colorMap';
import * as colorUtils from './colorUtils';

require('../scss/mockstyle.scss');
require('../svg/components.svg');
require('../svg/mockups.svg');

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

function setCSSColorVariable(variable, color) {
  const r = document.querySelector(':root');
  r.style.setProperty(`--${variable}`, color);
  const rgb = chroma(color).rgb();
  const color2 = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
  r.style.setProperty(`--${variable}-rgbstr`, color2);
}

function reloadColor(key) {
  const color = colorMap[key].v.toUpperCase();
  setCSSColorVariable(key, color);

  $(`#swatch-${key}`).css('background-color', color);
  $(`.swatchLabel-${key}`).removeClass('cssColorOnLight');
  $(`.swatchLabel-${key}`).removeClass('cssColorOnDark');
  $(`.swatchLabel-${key}`).addClass(colorUtils.textColorClassForBackground(color));
  $(`#swatchValue-${key}`).text(color);
  $(`svg .${key}`).each((i, obj) => {
    const svgelement = obj;
    svgelement.style.fill = color;
  });
  $('#exportColors').val(colorUtils.generateColorExport());
  $('#exportThemes').val(colorUtils.generateThemeExport());

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
        `<div class="swatch d-inline-flex flex-column p-1" id="${swatchKey}"" >`
         + ` <div class="flex-grow-1 fw-bolder swatchLabel ${swatchLabelKey}">${colorMap[key].l}</div>`

         + `   <div class="swatchValue ${swatchLabelKey}" id="${swatchValueKey}">${colorMap[key].v}</div>`
         + '</div>',
      );
      reloadColor(key);
    });

    /** **********************************************************************
          *                        Action Handlers
          ************************************************************************ */

    function getStyle(className) {
      let cssText = '';
      for (let s = 0; s < document.styleSheets.length; s++) {
        const classes = document.styleSheets[s].rules || document.styleSheets[s].cssRules;
        for (let x = 0; x < classes.length; x++) {
          if (classes[x].selectorText === className) {
            cssText += classes[x].fill || classes[x].style.fill;
          }
        }
      }
      return cssText;
    }

    // make color swatch flash if user clicks on ui component with that class in SVG
    $('body').on('click', 'rect,text,path,circle', function svgClickHandler() {
      const attrs = $(this).attr('class');
      if (typeof attrs === 'undefined') return;
      const classList = attrs.split(/\s+/);
      classList.forEach((className) => {
        const colorName = getStyle(`.${className}`).replace(/var\(--(.*)\)/, '$1');
        if (!colorName.startsWith('color')) return;
        $(`#swatch-${colorName}`).fadeOut(100).fadeIn(100).fadeOut(100)
          .fadeIn(100);
      });
    });
    // open color picker
    $('body').on('click', '.swatch', function swatchClickHandler() {
      const colorName = $(this).attr('id').replace('swatch-', '');
      $('#colorDialogColorName').text(colorMap[colorName].l);
      $('#colorDialogColorKey').text(colorName);
      $('#colorDialogPreviousValue').text(colorMap[colorName].v);
      $('#colorDialogColorValue').val(colorMap[colorName].v);
      colorPicker.color.hexString = colorMap[colorName].v;
      $('#color-swatches-content').hide();
      $('#color-picker-content').show();
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

    $('#btnRandomizeColor').on('click', () => {
      const key = $('#colorDialogColorKey').text();
      const color = colorUtils.randomColor();
      assignColor(key, color);
    });
    $('#btnResetColor').on('click', () => {
      const key = $('#colorDialogColorKey').text();
      const color = $('#colorDialogPreviousValue').text();
      assignColor(key, color);
    });
    $('#btnColorPicker').on('click', () => {
      $('#color-swatches-content').hide();
      $('#color-picker-content').show();
    });
    $('#btnClosePanel, #btnColorPickerBack').on('click', () => {
      $('#color-swatches-content').show();
      $('#color-picker-content').hide();
    });
    $('#btnLocateColor').on('click', () => {
      const colorName = $('#colorDialogColorKey').text();

      // make ui components in SVG flash if user clicks on swatch with that class
      const colorValue = colorMap[colorName].v;
      setCSSColorVariable(colorName, '#ffffff00');
      setTimeout(() => { setCSSColorVariable(colorName, colorValue); }, 100);
    });
    $('#btnCopyClipboard').on('click', () => {
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
    $('#btnResetAll').on('click', () => {
      window.location.reload();
    });

    $('#btnRandomizeAll').on('click', () => {
      let color;
      color = colorUtils.randomColor();
      assignColor('colorPrimary', color);
      color = colorUtils.randomDarkColor();
      assignColor('colorOnPrimary', color);
      color = colorUtils.randomColor();
      assignColor('colorPrimaryContainer', color);
      color = colorUtils.randomDarkColor();
      assignColor('colorOnPrimaryContainer', color);
      color = colorUtils.randomColor();
      assignColor('colorSecondary', color);
      color = colorUtils.randomDarkColor();
      assignColor('colorOnSecondary', color);
      color = colorUtils.randomColor();
      assignColor('colorSecondaryContainer', color);
      color = colorUtils.randomDarkColor();
      assignColor('colorOnSecondaryContainer', color);

      color = colorUtils.randomLightColor();
      assignColor('colorBackground', color);
      color = colorUtils.randomDarkColor();
      assignColor('colorOnBackground', color);
      color = colorUtils.randomLightColor();
      assignColor('colorSurface', color);
      color = colorUtils.randomDarkColor();
      assignColor('colorOnSurface', color);

      color = '#BA1A1A';
      assignColor('colorError', color);
      color = '#FFFFFF';
      assignColor('colorOnError', color);
      color = '#FFDAD6';
      assignColor('colorErrorContainer', color);
      color = '#410002';
      assignColor('colorOnErrorContainer', color);

      color = colorUtils.randomLightColor();
      assignColor('colorSurfaceVariant', color);
      color = colorUtils.randomDarkColor();
      assignColor('colorOnSurfaceVariant', color);
      color = colorUtils.randomDarkColor();
      assignColor('colorOutline', color);
      color = colorUtils.randomDarkColor();
      assignColor('colorOutlineVariant', color);

      color = colorUtils.randomDarkColor();
      assignColor('colorSurfaceInverse', color);
      color = colorUtils.randomLightColor();
      assignColor('colorOnSurfaceInverse', color);
      color = colorUtils.randomDarkColor();
      assignColor('colorPrimaryInverse', color);
    });
  },
);
