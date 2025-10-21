const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {
  counter.innerText = '0';
  const target = +counter.getAttribute('data-ceil');

  function updateCounter() {
    const current = +counter.innerText;
    const increment = target / 100; // controls animation smoothness

    if (current < target) {
      counter.innerText = `${Math.ceil(current + increment)}`;
      setTimeout(updateCounter, 30); // controls animation speed
    } else {
      counter.innerText = target;
    }
  }

  updateCounter();
});
