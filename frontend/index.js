// import pages
import * as Sentry from '@sentry/browser';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  registerPlugin
} from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'bootstrap/dist/css/bootstrap.css'
import '@yaireo/tagify/dist/tagify.css'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import 'index.css'
import '../sass/style.scss';

import App from './App';
import {
  BrowserRouter, Route, Routes 
} from 'react-router-dom'
registerPlugin(FilePondPluginImagePreview)
Sentry.init({
  dsn: window.SENTRY_DSN,
  release: window.COMMIT_SHA,
});

const root = createRoot(document.getElementById('react-app'));
root.render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
));
