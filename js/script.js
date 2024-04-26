
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

// Ленивая загрузка
[].forEach.call(document.querySelectorAll('img[data-src]'),    function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.removeAttribute('data-src');
});

// Модальные окна
const modals = document.querySelectorAll('.modal');

modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target != modal.querySelector('.modal__block') 
            && !modal.querySelector('.modal__block').contains(e.target))
            modal.style.display = 'none';
        $checkboxBlock = modal.querySelector('.checkbox-block');
        if (e.target == $checkboxBlock || $checkboxBlock.contains(e.target)) {
            if ($checkboxBlock.classList.contains('checkbox-block-active')) {
                $checkboxBlock.classList.remove('checkbox-block-active');
                $checkboxBlock.querySelector('input').checked = false;
            } else {
                $checkboxBlock.classList.add('checkbox-block-active');
                $checkboxBlock.querySelector('input').checked = true;
            }
                
        }
    });
    if (modal.classList.contains('phone-modal')) {
        document.querySelectorAll('[data-call-modal]').forEach(openBtn => {
            openBtn.addEventListener('click', () => {
                modal.style.display = 'flex';
            });
        });
    }
});

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

// Карта
try {
    function init() { 
        let map = new ymaps.Map('map', {
            center: [57.1577695986495,65.53351381879814],
            zoom: 16
        });

        map.controls.remove('geolocationControl'); // удаляем геолокацию
        map.controls.remove('searchControl'); // удаляем поиск
        map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
        map.controls.remove('rulerControl'); // удаляем контрол правил

        document.querySelectorAll('[data-mark-to]').forEach(item => {
            clinicMarkTo = parseFloat(item.getAttribute('data-mark-to'));
            clinicMarkFrom = parseFloat(item.getAttribute('data-mark-from'));
            let placemark = new ymaps.Placemark([clinicMarkFrom,clinicMarkTo], {}, {
                iconLayout: 'default#image',
                iconImageHref: '../icon/placemaker.png',
                iconImageSize: [50, 50],
                iconImageOffset: [-20, -20]
            });
            map.geoObjects.add(placemark);
        });
    }
    ymaps.ready(init);
} catch(e) {
    console.error('Unknown map' + e);
}

// Шапка
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

    const headerSearchBtn = document.querySelector('.header__search__icon'),
          headerSearchInput = document.querySelector('.header__search input');
    let headerSearchVisibility = false;
    headerSearchBtn.addEventListener('click', () => {
        if (!headerSearchVisibility) {
            headerSearchInput.classList.remove('non-visible', 'layer-bottom-9999');
            headerSearchVisibility = true;
        }
    });
    
} catch(e) {
    console.error('Unknown search');
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

// Первый экран
try {
    const firstScreenSlide = document.querySelectorAll('.first-screen-1__slide'),
          firstScreenSlider = document.querySelector('.first-screen-1__slider'),
          firstScreenSlideNext = document.querySelector('#first-screen-1__slider__arrow-right'),
          firstScreenSlidePrev = document.querySelector('#first-screen-1__slider__arrow-left'),
          firstScreedDots = document.querySelectorAll('.first-screen-1__slider__dot');
    let firstScreenSlideWidth = (parseInt(window.getComputedStyle(firstScreenSlide[0]).width) + parseInt(window.getComputedStyle(firstScreenSlide[0]).marginRight)),
        firstScreenSliderCurrent = 0,
        firstScreenSliderCount = firstScreenSlide.length;
    
    function hideArrow() {
        if (firstScreenSliderCurrent <= 0) {
            firstScreenSlidePrev.classList.add('hide');
        } else {
            firstScreenSlidePrev.classList.remove('hide');
        }

        if (firstScreenSliderCurrent >= firstScreenSliderCount - 1) {
            firstScreenSlideNext.classList.add('hide');
        } else {
            firstScreenSlideNext.classList.remove('hide');
        }
    }

    function switchDot() {
        firstScreedDots.forEach(item => {
            item.classList.remove('first-screen-1__slider__dot-active');
        });
        firstScreedDots[firstScreenSliderCurrent].classList.add('first-screen-1__slider__dot-active');
    }

    const firstScreenSlideAutoSwitch = setInterval(() => {
        firstScreenSliderCurrent = switchSlide2(firstScreenSlide, firstScreenSlideWidth, firstScreenSliderCurrent, firstScreenSliderCount, 1);
        hideArrow();
        switchDot();
    }, 5000);

    firstScreedDots.forEach((item, index) => {
        item.addEventListener('click', () => {
            firstScreenSliderCurrent = switchSlide2(firstScreenSlide, firstScreenSlideWidth, firstScreenSliderCurrent, firstScreenSliderCount, index - firstScreenSliderCurrent);
            firstScreedDots.forEach(dot => {
                dot.classList.remove('first-screen-1__slider__dot-active');
            });
            item.classList.add('first-screen-1__slider__dot-active');
            hideArrow();
            switchDot();
            clearInterval(firstScreenSlideAutoSwitch);
        });
    });

    firstScreenSlideNext.addEventListener('click', () => {
        firstScreenSlideWidth = (parseInt(window.getComputedStyle(firstScreenSlide[0]).width) + parseInt(window.getComputedStyle(firstScreenSlide[0]).marginRight))
        if (firstScreenSliderCurrent <= 0) {
            firstScreenSlidePrev.classList.remove('hide');
        }
        firstScreenSliderCurrent = switchSlide2(firstScreenSlide, firstScreenSlideWidth, firstScreenSliderCurrent, firstScreenSliderCount, 1);
        hideArrow();
        switchDot();
        clearInterval(firstScreenSlideAutoSwitch);
    });

    firstScreenSlidePrev.addEventListener('click', () => {
        firstScreenSlideWidth = (parseInt(window.getComputedStyle(firstScreenSlide[0]).width) + parseInt(window.getComputedStyle(firstScreenSlide[0]).marginRight))
        if (firstScreenSliderCurrent >= firstScreenSliderCount - 1) {
            firstScreenSlideNext.classList.remove('hide');
        }
        firstScreenSliderCurrent = switchSlide2(firstScreenSlide, firstScreenSlideWidth, firstScreenSliderCurrent, firstScreenSliderCount, -1);
        if (firstScreenSliderCurrent === 0) {
            firstScreenSlidePrev.classList.add('hide');
        } else {
            firstScreenSlidePrev.classList.remove('hide');
        }
        switchDot();
        clearInterval(firstScreenSlideAutoSwitch);
    });

    // Мобильный 
    let firstScreenSliderFirstTouch;
    firstScreenSlider.addEventListener('touchstart', (event) => {
        firstScreenSliderFirstTouch = event;
    });

    firstScreenSlider.addEventListener('touchend', (event) => {
        if (event.changedTouches[0].screenX < firstScreenSliderFirstTouch.touches[0].screenX) {
            firstScreenSliderCurrent = switchSlide2(firstScreenSlide, firstScreenSlideWidth, firstScreenSliderCurrent, firstScreenSliderCount, 1);
        } else {
            firstScreenSliderCurrent = switchSlide2(firstScreenSlide, firstScreenSlideWidth, firstScreenSliderCurrent, firstScreenSliderCount, -1);
        }
        firstScreedDots.forEach(item => {
            item.classList.remove('first-screen-1__slider__dot-active');
        });
        firstScreedDots[firstScreenSliderCurrent].classList.add('first-screen-1__slider__dot-active');
        clearInterval(firstScreenSlideAutoSwitch);
    });
} catch(e) {
    console.error('unknown FirstScreen');
}

// Персонал
try {
    function hideCard() {
        let aboutStafeCardVisible = document.querySelectorAll('.about-staff__list__item:not(.hide)');
        aboutStafeCardVisible.forEach((item, index) => {
            if (index >= aboutStaffSliderCurrent * 4 && index < (aboutStaffSliderCurrent + 1) * 4) {
                setTimeout(() => {
                    item.classList.remove('opacity0');
                }, 220);
            } else {
                item.classList.add('opacity0');
            }
        });
    }

    // Слайдер
    const aboutStaffNext = document.querySelector('#about-staff__list__arrow-right'),
        aboutStaffPrev = document.querySelector('#about-staff__list__arrow-left'),
        aboutStaffCard = document.querySelectorAll('.about-staff__list__item'),
        aboutStaffMainCard = document.querySelector('.about-staff__main-card__offer');
    let aboutStaffCardWidth = (parseInt(window.getComputedStyle(aboutStaffCard[0]).width) + parseInt(window.getComputedStyle(aboutStaffCard[0]).marginRight)) * 2,
        aboutStaffSliderCurrent = 0,
        aboutStaffSliderCount = aboutStaffCard.length / 4;

    aboutStaffNext.addEventListener('click', () => {
        let aboutStafeCardVisible = document.querySelectorAll('.about-staff__list__item:not(.hide)');
        aboutStaffCardWidth = (parseInt(window.getComputedStyle(aboutStaffCard[0]).width) + parseInt(window.getComputedStyle(aboutStaffCard[0]).marginRight)) * 2;
        aboutStaffSliderCount = aboutStafeCardVisible.length / 4;
        aboutStaffSliderCurrent = switchSlide(aboutStaffCard, aboutStaffCardWidth, aboutStaffSliderCurrent, aboutStaffSliderCount, 1);
        hideCard();
    });

    aboutStaffPrev.addEventListener('click', () => {
        let aboutStafeCardVisible = document.querySelectorAll('.about-staff__list__item:not(.hide)');
        aboutStaffCardWidth = (parseInt(window.getComputedStyle(aboutStaffCard[0]).width) + parseInt(window.getComputedStyle(aboutStaffCard[0]).marginRight)) * 2;
        aboutStaffSliderCount = aboutStafeCardVisible.length / 4;
        aboutStaffSliderCurrent = switchSlide(aboutStaffCard, aboutStaffCardWidth, aboutStaffSliderCurrent, aboutStaffSliderCount, -1);
        hideCard();
    });

    aboutStaffCard.forEach(item => {
        item.addEventListener('click', () => {
            aboutStaffMainCard.querySelector('[data-name]').innerHTML = item.querySelector('[data-name]').innerHTML;
            aboutStaffMainCard.querySelector('[data-experience]').innerHTML = item.querySelector('[data-experience]').innerHTML;
            aboutStaffMainCard.querySelector('[data-spec]').innerHTML = item.querySelector('[data-spec]').innerHTML;
            aboutStaffMainCard.querySelector('[data-link]').href = item.querySelector('[data-link]').href;
            document.querySelector('.about-staff__main-card__img').src = item.querySelector('[data-img]').src;
            document.querySelector('.about-staff__main-card__img').style.height = `150px`;
            document.querySelector('.about-staff__main-card__img').style.transitionDuration = `0ms`;

            setTimeout(function() {
                document.querySelector('.about-staff__main-card__img').style.transitionDuration = `300ms`;   
                document.querySelector('.about-staff__main-card__img').style.height = `300px`;
            },4)
            
        });
    });

    // Меню
    const aboutStaffMenuItem = document.querySelectorAll('.about-staff__menu__item');

    aboutStaffMenuItem.forEach(item => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('about-staff__menu__item-active')) {
                aboutStaffMenuItem.forEach(item => {
                    item.classList.remove('about-staff__menu__item-active');
                });
                item.classList.add('about-staff__menu__item-active');


                aboutStaffCard.forEach(card => {
                    let cardSpecStr = card.querySelector('[data-spec]').innerHTML.toLowerCase(),
                        menuSpecStr = item.innerHTML.toLowerCase();
                    if (menuSpecStr === 'все врачи') {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                        if (menuSpecStr.includes(cardSpecStr) || cardSpecStr.includes(menuSpecStr))
                            card.classList.remove('hide');
                    }

                    item.classList.remove('opacity0');
                    
                });
                hideCard();
            }
            aboutStaffSliderCurrent = 0;
            aboutStaffSliderCurrent = switchSlide(aboutStaffCard, aboutStaffCardWidth, aboutStaffSliderCurrent, aboutStaffSliderCount, 0);
        });
    });

    // Мобильный
    if (window.screen.width <= 768) {
        const aboutStaffSlider = document.querySelector('.about-staff__list');
        let aboutStaffCardFirstTouch;
        let aboutStaffCardCurrent = 1;
        const aboutStaffCardSwitch = (item, index) => {
            aboutStaffCard.forEach((card, cardIndex) => {
                card.classList.remove('about-staff__list__item-active');
                card.classList.remove('about-staff__list__item-visible');
                card.classList.remove('about-staff__list__item-next');
                card.classList.remove('about-staff__list__item-prev');
                if (cardIndex > index) {
                    card.classList.add('about-staff__list__item-next');
                } else if (cardIndex < index) {
                    card.classList.add('about-staff__list__item-prev');
                }
            });
            item.classList.add('about-staff__list__item-active');
            if(index>0){
                aboutStaffCard[index-1].classList.add('about-staff__list__item-visible');
                aboutStaffCard[index-1].classList.add('about-staff__list__item-prev');
            }
            if (index<aboutStaffCard.length-1) {
                aboutStaffCard[index+1].classList.add('about-staff__list__item-visible');
                aboutStaffCard[index+1].classList.add('about-staff__list__item-next');
            }
        }
        aboutStaffCard.forEach((item, index) => {
            item.addEventListener('click', () => {
                aboutStaffCardSwitch(item, index);
            });
        });

        aboutStaffSlider.addEventListener('touchstart', (event) => {
            aboutStaffCardFirstTouch = event;
        });

        aboutStaffSlider.addEventListener('touchend', (event) => {
            if (event.changedTouches[0].clientX > aboutStaffCardFirstTouch.touches[0].clientX && aboutStaffCardCurrent > 0) {
                aboutStaffCardCurrent--;
            } else if (event.changedTouches[0].clientX < aboutStaffCardFirstTouch.touches[0].clientX && aboutStaffCardCurrent < aboutStaffCard.length-1) {
                aboutStaffCardCurrent++;
            }
            aboutStaffCard[aboutStaffCardCurrent].click();
        });
    }
} catch(e) {
    console.error('Unknown variable: aboutStaff' + e);
}

// Клиника
// Видео
try {
    const aboutVideo = document.querySelector('.about-clinic__offer video'),
        aboutVideoPlayBtn = document.querySelector('.about-clinic__video__play');

    aboutVideo.addEventListener('click', () => {
        openVideoModal(aboutVideo);
    });

    aboutVideoPlayBtn.addEventListener('click', () => {
        openVideoModal(aboutVideo);
    });
} catch {
    console.error('Unknown: clinic');
}

// VR
try {
    const vrSlideNext = document.querySelector('#vr__list__arrow-right'),
          vrSlidePrev = document.querySelector('#vr__list__arrow-left'),
          vrSlide = document.querySelectorAll('.vr__list__item');
    let vrSlideWidth = (parseInt(window.getComputedStyle(vrSlide[0]).width) + parseInt(window.getComputedStyle(vrSlide[0]).marginRight)),
        vrSlideCurrent = 0,
        vrSlideCount = vrSlide.length - 1;
    
    vrSlideNext.addEventListener('click', () => {
        vrSlideCurrent = switchSlide(vrSlide, vrSlideWidth, vrSlideCurrent, vrSlideCount, 1);
    });

    vrSlidePrev.addEventListener('click', () => {
        vrSlideCurrent = switchSlide(vrSlide, vrSlideWidth, vrSlideCurrent, vrSlideCount, -1);
    });
} catch {
    console.error('Unknow variable: vr');
}

// Услуги
try{
    const headItems = document.querySelectorAll('.options__head__item'),
          optionsLists = document.querySelectorAll('.options__body__list');

    headItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            switchOptionsHead(item);
            switchOptions(index);
        });
    });

    
    function switchOptionsHead(item) {
        headItems.forEach(i => {
            if (i.getBoundingClientRect().top > headItems[0].getBoundingClientRect().top)
                i.classList.remove('options__head__item__checked-bottom');
            else
                i.classList.remove('options__head__item__checked-top');
        });

        if (item.getBoundingClientRect().top > headItems[0].getBoundingClientRect().top)
            item.classList.add('options__head__item__checked-bottom');
        else
            item.classList.add('options__head__item__checked-top');
    }

    function switchOptions(index) {
        optionsLists.forEach(i => {
            i.classList.add('hide');
        });

        optionsLists[index].classList.remove('hide');
    }

    // Мобильная
    if (window.screen.width <= 768) {
        const headWrap = document.querySelector('.options__head__wrap');
        let optionsFirstTouch = 0,
            optionsPosition = 0,
            optionsPositionLast = 0;
    
        let headItemsWidth = (parseInt(window.getComputedStyle(headItems[0]).width) + parseInt(window.getComputedStyle(headItems[0]).marginRight)) * (headItems.length - 1);
        
        headWrap.addEventListener('touchstart', (event) => {
            optionsFirstTouch = event;
        });

        headWrap.addEventListener('touchmove', (event) => {
            headItems.forEach(item => {
                optionsPosition = optionsPositionLast + (event.touches[0].clientX - optionsFirstTouch.touches[0].clientX);
                if (optionsPosition < -headItemsWidth) {
                    optionsPosition = -headItemsWidth;
                } else if (optionsPosition > 1) {
                    optionsPosition = 0;
                }
                item.style.transform = `translate(${optionsPosition}px)`;
            });
        });

        headWrap.addEventListener('touchend', (event) => {
            optionsPositionLast = optionsPosition;
        });
    }
    
} catch(e) {
    console.error('Unknown variable: options' + e);
}



// Видео-слайдер
try {
    const videoSlider = document.querySelector('.video-reviews__slider');
    const nextBtn = document.querySelector('#video-reviews__slider__arrow-right');
    const prevBtn = document.querySelector('#video-reviews__slider__arrow-left');
    let videoStartIndex = 6;
    
    if (document.documentElement.clientWidth > 768) {
        let currentSlideIndex = 1;
        const videoOffer = document.querySelector('.video-reviews__offer');
        let sliderCount = videoSlider.querySelectorAll('[data-slide]').length;
        document.querySelector('#video-reviews__count').textContent = sliderCount;
        document.querySelector('#video-reviews__current').textContent = currentSlideIndex;

        function switchInfo(step) {
            let slides = videoSlider.querySelectorAll('[data-slide]');
            videoOffer.querySelector('[data-img]').src = slides[videoStartIndex].querySelector('[data-img]').src;
            videoOffer.querySelector('[data-name]').textContent = slides[videoStartIndex].querySelector('[data-name]').innerHTML;
            videoOffer.querySelector('[data-clinic]').textContent = slides[videoStartIndex].querySelector('[data-clinic]').innerHTML;
            videoOffer.querySelector('[data-review]').textContent = slides[videoStartIndex].querySelector('[data-review]').innerHTML;

            currentSlideIndex += step;
            if (currentSlideIndex <= 0)
                currentSlideIndex = sliderCount;
            else if (currentSlideIndex > sliderCount)
                currentSlideIndex = 1;
            document.querySelector('#video-reviews__current').textContent = currentSlideIndex;
        }

        infinitySlider(videoSlider, nextBtn, prevBtn, videoStartIndex, 'video-reviews__slider__item-active');

        const prevSwitchInfo = () => {
            switchInfo(-1);
            prevBtn.removeEventListener('click', prevSwitchInfo);
            setTimeout(() => {
                prevBtn.addEventListener('click', prevSwitchInfo);
            }, 400);
        }
        
        const nextSwitchInfo = () => {
            switchInfo(1);
            nextBtn.removeEventListener('click', nextSwitchInfo);
            setTimeout(() => {
                nextBtn.addEventListener('click', nextSwitchInfo);
            }, 400);
        }
        
        nextBtn.addEventListener('click', nextSwitchInfo);
        prevBtn.addEventListener('click', prevSwitchInfo);
        
    }
    const videoReviewsSlider = document.querySelector('.video-reviews__slider');
        
    openMediaModal(videoSlider, 'video');

    let videoReviewsSlide = videoReviewsSlider.querySelectorAll('.video-reviews__slider__item');
    
    if (window.screen.width < 768) {
        let videoReviewsCardFirstTouch;
        let videoReviewsCardCurrent = 2;
        function videoReviewsCardSwitch (item, index) {
            videoReviewsSlide.forEach((slide, slideIndex) => {
                slide.classList.remove('video-reviews__slider__item-active');
                slide.classList.remove('video-reviews__slider__item-visible');
                slide.classList.remove('video-reviews__slider__item-next');
                slide.classList.remove('video-reviews__slider__item-prev');
                slide.querySelector('video').pause();
                slide.classList.remove('video-reviews__slider__item-active-run');
                if (slideIndex > index) {
                    slide.classList.add('video-reviews__slider__item-next');
                } else if (slideIndex < index) {
                    slide.classList.add('video-reviews__slider__item-prev');
                }
            });
            item.classList.add('video-reviews__slider__item-active');
            if(index>0){
                videoReviewsSlide[index-1].classList.add('video-reviews__slider__item-visible');
                videoReviewsSlide[index-1].classList.add('video-reviews__slider__item-prev');
            }
            if (index<videoReviewsSlide.length-1) {
                videoReviewsSlide[index+1].classList.add('video-reviews__slider__item-visible');
                videoReviewsSlide[index+1].classList.add('video-reviews__slider__item-next');
            }
        }
        videoReviewsSlide.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('video-reviews__slider__item-active')) {
                    if (item.querySelector('video').muted == true) {
                        item.classList.add('video-reviews__slider__item-active-run');
                        item.querySelector('video').play();
                        item.querySelector('video').muted = false;
                        item.querySelector('video').controls = true;
                    } else {
                        item.classList.remove('video-reviews__slider__item-active-run');
                        item.querySelector('video').pause();
                        item.querySelector('video').muted = true;
                        item.querySelector('video').controls = false;
                    }
                }
            });
        });
    
        videoReviewsSlider.addEventListener('touchstart', (event) => {
            videoReviewsCardFirstTouch = event;
        });
    
        videoReviewsSlider.addEventListener('touchend', (event) => {
            if (event.changedTouches[0].clientX - videoReviewsCardFirstTouch.touches[0].clientX > 10 && videoReviewsCardCurrent > 0) {
                videoReviewsCardCurrent--;
            } else if (event.changedTouches[0].clientX - videoReviewsCardFirstTouch.touches[0].clientX < -10 && videoReviewsCardCurrent < videoReviewsSlide.length-1) {
                videoReviewsCardCurrent++;
            }
            videoReviewsCardSwitch(videoReviewsSlide[videoReviewsCardCurrent], videoReviewsCardCurrent);
        });
    }
} catch(e) {
    console.log(e);
}

// Галерея
try {
    const gallerySlider = document.querySelector('[data-infinity-slider]');
    const galleryOffer = document.querySelector('.gallery__offer');
    if (document.documentElement.clientWidth > 768) {
        const galleryNext = document.querySelector('#gallery__slider__arrow-right'),
              galleryPrev = document.querySelector('#gallery__slider__arrow-left');
        let gallerySliderStart = 4;
        let currentSlideIndex = 1;
        let sliderCount = gallerySlider.querySelectorAll('.gallery__slider__item').length;
        galleryOffer.querySelector('#gallery__count').textContent = sliderCount;
        galleryOffer.querySelector('#gallery__current').textContent = currentSlideIndex;
        function switchInfo(step) {
            let slides = gallerySlider.querySelectorAll('.gallery__slider__item');
            galleryOffer.querySelector('[data-clinic]').textContent = slides[gallerySliderStart].querySelector('[data-clinic]').innerHTML;
            galleryOffer.querySelector('[data-room]').textContent = slides[gallerySliderStart].querySelector('[data-room]').innerHTML;

            currentSlideIndex += step;
            if (currentSlideIndex <= 0)
                currentSlideIndex = sliderCount;
            else if (currentSlideIndex > sliderCount)
                currentSlideIndex = 1;
            galleryOffer.querySelector('#gallery__current').textContent = currentSlideIndex;
        }

        infinitySlider(gallerySlider, galleryNext, galleryPrev, gallerySliderStart, 'gallery__slider__item-active');

        const prevSwitchInfo = () => {
            switchInfo(-1);
            galleryPrev.removeEventListener('click', prevSwitchInfo);
            setTimeout(() => {
                galleryPrev.addEventListener('click', prevSwitchInfo);
            }, 400);
        }

        const nextSwitchInfo = () => {
            switchInfo(1);
            galleryNext.removeEventListener('click', nextSwitchInfo);
            setTimeout(() => {
                galleryNext.addEventListener('click', nextSwitchInfo);
            }, 400);
        }

        galleryNext.addEventListener('click', nextSwitchInfo);
        galleryPrev.addEventListener('click', prevSwitchInfo);
    }

    openMediaModal(gallerySlider, 'img');
} catch(e) {
    console.log(e);
}

// Акции
try {
    // Мобильный слайдер
    const stocksSlider = document.querySelector('.stocks__list'),
          stocksCard = stocksSlider.querySelectorAll('.stocks__item');
    
    let stocksSliderWidth = (parseInt(window.getComputedStyle(stocksCard[0]).width) + parseInt(window.getComputedStyle(stocksCard[0]).marginRight)) * (stocksCard.length - 1);

    let stocksFirstTouch = 0,
        stocksPosition = 0,
        stocksPositionLast = 0;
    stocksSlider.addEventListener('touchstart', (event) => {
        stocksFirstTouch = event;
    });

    stocksSlider.addEventListener('touchmove', (event) => {
        stocksCard.forEach(item => {
            stocksPosition = stocksPositionLast + (event.touches[0].clientX - stocksFirstTouch.touches[0].clientX);
            if (stocksPosition < -stocksSliderWidth) {
                stocksPosition = -stocksSliderWidth;
            } else if (stocksPosition > 1) {
                stocksPosition = 0;
            }
            item.style.transform = `translate(${stocksPosition}px)`;
        });
    });

    stocksSlider.addEventListener('touchend', (event) => {
        stocksPositionLast = stocksPosition;
    });

} catch(e) {
    console.log('Unknown stocks');
}

// Сертификаты врачей
try {
    const sliderItem = document.querySelector('.doctor-card__certificates__slider__img'),
        certificates = document.querySelectorAll('[data-certificates]'),
        sliderNext = document.querySelector('#doctor-card__certificates__slider__arrow-right'),
        sliderPrev = document.querySelector('#doctor-card__certificates__slider__arrow-left');

    let sliderCurrent = 0;

    function changeSlider() {
        let changeTimeout;
        clearTimeout(changeTimeout);
        sliderItem.style.opacity = 0;
        changeTimeout = setTimeout(() => {
            sliderItem.src = certificates[sliderCurrent].src;
            sliderItem.style.opacity = 1;
        }, 350);
    }
    
    sliderNext.addEventListener('click', () => {
        sliderCurrent++;
        if (sliderCurrent >= certificates.length)
            sliderCurrent = 0;
        changeSlider();
    });

    sliderPrev.addEventListener('click', () => {
        sliderCurrent--;
        if (sliderCurrent < 0)
            sliderCurrent = certificates.length - 1;
        changeSlider();
    });
        
} catch(e) {
    console.log("Unknown doctor's certificates unknown");
}

// Открытие видео-отзывов на странице отзывов
try {
    const videoReviews = document.querySelectorAll('.reviews__video__list__item');

    videoReviews.forEach(videoBlock => {
        videoBlock.addEventListener('click', () => {
            openVideoModal(videoBlock.querySelector('video'));
        });
    });
} catch(e) {
    console.log("Unknow video-reviews");
}

try {
    const portfolioItem = document.querySelectorAll('.portfolio__list__item');

    portfolioItem.forEach(item => {
        const portfolioItemSeparator = item.querySelector('.portfolio__list__item__img__separator');
        let mouseDownCondition = false;
        let clickPositionX;
        var itemWidth;
        var leftItem = item.querySelector('.portfolio__list__item__img-wrap-left');
        var rightItem = item.querySelector('.portfolio__list__item__img-wrap-right');
        var leftItemWidth;
        portfolioItemSeparator.addEventListener('mousedown', (e) => { 
            mouseDownCondition = true;
            clickPositionX = e.x;
            itemWidth = item.getBoundingClientRect().width;
            leftItemWidth = leftItem.getBoundingClientRect().width;
        });

        window.addEventListener('mouseup', (e) => mouseDownCondition = false);

        item.addEventListener('mousemove', (e) => {
            
            if (mouseDownCondition) {
                leftItemNewWidth = leftItemWidth + e.clientX - clickPositionX;
                leftItem.style.width = leftItemNewWidth + "px";
                rightItem.style.width = itemWidth - leftItemNewWidth + "px";
            }
        });
    });
} catch(e) {
    console.log("Unknow portfolio");
}


// try {
    let vacancyOptions = 
    [
        {
            vacancyName: "Врача Стоматолога-Хирурга",
            descList: [
                {
                    sectionName: "Обязанности",
                    list: [
                        "Хирургический прием и лечение пациентов:", 
                        "Разработка плана обследования и лечения пациента:",
                        "Имплантация; костные пластики;", 
                        "Послеоперационное ведение пациента;",
                        "Заполнение медицинской документации"
                    ]
                },
                {
                    sectionName: "Требования",
                    list: [
                        "Наличие действующего сертификата по хирургии;", 
                        "Опыт имплантации;", 
                        "Опыт работы от 3-х лет."
                    ]
                },
                {
                    sectionName: "Условия",
                    list: [
                        "Высокая заработная плата;", 
                        "Комфортные условия работы;", 
                        "Перспективы профессионального развития внутри компании;", 
                        "Оформление по ТК;"
                    ]
                }
            ]
        },
        {
            vacancyName: "Врача Стоматолога-Ортопеда",
            descList: [
                {
                    sectionName: "Обязанности",
                    list: [
                        "Консультация первичных пациентов, составления плана лечения, ведение медицинской документации.", 
                        "Навыки протезирования: несъемные протезы ( безметалловые реставрации, виниры, на имплантатах), съемное протезирование (частичные и бюгельные протезы).",
                        "Имплантация; костные пластики;", 
                        "Работа с артикулятором и лицевой дугой.",
                    ]
                },
                {
                    sectionName: "Требования",
                    list: [
                        "Действующий сертификат по специальности «Стоматология ортопедическая».", 
                        "Опыт работы врачом стоматологом ортопедом - от 2 лет.", 
                    ]
                },
                {
                    sectionName: "Условия",
                    list: [
                        "Официальное трудоустройство по ТК РФ (трудовая книжка, оплата больничных, отпускных)", 
                        "Стабильная и своевременная выплата заработной платы и отпускных ( два раза в месяц 26 и 15 числа)", 
                        "Бесплатные ресертификационные курсы для постоянных сотрудников (после 6 мес. Работы в клинике)", 
                        "График работы сменный: Первая смена с 9 до 15 часов, вторая с 15 до 21 часов,",
                        "Удобная транспортная доступность"
                    ]
                }
            ]
        },
        {
            vacancyName: "Врача Стоматолога-Терапевта",
            descList: [
                {
                    sectionName: "Обязанности",
                    list: [
                        "Согласно профессиональным требованиям и стандартам.", 
                    ]
                },
                {
                    sectionName: "Требования",
                    list: [
                        "Консультация первичных пациентов, составления плана лечения, ведение медицинской документации.", 
                        "Владение навыками современного эндодонтического лечение, реставрации, использование в работе прогрессивных способов диагностики и лечения стоматологических заболеваний", 
                        "Приветствуется опыт работы под микроскопом"
                    ]
                },
                {
                    sectionName: "Условия",
                    list: [
                        "Официальное трудоустройство по ТК РФ (трудовая книжка, оплата больничных, отпускных)", 
                        "Стабильная и своевременная выплата заработной платы и отпускных ( два раза в месяц 26 и 15 числа)", 
                        "Бесплатные ресертификационные курсы для постоянных сотрудников (после 6 мес. Работы в клинике)", 
                        "График работы сменный: Первая смена с 9 до 15 часов, вторая с 15 до 21 часов,",
                        "Удобная транспортная доступность"
                    ]
                }
            ]
        },
        {
            vacancyName: "Ассистента стоматолога",
            descList: [
                {
                    sectionName: "Обязанности",
                    list: [
                        "Подготовка кабинета для приема;", 
                        "Помощь врачу во время приема;",
                        "Работа в 4 руки с врачом;", 
                    ]
                },
                {
                    sectionName: "Требования",
                    list: [
                        "Опыт работы Ассистентом-стоматолога от 6 мес;", 
                        "Действующий сертификат сестринское дело, (сестринское дело в работе процедурных кабинетов, сестринское дело в стоматологии);", 
                        "Наличие действующей медицинской книжки;",
                        "Знание санитарных норм и правил;"
                    ]
                },
                {
                    sectionName: "Условия",
                    list: [
                        "Официальное трудоустройство по ТК РФ (трудовая книжка, оплата больничных, отпускных)", 
                        "Стабильная и своевременная выплата заработной платы и отпускных ( два раза в месяц 26 и 15 числа)", 
                        "Бесплатные ресертификационные курсы для постоянных сотрудников (после 6 мес. Работы в клинике)", 
                        "График работы сменный: Первая смена с 9 до 15 часов, вторая с 15 до 21 часов,",
                        "Удобная транспортная доступность"
                    ]
                }
            ]
        },
    ];
// } catch(e) {
//     console.log(e);
// }


try {
    // Слайдер Услуга Современная стоматология
    const optionSmartSlider = document.querySelector('.option__smart__slider'),
          optionSmartSlides = optionSmartSlider.querySelectorAll('.option__smart__slider__item'),
          optionSmartSliderNext = document.querySelector('#option__smart__slider__arrow-right'),
          optionSmartSliderPrev = document.querySelector('#option__smart__slider__arrow-left'),
          optionSmartSliderDotted = document.querySelectorAll('.option__smart__slider__dotted__item');
    
    let optionSmartSlideWidth = optionSmartSlides[0].getBoundingClientRect().width + parseInt(getComputedStyle(optionSmartSlides[0]).marginRight);
    let currentSlide = 0;
    let countSlides = optionSmartSlides.length;

    function switchSlide() {
        optionSmartSliderDotted.forEach(dot => {
            dot.classList.remove('option__smart__slider__dotted__item-active');
        });
        optionSmartSliderDotted[currentSlide].classList.add('option__smart__slider__dotted__item-active');
        optionSmartSlides.forEach(slide => {
            slide.style.transform = "translateX(-" + optionSmartSlideWidth * currentSlide + "px)";
        });
    }

    optionSmartSliderNext.addEventListener('click', () => {
        currentSlide++;
        if (currentSlide >= countSlides)
            currentSlide = 0;
        switchSlide();
    });

    optionSmartSliderPrev.addEventListener('click', () => {
        currentSlide--;
        if (currentSlide < 0) 
            currentSlide = countSlides - 1;
        switchSlide();
    });

    optionSmartSliderDotted.forEach((dot, dotIndex) => {
        dot.addEventListener('click', () => {
            currentSlide = dotIndex;
            switchSlide();
        });
    })
} catch(e) {
    console.log(e);
}