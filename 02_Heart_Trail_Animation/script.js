const body = document.querySelector('body')

body.addEventListener('mousemove', (e)=> {
    const xPos = e.offsetX;
    const yPos = e.offsetY;
    const span = document.createElement('span');
    span.style.left = xPos + 'px';
    span.style.top = yPos + 'px';
    const size = Math.random()*40;
    span.style.height = size + 'px'
    span.style.width = size + 'px'
    body.appendChild(span)
    setTimeout(() => {
        span.remove();
    }, 5000);
})