import Catalog from "./Catalog.js";
import Basket from "./Basket.js";
import CatalogSearch from "./CatalogSearch.js";

// Получить данные
async function getData() {
  const url = 'https://bymi.ru/api/goods';

  try {
    // На живом проекте можно, к примеру, добавить надпись, что данные загружаются
    // или gif-loader, или что дизайнер придумает
    const response = await fetch(url);
    return  await response.json();
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
      btn.addEventListener('click', function () {
        // Id товара
        const goodId = this.getAttribute('data-good-id');
        // Удаляем html-ноду товара в карзине из DOM
        this.parentElement.remove();
        // Удаляем товар из карзины
        basket.remove(goodId);
        // Удаляем html-ноду отображения количества товаров в списке
        document.getElementById('catalog-item__basket-good-' + goodId).remove();
      });
    }
  }
}

// Обработчик события клика на кнопку "Добавить в карзиру"
function basketAdd(basket, catalog) {
  // Получаем html-коллекцию елементов
  const addToBasketBtns = document.querySelectorAll('.add-to-basket');
  for (let btn of addToBasketBtns) {
    // Добавляем прослушку события "клик"
    btn.addEventListener('click', function () {
      // Id товара
      const goodId = this.getAttribute('data-good-id');
      // Добавляем товар в карзину
      basket.addToBasket(goodId);

      // Если нет отображения количества товаров в карзине, то
      if (btn.nextElementSibling === null) {
        // Вставляем html-ноду после этой кнопки
        btn.after(catalog.nodeQuantity(goodId));
      } else {
        // Иначе, получаем количество товара в карзине
        let quantity = basket.basket[goodId].quantity;
        // Получаем ноду с количеством
        let inBasket = btn.nextElementSibling.getElementsByClassName('in-basket')[0];
        // Обновляем
        inBasket.innerHTML = `${quantity} товаров`;
      }
      // Добавляем прослушку на удаление из карзины
      basketRemove(basket);
    });
  }
}

// Запуск приложения
function start(data){
  // Карзина
  const basket = new Basket(data);
  // Каталог
  const catalog = new Catalog(data, basket);
  // Поиск
  const catalogSearch = new CatalogSearch();

  // Отрисовка карзины
  basket.render();
  // Отрисовка поиска
  catalogSearch.render();
  // Отрисовка списка товаров с пагинацией
  catalog.render();

  // Прослушка события добавления товара в карзину
  basketAdd(basket, catalog);
  // Прослушка события удаления товара из карзину
  basketRemove(basket);
}

getData().then(data => start(data));

