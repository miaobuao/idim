export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('click', {
    mounted(el: HTMLElement, { value: fn }) {
      const triggerDownPosition = { x: 0, y: 0 }
      el.addEventListener('mousedown', (e) => {
        const { clientX, clientY } = e
        triggerDownPosition.x = clientX
        triggerDownPosition.y = clientY
      })
      el.addEventListener('mouseup', (e) => {
        const { clientX, clientY } = e
        if (
          Math.abs(clientX - triggerDownPosition.x)
          + Math.abs(clientY - triggerDownPosition.y)
          < 5
        )
          fn(e)
      })
    },
    getSSRProps() {
      return {}
    },
  })
})
