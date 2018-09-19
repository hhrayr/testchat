import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';

const setPath = (assetPath) => {
  return path.join(__dirname, assetPath);
};

export default (server) => {
  server.use('/assets', express.static(setPath('/../../assets')));
  server.use('/public', express.static(setPath('/../../build')));
  server.use(favicon(setPath('/../../assets/favicon.ico')));
  server.use((req, res, next) => {
    if (/assets|public|static|locales/.test(req.url)) {
      res.status(404).send('Not found');
    } else {
      next();
    }
  });
};
