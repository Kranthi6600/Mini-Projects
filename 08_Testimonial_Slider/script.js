const testimonials = [
    {
        name: 'John Smith',
        photoUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        text: 'Working with this team has been an absolute pleasure. Their attention to detail and commitment to excellenceis unmatched.'
    },

    {
        name: 'Sarah Johnson',
        photoUrl: 'https://plus.unsplash.com/premium_photo-1755856680228-60755545c4ec?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        text: 'Happiness is found in the little moments gratitude makes challenges feel lighter each day brings a new chance to grow and life feels richer with purpose.'
    },

    {
        name: 'Michael Lee',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        text: 'Life isn’t about chasing perfection it’s about learning through struggles every setback is a hidden opportunity and I choose to rise stronger each time.'
    }
];

const img = document.querySelector('img');
const textEl = document.querySelector('.text');
const userName = document.querySelector('.user-name');

let idx = 0;



function updateTestimonial(){
    const {name, photoUrl, text} = testimonials[idx];
    img.src = photoUrl;
    textEl.innerText = text;
    userName.innerText = name;
    idx++;
    if(idx === testimonials.length){
        idx = 0;
    }
    setTimeout(() => {
        updateTestimonial();
    }, 2000);
}

updateTestimonial()