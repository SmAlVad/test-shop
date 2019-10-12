export default class Catalog {
  /**
   * @param data
   * @param basket
   */
  constructor(data, basket) {
    this.data = data;
    this.basket = basket;
  }

  /**
   * Добавляет Html разметку каталога товаров
   */
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
      if (item.available) {
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

      if (this.inBasket(item.id)) {
        let quantity = this.basket.getQuantity(item.id);
        let catalogItemBasketQuantity = `
            <div class="count-item-in-basket catalog-item__basket-good-${item.id}">
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

  /**
   *
   * @returns {string}
   */
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

  /**
   *
   * @param id
   * @returns {boolean}
   */
  inBasket(id) {
    return typeof this.basket.basket[id] !== "undefined";
  }
}
