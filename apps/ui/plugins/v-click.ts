export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click', {
    mounted(el: HTMLElement, { value: fn }) {
      const triggerDownPosition = { x: 0, y: 0 };
      el.addEventListener('mousedown', ({ clientX, clientY }) => {
        triggerDownPosition.x = clientX;
        triggerDownPosition.y = clientY;
      });
      el.addEventListener('mouseup', ({ clientX, clientY }) => {
        if (
          Math.abs(clientX - triggerDownPosition.x) +
            Math.abs(clientY - triggerDownPosition.y) <
          5
        ) {
          fn();
        }
      });
    },
    getSSRProps() {
      return {};
    },
  });
});
