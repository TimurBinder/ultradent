function createElementByHTML(tagName, className, innerHTML)
{
    let element = document.createElement(tagName);
    element.className = className;
    element.innerHTML = innerHTML;
    return element;
}

class Modal {
    window = createElementByHTML('div', 'modal', '');
    modal = createElementByHTML('div', 'modal__block', '');
    close = createElementByHTML('div', 'modal-close', '<hr><hr>');

    constructor() {
        if (this.constructor == Modal)
            throw new Error('cannot use an abstract class');
    }

    draw(parent, position) {
        parent.insertAdjacentElement(position, this.window);
        document.querySelector('body').style.overflowY = 'hidden';
        if (this.modal.clientHeight > window.innerHeight) {
            this.window.style.paddingTop = "5%";
        }
    }

    remove() {
        this.window.remove();
        document.querySelector('body').style.overflowY = 'scroll';
    }

    createModal() {
        this.window.insertAdjacentElement('beforeend', this.close);
        this.window.insertAdjacentElement('beforeend', this.modal);
        this.window.addEventListener('click', (e) => {
            if (e.target == this.window || e.target == this.close || e.target == this.close.querySelector('hr:first-child')|| e.target == this.close.querySelector('hr:last-child'))
                this.remove();
        });
    }
}

class CityModal extends Modal {
    title = createElementByHTML('h2', 'modal__title', 'Выберите город');
    citiesList;

    constructor(citiesArray) {
        super();
        this.createModal(citiesArray);
    }

    createModal(citiesArray) {
        super.createModal();
        this.citiesList = this.#createCitiesList(citiesArray);
        this.modal.insertAdjacentElement('beforeend', this.title);
        this.modal.insertAdjacentElement('beforeend', this.citiesList);
    }

    #createCitiesList(citiesArray) {
        let list = createElementByHTML('div', 'modal__cities-list', '');
        let citiesElements = [];
        citiesArray.forEach((cityElem, index) => {
            citiesElements.push(createElementByHTML('a', '', cityElem.name));
            citiesElements[index].href  = cityElem.link;
            list.insertAdjacentElement('beforeend', citiesElements[index]);
        });
        return list;
    }
}

class CallModal extends Modal {
    form = this.#createForm();
    title = createElementByHTML('h2', 'modal__title', 'Обратный звонок');
    agreement = createElementByHTML('p', 'modal__agreement', 'Нажимая кнопку «Отправить», Вы даете согласие на обработку персональных данных в соответствии с <a href="#">Политикой конфиденциальности</a>');

    constructor() {
        super();
        this.createModal();
    }

    createModal() {
        super.createModal();
        this.modal.insertAdjacentElement('beforeend', this.title);
        this.modal.insertAdjacentElement('beforeend', this.form);
        this.modal.insertAdjacentElement('beforeend', this.agreement);
    }

    draw(parent, position) {
        super.draw(parent, position);
        phoneMask();
    }

    #createForm() {
        let form = createElementByHTML('form', 'modal__form', '');

        let nameInputBlock = createElementByHTML('div', 'modal__input-block', '<span>Имя</span><input type="text" required name="name" placeholder="Имя">');
        let phoneInputBlock = createElementByHTML('div', 'modal__input-block', '<span>Телефон</span><input type="tel" required name="phone" pattern="\\+7[0-9]{10}" maxlength="12" placeholder="Телефон">');
        let button = createElementByHTML('button', 'modal__btn btn1', 'Отправить');

        button.type = 'submit';
        form.method = 'POST';
        form.setAttribute('autocomplete', 'off');

        form.insertAdjacentElement('beforeend', nameInputBlock);
        form.insertAdjacentElement('beforeend', phoneInputBlock);
        form.insertAdjacentElement('beforeend', button);

        return form;
    }
}

// let vacancyOptions = 
// [
//     {
//         vacancyName: "Врача Стоматолога-Хирурга",
//         descList: [
//             {
//                 sectionName: "Обязанности",
//                 list: [
//                     "Хирургический прием и лечение пациентов:", 
//                     "Разработка плана обследования и лечения пациента:",
//                     "Имплантация; костные пластики;", 
//                     "Послеоперационное ведение пациента;",
//                     "Заполнение медицинской документации"
//                 ]
//             },
//             {
//                 sectionName: "Требования",
//                 list: [
//                     "Наличие действующего сертификата по хирургии;", 
//                     "Опыт имплантации;", 
//                     "Опыт работы от 3-х лет."
//                 ]
//             },
//             {
//                 sectionName: "Условия",
//                 list: [
//                     "Высокая заработная плата;", 
//                     "Комфортные условия работы;", 
//                     "Перспективы профессионального развития внутри компании;", 
//                     "Оформление по ТК;"
//                 ]
//             }
//         ]
//     },
// ];

class VacancyModal extends CallModal {
    #vacancyName; 
    #offer = createElementByHTML('div', 'modal__offer', '');

    constructor(vacancyName, options) {
        super();
        this.#vacancyName = vacancyName;
        this.createModal(options);
        this.title.textContent = 'Открыта вакансия на должность ' + vacancyName;
        this.title.classList.add('modal-vacancy__title');
        this.window.classList.add('vacancy-modal');
    }

    createModal(options) {
        super.createModal();
        if (options == undefined) return;
        options.forEach(optionItem => {
            this.#offer.insertAdjacentElement('beforeend', this.#createOfferSection(optionItem.sectionName, optionItem.list));
        });
        this.form.insertAdjacentElement('afterbegin', this.#offer);
    }

    #createOfferSection(titleName, listArray) {
        let offerSection = createElementByHTML('div', 'modal__offer', '');
        let title = createElementByHTML('h3', 'modal__offer__title', titleName);
        let list = createElementByHTML('ul', 'modal__offer__list dashed', '');
        listArray.forEach(item => {
            list.insertAdjacentElement('beforeend', createElementByHTML('li', '', item));
        });
        offerSection.insertAdjacentElement('beforeend', title);
        offerSection.insertAdjacentElement('beforeend', list);
        return offerSection;
    }
}

var calcArray = 
{
    mainList: 
    {
        title: 'Выберите услугу, которая Вас интересует',
        items: 
        [
            'Лечение зубов', 'Удаление зубов', 'Установка коронок', 'Протезирование', 'Имплантация', 'Профессиональная гигена полости рта', 'Отбеливание зубов', 'Виниры и реставрация улыбки', 'Детская стоматология', 'Лечение десен', 'Плановый осмотр стоматолога'
        ]
    },

    listsArray: 
    [
        [
            {
                title: 'Сколько зубов Вы хотите вылечить',
                items: 
                [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            },

            {
                title: 'Какая у Вас ситуация с зубами',
                items:
                [
                    'Острая боль', 'Есть темное пятно (но зуб не болит)', 'Давно не был, хочу проверить состояние зубов', 'Необходимо лечение зубов при подготовке к другой услуге', 'Иногда побаливают зубы, реакция на холодное/горячее', 'Замена старых пломб, коронок', 'Появился неприятный запах изо рта', 'Необходимо лечение при подготовке к беременности', 'Другое'
                ]
            },

            {
                title: 'Какой вариант лечения Вам предпочтительнее',
                items:
                [
                    'Возможность лечения без сверления', 'Самый лучший вариант', 'Очень качественное лечение', 'Самый дешевый вариант', 'Нужна консультация'
                ]
            },

            {
                title: 'Требуется ли Вам',
                items:
                [
                    'Лечение каналов', 'Восстановление керамической вкладкой', 'Восстановление коронкой', 'Другое', 'Нужно проконсультироваться у врача'
                ]
            },
            
            {
                title: 'Когда планируете начать лечение',
                items: 
                [
                    'Как можно скорее', 'В ближайшие 2 недели', 'В ближайший месяц', 'Через пол года'
                ]
            }
        ],

        [
            {
                title: 'Сколько зубов Вы хотите вылечить',
                items: 
                [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            },

            {
                title: 'Какая у Вас ситуация с зубами',
                items:
                [
                    'Острая боль', 'Есть темное пятно (но зуб не болит)', 'Давно не был, хочу проверить состояние зубов', 'Необходимо лечение зубов при подготовке к другой услуге', 'Иногда побаливают зубы, реакция на холодное/горячее', 'Замена старых пломб, коронок', 'Появился неприятный запах изо рта', 'Необходимо лечение при подготовке к беременности', 'Другое'
                ]
            },

            {
                title: 'Какой вариант лечения Вам предпочтительнее',
                items:
                [
                    'Возможность лечения без сверления', 'Самый лучший вариант', 'Очень качественное лечение', 'Самый дешевый вариант', 'Нужна консультация'
                ]
            },

            {
                title: 'Требуется ли Вам',
                items:
                [
                    'Лечение каналов', 'Восстановление керамической вкладкой', 'Восстановление коронкой', 'Другое', 'Нужно проконсультироваться у врача'
                ]
            },
            
            {
                title: 'Когда планируете начать лечение',
                items: 
                [
                    'Как можно скорее', 'В ближайшие 2 недели', 'В ближайший месяц', 'Через пол года'
                ]
            }
        ],

        [
            {
                title: 'Сколько зубов Вы хотите вылечить',
                items: 
                [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            },

            {
                title: 'Какая у Вас ситуация с зубами',
                items:
                [
                    'Острая боль', 'Есть темное пятно (но зуб не болит)', 'Давно не был, хочу проверить состояние зубов', 'Необходимо лечение зубов при подготовке к другой услуге', 'Иногда побаливают зубы, реакция на холодное/горячее', 'Замена старых пломб, коронок', 'Появился неприятный запах изо рта', 'Необходимо лечение при подготовке к беременности', 'Другое'
                ]
            },

            {
                title: 'Какой вариант лечения Вам предпочтительнее',
                items:
                [
                    'Возможность лечения без сверления', 'Самый лучший вариант', 'Очень качественное лечение', 'Самый дешевый вариант', 'Нужна консультация'
                ]
            },

            {
                title: 'Требуется ли Вам',
                items:
                [
                    'Лечение каналов', 'Восстановление керамической вкладкой', 'Восстановление коронкой', 'Другое', 'Нужно проконсультироваться у врача'
                ]
            },
            
            {
                title: 'Когда планируете начать лечение',
                items: 
                [
                    'Как можно скорее', 'В ближайшие 2 недели', 'В ближайший месяц', 'Через пол года'
                ]
            }
        ],

        [
            {
                title: 'Сколько зубов Вы хотите вылечить',
                items: 
                [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            },

            {
                title: 'Какая у Вас ситуация с зубами',
                items:
                [
                    'Острая боль', 'Есть темное пятно (но зуб не болит)', 'Давно не был, хочу проверить состояние зубов', 'Необходимо лечение зубов при подготовке к другой услуге', 'Иногда побаливают зубы, реакция на холодное/горячее', 'Замена старых пломб, коронок', 'Появился неприятный запах изо рта', 'Необходимо лечение при подготовке к беременности', 'Другое'
                ]
            },

            {
                title: 'Какой вариант лечения Вам предпочтительнее',
                items:
                [
                    'Возможность лечения без сверления', 'Самый лучший вариант', 'Очень качественное лечение', 'Самый дешевый вариант', 'Нужна консультация'
                ]
            },

            {
                title: 'Требуется ли Вам',
                items:
                [
                    'Лечение каналов', 'Восстановление керамической вкладкой', 'Восстановление коронкой', 'Другое', 'Нужно проконсультироваться у врача'
                ]
            },
            
            {
                title: 'Когда планируете начать лечение',
                items: 
                [
                    'Как можно скорее', 'В ближайшие 2 недели', 'В ближайший месяц', 'Через пол года'
                ]
            }
        ],

        [
            {
                title: 'Сколько зубов Вы хотите вылечить',
                items: 
                [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            },

            {
                title: 'Какая у Вас ситуация с зубами',
                items:
                [
                    'Острая боль', 'Есть темное пятно (но зуб не болит)', 'Давно не был, хочу проверить состояние зубов', 'Необходимо лечение зубов при подготовке к другой услуге', 'Иногда побаливают зубы, реакция на холодное/горячее', 'Замена старых пломб, коронок', 'Появился неприятный запах изо рта', 'Необходимо лечение при подготовке к беременности', 'Другое'
                ]
            },

            {
                title: 'Какой вариант лечения Вам предпочтительнее',
                items:
                [
                    'Возможность лечения без сверления', 'Самый лучший вариант', 'Очень качественное лечение', 'Самый дешевый вариант', 'Нужна консультация'
                ]
            },

            {
                title: 'Требуется ли Вам',
                items:
                [
                    'Лечение каналов', 'Восстановление керамической вкладкой', 'Восстановление коронкой', 'Другое', 'Нужно проконсультироваться у врача'
                ]
            },
            
            {
                title: 'Когда планируете начать лечение',
                items: 
                [
                    'Как можно скорее', 'В ближайшие 2 недели', 'В ближайший месяц', 'Через пол года'
                ]
            }
        ],

        [
            {
                title: 'Сколько зубов Вы хотите вылечить',
                items: 
                [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            },

            {
                title: 'Какая у Вас ситуация с зубами',
                items:
                [
                    'Острая боль', 'Есть темное пятно (но зуб не болит)', 'Давно не был, хочу проверить состояние зубов', 'Необходимо лечение зубов при подготовке к другой услуге', 'Иногда побаливают зубы, реакция на холодное/горячее', 'Замена старых пломб, коронок', 'Появился неприятный запах изо рта', 'Необходимо лечение при подготовке к беременности', 'Другое'
                ]
            },

            {
                title: 'Какой вариант лечения Вам предпочтительнее',
                items:
                [
                    'Возможность лечения без сверления', 'Самый лучший вариант', 'Очень качественное лечение', 'Самый дешевый вариант', 'Нужна консультация'
                ]
            },

            {
                title: 'Требуется ли Вам',
                items:
                [
                    'Лечение каналов', 'Восстановление керамической вкладкой', 'Восстановление коронкой', 'Другое', 'Нужно проконсультироваться у врача'
                ]
            },
            
            {
                title: 'Когда планируете начать лечение',
                items: 
                [
                    'Как можно скорее', 'В ближайшие 2 недели', 'В ближайший месяц', 'Через пол года'
                ]
            }
        ],

        [
            {
                title: 'Сколько зубов Вы хотите вылечить',
                items: 
                [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            },

            {
                title: 'Какая у Вас ситуация с зубами',
                items:
                [
                    'Острая боль', 'Есть темное пятно (но зуб не болит)', 'Давно не был, хочу проверить состояние зубов', 'Необходимо лечение зубов при подготовке к другой услуге', 'Иногда побаливают зубы, реакция на холодное/горячее', 'Замена старых пломб, коронок', 'Появился неприятный запах изо рта', 'Необходимо лечение при подготовке к беременности', 'Другое'
                ]
            },

            {
                title: 'Какой вариант лечения Вам предпочтительнее',
                items:
                [
                    'Возможность лечения без сверления', 'Самый лучший вариант', 'Очень качественное лечение', 'Самый дешевый вариант', 'Нужна консультация'
                ]
            },

            {
                title: 'Требуется ли Вам',
                items:
                [
                    'Лечение каналов', 'Восстановление керамической вкладкой', 'Восстановление коронкой', 'Другое', 'Нужно проконсультироваться у врача'
                ]
            },
            
            {
                title: 'Когда планируете начать лечение',
                items: 
                [
                    'Как можно скорее', 'В ближайшие 2 недели', 'В ближайший месяц', 'Через пол года'
                ]
            }
        ],

        [
            {
                title: 'Сколько зубов Вы хотите вылечить',
                items: 
                [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            },

            {
                title: 'Какая у Вас ситуация с зубами',
                items:
                [
                    'Острая боль', 'Есть темное пятно (но зуб не болит)', 'Давно не был, хочу проверить состояние зубов', 'Необходимо лечение зубов при подготовке к другой услуге', 'Иногда побаливают зубы, реакция на холодное/горячее', 'Замена старых пломб, коронок', 'Появился неприятный запах изо рта', 'Необходимо лечение при подготовке к беременности', 'Другое'
                ]
            },

            {
                title: 'Какой вариант лечения Вам предпочтительнее',
                items:
                [
                    'Возможность лечения без сверления', 'Самый лучший вариант', 'Очень качественное лечение', 'Самый дешевый вариант', 'Нужна консультация'
                ]
            },

            {
                title: 'Требуется ли Вам',
                items:
                [
                    'Лечение каналов', 'Восстановление керамической вкладкой', 'Восстановление коронкой', 'Другое', 'Нужно проконсультироваться у врача'
                ]
            },
            
            {
                title: 'Когда планируете начать лечение',
                items: 
                [
                    'Как можно скорее', 'В ближайшие 2 недели', 'В ближайший месяц', 'Через пол года'
                ]
            }
        ],

        [
            {
                title: 'Сколько зубов Вы хотите вылечить',
                items: 
                [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            },

            {
                title: 'Какая у Вас ситуация с зубами',
                items:
                [
                    'Острая боль', 'Есть темное пятно (но зуб не болит)', 'Давно не был, хочу проверить состояние зубов', 'Необходимо лечение зубов при подготовке к другой услуге', 'Иногда побаливают зубы, реакция на холодное/горячее', 'Замена старых пломб, коронок', 'Появился неприятный запах изо рта', 'Необходимо лечение при подготовке к беременности', 'Другое'
                ]
            },

            {
                title: 'Какой вариант лечения Вам предпочтительнее',
                items:
                [
                    'Возможность лечения без сверления', 'Самый лучший вариант', 'Очень качественное лечение', 'Самый дешевый вариант', 'Нужна консультация'
                ]
            },

            {
                title: 'Требуется ли Вам',
                items:
                [
                    'Лечение каналов', 'Восстановление керамической вкладкой', 'Восстановление коронкой', 'Другое', 'Нужно проконсультироваться у врача'
                ]
            },
            
            {
                title: 'Когда планируете начать лечение',
                items: 
                [
                    'Как можно скорее', 'В ближайшие 2 недели', 'В ближайший месяц', 'Через пол года'
                ]
            }
        ],

        [
            {
                title: 'Сколько зубов Вы хотите вылечить',
                items: 
                [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            },

            {
                title: 'Какая у Вас ситуация с зубами',
                items:
                [
                    'Острая боль', 'Есть темное пятно (но зуб не болит)', 'Давно не был, хочу проверить состояние зубов', 'Необходимо лечение зубов при подготовке к другой услуге', 'Иногда побаливают зубы, реакция на холодное/горячее', 'Замена старых пломб, коронок', 'Появился неприятный запах изо рта', 'Необходимо лечение при подготовке к беременности', 'Другое'
                ]
            },

            {
                title: 'Какой вариант лечения Вам предпочтительнее',
                items:
                [
                    'Возможность лечения без сверления', 'Самый лучший вариант', 'Очень качественное лечение', 'Самый дешевый вариант', 'Нужна консультация'
                ]
            },

            {
                title: 'Требуется ли Вам',
                items:
                [
                    'Лечение каналов', 'Восстановление керамической вкладкой', 'Восстановление коронкой', 'Другое', 'Нужно проконсультироваться у врача'
                ]
            },
            
            {
                title: 'Когда планируете начать лечение',
                items: 
                [
                    'Как можно скорее', 'В ближайшие 2 недели', 'В ближайший месяц', 'Через пол года'
                ]
            }
        ],

        [
            {
                title: 'Сколько зубов Вы хотите вылечить',
                items: 
                [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            },

            {
                title: 'Какая у Вас ситуация с зубами',
                items:
                [
                    'Острая боль', 'Есть темное пятно (но зуб не болит)', 'Давно не был, хочу проверить состояние зубов', 'Необходимо лечение зубов при подготовке к другой услуге', 'Иногда побаливают зубы, реакция на холодное/горячее', 'Замена старых пломб, коронок', 'Появился неприятный запах изо рта', 'Необходимо лечение при подготовке к беременности', 'Другое'
                ]
            },

            {
                title: 'Какой вариант лечения Вам предпочтительнее',
                items:
                [
                    'Возможность лечения без сверления', 'Самый лучший вариант', 'Очень качественное лечение', 'Самый дешевый вариант', 'Нужна консультация'
                ]
            },

            {
                title: 'Требуется ли Вам',
                items:
                [
                    'Лечение каналов', 'Восстановление керамической вкладкой', 'Восстановление коронкой', 'Другое', 'Нужно проконсультироваться у врача'
                ]
            },
            
            {
                title: 'Когда планируете начать лечение',
                items: 
                [
                    'Как можно скорее', 'В ближайшие 2 недели', 'В ближайший месяц', 'Через пол года'
                ]
            }
        ],
    ]
};

class CalculatorList {
    #title;
    #itemsList;
    #listBlock; #listArray = [];
    
    constructor(title, itemsList) {
        this.#title = title;
        this.#itemsList = itemsList;
        this.#listBlock = this.#createList(itemsList);
    }

    getItemsArray() {
        return this.#listArray;
    }

    getList() {
        return this.#listBlock;
    }

    #createList(itemsList) {
        let list = createElementByHTML('div', 'calculator__main__list', '');

        itemsList.forEach(item => {
            let itemElemHtml = `<div class='calculator__main__list__item__check'></div><p class='calculator__main__list__item__name'>${item}</p>`;
            let itemElem = createElementByHTML('div', 'calculator__main__list__item', itemElemHtml);
            this.#listArray.push(itemElem);
            list.insertAdjacentElement('beforeend', itemElem);
        });

        this.#listArray.forEach(item => {
            item.addEventListener('click', () => {
                this.#listArray.forEach(itemInner => {
                    itemInner.classList.remove('calculator__main__list__item-active');
                });
                item.classList.add('calculator__main__list__item-active');
            });
        });
        
        return list;
    }
}

class CalculatorModal extends Modal {
    #title = createElementByHTML('h2', 'modal__title calculator__main__title', 'Выберите услугу, которая Вас интересует');
    #mainList; #listsArray = [];
    #listsBlock; #listsBlockWrap;
    #currentListIndex; #btnsWrap;

    constructor(calcList) {
        super();
        this.modal.classList.add('calculator-modal');
        this.#mainList = new CalculatorList(this.#title, calcList.mainList.items);
        calcList.listsArray.forEach(listsList => {
            let lists = [];
            listsList.forEach(list => {
                lists.push(new CalculatorList(list.title, list.items));
            });
            this.#listsArray.push(lists);
        });
        this.#createListsBlock();
        this.#createBtnsWrap();
        this.#listsBlock.insertAdjacentElement('beforeend', this.#btnsWrap);
        this.modal.insertAdjacentElement('beforeend', this.#listsBlock);
        this.window.insertAdjacentElement('beforeend', this.modal);
    }

    #createListsBlock() {
        this.#listsBlock = createElementByHTML('div', 'calculator__main', '');
        this.#listsBlockWrap = createElementByHTML('div', 'calculator__main-wrap', '');
        this.#listsBlock.insertAdjacentElement('beforeend', this.#title);
        this.#listsBlockWrap.insertAdjacentElement('beforeend', this.#mainList.getList());
        this.#listsBlock.insertAdjacentElement('beforeend', this.#listsBlockWrap);
        this.#currentListIndex = 0;
    }

    #selectList() {
        
    }

    #switchList = (step) => {
        this.#listsArray[this.#currentListIndex].remove();
        this.#currentListIndex += step;
        this.#listsBlockWrap.insertAdjacentElement('beforeend', this.#listsArray[this.#currentListIndex]);
    }

    #createBtnsWrap() {
        this.#btnsWrap = createElementByHTML('div', 'calculator__main__btns-block', '');
        let btnPrev = createElementByHTML('div', 'calculator__main__btn calculator__main__btn-prev btn-second1', 'Назад');
        let btnNext = createElementByHTML('div', 'calculator__main__btn calculator__main__btn-next btn1', 'Далее');

        btnPrev.addEventListener('click', () => {
            this.#switchList(-1);
        });
        btnNext.addEventListener('click', () => {
            this.#switchList(1);
        });

        this.#btnsWrap.insertAdjacentElement('beforeend', btnPrev);
        this.#btnsWrap.insertAdjacentElement('beforeend', btnNext);
    }
}

var calculator = new CalculatorModal(calcArray);
document.querySelectorAll('[data-calc]').forEach(calc => {
    calc.addEventListener('click', () => calculator.draw(document.querySelector('body'), 'beforeend'));
    phoneMask();
});