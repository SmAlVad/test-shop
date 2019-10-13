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
   * @param {Object} options
   */
  render(options) {
    // Html каталога
    let catalogHtml = '';

    const data = this.getData(options);

    // Для каждого товара
    for (let item of data) {
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

      // Если товар есть в карзине
      if (this.inBasket(item.id)) {
        // Получаем его количество
        let quantity = this.basket.getQuantity(item.id);

        let catalogItemBasketQuantity = `
            <div class="count-item-in-basket catalog-item__basket-good-${item.id}">
              <span class="text-bold">Добавлено:</span>&nbsp;
              <span class="in-basket color-blue">${quantity} товаров</span>
            </div>
        `;

        // Добавляем html количества товара в карзине
        catalogBasketHtml += catalogItemBasketQuantity;
      }

      // закрывающий тег catalog-item__basket
      catalogBasketHtml += '</div>';

      // добавление блока "добавить в карзину"
      elementHtml += catalogBasketHtml;
      // закрывающий тег
      elementHtml += '</div>';
      // добавление товара в общий список
      catalogHtml += elementHtml;
    }

    // Добавление html пагенации
    catalogHtml += this.pagination();

    const catalog = document.getElementById('catalog');
    catalog.innerHTML = catalogHtml;
  }

  /**
   *
   * @param {Object} options
   */
  getData(options) {
    const title = options.title;
    const startPrice = options.startPrice;
    const endPrice = options.endPrice;
    const available = options.available;

    return  Object.values(this.data).filter(function (el) {

      if (title !== '*') {
        if (!el.title.toLocaleLowerCase().includes(title)) return false
      }

      if (startPrice >= 0) {
        if (el.price < startPrice) return false
      }

      if (endPrice !== '*') {
        if (el.price > endPrice) return false
      }

      if (available !== '*') {
        if (el.available !== available) return false
      }

      return true
    });
  }

  /**
   * Html пагенации
   * @returns {string}
   */
  pagination() {
    return `
     <div class="pagination-wrapper">
      <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#"> < </a></li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">...</a></li>
        <li class="page-item"><a class="page-link" href="#">14</a></li>
        <li class="page-item"><a class="page-link" href="#"> > </a></li>
      </ul>
    </div>
   `
  }

  /**
   * Проверка, есть ли товар в карзине
   * @param id
   * @returns {boolean}
   */
  inBasket(id) {
    return typeof this.basket.basket[id] !== "undefined";
  }
}
