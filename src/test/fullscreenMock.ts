type FullscreenMock = {
  restore: () => void
  exitFullscreen: () => Promise<void>
}

/**
 * Narrow Fullscreen API substitute for jsdom.
 * Tracks fullscreenElement and dispatches fullscreenchange on enter/exit.
 */
export function installFullscreenMock(): FullscreenMock {
  let fullscreenElement: Element | null = null

  const previousFullscreenElement = Object.getOwnPropertyDescriptor(
    Document.prototype,
    'fullscreenElement',
  )
  const previousExitFullscreen = Document.prototype.exitFullscreen
  const previousElementRequestFullscreen = HTMLElement.prototype.requestFullscreen

  Object.defineProperty(document, 'fullscreenElement', {
    configurable: true,
    get: () => fullscreenElement,
  })

  async function enterFullscreen() {
    fullscreenElement = document.documentElement
    document.dispatchEvent(new Event('fullscreenchange'))
  }

  async function exitFullscreen() {
    fullscreenElement = null
    document.dispatchEvent(new Event('fullscreenchange'))
  }

  HTMLElement.prototype.requestFullscreen = enterFullscreen
  Document.prototype.exitFullscreen = exitFullscreen

  return {
    restore: () => {
      fullscreenElement = null
      if (previousFullscreenElement) {
        Object.defineProperty(
          Document.prototype,
          'fullscreenElement',
          previousFullscreenElement,
        )
      } else {
        Reflect.deleteProperty(document, 'fullscreenElement')
      }
      Document.prototype.exitFullscreen = previousExitFullscreen
      HTMLElement.prototype.requestFullscreen = previousElementRequestFullscreen
    },
    exitFullscreen,
  }
}
