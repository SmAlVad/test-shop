export {getData, basketAdd, basketRemove}

// Получить данные
async function getData() {
  const url = 'https://bymi.ru/api/goods';

  try {
    // На живом проекте можно, к примеру, добавить надпись, что данные загружаются
    // или gif-loader, или что дизайнер придумает
    const response = await fetch(url);
    return await response.json();
  } catch (e) {
    // В целях экономии времени
    console.log(e);
    // На живом проекте я так не сделаю
  }
}

// Обработчик события клика на кнопку "х", элемента списка товаров в карзине
function basketRemove(basket) {
  // Получаем html-коллекцию елементов
  const removeFromBasketBtns = document.querySelectorAll('.basket__item-remove');
  // Если в карзине есть товары, те количетво кнопок > 0
  if (removeFromBasketBtns.length !== 0) {
    for (let btn of removeFromBasketBtns) {
      // Добавляем прослушку события "клик"
      btn.onclick = function () {
        // Id товара
        const goodId = this.getAttribute('data-good-id');
        // Удаляем html-ноду товара в карзине из DOM
        this.parentElement.remove();
        // Удаляем товар из карзины
        basket.remove(goodId);

        // Удаляем html отображения количества товаров в списке
        let catalogBasket = document.querySelectorAll('.catalog-item__basket-good-' + goodId);
        for (let el of catalogBasket) {
          el.remove();
        }

        // Если это бы последний товар в карзине
        // то удаляем кнопку "заказать", вставляем отображение пустой карзины
        let countBtns = document.querySelectorAll('.basket__item-remove').length;
        if (countBtns === 0) {
          let orderBtn = document.getElementsByClassName('basket-btn');
          let emptyBasket = document.createElement('div');
          emptyBasket.classList.add('basket-is-empty');
          emptyBasket.innerHTML = '<h3 class="text-center">В карзине пусто</h3>';
          orderBtn[0].after(emptyBasket);
          orderBtn[0].remove();
        }
      };
    }
  }
}

// Обработчик события клика на кнопку "Добавить в карзиру"
function basketAdd(basket) {
  // Получаем html-коллекцию елементов
  const addToBasketBtns = document.querySelectorAll('.add-to-basket');
  for (let btn of addToBasketBtns) {
    // Добавляем прослушку события "клик"
    btn.onclick = function () {
      // Id товара
      const goodId = this.getAttribute('data-good-id');
      // Добавляем товар в карзину
      basket.addToBasket(goodId);

      // Если нет отображения количества товаров в карзине, то
      if (btn.nextElementSibling === null) {

        let quantity = basket.getQuantity(goodId);
        let html = `
          <span class="text-bold">Добавлено:</span>&nbsp;
          <span class="in-basket color-blue">${quantity} товаров</span>
        `;

        let el = document.createElement('div');
        el.classList.add('count-item-in-basket');
        el.classList.add(`catalog-item__basket-good-${goodId}`);
        el.innerHTML = html;
        btn.after(el);

      } else {
        // Иначе, получаем количество товара в карзине
        let quantity = basket.getQuantity(goodId);
        // Получаем ноду с количеством
        let inBasket = btn.nextElementSibling.getElementsByClassName('in-basket')[0];
        // Обновляем
        inBasket.innerHTML = `${quantity} товаров`;
      }
      // Добавляем прослушку на удаление из карзины
      basketRemove(basket);
    };
  }
}
