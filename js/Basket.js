export default class Basket {
  /**
   * В корструкторе принимаем объект с данными товаров
   * @param goods
   */
  constructor(goods) {
    // Получаем объект карзины из LocalStorage
    this.basket = this.getStorageBasket();

    this.goods = goods;
  }

  /**
   * Добавляет Html карзины в разметку правой калонки
   */
  render() {
    // Html карзины, открывающий тэг
    let basketHtl = `
    <div id="basket">
    `;

    // Если в карзине пусто, то добавляем об этом запись
    if (this.basketIsEmpty()) {
      const emptyBasketHtml = `
        <div class="basket-is-empty">
          <h3 class="text-center">В карзине пусто</h3>
        </div>
       </div>
      `;
      basketHtl = basketHtl + emptyBasketHtml;
    } else {
      // Иначе, отрисовываем элементы в карзине, добавляем кнопку заказать и закрывающий тэг
      basketHtl = basketHtl + this.htmlBasketItems();

      basketHtl = basketHtl + `
         <div class="basket-btn">Заказать</div>
        `;
    }

    // Получаем правую калонку
    const col = document.querySelector('#right-col');
    // Добавляем в нее Html карзины
    col.innerHTML = basketHtl;
  }

  /**
   * Добавляет товара в карзину
   * @param goodId
   */
  addToBasket(goodId) {
    // Получаем объект товра
    const good = this.goods[goodId];

    // Если товар уже есть в карзине
    if (this.basket[goodId] !== undefined) {
      // Увеличиваем его количество на 1
      this.basket[goodId].quantity++;
      // Получаем количество у товара в карзине
      let goodQuantity = document.getElementById(`basket-quantity-good-id-${good.id}`);
      // Обновляем отрисовку количества
      goodQuantity.innerText = parseInt(goodQuantity.innerText) + 1;

    } else {
      // Иначе добавляем товар в карзину
      this.basket[goodId] = good;
      // Присваиваем количество = 1
      this.basket[goodId].quantity = 1;

      // Html разметка товара в карзине
      const goodHtml = `
        <div class="basket__item-preview">
          <img src="${good.image}" alt="${good.title}">
        </div>
        <div class="basket__item-title">${good.title}</div>
        <div class="basket__item-quantity">
           x<span class="in-basket" id="basket-quantity-good-id-${good.id}">${good.quantity}</span>
        </div>
        <div class="basket__item-remove" data-good-id="${good.id}">x</div>
    `;

      // Создаем обертку
      const goodInBasket = document.createElement('div');
      goodInBasket.classList.add('basket__item');

      // Добавляем в обертку Html товара
      goodInBasket.innerHTML = goodHtml;

      // Получаем ноду карзины
      const basket = document.getElementById('basket');
      // Вставляем Html товара перед последним элементом
      basket.insertBefore(goodInBasket, basket.lastElementChild);
    }

    // Меняем "в карзине пусто", на кнопку "заказать"
    let emptyBasket = document.getElementsByClassName('basket-is-empty');
    if (emptyBasket.length !== 0) {
      let orderBtn = document.createElement('div');
      orderBtn.classList.add('basket-btn');
      orderBtn.innerHTML = 'заказать';
      emptyBasket[0].after(orderBtn);
      emptyBasket[0].remove();
    }

    // Сохраняем данные карзины
    this.saveBasket();
  }

  /**
   * Удаляет товар из карзины
   * @param goodId
   */
  remove(goodId) {
    delete this.basket[goodId];
    this.saveBasket();
  }

  /**
   * Сохраняем изменение карзины в LocalStorage
   */
  saveBasket() {
    localStorage.setItem('basket', JSON.stringify(this.basket));
  }

  /**
   * Проверка, не пуста ли карзина
   * @returns {boolean}
   */
  basketIsEmpty() {
    return Object.keys(this.basket).length === 0 && this.basket.constructor === Object
  }

  /**
   * Получение карзины из LocalStorage
   * @returns {Object}
   */
  getStorageBasket() {
    // Если карзины нет, возвращается пустой объект
    return JSON.parse(localStorage.getItem('basket')) || {};
  }

  /**
   * Html товаров в карзине
   * @returns {string}
   */
  htmlBasketItems(){
    let html = '';

    for (let good of Object.values(this.basket)) {
      // Html разметка товара в карзине
      const goodHtml = `
        <div class="basket__item">
          <div class="basket__item-preview">
            <img src="${good.image}" alt="${good.title}">
          </div>
          <div class="basket__item-title">${good.title}</div>
          <div class="basket__item-count">
            x<span class="in-basket" id="basket-quantity-good-id-${good.id}">${good.quantity}</span>
          </div>
          <div class="basket__item-remove" data-good-id="${good.id}">x</div>
        </div>    
      `;

      html = html + goodHtml;
    }

    return html;
  }

  /**
   * Возвращает количество товара в карзине
   * @param id
   * @returns {number}
   */
  getQuantity(id) {
    return this.basket[id].quantity;
  }
}
