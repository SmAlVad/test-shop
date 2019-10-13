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
    let basketHtl = `<div id="basket">`;

    // Если в карзине пусто, то добавляем об этом запись
    if (this.basketIsEmpty()) {
      const emptyBasketHtml = `
        <div class="basket-is-empty">
          <h3 class="text-center">В карзине пусто</h3>
        </div>
       </div>
      `;
      basketHtl += emptyBasketHtml;
    } else {
      // Иначе, отрисовываем элементы в карзине, добавляем кнопку заказать и закрывающий тэг
      basketHtl += this.htmlBasketItems();

      let totalPrice = this.htmlTotalPrice();

      basketHtl += `
          <div class="basket__total">
             ${totalPrice}
             <div class="basket-btn">Заказать</div>
          </div>
        </div>
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
      orderBtn.classList.add('basket__total');
      orderBtn.innerHTML = `
         ${this.htmlTotalPrice()}
         <div class="basket-btn">Заказать</div>
      `;
      emptyBasket[0].after(orderBtn);
      emptyBasket[0].remove();
    }

    // Сохраняем данные карзины
    this.saveBasket();
    // Обновляем представление конечной цены
    this.updateTotalPrice()
  }

  /**
   * Получение карзины из LocalStorage
   * @returns {Object}
   */
  getStorageBasket() {
    // Если карзины нет, возвращается пустой объект
    return JSON.parse(localStorage.getItem('basket')) || {}
  }

  /**
   * Удаляет товар из карзины
   * @param goodId
   */
  remove(goodId) {
    delete this.basket[goodId];
    this.saveBasket();
    this.updateTotalPrice();
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

      html += goodHtml
    }

    return html
  }

  /**
   * Возвращает html итоговой стоимости
   * @returns {string}
   */
  htmlTotalPrice() {
    let total = this.calcTotalPrice();
    return `<div class="basket__total-price">
              <h3 class="mb-0">ИТОГ</h3>
              <div class="total-price"><span class="total-price-value">${total}</span> рублей</div>
            </div>`
  }

  /**
   * Вычисляет общую стоимость
   * @returns {number}
   */
  calcTotalPrice() {
    let total = 0;
    for (let item of Object.values(this.basket)) {
      // тк данные товаров генерятся рандомно, в карзине будут старые занчения цены
      // поэтому для расчета берется актуальная цена товара
      let good = this.goods[item.id];
      total += good.price * item.quantity
    }

    return total
  }

  /**
   *  Обновляет html итоговой стоимости
   */
  updateTotalPrice() {
    let totalPrice = this.calcTotalPrice();
    let el = document.querySelector('.total-price-value');

    if (totalPrice === 0) {
      document.querySelector('.basket__total-price').remove()
    } else {
      el.innerHTML = `${totalPrice}`
    }
  }

  /**
   * Возвращает количество товара в карзине
   * @param id
   * @returns {number}
   */
  getQuantity(id) {
    return this.basket[id].quantity
  }
}
