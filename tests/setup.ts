// tests/setup.ts
import "@testing-library/jest-dom";
import "whatwg-fetch";

// --- Minimal BroadcastChannel shim for Jest/jsdom ---
(() => {
  if (typeof (globalThis as any).BroadcastChannel !== "undefined") return;

  type Handler = (ev: MessageEvent) => void;
  const rooms: Record<string, Set<FakeBC>> = {};

  class FakeBC {
    name: string;
    private _handlers: Set<Handler> = new Set();
    onmessage: Handler | null = null;

    constructor(name: string) {
      this.name = name;
      rooms[name] ||= new Set();
      rooms[name].add(this);
    }

    postMessage(data: any) {
      const peers = rooms[this.name] || new Set();
      for (const bc of peers) {
        if (bc === this) continue;
        const evt = { data } as MessageEvent;
        // onmessage
        bc.onmessage?.(evt);
        // addEventListener('message', ...)
        bc._handlers.forEach((h) => h(evt));
      }
    }

    close() {
      rooms[this.name]?.delete(this);
      this._handlers.clear();
      this.onmessage = null;
    }

    addEventListener(type: string, handler: Handler) {
      if (type === "message") this._handlers.add(handler);
    }
    removeEventListener(type: string, handler: Handler) {
      if (type === "message") this._handlers.delete(handler);
    }

    // keep DOM EventTarget signature happy for consumers that call it
    dispatchEvent() {
      return false;
    }
  }

  (globalThis as any).BroadcastChannel = FakeBC as any;
})();

// ---- Polyfills (must be before MSW/server import) ----
import { TextEncoder, TextDecoder } from "util";
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder as any;

// Web Streams (for MSW v2 fetch interceptor)
try {
  // Node 18+ provides these via 'stream/web'
  const {
    TransformStream,
    ReadableStream,
    WritableStream
  } = require("stream/web");
  (globalThis as any).TransformStream ||= TransformStream;
  (globalThis as any).ReadableStream ||= ReadableStream;
  (globalThis as any).WritableStream ||= WritableStream;
} catch {
  // Fallback for older Node: ponyfill
  const ws = require("web-streams-polyfill/ponyfill");
  (globalThis as any).TransformStream ||= ws.TransformStream;
  (globalThis as any).ReadableStream ||= ws.ReadableStream;
  (globalThis as any).WritableStream ||= ws.WritableStream;
}

// Recharts sometimes needs this in jsdom
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as any).ResizeObserver =
  (globalThis as any).ResizeObserver || MockResizeObserver;

// Optional: matchMedia mock if needed
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  })
});

// ---- MSW server start (keep last) ----
try {
  const { BroadcastChannel } = require("broadcast-channel");
  (globalThis as any).BroadcastChannel ||= BroadcastChannel;
} catch {}
import { server } from "./testServer";
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
