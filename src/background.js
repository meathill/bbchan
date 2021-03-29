import {EXTENSION_NAME} from "@/data/constant";

chrome.storage.onChanged.addListener(changes => {
  const {danmu: {newValue: danmu}} = changes;
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

chrome.alarms.onAlarm.addListener(alarm => {
  const {name} = alarm;
  if (name !== EXTENSION_NAME) {
    return;
  }

  console.log('[BBChan] let\'s send');
  chrome.runtime.sendMessage({
    from: EXTENSION_NAME,
    type: 'send',
  }, response => {
    console.log(response);
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
    }
  });
});
