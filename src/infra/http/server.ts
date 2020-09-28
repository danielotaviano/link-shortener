import 'reflect-metadata';
import app from './express/app';
import '../../container';
import '../database/connection';

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
