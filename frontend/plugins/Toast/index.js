import Vue from "vue";
import ToastComponent from "./Toast";

const optionsDefaults = {
  data: {
    type: "info",
    show: true,
    timeout: 4500,

    onCreate(created = null) {},
    onEdit(editted = null) {},
    onRemove(removed = null) {}
  }
};

function toast(options) {
  // merge the default options with the passed options.
  const root = new Vue({
    data: {
      ...optionsDefaults.data,
      ...options
    },
    render: createElement => createElement(ToastComponent)
  });

  root.$mount(document.body.appendChild(document.createElement("div")));
}

export default {
  install(vue) {
    console.log("Installing toast plugin!");

    Vue.prototype.$toast = {
      info(options) {
        toast({ type: "info", ...options });
      },
      success(options) {
        toast({ type: "success", ...options });
      },
      warning(options) {
        toast({ type: "warning", ...options });
      },
      error(options) {
        toast({ type: "error", ...options });
      },
      simple(options) {
        toast({ type: "simple", ...options });
      }
    };
  }
};
