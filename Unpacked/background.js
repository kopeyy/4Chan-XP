var properties = {
  host: '', port: '',
  auth: {
    username: '',
    password: ''
  }
}

var proxyObject = {
  value: {
    mode: 'pac_script',
    pacScript: {
      data: `
      function FindProxyForURL(url, host) {
        if (shExpMatch(host, "(sys.4cha*.org)"))
          return "[]";
        return "DIRECT";
      }`
    }
  },
  scope: 'regular'
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'set') {
    proxyObject.value.pacScript.data = proxyObject.value.pacScript.data.replace(
      '[]', `PROXY ${request.host}:${request.port}`
    )
    properties.auth.username = request.username
    properties.auth.password = request.password
    properties.host = request.host
    properties.port = request.port

    chrome.storage.local.set({'config': request});
    chrome.proxy.settings.set(proxyObject)
    chrome.webRequest.onAuthRequired.addListener((details) => {
      if (details.challenger === properties.host) {
        return {authCredentials: properties.auth}
      }
    }, {urls: ["<all_urls>"]}, ['blocking'])

    if (request.cookies) {
      chrome.cookies.getAll({name: '4chan_pass'}, function(cookies) {
        cookies.forEach((cookie) => {
          chrome.cookies.remove({'url': sender.url, 'name': '4chan_pass'});
        })
        sendResponse('over')
      });
      return
    }
    sendResponse('over')
  } else if (request.action === 'clear') {
    chrome.proxy.settings.clear({scope: 'regular'})
  }
})
