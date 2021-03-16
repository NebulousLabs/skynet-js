import { ensureUrl } from "skynet-interface-utils";

/**
 * From SkyID.
 */
export function popupCenter(url: string, title: string, w: number, h: number): Window {
  url = ensureUrl(url);

  // Fixes dual-screen position                             Most browsers      Firefox
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const newWindow = window.open(
    url,
    title,
    `
scrollbars=yes,
width=${w / systemZoom},
height=${h / systemZoom},
top=${top},
left=${left}
`
  );
  if (!newWindow) {
    throw new Error("could not open window");
  }

  if (newWindow.focus) newWindow.focus();
  return newWindow;
}
