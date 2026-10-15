import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

const dialogFocusReturn = new WeakMap<HTMLDialogElement, HTMLElement>();

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (media: string) => ({
      matches: false,
      media,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    }),
  });
}

if (typeof HTMLDialogElement.prototype.showModal !== 'function') {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      const activeElement = document.activeElement;
      if (activeElement instanceof HTMLElement) dialogFocusReturn.set(this, activeElement);
      this.setAttribute('open', '');
    },
  });
}

if (typeof HTMLDialogElement.prototype.close !== 'function') {
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.removeAttribute('open');
      const returnFocus = dialogFocusReturn.get(this);
      if (returnFocus?.isConnected) returnFocus.focus();
    },
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});