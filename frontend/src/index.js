// import * as Sentry from '@sentry/browser';
import React from 'react';
import { ReactDOM } from 'react-dom';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
import {
  registerPlugin
} from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'bootstrap/dist/css/bootstrap.css'
import '@yaireo/tagify/dist/tagify.css'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import './index.css'
// import '../sass/style.scss';

import App from './App';
import {
  BrowserRouter, Route, Routes 
} from 'react-router-dom'
registerPlugin(FilePondPluginImagePreview)
// Sentry.init({
//   dsn: window.SENTRY_DSN,
//   release: window.COMMIT_SHA,
// });

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
