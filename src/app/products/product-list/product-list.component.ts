import { Component, OnInit, ViewChild } from '@angular/core';
import { AddItemComponent } from '../add-item/add-item.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/service/service.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  itemsColumns: string[] = ['productCode', 'productName', 'purchasePrice','sellingPrice','reorderLevel','mou','createDate', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ServiceService,
    private toastr:ToastrService) {
      this.api.listen().subscribe((m:any)=>{
        this.refreshList();
      })
  }
  ngOnInit(): void {
    this.refreshList();
  }
  
  openItemDialog() {
    this.dialog.open(AddItemComponent, {
      width: '35%',
    });
  }


  refreshList() {
    this.api.getAllItems().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        this.toastr.error('Error', "Error While adding the Items")
      }
    })
  }

  editItem(row:any) {
    this.dialog.open(AddItemComponent, {
      width: '40%',
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
