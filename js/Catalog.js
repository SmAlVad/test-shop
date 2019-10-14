export default class Catalog {
  /**
   * @param data
   * @param basket
   */
  constructor(data, basket) {
    this.data = data;
    this.basket = basket;
    this.itemPerPage = 5;
  }

  /**
   * Добавляет Html разметку каталога товаров
   * @param {Object} options
   */
  render(options) {

    const data = this.getData(options);

    document.querySelector('#catalog').innerHTML = '';
    let pagination = document.querySelector('.pagination-wrapper');
    if (pagination) {
      pagination.remove()
    }

    this.pagination(data);
  }

  /**
   * Получить данные
   * @param {Object} options
   */
  getData(options) {
    const title       = options.title;        // Название товара
    const startPrice  = options.startPrice;   // Начальная цена
    const endPrice    = options.endPrice;     // Конечная цена
    const available   = options.available;    // Есть в насичии

    // Фильтруем данные по параметрам
    return  Object.values(this.data).filter(function (el) {

      if (title !== '*') {
        if (!el.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())) return false
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
  pagination(data) {

    localStorage.setItem('catalogList', JSON.stringify(data));

    let lastLink = Math.ceil(data.length / this.itemPerPage);

   //  let htmlPagination =  `
   //    <ul class="pagination">
   //      <li class="page-item page-prev page-disable"> < </li>
   //      <li class="page-item page-link page-item-active">1</li>
   //      <li class="page-item page-link">2</li>
   //      <li class="page-item page-link">3</li>
   //      <li class="page-item"> ... </li>
   //      <li class="page-item page-link last-link">${lastLink}</li>
   //      <li class="page-item page-next"> > </li>
   //    </ul>
   // `;

    //let catalogHtml = this.htmlCatalog(data);

    let  htmlPagination = '<ul class="pagination">';

      for (let i = 1; i <= lastLink; i++) {
        let li = `<li class="page-item page-link">${i}</li>`;
        htmlPagination += li;
      }

      htmlPagination += '</ul>';

    const app = document.getElementById('app');

    let pagination = document.createElement('div');
    pagination.classList.add('pagination-wrapper');
    pagination.innerHTML = htmlPagination;

    app.append(pagination);

    pagination.addEventListener('click', this.paginatorHandler.bind(this));

    document.querySelector('.page-link').click();
  }

  /**
   * Проверка, есть ли товар в карзине
   * @param id
   * @returns {boolean}
   */
  inBasket(id) {
    return typeof this.basket.basket[id] !== "undefined";
  }

  /**
   * Html одной страницы каталога
   * @param data
   * @returns {string}
   */
  htmlCatalog(data) {
    // Html каталога
    let catalogHtml = '';

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
    return catalogHtml
  }

  paginatorHandler(event) {
    const data = JSON.parse(localStorage.getItem('catalogList'));
    const el = event.target;

    if (el.classList.contains('page-link')) {
      let active = document.querySelector('.page-item-active');

      if (active) {
        active.classList.remove('page-item-active');
      }

      el.classList.add('page-item-active');

      let pageNam = +el.innerHTML;

      let start = (pageNam - 1) * this.itemPerPage;
      let end = start + this.itemPerPage;
      let list = data.slice(start, end);
      list = this.htmlCatalog(list);

      let catalog = document.querySelector('#catalog');
      catalog.innerHTML = list;
    }
  }
}
