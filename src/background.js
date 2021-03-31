import { EXTENSION_NAME } from '@/data/constant';

chrome.storage.onChanged.addListener(changes => {
  let { danmu } = changes;
  if (!danmu) {
    return;
  }
  ({ newValue: danmu } = danmu);
  if (!danmu) {
    return;
  }
  console.log('[BBChan] get danmu: ', danmu.length);
  if (danmu.length > 0) {
    const when = Date.now() + 12E4;
    chrome.alarms.create(EXTENSION_NAME, {
      when,
    });
    console.log('[BBChan] will alarm at: ', when);
  } else {
    chrome.alarms.clear(EXTENSION_NAME);
  }
});

chrome.alarms.onAlarm.addListener(async alarm => {
  const { name } = alarm;
  if (name !== EXTENSION_NAME) {
    return;
  }

  console.log('[BBChan] let\'s send');
  await chrome.storage.local.set({
    send: true,
  });
});
