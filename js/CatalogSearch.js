export default class CatalogSearch {

  render() {
    const searchHtml = `
      <div class="catalog-search">
        <h3 class="text-center">Поиск</h3>
        <form id="catalog-search-form" class="form">
          <div class="form-group">
            <input class="search-form-title" type="text" name="title" placeholder="Название">
          </div>

          <div class="form-group">
            <input class="search-form-start-price" type="text" name="start_price" placeholder="цена от">
            <input class="search-form-end-price" type="text" name="end_price" placeholder="цена до">
          </div>

          <div class="form-group text-center">
            <label for="search-form-available">в наличии: </label>
            <input id="search-form-available" type="checkbox" checked>
          </div>

          <div class="form-group text-center">
            <input class="search-form-submit-btn" type="submit" value="найти">
          </div>
        </form>
      </div>
    `;

    const col = document.querySelector('#right-col');
    col.innerHTML = col.innerHTML + searchHtml;
  }
}
