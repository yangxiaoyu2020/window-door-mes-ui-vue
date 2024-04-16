import { App, Directive } from "vue";
import debounce from "./debounce";


const directivesList: { [key: string]: Directive } = {
  debounce,
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      app.directive(key, directivesList[key]);
    });
  }
};

export default directives;