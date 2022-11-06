import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BillHeader } from '../models/billheader.model';
import { ServiceService } from '../service/service.service';
import { EditBillComponent } from './edit-bill/edit-bill.component';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {

  orderList: BillHeader[] | undefined;
  //detailOrderList:BillDetail;

  displayedColumns: string[] = ['billNo', 'custName', 'totalAmount', 'payAmount', 'returnAmount', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: ServiceService,
    private router: Router,
    private dialog: MatDialog,
    private toastr: ToastrService) { 
      this.service.listen().subscribe((m:any)=>{
        console.log(m);
        this.refreshList();
      })
    }

  ngOnInit(): void {
    this.refreshList();
  }

  openForEdit(orderID: number) {
    //this.router.navigate(['/order/edit/' + orderID]);
  }
  // refreshList() {
  //   console.log(this.service.getOrderList().then(res => this.orderList = res as BillHeader[]));
  //   this.service.getOrderList().then(res => this.orderList = res as BillHeader[]);
  // }

  refreshList() {
    this.service.getOrderList().subscribe({
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

  onOrderDelete(id: number) {
    if (confirm('Are you sure to delete this record?')) {
      // this.service.deleteOrder(id).then(res => {
      //   this.refreshList();
      //   this.toastr.warning("Deleted Successfully", "Restaurent App.");
      // });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteBill(billNo: number) {
    this.service.deleteOrderList(billNo).subscribe(res => {
      this.refreshList();
      this.toastr.success('Bill has been deleted', 'Message');
    })
  }

  editBill(billNo: number) {
    this.dialog.open(EditBillComponent, {
      width: '70%',
      disableClose: false,
      data: billNo
    })
  }

}
