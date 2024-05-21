import { Component, OnInit, signal } from '@angular/core';
import { toast } from 'ngx-sonner';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DataTableComponent } from '../../../components/data-table/data-table.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { PaginationTableOutput } from '../../../interfaces/pagination.interface';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    DataTableComponent,
    TooltipModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styles: ``,
})
export class HomeComponent implements OnInit {
  protected readonly toast = toast;

  value: string = '';
  date2: string = '';

  rows: any[] = [];

  columnas = [
    { field: 'id', header: 'ID', column_align: 'left', row_align: 'center' },
    { field: 'nombre', header: 'Nombre', column_align: 'left', row_align: 'center' },
    { field: 'apellido', header: 'Apellido', column_align: 'left', row_align: 'center' },
    { field: 'estado', header: 'Estado', column_align: 'center', row_align: 'center' },
  ];

  empleados: any = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', estado: { id: 1, nombre: 'Activo' } },
    { id: 2, nombre: 'María', apellido: 'Gómez', estado: { id: 2, nombre: 'Inactivo' } },
    { id: 3, nombre: 'Pedro', apellido: 'Martínez', estado: { id: 1, nombre: 'Activo' } },
    { id: 4, nombre: 'Ana', apellido: 'López', estado: { id: 3, nombre: 'Inhabilitado' } },
    { id: 5, nombre: 'Luis', apellido: 'Hernández', estado: { id: 1, nombre: 'Activo' } },
    { id: 6, nombre: 'Sara', apellido: 'García', estado: { id: 2, nombre: 'Inactivo' } },
    { id: 7, nombre: 'Carlos', apellido: 'Ruiz', estado: { id: 1, nombre: 'Activo' } },
    { id: 8, nombre: 'María', apellido: 'Gómez', estado: { id: 2, nombre: 'Inactivo' } },
    { id: 9, nombre: 'Laura', apellido: 'Fernández', estado: { id: 3, nombre: 'Inhabilitado' } },
    { id: 10, nombre: 'Juan', apellido: 'Pérez', estado: { id: 1, nombre: 'Activo' } },
    { id: 11, nombre: 'Juan', apellido: 'Pérez', estado: { id: 1, nombre: 'Activo' } },
    { id: 12, nombre: 'María', apellido: 'Gómez', estado: { id: 2, nombre: 'Inactivo' } },
    { id: 13, nombre: 'Pedro', apellido: 'Martínez', estado: { id: 1, nombre: 'Activo' } },
    { id: 14, nombre: 'Ana', apellido: 'López', estado: { id: 3, nombre: 'Inhabilitado' } },
    { id: 15, nombre: 'Luis', apellido: 'Hernández', estado: { id: 1, nombre: 'Activo' } },
    { id: 16, nombre: 'Sara', apellido: 'García', estado: { id: 2, nombre: 'Inactivo' } },
    { id: 17, nombre: 'Carlos', apellido: 'Ruiz', estado: { id: 1, nombre: 'Activo' } },
    { id: 18, nombre: 'Laura', apellido: 'Fernández', estado: { id: 3, nombre: 'Inhabilitado' } },
    { id: 19, nombre: 'María', apellido: 'Gómez', estado: { id: 2, nombre: 'Inactivo' } },
    { id: 21, nombre: 'Pedro', apellido: 'Martínez', estado: { id: 1, nombre: 'Activo' } },
    { id: 22, nombre: 'Ana', apellido: 'López', estado: { id: 3, nombre: 'Inhabilitado' } },
    { id: 23, nombre: 'Luis', apellido: 'Hernández', estado: { id: 1, nombre: 'Activo' } },
    { id: 24, nombre: 'Sara', apellido: 'García', estado: { id: 2, nombre: 'Inactivo' } },
    { id: 25, nombre: 'Carlos', apellido: 'Ruiz', estado: { id: 1, nombre: 'Activo' } },
    { id: 26, nombre: 'Laura', apellido: 'Fernández', estado: { id: 3, nombre: 'Inhabilitado' } },
  ];
  pagination = {
    total: this.empleados.length,
    perPage: signal(10),
    page: signal(1),
  };

  getData = (): void => {
    const startIndex = (this.pagination.page() - 1) * this.pagination.perPage();
    const endIndex = startIndex + this.pagination.perPage();
    this.rows = this.empleados.slice(startIndex, endIndex);
  };

  acciones = [
    {
      label: 'Visualizar',
      icon: 'visibility',
      permiso: true,
      onClick: (value: any) => {
        console.log('Visualizar:', value);
      },
    },
    {
      label: 'Editar',
      icon: 'edit',
      permiso: true,
      onClick: (value: any) => {
        console.log('Editar:', value);
      },
    },
    {
      label: 'Eliminar',
      icon: 'delete',
      permiso: true,
      onClick: (value: any) => {
        console.log('Eliminar:', value);
      },
    },
  ];

  paginatePage(pag: PaginationTableOutput) {
    this.pagination.page.set(pag.page);
    this.pagination.perPage.set(pag.perPage);
    console.log('Paginate page:', pag);
    this.getData();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getData();
  }
}
