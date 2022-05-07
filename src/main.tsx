import { createRoot } from 'react-dom/client';

import { IllustIdSchema } from '@external';

import { App } from './App';
import './vendors/setup-dayjs';

export const DATA_NAME = 'data-illust-meta';

export function mount(a: HTMLAnchorElement) {
  a.setAttribute(DATA_NAME, 'processing');

  try {
    const illustId = IllustIdSchema.parse(a.href.split('/artworks/').pop());
    const container = document.createElement('div');

    // main() のクエリによって親が存在することは保証されている
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    a.parentElement!.after(container);
    createRoot(container).render(<App illustId={illustId} />);

    a.setAttribute(DATA_NAME, 'processed');
  } catch (err) {
    a.setAttribute(DATA_NAME, 'mount-failure');
    throw err;
  }
}

function main() {
  document
    .querySelectorAll<HTMLAnchorElement>(
      `div[type="illust"] ~ div > a[href*="/artworks/"]:not([${DATA_NAME}])`
    )
    .forEach(mount);
}

main();

new MutationObserver(main).observe(document.body, {
  childList: true,
  subtree: true,
});
