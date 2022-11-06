import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { StockEntry } from 'src/app/models/stock-entry.model';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-stock-entry-register',
  templateUrl: './stock-entry-register.component.html',
  styleUrls: ['./stock-entry-register.component.css']
})
export class StockEntryRegisterComponent implements OnInit {

  orderList!: StockEntry[];
  stockEnterRegister!: FormGroup;


  displayedColumns: string[] = ['billNo', 'productCode', 'productName', 'purchasePrice', 'sellingPrice', 'qty', 'totalAmount'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private service: ServiceService,
    private toastr: ToastrService) { }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 1 || date === 20 ? 'example-custom-date-class' : '';
    }

    return '';
  };

  ngOnInit(): void {
    this.stockEnterRegister = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });
  }

  refreshList(event: any) {
    var date = new Date(this.stockEnterRegister.controls['fromDate'].value);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var fromDate = yyyy + '-' + mm + '-' + dd;

    var tDate = new Date(this.stockEnterRegister.controls['toDate'].value);
    var dd = String(tDate.getDate()).padStart(2, '0');
    var mm = String(tDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = tDate.getFullYear();
    var toDate = yyyy + '-' + mm + '-' + dd;

    console.log('To Date: ' + tDate);

    this.service.getItemStockByDate(fromDate, toDate).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.toastr.error('Error', "Error was found")
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
