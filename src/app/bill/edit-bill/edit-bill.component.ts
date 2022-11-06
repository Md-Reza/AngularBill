import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Products } from 'src/app/models/products.mode';
import { ServiceService } from 'src/app/service/service.service';

export class BillDetail {
  billNo: number = 0
  productCode: string = ''
  productName: string = ''
  qty: number = 0
  product!: Products
  sellingPrice: number = 0
  totalAmount: number = 0
  isEdit: boolean = false
}

export class ItemBill {
  billNo: number = 0
}

@Component({
  selector: 'app-edit-bill',
  templateUrl: './edit-bill.component.html',
  styleUrls: ['./edit-bill.component.css']
})
export class EditBillComponent implements OnInit {

  editItemBill!: BillDetail[];
  itemBill ={} as ItemBill

  constructor(
    @Inject(MAT_DIALOG_DATA) public billNo: number,
    private service: ServiceService,
    private toastr: ToastrService,
    private daialogRef: MatDialogRef<EditBillComponent>) { }

  ngOnInit(): void {
    this.service.getBillItemEdit(this.billNo).subscribe(
      data => {
        this.editItemBill = data;
      });
      this.itemBill.billNo=this.billNo
  }

  onClose(){
    this.daialogRef.close();
    this.service.filter("Register Click");
  }

  onEdit(item: BillDetail) {
    //debugger;
    item.isEdit = true;
  }
  onSubmit(form: NgForm) {
    this.service.editBillItem(this.editItemBill).subscribe(res => {

      console.log("Final Data: " + this.service.editOrderBillItem);
      this.service.filter("Register Click");
      this.toastr.success(JSON.stringify(res.toString()), 'Message');
    })

    this.daialogRef.close();
  }

}
