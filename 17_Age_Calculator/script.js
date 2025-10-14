const datepickerEl = document.getElementById('datepicker');
const btnEl = document.getElementById('btn');
const resultEl = document.getElementById('result');


flatpickr("#datepicker", {
    dateFormat: "Y-m-d",
    defaultDate: "today"
});

function calculateAge() {
    const birthdayValue = datepickerEl.value;

    if (birthdayValue === '') {
        alert('Please select date...');
    } else {
        const age = getAge(birthdayValue);
        resultEl.innerText = `Your age is ${age}`;
    }


}

function getAge(birthdayValue) {
    const currentDate = new Date();
    const birthDate = new Date(birthdayValue);
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

btnEl.addEventListener('click', calculateAge)