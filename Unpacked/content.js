function toggleFunc () {
  if (proxyToggle.style.transform === '') {
    proxySection.style.display = 'grid'
    proxyToggle.style.transform = 'scaleY(-1)'
  } else if (proxyToggle.style.transform === 'scaleY(-1)') {
    proxySection.style.display = 'none'
    proxyToggle.style.transform = ''
  }
}

function saveFunc (saveButton) {
  const config = {
    'host': document.getElementById('hostField').value,
    'port': document.getElementById('portField').value,
    'username': document.getElementById('usernameField').value,
    'password': document.getElementById('passwordField').value,
    'cookies': document.getElementById('cookieCheck').checked,
    'hideData': document.getElementById('dataCheck').checked
  }

  if (saveButton.value === 'OFF') {
    saveButton.disabled = true
    saveButton.value = 'ON'
    config.action = 'set'
    chrome.runtime.sendMessage('cgkfmafcnjjmjiebclnkmmjckacbhacm', config, () => {
      saveButton.disabled = false
    })
  } else if (saveButton.value === 'ON') {
    saveButton.value = 'OFF'
    config.action = 'clear'
    chrome.runtime.sendMessage('cgkfmafcnjjmjiebclnkmmjckacbhacm', config)
  }
}

function hideFunc (host, port, username, password) {
  if (dataCheck.checked) {
    host.style.display = 'none'
    port.style.display = 'none'
    username.style.display = 'none'
    password.style.display = 'none'
  } else if (!dataCheck.checked) {
    host.style.display = ''
    port.style.display = ''
    username.style.display = ''
    password.style.display = ''
  }
}

function initialize () {

  const form = document.querySelector('#qr > form')
  const submitDiv = document.querySelector('div#file-n-submit')
  const proxySection = document.createElement('div')
  const proxyToggle = document.createElement('a')
  const saveButton = document.createElement('input')
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  const postButton = document.querySelector('div#file-n-submit > input[type="submit"]')
  const proxyTab = document.createElement('div')
  const host = document.createElement('input')
  const port = document.createElement('input')
  const username = document.createElement('input')
  const password = document.createElement('input')
  const cookieCell = document.createElement('label')
  const cookieCheck = document.createElement('input')
  const dataCell = document.createElement('label')
  const dataCheck = document.createElement('input')

  proxyToggle.setAttribute('id', 'proxyToggle')
  proxyToggle.setAttribute('title', 'Toggle proxy tab')
  proxySection.setAttribute('id', 'proxySection')
  proxyTab.setAttribute('id', 'proxyTab')
  port.setAttribute('placeholder', 'Port')
  port.setAttribute('class', 'field')
  port.setAttribute('id', 'portField')
  host.setAttribute('placeholder', 'Host')
  host.setAttribute('class', 'field')
  host.setAttribute('id', 'hostField')
  username.setAttribute('placeholder', 'Username')
  username.setAttribute('class', 'field')
  username.setAttribute('id', 'usernameField')
  password.setAttribute('placeholder', 'Password')
  password.setAttribute('class', 'field')
  password.setAttribute('id', 'passwordField')
  password.setAttribute('type', 'password')
  cookieCheck.setAttribute('type', 'checkbox')
  cookieCheck.setAttribute('id', 'cookieCheck')
  cookieCell.setAttribute('title', 'Clear cookies before each post')
  dataCheck.setAttribute('type', 'checkbox')
  dataCheck.setAttribute('id', 'dataCheck')
  saveButton.setAttribute('value', 'OFF')
  saveButton.setAttribute('type', 'button')
  postButton.setAttribute('id', 'postButton')
  svg.setAttribute('xlmns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('fill', 'currentColor')
  svg.setAttribute('viewBox', '-2 2 18 18')
  path.setAttribute('d', 'M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z')
  path.setAttribute('fill-rule', 'evenodd')

  proxyToggle.style = 'height: 12px; margin: auto; width: 20px; cursor: pointer'
  proxySection.style = 'display: none'
  host.style = 'grid-area: 1 / 1 / 1 / 5; width: 100%; text-align: left'
  port.style = 'grid-area: 1 / 5 / 1 / 10; width: 100%; text-align: left'
  username.style = 'grid-area: 2 / 1 / 2 / 5; width: 100%; text-align: left'
  password.style = 'grid-area: 2 / 5 / 2 / 10; width: 100%; text-align: left'
  cookieCell.style = 'grid-area: 3 / 1 / 3 / 3'
  dataCell.style = 'grid-area: 3 / 3 / 3 / 6'
  saveButton.style = 'grid-area: 3 / 8 / 3 / 10; border-radius: 3px; min-width: 60px'
  cookieCell.innerText = 'Clear cookies'
  dataCell.innerText = 'Hide details'

  svg.appendChild(path)
  proxyToggle.appendChild(svg)
  submitDiv.appendChild(proxyToggle)
  cookieCell.prepend(cookieCheck)
  dataCell.prepend(dataCheck)
  proxySection.appendChild(host)
  proxySection.appendChild(port)
  proxySection.appendChild(username)
  proxySection.appendChild(password)
  proxySection.appendChild(cookieCell)
  proxySection.appendChild(dataCell)
  proxySection.appendChild(saveButton)
  form.appendChild(proxySection)

  document.querySelector('textarea[data-name="com"]').style['min-width'] = '373px'
  form.style['overflow-y'] = 'hidden'

  proxyToggle.addEventListener('click', toggleFunc)
  saveButton.addEventListener('click', () => {saveFunc(saveButton)})
  dataCheck.addEventListener('change', () => {hideFunc(host, port, username, password)})

  chrome.storage.local.get(['config'], function(item) {
    host.value = item.config.host
    port.value = item.config.port
    username.value = item.config.username
    password.value = item.config.password
    cookieCheck.checked = item.config.cookies
    dataCheck.checked = item.config.hideData
    if (dataCheck.checked) {
      host.style.display = 'none'
      port.style.display = 'none'
      username.style.display = 'none'
      password.style.display = 'none'
    }
  })
}

document.addEventListener('QRDialogCreation', initialize)

