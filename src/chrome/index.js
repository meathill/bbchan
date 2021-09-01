if (!chrome.tabs) {
  chrome.tabs = {
    query() {
      return {
        url: location.href,
      };
    },
  };

  chrome.runtime = {
    sendMessage(obj) {
      return {
        sender: 'bbjiang-background',
        message: 'ok',
      };
    },
  };
}
