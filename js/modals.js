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
        phoneMask();
        console.log(this.modal.clientHeight, window.innerHeight);
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

class CallModal extends Modal{
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


class CalculatorList {
    #list = document.createElement('div');
    #itemsArray = []; #itemsCount;
    #value = null; #title = "";

    constructor(listItemsArray) {
        this.#itemsCount = listItemsArray.items.length;
        this.#title = listItemsArray.title;
        this.#list.className = "calculator__main__list";
        for (let i = 0; i < this.#itemsCount; i++)
            this.#createItem(listItemsArray.items[i]);
    }

    #createItem(value) {
        let item = document.createElement('div');
        item.className = "calculator__main__list__item";

        let itemCheck = document.createElement('div');
        itemCheck.className = "calculator__main__list__item__check";
        
        let itemValue = document.createElement('p');
        itemValue.className = "calculator__main__list__item__name";
        itemValue.textContent = value;

        item.insertAdjacentElement('beforeend', itemCheck);
        item.insertAdjacentElement('beforeend', itemValue);

        this.#itemAddClickListener(item);
        this.#itemsArray.push(item);
        this.#list.insertAdjacentElement('beforeend', item);
    }

    #itemAddClickListener(item) {
        item.addEventListener('click', () => {
            this.#itemsArray.forEach(listItem => {
                listItem.classList.remove('calculator__main__list__item-active');
            });
            item.classList.add('calculator__main__list__item-active');
            this.#value = item.querySelector('.calculator__main__list__item__name').innerHTML;
        });
    }

    getList() {
        return this.#list;
    }

    getTitleText() {
        return this.#title;
    }

    getValue() {
        return this.#value;
    }
}

class Calculator {
    #window = document.createElement('div');
    #modal = document.createElement('div');
    #main = document.createElement('div');
    #mainWrap = document.createElement('div');
    #mainTitle = document.createElement('h2');
    #currentListIndex = 0; #listsArray = [];
    #btnsBlock = document.createElement('div');
    #sidebar = document.createElement('div');
    #form = document.createElement('form');
    #formOffer = document.createElement('div');
    #hiddenInputs = []; 
    #maxDiscount = 35; #stepDiscount; #discountNumElem;
    #closeBlock = createElementByHTML('div', "calculator-close modal-close", "<hr><hr>");;

    constructor(listsInfoArray) {
        for (let i = 0; i < listsInfoArray.length; i++)
            this.#listsArray.push(new CalculatorList(listsInfoArray[i]));

        this.#stepDiscount = this.#maxDiscount / this.#listsArray.length;
        this.#window.className = "calculator";
        this.#modal.className = "calculator-modal";
        this.#main.className = "calculator__main";
        this.#mainWrap.className = "calculator__main-wrap";
        this.#mainTitle.className = "calculator__main__title";
        this.#window.addEventListener('click', (e) => {
            if (e.target == this.#window || e.target == this.#closeBlock)
                this.remove();
        });
        this.#window.insertAdjacentElement('beforeend', this.#closeBlock);
        this.#main.insertAdjacentElement('beforeend', this.#mainWrap);
        this.#modal.insertAdjacentElement('beforeend', this.#main);
        this.#window.insertAdjacentElement('beforeend', this.#modal);
        this.#createBtnsBlock();
        this.#createSidebar();
        
        this.#createForm();
        this.#createFormOffer();
        
        this.#drawList();
        this.#main.insertAdjacentElement('beforeend', this.#btnsBlock);
        this.#modal.insertAdjacentElement('beforeend', this.#sidebar);
    }

    draw() {
        document.querySelector('body').insertAdjacentElement('beforeend', this.#window);
    }

    remove() {
        this.#window.remove();
    }

    #createForm() {
        this.#form.className = "calculator__sidebar__form";

        let nameBlock = createElementByHTML('div', "calculator__sidebar__form__input-block", "<span>Введите имя</span><input required type='text' name='name' placeholder='Имя'>");

        let telBlock = createElementByHTML('div', "calculator__sidebar__form__input-block", "<span>Введите телефон</span><input required type='tel' name='phone' placeholder='Введите телефон'>");

        let button = document.createElement('button');
        button.className = "calculator__sidebar__form__btn btn1";
        button.textContent = "Записаться на прием";
        button.type = "submit";

        let checkboxBlock = createElementByHTML('div', "calculator__sidebar__form__check-block check-block", "<input type='checkbox' checked name='agreement'><span>C <a href='#'>Положение об обработке персональных данных</a> и <a href='#''>Политикой конфиденциальности</a> ознакомлен и согласен</span>");

        this.#form.insertAdjacentElement('beforeend', nameBlock);
        this.#form.insertAdjacentElement('beforeend', telBlock);
        this.#form.insertAdjacentElement('beforeend', button);
        this.#form.insertAdjacentElement('beforeend', checkboxBlock);

        for (var i = 0; i < this.#listsArray.length; i++) {
            this.#hiddenInputs.push(document.createElement('input'));
            this.#hiddenInputs[i].type = 'hidden';
            this.#hiddenInputs[i].name = "list" + (i + 1);
            this.#form.insertAdjacentElement('beforeend', this.#hiddenInputs[i]);
        }
    }

    #createFormOffer() {
        this.#formOffer.className = "calculator__main__offer";

        let offerTitle = createElementByHTML('h2', "calculator__main__offer__title", "Пожалуйста, оставьте свой номер телефона, чтобы мы смогли с Вами связаться. А также ответить на другие вопросы, касаемые лечения.");

        let offerList = createElementByHTML('ul', "calculator__main__offer__desc-list", "<li>Бесплатные приемы</li><li>3D-снимок или снимок ОПТГ</li><li>План лечения И все это совершенно <b>бесплатно</b></li>");

        var offerDescs = [ document.querySelector('p'), document.createElement('p') ];
        offerDescs[0].textContent = "А также для всех жителей города действует акция на первое посещение стоматологии:";
        offerDescs.forEach(desc => {
            desc.className = "calculator__main__offer__desc";
        });
        offerDescs[1].textContent = "*Акция действует для лиц старше 30 лет";

        let offerDiscount = createElementByHTML('div', "calculator__main__offer__discount", `<span>Ваша скидка: </span><span class='calculator__main__offer__discount-num'>${this.#maxDiscount} %</span>`);

        this.#formOffer.insertAdjacentElement('beforeend', offerTitle);
        this.#formOffer.insertAdjacentElement('beforeend', offerDescs[0]);
        this.#formOffer.insertAdjacentElement('beforeend', offerList);
        this.#formOffer.insertAdjacentElement('beforeend', offerDescs[1]);
        this.#formOffer.insertAdjacentElement('beforeend', offerDiscount);
    }

    #createSidebar() {
        this.#sidebar.className = "calculator__sidebar";
        
        let discount = createElementByHTML('div', "calculator__sidebar__discount", "<span>Ваша скидка: </span>");
        this.#discountNumElem = createElementByHTML('span', "calculator__sidebar__discount-num", this.#stepDiscount*this.#currentListIndex + "%");
        
        discount.insertAdjacentElement('beforeend', this.#discountNumElem);
        discount.insertAdjacentElement('beforeend', createElementByHTML('div', "calculator__sidebar__discount-up", "<div><hr><hr></div><div><hr><hr></div>"));

        this.#sidebar.insertAdjacentElement('beforeend', discount);
    }

    #createBtnsBlock() {
        this.#btnsBlock.className = "calculator__main__btns-block";
        let btnNext = document.createElement('div');
        btnNext.className = "calculator__main__btn calculator__main__btn-next btn1";
        btnNext.textContent = "Далее";
        btnNext.addEventListener('click', () => {
            if (this.#currentListIndex < this.#listsArray.length
                && this.#listsArray[this.#currentListIndex].getValue() != null)
                    this.#switchList(1);
        });

        let btnPrev = document.createElement('div');
        btnPrev.className = "calculator__main__btn calculator__main__btn-prev btn-second1";
        btnPrev.textContent = "Назад";
        btnPrev.addEventListener('click', () => {
            if (this.#currentListIndex > 0)
                this.#switchList(-1);
        });

        this.#btnsBlock.insertAdjacentElement('beforeend', btnPrev);
        this.#btnsBlock.insertAdjacentElement('beforeend', btnNext);
    }

    #switchList(step) { // step = 1 или -1;
        if (step === 1 && this.#currentListIndex < this.#listsArray.length)
            this.#hiddenInputs[this.#currentListIndex].value = this.#listsArray[this.#currentListIndex].getValue();
        this.#mainWrap.classList.add("calculator__main-wrap-switch");
        setTimeout(() => {
            this.#clearList();
            this.#currentListIndex += step;

            if (this.#currentListIndex < 0) {
                this.#currentListIndex = 0;
            } else if (this.#currentListIndex > this.#listsArray.length-1) {
                this.#mainWrap.innerHTML = "";
                this.#sidebar.innerHTML = "";
                this.#btnsBlock.remove();
                
                this.#mainWrap.insertAdjacentElement('beforeend', this.#formOffer);
                this.#sidebar.insertAdjacentElement('beforeend', this.#form);
            } else {
                this.#drawList();
                this.#discountNumElem.innerHTML = Math.round(this.#currentListIndex * this.#stepDiscount) + "%";
            }

            this.#mainWrap.classList.remove("calculator__main-wrap-switch");
        }, 400);
    }

    #drawList() {
        this.#mainTitle.textContent = this.#listsArray[this.#currentListIndex].getTitleText();
        this.#mainWrap.insertAdjacentElement('beforeend', this.#mainTitle);
        this.#mainWrap.insertAdjacentElement('beforeend', this.#listsArray[this.#currentListIndex].getList());
    }

    #clearList() {
        this.#listsArray[this.#currentListIndex].getList().remove();
        this.#mainTitle.remove();
    }
}

var array = 
[
    {
        title: "Выберите услугу, которая Вас интересует",
        items: 
        [
            "Лечение зубов", "Удаление зубов", "Установка коронок", "Протезирование", "Имплантация", "Профессиональная гигена полости рта", "Отбеливание зубов", "Виниры и реставрация улыбки", "Детская стоматология", "Лечение десен", "Плановый осмотр стоматолога"
        ]
    },

    {
        title: "В связи с чем думаете ставить виниры/сделать эстетическую реставрацию?",
        items: 
        [
            "Хочу Голливудскую улыбку", "Откололся зуб", "Хочу скорректировать форму зубов", "Другое"
        ]
    },

    {
        title: "На какое количество зубов хотите установить виниры?",
        items: 
        [
            "1", "2", "3", "4", "5", "6 и более", "Верхние передние", "Нижние передние", "На обе челюсти", "Нужна консультация"
        ]
    },

    {
        title: "Какие виниры вы хотите?",
        items: 
        [
            "Лучшие", "Эконом", "Цена/Качество", "Накладные зубные виниры (дешевые)"
        ]
    },

    {
        title: "Когда планируете начать лечение?",
        items: 
        [
            "Как можно скорее", "В ближайшие 2 недели", "В ближайший месяц", "Через пол года и позже"
        ]
    },
];

var array1 = 
[
    {
        title: "Лечение зубов",
        lists: [
            {
                title: "Сколько зубов Вы хотите вылечить?",
                items: [
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10 и более', 'Нужна консультация'
                ]
            }
        ]
    }
];

var calculator = new Calculator(array);
document.querySelectorAll('[data-calc]').forEach(calc => {
    calc.addEventListener('click', () => calculator.draw());
    phoneMask();
});