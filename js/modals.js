function createElementByHTML(tagName, className, innerHTML)
{
    let element = document.createElement(tagName);
    element.className = className;
    element.innerHTML = innerHTML;
    return element;
}

class Modal {
    window; modal; close;

    constructor() {
        this.window = createElementByHTML('div', 'modal', '');
        this.modal = createElementByHTML('div', 'modal__block', '');
        this.close = createElementByHTML('div', 'modal-close', '<hr><hr>');
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
                    '1', '2', '3', '4', '5', '6 и более', 'Нужно подготовить к имплантации/протезированию', 'Нужна консультация врача'
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
                title: 'Коронки из какого материала Вам предпочтительнее',
                items: 
                [
                    'Металлические', 'Металлокерамика', 'Керамика', 'Пластмасса', 'Цирконий', 'Нужна помощь врача', '7', '8', '9', '10 и более', 'Нужна консультация'
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
    #title; #listElement; 
    #itemsArray; #itemsElementsArray = [];
    #value; #valueId = null;

    constructor(title, itemsArray) {
        this.#title = title;
        this.#itemsArray = itemsArray;
        this.#createList();
    }

    #createList() {
        this.#listElement = createElementByHTML('div', 'calculator__main__list', '');

        this.#itemsArray.forEach(item => {
            let itemHtmlCode = `<div class="calculator__main__list__item__check"></div><p class="calculator__main__list__item__name">${item}</p>`;

            let itemElement = createElementByHTML('div', 'calculator__main__list__item', itemHtmlCode);

            this.#itemsElementsArray.push(itemElement);

            this.#listElement.insertAdjacentElement('beforeend', itemElement);
        });

        this.#itemsElementsArray.forEach((itemElement, index) => {
            itemElement.addEventListener('click', (e) => {
                e.preventDefault();
                this.#itemsElementsArray.forEach(item => {
                    item.classList.remove('calculator__main__list__item-active');
                });
                itemElement.classList.add('calculator__main__list__item-active');
                this.#value = itemElement.querySelector('p').innerHTML;
                this.#valueId = index;
            });
        });
    }

    getTitle() { return this.#title; }
    getList() { return this.#listElement; }
    getItemsArray() { return this.#itemsElementsArray; }
    getValue() { return this.#value; }
    getValueId() { return this.#valueId }
}

class CalculatorModal extends Modal {
    #mainBlock; #mainWrap; #btnsWrap; #sidebar;
    #mainList; #mainListInstance; #mainListElement;  
    #currentListIndex = 0; #currentList;
    #selectedListInstancesArray = []; #listsCount; #listsArray = []; #selectedListsArray = []; #selectionData = [];
    #discountElement; #discountAmount = 0; #maxDiscountAmount = 35; #discountAmountStep; #discountAmountElement;
    #titleElement;
    #form; #mainOffer;

    constructor(calcArray) { // calcArray: { mainList: {}, listsArray: {} };
        super();
        this.#mainList = calcArray.mainList;
        this.#listsArray = calcArray.listsArray;
        this.#createModal();
        this.window.classList.add('calculator');
        this.modal.classList.add('calculator-modal');
    }

    #createModal() {
        super.createModal();
        this.#mainBlock = createElementByHTML('div', 'calculator__main', '');
        this.#mainWrap = createElementByHTML('div', 'calculator__main-wrap', '');
        this.#titleElement = createElementByHTML('h2', 'calculator__main__offer__title', 'Выберите услугу, которая Вас интересует');
        this.#createBtnsWrap();
        this.#createSidebar();
        this.#mainListInstance = new CalculatorList(this.#mainList.title, this.#mainList.items);
        this.#mainListElement = this.#mainListInstance.getList();
        this.#mainWrap.insertAdjacentElement('beforeend', this.#titleElement);
        this.#mainWrap.insertAdjacentElement('beforeend', this.#mainListElement);
        this.#mainBlock.insertAdjacentElement('beforeend', this.#mainWrap);
        this.#mainBlock.insertAdjacentElement('beforeend', this.#btnsWrap);
        this.modal.insertAdjacentElement('beforeend', this.#mainBlock);
        this.modal.insertAdjacentElement('beforeend', this.#sidebar);
        this.#currentList = this.#mainListInstance;
    }

    #createBtnsWrap() {
        this.#btnsWrap = createElementByHTML('div', 'calculator__main__btns-block', '');

        let btnPrev = createElementByHTML('div', 'calculator__main__btn calculator__main__btn-prev btn-second1', 'Назад');
        let btnNext = createElementByHTML('div', 'calculator__main__btn calculator__main__btn-next btn1', 'Далее');

        btnPrev.addEventListener('click', (e) => {
            e.preventDefault();
            this.#switchList(-1);
        });

        btnNext.addEventListener('click', (e) => {
            e.preventDefault();
            this.#switchList(1);
        });

        this.#btnsWrap.insertAdjacentElement('beforeend', btnPrev);
        this.#btnsWrap.insertAdjacentElement('beforeend', btnNext);
    }

    #createSidebar() {
        this.#sidebar = createElementByHTML('div', 'calculator__sidebar', '');
        this.#createDiscountElement();
        this.#sidebar.insertAdjacentElement('beforeend', this.#discountElement);
    }

    #createDiscountElement() {
        this.#discountElement = createElementByHTML('div', 'calculator__sidebar__discount', '<span>Ваша скидка: </span>');
        this.#discountAmountElement = createElementByHTML('span', '', `${this.#discountAmount} %`);
        let iconUp = createElementByHTML('div', 'calculator__sidebar__discount-up', '<div><hr><hr></div><div><hr><hr></div>');
        this.#discountElement.insertAdjacentElement('beforeend', this.#discountAmountElement);
        this.#discountElement.insertAdjacentElement('beforeend', iconUp);
    }

    #changeDiscount(value = null) {
        if (value === null)
            this.#discountAmount = this.#currentListIndex * this.#discountAmountStep;
        else 
            this.#discountAmount = value;

        this.#discountAmountElement.textContent = Math.round(this.#discountAmount) + " %";
    }

    #switchList(step) { // step == 1 / -1
        if (step === 1 && this.#currentList.getValueId() === null) 
            return;

        this.#currentListIndex += step;

        if (this.#currentListIndex < 0) {
            this.#currentListIndex = 0;
            return;
        } else if (this.#currentListIndex > this.#listsCount) {
            this.#openCallForm();
            this.#changeDiscount(this.#maxDiscountAmount);
            return;
        }

        this.#mainWrap.style.transform = "scaleY(0)";
        setTimeout(() => {
    
            if (this.#currentListIndex === 1 && step === 1) {
                this.#selectedListInstancesArray = this.#createListElementsArray(this.#listsArray[this.#currentList.getValueId()]);
                this.#listsCount = this.#selectedListInstancesArray.length;
                this.#discountAmountStep = this.#maxDiscountAmount / (this.#listsCount + 1);
            }
    
            if (this.#currentListIndex === 0) {
                this.#currentList = this.#mainListInstance;
                this.#selectedListInstancesArray[0].getList().remove();
            }
            else {
                this.#currentList = this.#selectedListInstancesArray[this.#currentListIndex-1];
                if (this.#currentListIndex === 1 && step === 1)
                    this.#mainListElement.remove();
                else 
                    this.#selectedListInstancesArray[this.#currentListIndex-1-step].getList().remove();
            }
    
            this.#mainWrap.insertAdjacentElement('beforeend', this.#currentList.getList());
            this.#titleElement.textContent = this.#currentList.getTitle();
            this.#changeDiscount();
            this.#mainWrap.style.transform = "scaleY(1)";
        }, 400);
    }

    #createListElementsArray(listsArray) {
        let listElementsArray = [];

        listsArray.forEach(list => {
            listElementsArray.push(new CalculatorList(list.title, list.items));
        });

        return listElementsArray;
    }

    #openCallForm() {
        this.#mainWrap.remove();
        this.#discountElement.remove();
        this.#btnsWrap.remove();

        this.#createMainOffer();
        this.#createForm();

        this.#mainBlock.insertAdjacentElement('beforeend', this.#mainOffer);
        this.#sidebar.insertAdjacentElement('beforeend', this.#form);
    }

    #createMainOffer() {
        this.#mainOffer = createElementByHTML('div', 'calculator__main__offer', '');
        this.#titleElement.textContent = "Пожалуйста, оставьте свой номер телефона, чтобы мы смогли с Вами связаться. А также ответить на другие вопросы, касаемые лечения.";
        
        let desc1 = createElementByHTML('p', 'calculator__main__offer__desc', 'А также для всех жителей города действует акция на первое посещение стоматологии:');
        let desc2 = createElementByHTML('p', 'calculator__main__offer__desc', '*Акция действует для лиц старше 30 лет');
        let descList = createElementByHTML('ul', 'calculator__main__offer__desc-list dashed', `<li>Бесплатные приемы</li><li>3D-снимок или снимок ОПТГ</li><li>План лечения и все это совершенно <b>бесплатно</b></li>`);
        let discountBlock = createElementByHTML('div', 'calculator__main__offer__discount', `<span>Ваша скидка: </span>
        <span class="calculator__main__offer__discount-num">35 %</span>`);
        
        this.#mainOffer.insertAdjacentElement('beforeend', this.#titleElement);
        this.#mainOffer.insertAdjacentElement('beforeend', desc1);
        this.#mainOffer.insertAdjacentElement('beforeend', descList);
        this.#mainOffer.insertAdjacentElement('beforeend', desc2);
        this.#mainOffer.insertAdjacentElement('beforeend', discountBlock);
    }

    #createForm() {
        this.#form = createElementByHTML('form', 'calculator__sidebar__form', '');

        let nameInputBlock = createElementByHTML('div', 'calculator__sidebar__form__input-block', `<span>Введите имя</span><input required type="text" name="name" placeholder="Имя">`);
        let phoneInputBlock = createElementByHTML('div', 'calculator__sidebar__form__input-block', `<span>Введите телефон</span><input required type="tel" name="phone" placeholder="Введите телефон">`);
        let button = createElementByHTML('button', 'calculator__sidebar__form__btn btn1', 'Записаться на прием');
        button.type = 'submit';
        let policityBlock = createElementByHTML('div', 'calculator__sidebar__form__check-block check-block', `<input type="checkbox" checked name="agreement"><span>C <a href="#">Положение об обработке персональных данных</a> и <a href="#">Политикой конфиденциальности</a> ознакомлен и согласен</span>`);

        this.#form.insertAdjacentElement('beforeend', nameInputBlock);
        this.#form.insertAdjacentElement('beforeend', phoneInputBlock);
        this.#form.insertAdjacentElement('beforeend', button);
        this.#form.insertAdjacentElement('beforeend', policityBlock);

        this.#recordSelectionData();
        this.#selectionData.forEach((item, index) => {
            let input = document.createElement('input');
            input.type = 'hidden'; input.value = item; 
            input.name = `question_${index+1}`;
            this.#form.insertAdjacentElement('beforeend', input);
        });
    }

    #recordSelectionData() {
        this.#selectionData.push(this.#mainListInstance.getTitle() + ": " + this.#mainListInstance.getValue());
        this.#selectedListInstancesArray.forEach(list => {
            this.#selectionData.push(list.getTitle() + ": " + list.getValue());
        });
    }
}

var calculator = new CalculatorModal(calcArray);
document.querySelectorAll('[data-calc]').forEach(calc => {
    calc.addEventListener('click', () => calculator.draw(document.querySelector('body'), 'beforeend'));
});