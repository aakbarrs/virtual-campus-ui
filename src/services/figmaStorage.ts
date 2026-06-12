const isFigma =
  typeof parent !== 'undefined' &&
  typeof window !== 'undefined' &&
  window.location.protocol === 'data:';

let messageId = 0;
const pendingRequests = new Map<string, { resolve: (v: any) => void; reject: (e: Error) => void }>();

function listenForResults() {
  window.addEventListener('message', (event: MessageEvent) => {
    const msg = event.data?.pluginMessage;
    if (!msg || msg.type !== 'storage-result') return;
    const reqId = msg._reqId;
    if (reqId && pendingRequests.has(reqId)) {
      pendingRequests.get(reqId)!.resolve(msg.value);
      pendingRequests.delete(reqId);
    }
  });
}

if (isFigma) {
  listenForResults();
}

function sendAndWait(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const reqId = `req_${++messageId}_${Date.now()}`;
    pendingRequests.set(reqId, { resolve, reject });
    parent.postMessage(
      { pluginMessage: { type: 'storage-get', key, _reqId: reqId } },
      '*'
    );
    setTimeout(() => {
      if (pendingRequests.has(reqId)) {
        pendingRequests.delete(reqId);
        resolve(null);
      }
    }, 2000);
  });
}

export const figmaStorage = {
  async get(key: string): Promise<string | null> {
    if (isFigma) {
      try {
        const value = await sendAndWait(key);
        if (value === null || value === undefined) return null;
        return String(value);
      } catch {
        return null;
      }
    }
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    if (isFigma) {
      parent.postMessage(
        { pluginMessage: { type: 'storage-set', key, value } },
        '*'
      );
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('[figmaStorage] set failed:', e);
    }
  },

  async remove(key: string): Promise<void> {
    if (isFigma) {
      parent.postMessage(
        { pluginMessage: { type: 'storage-remove', key } },
        '*'
      );
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('[figmaStorage] remove failed:', e);
    }
  },

  async clear(): Promise<void> {
    if (isFigma) {
      parent.postMessage(
        { pluginMessage: { type: 'storage-clear' } },
        '*'
      );
      return;
    }
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('[figmaStorage] clear failed:', e);
    }
  },

  async getJSON<T>(key: string, fallback: T): Promise<T> {
    const raw = await this.get(key);
    if (raw === null) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  async setJSON(key: string, value: unknown): Promise<void> {
    return this.set(key, JSON.stringify(value));
  },

  isFigma,
};
