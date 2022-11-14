import colorMap from './colorMap';

import { APP_TITLE, APP_URL } from './constants';

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

export {
  randomColor,
  randomDarkColor,
  randomLightColor,
  textColorClassForBackground,
  generateColorExport,
  generateThemeExport,
};
