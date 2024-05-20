import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [TableModule, TagModule, PaginatorModule, CommonModule],
  templateUrl: './data-table.component.html',
  styles: [
    `
      :host ::ng-deep .p-inputtext {
        padding: 0.3rem 0.75rem;
        color: #5271ff;
        font-weight: bold;
      }
    `,
  ],
})
export class DataTableComponent {
  @Input() columns: any[] = [];
  @Input() invertedColors: boolean = false;
  @Input() rows: any[] = [];
  @Input() haveActions: boolean = false;
  @Input() headerAlign: string = 'left';
  @Input() tableStyle: string = 'min-width: 50rem';
  @Input() showPagination: boolean = false;
  @Input() pagination: any = { total: 0, perPage: 10, page: 1 };
  @ContentChild('actions', { static: true }) actionsTemplate!: TemplateRef<any>;
  @Output() setPagination = new EventEmitter();

  selectedOption: any = 10;
  currentPage: number = 1;
  rowsToShow: any[] = [];

  ngOnInit() {
    this.paginate();
  }

  colorTag(estado: any) {
    if (['Activo'].includes(estado)) {
      return 'success';
    }
    if (['Inactivo'].includes(estado)) {
      return 'danger';
    }
    if (['Inhabilitado'].includes(estado)) {
      return 'warning';
    }
    return 'info';
  }

  selectPerPage(event: any) {
    this.selectedOption = event.value;
    this.currentPage = 1;
    this.setPagination.emit({ page: 1, perPage: this.selectedOption });
    this.paginate();
    window.scrollTo(0, 0);
  }

  nextPage() {
    if (this.currentPage * this.pagination.perPage < this.pagination.total) {
      this.currentPage++;
    }
    this.setPagination.emit({ page: this.currentPage, perPage: this.selectedOption });
    this.paginate();
    window.scrollTo(0, 0);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.setPagination.emit({ page: this.currentPage, perPage: this.selectedOption });
    this.paginate();
    window.scrollTo(0, 0);
  }

  goToPage(page: any) {
    this.currentPage = page;
    this.setPagination.emit({ page: this.currentPage, perPage: this.selectedOption });
    this.paginate();
    window.scrollTo(0, 0);
  }

  get pageRange() {
    const total_pages = Math.ceil(this.pagination.total / this.pagination.perPage);
    const range = 5;
    let start = this.currentPage - Math.floor(range / 2);
    start = Math.max(start, 1);
    let end = start + range - 1;
    end = Math.min(end, total_pages);
    start = Math.max(end - range + 1, 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  paginate() {
    this.rowsToShow = this.rows;
  }
}
