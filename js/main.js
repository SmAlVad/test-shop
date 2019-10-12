import { getData, basketAdd, basketRemove } from "./Core.js";
import Catalog from "./Catalog.js";
import Basket from "./Basket.js";
import CatalogSearch from "./CatalogSearch.js";

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
  basketAdd(basket);
  // Прослушка события удаления товара из карзину
  basketRemove(basket);
}

getData().then(data => start(data));

