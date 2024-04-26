document.addEventListener('DOMContentLoaded', () => {
    try {
        [].forEach.call(document.querySelectorAll('img[data-src]'),    
        function(img) {
            let canImg = true;
    
            if (img.hasAttribute('media')) {
                let media = img.getAttribute('media');
                let mediaArr = media.split(':');
                let mediaValue = parseInt(mediaArr[1].trim().substr(0, media.indexOf('px')));
                let mediaName = mediaArr[0].trim();
                let screenWidth = document.documentElement.clientWidth;
    
                if (mediaName == "max-width") {
                    if (screenWidth > mediaValue) {
                        canImg = false;
                    }
                } else if (mediaName == "min-width") {
                    if (screenWidth < mediaValue) {
                        canImg = false;
                    }
                }
            }
            if (canImg) {
                img.setAttribute('src', img.getAttribute('data-src'));
                img.onload = function() {
                img.removeAttribute('data-src');
            }
          };
        });
    
    } catch(e) {
        console.log(e);
    }

    try {
        document.addEventListener('DOMContentLoaded', () => {
            function phoneMask() {
                const inputTel = document.querySelectorAll('input[type=tel]');
                inputTel.forEach(input => {
                    input.addEventListener('input', (e) => {
                        e.preventDefault();
                        if (input.value.length <= 2)
                            input.value = (e.data != null) ? "+7" + e.data : "+7";
                        if (e.data != null)
                            if (e.data.match(/[0-9+-]/) == null || input.value.length > 12)
                                input.value = input.value.substring(0, input.value.length - 1);
                    });
                });
            }

            phoneMask();
        });
    } catch(e) {
        console.log(e);
    }

    
    // Смена города
    try {
        const headerLocation = document.querySelector('.header__location__list');
        const headerLocationSelect = headerLocation.querySelector('.header__location__select');
        let headerLocationVisible = false;
    
        headerLocation.addEventListener('click', (e) => {
            if (headerLocationVisible) {
                headerLocationSelect.style.display = 'none';
                headerLocationVisible = false;
            } else {
                headerLocationSelect.style.display = 'flex';
                headerLocationVisible = true;
            }
        });
    
        document.addEventListener('click', (e) => {
            if (e.target.parentElement != headerLocation && headerLocationVisible) {
                headerLocationSelect.style.display = 'none';
                headerLocationVisible = false;
            }
        });
    } catch(e) {
        console.log(e);
    }
    
    // Бургер
    try {
        const burger = document.querySelector('.burger'),
              burgerMenu = document.querySelector('.burger-menu'),
              burgerMenuCross = burgerMenu.querySelector('.burger-menu__cross');
    
        burger.addEventListener('click', () => {
            burgerMenu.classList.remove('hide');
            burger.classList.add('hide');
        });
        burgerMenuCross.addEventListener('click', () => {
            burgerMenu.classList.add('hide');
            burger.classList.remove('hide');
        });  
    } catch(e) {
        console.error('Unknown burger');
    }
    
    // Подвал
    try {
        document.querySelectorAll('.footer__body__info__clinic__license__img').forEach(item => {
            item.addEventListener('click', () => {
                openPhotoModal(item);
            });
        });
    } catch(e) {
        console.error('Unknown footer');
    }
});

function switchSlide(slide, slideWidth, current, count, step) {
    current += step;
    if (current >= count) {
        current = count - 1;
    } else if (current < 0)
    current = 0;

    slide.forEach(item => {
        item.style.transform = `translateX(-${slideWidth * current}px)`;
    });
    return current;
}

function switchSlide2(slide, slideWidth, current, count, step) {
    current += step;
    if (current >= count) {
        current = count - 1;
    } else if (current < 0)
    current = 0;

    slide.forEach(item => {
        item.style.right = `${slideWidth * current}px`;
    });
    return current;
}

function infinitySlider(slider, nextBtn, prevBtn, startIndex, activeClass) {
    let slides = slider.querySelectorAll('[data-slide]');
    let slidesWidth = slides[0].getBoundingClientRect().width + parseInt(getComputedStyle(slides[0]).marginRight),
        currentSlideIndex = startIndex;

    let cloneSlides = [];
    slides[currentSlideIndex].classList.add(activeClass);

    for (let i = slides.length-1; i >= 0; i--) {
        cloneSlides.push(slides[i].cloneNode(true));
    }

    cloneSlides.forEach(cloneSlide => {
        slider.insertAdjacentElement('afterbegin', cloneSlide);
    });
    slides = slider.querySelectorAll('[data-slide]');

    function cloneSlidesMove(position) {
        let slide = (position == 'beforeend') ? slides[0] : slides[slides.length-1];
        slider.insertAdjacentElement(position, slide);
        slides = slider.querySelectorAll('[data-slide]');
        slides.forEach(slideItem => {
            slideItem.style.transitionDuration = '0ms';
            slideItem.style.transform = "translateX(-" + (slidesWidth * currentSlideIndex) + "px)";
        })
    }

    function switchSlides(step) {
        currentSlideIndex += step;
        slides.forEach(slide => {
            slide.style.transitionDuration = '400ms';
            slide.style.transform = "translateX(-" + (slidesWidth * currentSlideIndex) + "px)";
            slide.classList.remove(activeClass);
        });
        slides[currentSlideIndex].classList.add(activeClass);
    }

    switchSlides(0);

    const nextBtnClick = () => {
        switchSlides(1);
        nextBtn.removeEventListener('click', nextBtnClick);
        setTimeout(() => {
            currentSlideIndex--;
            cloneSlidesMove('beforeend');
            nextBtn.addEventListener('click', nextBtnClick);
        }, 400);
    };

    const prevBtnClick = () => {
        switchSlides(-1);
        prevBtn.removeEventListener('click', prevBtnClick);
        setTimeout(() => {
            currentSlideIndex++;
            cloneSlidesMove('afterbegin');
            prevBtn.addEventListener('click', prevBtnClick);
        }, 400);
    }

    nextBtn.addEventListener('click', nextBtnClick);
    prevBtn.addEventListener('click', prevBtnClick);
}

function openMediaModal(parent, tagMedia) {
    const imgs = parent.querySelectorAll(tagMedia);
    let photoModal = document.createElement('div');
    photoModal.classList.add('modal');
    let imgElement = document.createElement(tagMedia);
    imgElement.className = "photo__modal__photo";
    imgElement.setAttribute('controls', true);
    let cross = document.createElement('div');
    cross.className = "video-modal__cross";
    cross.innerHTML = `<hr class="video-modal__cross-line" id="video-modal__cross-line-1"><hr class="video-modal__cross-line" id="video-modal__cross-line-2">`;

    let nextBtn = document.createElement('div');
    let prevBtn = document.createElement('div');

    let currentIndex;

    nextBtn.className = "modal__arrow";
    prevBtn.className = "modal__arrow";

    prevBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#fff" d="M9.125 21.1L.7 12.7q-.15-.15-.212-.325Q.425 12.2.425 12t.063-.375Q.55 11.45.7 11.3l8.425-8.425q.35-.35.875-.35t.9.375q.375.375.375.875t-.375.875L3.55 12l7.35 7.35q.35.35.35.862q0 .513-.375.888t-.875.375q-.5 0-.875-.375Z"></path></svg>`;
    nextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g transform="rotate(180 12 12)"><path fill="#fff" d="M9.125 21.1L.7 12.7q-.15-.15-.212-.325Q.425 12.2.425 12t.063-.375Q.55 11.45.7 11.3l8.425-8.425q.35-.35.875-.35t.9.375q.375.375.375.875t-.375.875L3.55 12l7.35 7.35q.35.35.35.862q0 .513-.375.888t-.875.375q-.5 0-.875-.375Z"></path></g></svg>`;

    nextBtn.style.marginLeft = "50px";
    prevBtn.style.marginRight = "50px";

    photoModal.insertAdjacentElement('beforeend', prevBtn);
    photoModal.insertAdjacentElement('beforeend', imgElement);
    photoModal.insertAdjacentElement('beforeend', nextBtn);
    photoModal.insertAdjacentElement('beforeend', cross);

    const closeModal = (e) => {
        if (e.target == photoModal || e.target == cross) {
            photoModal.remove();
        }
    }

    imgs.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            photoModal.querySelector('.photo__modal__photo').src = img.src;
            document.querySelector('body').insertAdjacentElement('beforeend', photoModal);
            currentIndex = index;
        });
    });
    photoModal.addEventListener('click', closeModal);
    cross.addEventListener('click', () => photoModal.remove());

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= imgs.length)
            currentIndex = 0;
        imgElement.src = imgs[currentIndex].src;
    });

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0)
            currentIndex = imgs.length - 1;
        imgElement.src = imgs[currentIndex].src;
    });
}

function openVideoModal(video) {
    let videoModal = document.createElement('div');
    videoModal.classList.add('video-modal');
    videoModal.innerHTML = `<video src="${video.src}" autoplay class="video-modal__video" controls></video> <div class="video-modal__cross"><hr class="video-modal__cross-line" id="video-modal__cross-line-1"><hr class="video-modal__cross-line" id="video-modal__cross-line-2"></div>`;

    document.body.append(videoModal);

    let videoModalCross = videoModal.querySelector('.video-modal__cross'),
        videoModalVideo = videoModal.querySelector('.video-modal__video');
    videoModalCross.addEventListener('click', () => {
        videoModal.remove();
    });
    videoModal.addEventListener('click', (e) => {
        if (e.target != videoModalVideo)
            videoModal.remove();
    });
}