import { getData, basketAdd, basketRemove, search } from "./Core.js";
import Catalog from "./Catalog.js";
import Basket from "./Basket.js";
import CatalogSearch from "./CatalogSearch.js";

/**
 * Запуск приложения
 * @param {Object} data
 */
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
  let options = {
    title:        '*',  // любое название
    startPrice:   0,    // начальная цена
    endPrice:     '*',  // конечная цена, любая
    available:    '*'   // в наличии, любое значение
  };
  catalog.render(options);

  // Прослушка события добавления товара в карзину
  basketAdd(basket);
  // Прослушка события удаления товара из карзину
  basketRemove(basket);
  //
  search(catalog);
}

const url = 'https://bymi.ru/api/goods';
getData(url).then(data => start(data));

