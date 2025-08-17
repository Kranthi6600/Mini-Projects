const imageContainer = document.querySelector('.image-container');
const btn = document.querySelector('.btn');

btn.addEventListener('click', () => {
    imgNum = 5;
    addNewImages()
})

function addNewImages() {
    for (let i = 0; i < imgNum; i++) {
        const newImg = document.createElement('img');
        newImg.src = `https://picsum.photos/300?random = ${Math.round(Math.random() * 2000)}`;
        newImg.loading = 'lazy'
        imageContainer.appendChild(newImg)
    }
    imageContainer.appendChild(fragment);
}
