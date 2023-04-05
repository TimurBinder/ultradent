
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

function openPhotoModal(photo) {
    let photoModal = document.createElement('div');
    photoModal.classList.add('photo__modal');
    photoModal.innerHTML = `<img src="${photo.src}" class="photo__modal__photo" controls> <div class="video-modal__cross"><hr class="video-modal__cross-line" id="video-modal__cross-line-1"><hr class="video-modal__cross-line" id="video-modal__cross-line-2"></div>`;

    document.body.append(photoModal);

    let photoModalCross = photoModal.querySelector('.video-modal__cross'),
        photoModalImg = photoModal.querySelector('.photo__modal__photo');
        photoModalCross.addEventListener('click', () => {
        videoModal.remove();
    });

    photoModal.addEventListener('touchstart', (e) => {
        e.preventDefault();
    });

    photoModal.addEventListener('click', (e) => {
        e.preventDefault();
        if (e.target != photoModalImg)
            photoModal.remove();
    });

    let firstTouch = 0;
    if (window.screen.width < 768) {
        photoModalImg.addEventListener('touchstart', (event) => {
            event.preventDefault();
            firstTouch = event;
        });

        photoModalImg.addEventListener('touchmove', (event) => {
            let transform = 
            photoModalImg.style.transform = `translateY(-${firstTouch.touches[0].clientY - event.touches[0].clientY}px) scale(${1 - ((firstTouch.touches[0].clientY - event.touches[0].clientY) / 1000)})`;
            console.log();
        });

        photoModalImg.addEventListener('touchend', (event) => {
            if (event.changedTouches[0].screenY < firstTouch.touches[0].screenY) {
                photoModal.remove();
            } else {
                
            }
        });
    }
}

// Ленивая загрузка
[].forEach.call(document.querySelectorAll('img[data-src]'),    function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.removeAttribute('data-src');
});

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
                document.querySelector('.about-staff__main-card__img').style.height = `300px`;
                document.querySelector('.about-staff__main-card__img').style.transitionDuration = `300ms`;   
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
    const videoReviewsSlider = document.querySelector('.video-reviews__slider'),
          videoReviewsSlideNext = document.querySelector('#video-reviews__slider__arrow-right'),
          videoReviewsSlidePrev = document.querySelector('#video-reviews__slider__arrow-left'),
          videoReviewsSlideCurrentText = document.querySelector('#video-reviews__current'),
          videoReviewsSlideCountText = document.querySelector('#video-reviews__count'),
          videoReviewsSlideMain = document.querySelector('.video-reviews__offer');

    let videoReviewsSlide = videoReviewsSlider.querySelectorAll('.video-reviews__slider__item');

    let videoReviewsSlideCurrent = 0,
        videoReviewsSlideCount = videoReviewsSlider.querySelectorAll('.video-reviews__slider__item').length,
        videoReviewsSlideWidth = (parseInt(window.getComputedStyle(videoReviewsSlide[0]).width) + parseInt(window.getComputedStyle(videoReviewsSlide[0]).marginRight));
    
    if (window.screen.width > 768) {
        videoReviewsSlide.forEach(item => {
            let clone = item.cloneNode(true);
            if (clone.classList.contains('video-reviews__slider__item-active')) clone.classList.remove('video-reviews__slider__item-active');
            videoReviewsSlider.append(clone);
        });
    
        videoReviewsSlideCountText.innerHTML = videoReviewsSlideCount;
        videoReviewsSlideCurrentText.innerHTML = videoReviewsSlideCurrent + 1;
        videoReviewsSlide = videoReviewsSlider.querySelectorAll('.video-reviews__slider__item');
        videoReviewsSlide.forEach(item => {
            item.addEventListener('click', () => {
                openVideoModal(item.querySelector('video'));
            });
        });
    
        const videoReviewsSwitchNext = () => {
            videoReviewsSlide = videoReviewsSlider.querySelectorAll('.video-reviews__slider__item');
            videoReviewsSlideCurrent++;
            if (videoReviewsSlideCurrent >= videoReviewsSlideCount) {
                setTimeout(function() {
                    videoReviewsSlideCurrent = 0;
                    videoReviewsSlide.forEach(item => {
                        item.style.transitionDuration = '0ms';
                        item.style.transform = `translateX(0px)`;
                        videoReviewsSlide.forEach(item => {
                            item.classList.remove('video-reviews__slider__item-active');
                        });
                        videoReviewsSlide[videoReviewsSlideCurrent+2].classList.add('video-reviews__slider__item-active');
                    });
                }, 400);
            }
            videoReviewsSlide.forEach(item => {
                item.style.transitionDuration = '400ms';
                item.style.transform = `translateX(-${videoReviewsSlideWidth * videoReviewsSlideCurrent}px)`;
            });
            
            videoReviewsSlide.forEach(item => {
                item.classList.remove('video-reviews__slider__item-active');
            });
            videoReviewsSlide[videoReviewsSlideCurrent+2].classList.add('video-reviews__slider__item-active');
            videoReviewsSlideNext.removeEventListener('click', videoReviewsSwitchNext);
            setTimeout(() => {
                videoReviewsSlideNext.addEventListener('click', videoReviewsSwitchNext);
                videoReviewsSlideCurrentText.innerHTML = videoReviewsSlideCurrent + 1;
                videoReviewsSlide.forEach(item => {
                    if (item.classList.contains('video-reviews__slider__item-active')) {
                        videoReviewsSlideMain.querySelector('[data-img]').src = item.querySelector('[data-img]').src;
                        videoReviewsSlideMain.querySelector('[data-name]').innerHTML = item.querySelector('[data-name]').innerHTML;
                        videoReviewsSlideMain.querySelector('[data-clinic]').innerHTML = item.querySelector('[data-clinic]').innerHTML;
                        videoReviewsSlideMain.querySelector('[data-review]').innerHTML = item.querySelector('[data-review]').innerHTML;
                    }
                });
            }, 400);
            
        }
    
        const videoReviewsSwitchPrev = () => {
            videoReviewsSlideCurrent--;
            console.log(videoReviewsSlideCurrent);
            videoReviewsSlide = videoReviewsSlider.querySelectorAll('.video-reviews__slider__item');
            if (videoReviewsSlideCurrent < 0) {
                videoReviewsSlideCurrent = videoReviewsSlideCount;
                console.log(videoReviewsSlideCurrent);
                videoReviewsSlide.forEach(item => {
                    item.style.transitionDuration = '0ms';
                    item.style.transform = `translateX(-${videoReviewsSlideCurrent * videoReviewsSlideWidth}px)`;
                    videoReviewsSlide.forEach(item => {
                        item.classList.remove('video-reviews__slider__item-active');
                    });
                    videoReviewsSlide[videoReviewsSlideCurrent+2].classList.add('video-reviews__slider__item-active');
                });
                videoReviewsSlideCurrent--;
            }
            videoReviewsSlide = videoReviewsSlider.querySelectorAll('.video-reviews__slider__item');
            setTimeout(() => {
                videoReviewsSlide.forEach(item => {
                    item.style.transitionDuration = '400ms';
                    item.style.transform = `translateX(-${videoReviewsSlideWidth * videoReviewsSlideCurrent}px)`;
                });
                console.log(videoReviewsSlideCurrent, videoReviewsSlide[0].style.transform);
                videoReviewsSlide.forEach(item => {
                    item.classList.remove('video-reviews__slider__item-active');
                });
                videoReviewsSlide[videoReviewsSlideCurrent+2].classList.add('video-reviews__slider__item-active');
                videoReviewsSlidePrev.removeEventListener('click', videoReviewsSwitchPrev);
            }, 10);
            setTimeout(() => {
                videoReviewsSlidePrev.addEventListener('click', videoReviewsSwitchPrev);
                videoReviewsSlideCurrentText.innerHTML = videoReviewsSlideCurrent + 1;
                videoReviewsSlide.forEach(item => {
                    if (item.classList.contains('video-reviews__slider__item-active')) {
                        videoReviewsSlideMain.querySelector('[data-img]').src = item.querySelector('[data-img]').src;
                        videoReviewsSlideMain.querySelector('[data-name]').innerHTML = item.querySelector('[data-name]').innerHTML;
                        videoReviewsSlideMain.querySelector('[data-clinic]').innerHTML = item.querySelector('[data-clinic]').innerHTML;
                        videoReviewsSlideMain.querySelector('[data-review]').innerHTML = item.querySelector('[data-review]').innerHTML;
                    }
                });
            }, 395);
        }
        
        // videoReviewsSwitchPrev();
    
        videoReviewsSlideNext.addEventListener('click', videoReviewsSwitchNext);
    
        videoReviewsSlidePrev.addEventListener('click', videoReviewsSwitchPrev);
    } else {
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
                    console.log(!item.classList.contains('video-reviews__slider__item-active-run'));
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

}

// Галлерея
try {
    const gallerySlider = document.querySelector('.gallery__slider'),
          gallerySlideNext = document.querySelector('#gallery__slider__arrow-right'),
          gallerySlidePrev = document.querySelector('#gallery__slider__arrow-left'),
          gallerySlideCurrentText = document.querySelector('#gallery__current'),
          gallerySlideCountText = document.querySelector('#gallery__count'),
          gallerySlideMain = document.querySelector('.gallery__offer');

    let gallerySlide = gallerySlider.querySelectorAll('.gallery__slider__item');

    let gallerySlideCurrent = 0,
        gallerySlideCount = gallerySlider.querySelectorAll('.gallery__slider__item').length,
        gallerySlideWidth = (parseInt(window.getComputedStyle(gallerySlide[0]).width) + parseInt(window.getComputedStyle(gallerySlide[0]).marginRight));

    gallerySlide.forEach(item => {
        let clone = item.cloneNode(true);
        if (clone.classList.contains('gallery__slider__item-active')) clone.classList.remove('gallery__slider__item-active');
        gallerySlider.append(clone);
    });

    gallerySlideCountText.innerHTML = gallerySlideCount;
    gallerySlideCurrentText.innerHTML = gallerySlideCurrent + 1;

    gallerySlide = gallerySlider.querySelectorAll('.gallery__slider__item');
    gallerySlide.forEach(item => {
        item.addEventListener('click', () => {
            openPhotoModal(item.querySelector('img'));
        });
    });

    const gallerySwitchNext = () => {
        gallerySlide = gallerySlider.querySelectorAll('.gallery__slider__item');
        gallerySlideCurrent++;
        if (gallerySlideCurrent >= gallerySlideCount) {
            setTimeout(function() {
                gallerySlideCurrent = 0;
                gallerySlide.forEach(item => {
                    item.style.transitionDuration = '0ms';
                    item.style.transform = `translateX(0px)`;
                    gallerySlide.forEach(item => {
                        item.classList.remove('gallery__slider__item-active');
                    });
                    gallerySlide[gallerySlideCurrent+2].classList.add('gallery__slider__item-active');
                });
            }, 400);
        }
        gallerySlide.forEach(item => {
            item.style.transitionDuration = '400ms';
            item.style.transform = `translateX(-${gallerySlideWidth * gallerySlideCurrent}px)`;
        });
        
        gallerySlide.forEach(item => {
            item.classList.remove('gallery__slider__item-active');
        });
        gallerySlide[gallerySlideCurrent+2].classList.add('gallery__slider__item-active');
        gallerySlideNext.removeEventListener('click', gallerySwitchNext);
        setTimeout(() => {
            gallerySlideNext.addEventListener('click', gallerySwitchNext);
            gallerySlideCurrentText.innerHTML = gallerySlideCurrent + 1;
            gallerySlide.forEach(item => {
                if (item.classList.contains('gallery__slider__item-active')) {
                    gallerySlideMain.querySelector('[data-clinic]').innerHTML = item.querySelector('[data-clinic]').innerHTML;
                    gallerySlideMain.querySelector('[data-room]').innerHTML = item.querySelector('[data-room]').innerHTML;
                }
            });
        }, 400);
    }

    const gallerySwitchPrev = () => {
        gallerySlideCurrent--;
        console.log(gallerySlideCurrent);
        gallerySlide = gallerySlider.querySelectorAll('.gallery__slider__item');
        if (gallerySlideCurrent < 0) {
            gallerySlideCurrent = gallerySlideCount;
            console.log(gallerySlideCurrent);
            gallerySlide.forEach(item => {
                item.style.transitionDuration = '0ms';
                item.style.transform = `translateX(-${gallerySlideCurrent * gallerySlideWidth}px)`;
                gallerySlide.forEach(item => {
                    item.classList.remove('gallery__slider__item-active');
                });
                gallerySlide[gallerySlideCurrent+2].classList.add('gallery__slider__item-active');
            });
            gallerySlideCurrent--;
        }
        gallerySlide = gallerySlider.querySelectorAll('.gallery__slider__item');
        setTimeout(() => {
            gallerySlide.forEach(item => {
                item.style.transitionDuration = '400ms';
                item.style.transform = `translateX(-${gallerySlideWidth * gallerySlideCurrent}px)`;
            });
            console.log(gallerySlideCurrent, gallerySlide[0].style.transform);
            gallerySlide.forEach(item => {
                item.classList.remove('gallery__slider__item-active');
            });
            gallerySlide[gallerySlideCurrent+2].classList.add('gallery__slider__item-active');
            gallerySlidePrev.removeEventListener('click', gallerySwitchPrev);
        }, 10);
        setTimeout(() => {
            gallerySlidePrev.addEventListener('click', gallerySwitchPrev);
            gallerySlideCurrentText.innerHTML = gallerySlideCurrent + 1;
            gallerySlide.forEach(item => {
                if (item.classList.contains('gallery__slider__item-active')) {
                    gallerySlideMain.querySelector('[data-clinic]').innerHTML = item.querySelector('[data-clinic]').innerHTML;
                    gallerySlideMain.querySelector('[data-room]').innerHTML = item.querySelector('[data-room]').innerHTML;
                }
            });
        }, 395);
    }
    
    gallerySlideNext.addEventListener('click', gallerySwitchNext);

    gallerySlidePrev.addEventListener('click', gallerySwitchPrev);
} catch(e) {
    console.log('Unknown gallery');
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

phoneMask();

try {
    const callModal = document.querySelector('.call-modal');
    const callModalBtn = document.querySelectorAll('[data-call-modal]');

    callModalBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            callModal.style.display = "flex";
        });
    });

    callModal.addEventListener('click', (e) => {
        if (e.target == callModal || e.target == callModal.querySelector('.modal-close')) {
            callModal.style.display = "none";
        }
    });
} catch(e) {
    console.log(e);
}