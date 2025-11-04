const yellow = document.querySelector('.yellow');
const red = document.querySelector('.red');
const green = document.querySelector('.green');

const showMessage = (msg, type) => {
  const messageDiv = document.querySelector('.message');

  messageDiv.classList.add('visible');
  messageDiv.classList.add('hidden');

  setTimeout(() => {
    messageDiv.textContent = msg;
    messageDiv.style.color =
      type === 'error'
        ? 'rgba(255, 49, 49, 0.836)'
        : type === 'warning'
          ? 'rgba(233, 248, 101, 1)'
          : 'rgba(27, 239, 24, 1)';
    messageDiv.classList.remove('hidden');
  }, 200);
};

function highlight(color) {
  [red, yellow, green].forEach(el => el.classList.remove('active'));
  color.classList.add('active');
}

function trafficSignal(color) {
  highlight(color);
  switch (color) {
    case yellow:
      showMessage('Slow Down', 'warning');
      break;
    case red:
      showMessage('Stop', 'error');
      break;
    case green:
      showMessage('Go');
      break;
  }
}


yellow.addEventListener('click', () => trafficSignal(yellow))
red.addEventListener('click', () => trafficSignal(red))
green.addEventListener('click', () => trafficSignal(green))
