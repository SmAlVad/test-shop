export default class Catalog {
  // @param data Obj данные товаров
  // @param basket Obj карзина
  constructor(data, basket) {
    this.data = data;
    this.basket = basket;
  }

  // Получить товар
  getGood(id) {
    return this.data[id];
  }

  // Добавляет Html разметку каталога товаров
  render() {
    // Html каталога
    let catalogHtml = '';

    // Для каждого товара
    for (let item of Object.values(this.data)) {
      // Html товара с открывающим тэгом
      let elementHtml = `
        <div class="catalog-item">
          <div class="catalog-item__preview-img"><img src="${item.image}" alt="${item.title}"></div>

          <div class="catalog-item__info">
            <h2 class="catalog-item__info-title">${item.title}</h2>
            <div class="catalog-item__info-price">${item.price} рублей</div>
            <div class="catalog-item__info-desc">${item.descr}</div>
          </div>
        `;

      // Html количества товаров с карзини и кнопка добавить
      let catalogBasketHtml = '';
      // Если товар есть в наличии, отображаем кнопку добавить в карзину
      if (this.goodIsAvailable(item)) {
        catalogBasketHtml = `    
          <div class="catalog-item__basket">
            <div class="catalog-btn add-to-basket" data-good-id="${item.id}">Добавить в карзину</div>
        `;
      } else {
        // иначе, показываем что товара нет в наличии
        catalogBasketHtml = `
          <div class="catalog-item__basket">
            <h4 class="catalog-item__not-available">нет в наличии</h4>
        `;
      }

      if (this.isItemInBasket(item.id)) {
        let quantity = this.basket.getQuantity(item.id);
        let catalogItemBasketQuantity = `
            <div class="count-item-in-basket" id="catalog-item__basket-good-${item.id}">
              <span class="text-bold">Добавлено:</span>&nbsp;
              <span class="in-basket color-blue">${quantity} товаров</span>
            </div>
        `;

        catalogBasketHtml = catalogBasketHtml + catalogItemBasketQuantity;
      }

      // закрывающий тег catalog-item__basket
      catalogBasketHtml = catalogBasketHtml + '</div>';

      // добавление блока "добавить в карзину"
      elementHtml = elementHtml + catalogBasketHtml;
      // закрывающий тег
      elementHtml = elementHtml + '</div>';
      // добавление товара в общий список
      catalogHtml = catalogHtml + elementHtml;
    }

    catalogHtml = catalogHtml + this.pagination();

    const catalog = document.getElementById('catalog');
    catalog.innerHTML = catalogHtml;
  }

  // Возвращает ноду с количеством товара в карзине
  // @id string id товара в карзине
  nodeQuantity(id) {
    let quantity = this.basket.getQuantity(id);
    let html = `
        <span class="text-bold">Добавлено:</span>&nbsp;
        <span class="in-basket color-blue">${quantity} товаров</span>
     `;

    let el = document.createElement('div');
    el.classList.add('count-item-in-basket');
    el.id = `catalog-item__basket-good-${id}`;
    el.innerHTML = html;

    return el;
  }

  pagination() {
    return `
     <div class="pagination-wrapper">
      <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#">Previous</a></li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">...</a></li>
        <li class="page-item"><a class="page-link" href="#">14</a></li>
        <li class="page-item"><a class="page-link" href="#">Next</a></li>
      </ul>
    </div>
   `
  }

  goodIsAvailable(good) {
    return good.available;
  }

  isItemInBasket(id) {
    return typeof this.basket.basket[id] !== "undefined";
  }
}