import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BillDetail } from 'src/app/models/billdetail.mode';
import { Products } from 'src/app/models/products.mode';
import { Stock } from 'src/app/models/stock.model';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-billdetail',
  templateUrl: './billdetail.component.html',
  styleUrls: ['./billdetail.component.css']
})
export class BilldetailComponent implements OnInit {
  formData!: BillDetail;
  itemList!: Products[];
  currentStock:any={} as Stock;
  isValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BilldetailComponent>,
    private toastr: ToastrService,
    private orderSevice: ServiceService) { }

  ngOnInit() {
    this.orderSevice.getAllItems().subscribe(res => this.itemList = res as Products[]);
    console.log('Seq: ' + this.itemList);
    if (this.data.orderItemIndex == null)
      this.formData = {
        billDetId: 0,
        billNo: this.data.billNo,
        productCode: '',
        productName: '',
        sellingPrice: 0,
        qty: 0,
        mou: '',
        totalAmount: 0,
        stockQty: 0
      }
    else
      this.formData = Object.assign({}, this.orderSevice.orderItems[this.data.orderItemIndex]);
  }

  validationQty() {
    if (this.formData.qty < 0) {
      this.toastr.error('Negetive value not allow', 'Restaurent App.');
      return;
    }
  }

  updatePrice(ctrl: any) {
    if (this.formData.qty < 0) {
      this.toastr.error('Negetive value not allow', 'Error Message.');
      return;
    }

    if (ctrl.selectedIndex == 0) {
      this.formData.sellingPrice = 0;
      this.formData.productName = '';
      this.formData.mou = '';
      this.formData.stockQty = 0;
    }
    else {
      // this.currentStock == null
      // this.formData.stockQty = 0
      // const stkValue = this.service.getItemStockByCode(this.formData.productCode.toString()).subscribe((res:any) => this.currentStock = res as Stock);
      this.formData.sellingPrice = this.itemList[ctrl.selectedIndex - 1].sellingPrice;
      this.formData.productName = this.itemList[ctrl.selectedIndex - 1].productName;
      this.formData.mou = this.itemList[ctrl.selectedIndex - 1].mou;
      // if (stkValue == null && stkValue == 0) {
      //   this.formData.stockQty = 0;
      // } else
      // this.formData.stockQty=this.currentStock[0].stockQty;
    }
    this.updateTotal();
  }




  updateTotal() {
    if (parseFloat((Number(this.formData.qty) * this.formData.sellingPrice).toFixed(2)) < 0) {
      this.toastr.error('Negetive value not allow', 'Restaurent App.');
      return;
    }
    this.formData.totalAmount = parseFloat((Number(this.formData.qty) * this.formData.sellingPrice).toFixed(2));
  }


  onSubmit(form: NgForm) {
    if (parseFloat((Number(this.formData.qty) * this.formData.sellingPrice).toFixed(2)) < 0) {
      this.toastr.error('Negetive value not allow', 'Restaurent App.');
      return;
    }
    // if (this.formData.stockQty < this.formData.qty) {
    //   this.toastr.error('No available qty for this item', 'Error Message.');
    //   return;
    // }

    if (this.validateForm(form.value)) {
      if (this.data.orderItemIndex == null) {
        this.orderSevice.orderItems.push(form.value);
      }
      else
        this.orderSevice.orderItems[this.data.orderItemIndex] = form.value;
      this.dialogRef.close();
    }
  }

  validateForm(formData: BillDetail) {
    this.isValid = true;
    if (formData.productCode == '')
      this.isValid = false;
    else if (Number(formData.qty) == 0)
      this.isValid = false;
    return this.isValid;
  }
}
