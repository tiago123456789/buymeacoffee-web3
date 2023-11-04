export class PaginationDto {
  page: number;
  itemsPerPage: number;

  constructor(page: number, itemsPerPage: 10) {
    this.page = page || 1;
    this.itemsPerPage = itemsPerPage || 10;
  }

  getPage() {
    const value = (this.page - 1) * this.itemsPerPage;
    if (value < 0) {
      return 0;
    }
    return value;
  }

  getItemsPerPage() {
    return this.itemsPerPage;
  }
}
