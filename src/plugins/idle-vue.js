import IdleVue from "idle-vue";

export default ({ Vue, store }) => {
  const eventsHub = new Vue();
  const options = {
    eventEmitter: eventsHub,
    idleTime: 1000 * 60 * 5, //enter sleep state
    store: store,
    startAtIdle: false,
    events: ["keydown", "mousedown", "scroll", "touchstart"]
  };
  Vue.use(IdleVue, options);
};
