import React from 'react';
import { render } from 'react-dom';
import Tools from './tools.tsx';
import webVitals from './web-vitals-log.ts';

const placeholder = document.getElementById('place-holder') ?? (() => {
  const element = document.createElement('div');
  element.setAttribute('id', 'place-holder');
  document.body.appendChild(element);
  return element;
})();

console.log(placeholder);

render(<Tools> Embedded </Tools>, placeholder);

webVitals(console.log);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
