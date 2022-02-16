import { App } from 'vue';

export default (app: App<Element>) => {
  console.log(`vue version ${app.version}`);
};
