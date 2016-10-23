import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';

import routes from './routes/routes';
import 'muicss';

const rootDir = process.env.NODE_ENV === 'development' ? 'build' : 'dist';
const staticPath =  path.join(__dirname, rootDir);
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, rootDir + '/img/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(staticPath));
app.use('/', routes);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});
  
export default app;
