import AV from 'leancloud-storage';
import {LC_APP_ID, LC_APP_SECRET} from "@/config/leancloud";
import DanMu from "@/model/danmu";

const {forEach} = Array.prototype;

AV.init({
  appId: LC_APP_ID,
  appKey: LC_APP_SECRET,
  serverURL: "https://api.bb.meathill.com",
});

const targetNode = document.getElementById('chat-items');

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for(const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const {addedNodes} = mutation;
      forEach.call(addedNodes, async node => {
        const {classList} = node;
        if (!classList.contains('chat-item')
            || (!classList.contains('important-prompt-item') && !classList.contains('danmaku-item'))) {
          return;
        }

        const danmu = new DanMu();
        if (classList.contains('important-prompt-item')) {
          danmu.set('type', '通知');
          danmu.set('content', node.textContent);
        } else if (classList.contains('danmaku-item')) {
          let {uid, uname, ts, danmaku} = node.dataset;
          ts = ts === '0' ? Date.now() / 1000 >> 0 : ts;
          danmu.set('type', '弹幕');
          danmu.set('uid', uid);
          danmu.set('uname', uname);
          danmu.set('ts', ts);
          danmu.set('content', danmaku);
        }
        try {
          await danmu.save();
          console.log('保存弹幕成功。' + danmu.id);
        } catch (e) {
          if (e.message.startsWith('A unique field was given a value that is already taken')) {
            return;
          }
          console.log('保存弹幕失败。' + e.message);
        }
      });
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
