figma.showUI(__html__, { width: 540, height: 780 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'storage-get') {
    try {
      const value = await figma.clientStorage.getAsync(msg.key);
      figma.ui.postMessage({
        type: 'storage-result',
        key: msg.key,
        value: value !== undefined ? value : null,
        _reqId: msg._reqId,
      });
    } catch (e) {
      figma.ui.postMessage({ type: 'storage-result', key: msg.key, value: null, _reqId: msg._reqId });
    }
  }
  if (msg.type === 'storage-set') {
    try { await figma.clientStorage.setAsync(msg.key, msg.value); } catch (e) { console.error(e); }
  }
  if (msg.type === 'storage-remove') {
    try { await figma.clientStorage.deleteAsync(msg.key); } catch (e) { console.error(e); }
  }
  if (msg.type === 'storage-clear') {
    try { const keys = await figma.clientStorage.keysAsync(); for (const key of keys) await figma.clientStorage.deleteAsync(key); } catch (e) { console.error(e); }
  }
  if (msg.type === 'resize') {
    figma.ui.resize(msg.width, msg.height);
  }
};
