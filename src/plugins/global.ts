import { App } from 'vue';
import Toast from 'vue-toastification';
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css';

export default (app: App<Element>) => {
  console.log(`vue version ${app.version}`);
  app.use(Toast);
};
