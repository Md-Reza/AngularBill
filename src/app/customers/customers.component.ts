import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../service/service.service';
import { AddCustomerComponent } from './add-customer/add-customer.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  displayedColumns: string[] = ['custId', 'custName', 'address', 'mobileNo', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, 
    private service:ServiceService,
    private toastr: ToastrService) {
      this.service.listen().subscribe((any:any)=>{
        this.refreshList();
      })
  }
  ngOnInit(): void {
    this.refreshList();
  }

  openDialog() {
    this.dialog.open(AddCustomerComponent, {
      width: '30%'
    });
  }

  refreshList() {
    this.service.getCustomerData().subscribe({
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

  editCustomer(row:any) {
    this.dialog.open(AddCustomerComponent, {
      width: '30%',
      data: row
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
