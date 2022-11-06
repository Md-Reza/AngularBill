import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Products } from '../models/products.mode';
import { StockEntry } from '../models/stock-entry.model';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-stock-entry',
  templateUrl: './stock-entry.component.html',
  styleUrls: ['./stock-entry.component.css']
})
export class StockEntryComponent implements OnInit {

  itemList!: Products[];
  items!: Products;
  isValid: boolean = true;
  stokEntryFormData!: StockEntry;
  orderItems: any = [];
  itemStockQty: any = StockEntry;

  constructor(
   private service: ServiceService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.service.getAllItems().subscribe((res: any[]) => this.itemList = res as Products[]);
    //this.api.getItemStockQty(this.stokEntryFormData.productCode.toString()).subscribe((res: any) => this.itemStockQty = res as StockEntry);
    if (this.stokEntryFormData == null)

      this.stokEntryFormData = {
        billNo: 0,
        productCode: '',
        productName: '',
        purchasePrice: 0,
        sellingPrice: 0,
        qty: 0,
        mou: '',
        totalAmount: 0,
        stockQty: 0
      }
  }

  resetForm(form?: NgForm) {
    if (form != null)
      this.resetForm();
    this.orderItems = {
      billNo: 0,
      productCode: '',
      productName: '',
      purchasePrice: 0,
      sellingPrice: 0,
      qty: 0,
      mou: '',
      totalAmount: 0,
    };
    this.stokEntryFormData.billNo = 0,
    this.service.itemStock = [];
    this.orderItems = [];
    this.stokEntryFormData.sellingPrice = 0;
    this.stokEntryFormData.totalAmount = 0;
    this.stokEntryFormData.mou = '';
    this.stokEntryFormData.purchasePrice = 0;
  }

  updatePrice(ctrl: any) {
    if (this.stokEntryFormData.qty < 0) {
      this.toastr.error('Negetive value not allow', 'App');
      return;
    }

    if (ctrl.selectedIndex == 0) {
      this.stokEntryFormData.sellingPrice = 0;
      this.stokEntryFormData.purchasePrice = 0;
      this.stokEntryFormData.productName = '';
      this.stokEntryFormData.mou = '';
    }
    else {
      this.stokEntryFormData.sellingPrice = this.itemList[ctrl.selectedIndex - 1].sellingPrice;
      this.stokEntryFormData.purchasePrice = this.itemList[ctrl.selectedIndex - 1].purchasePrice;
      this.stokEntryFormData.productName = this.itemList[ctrl.selectedIndex - 1].productName;
      this.stokEntryFormData.mou = this.itemList[ctrl.selectedIndex - 1].mou;
      this.stokEntryFormData.stockQty = this.itemStockQty.stockQty;
    }
    //this.updateTotal();
  }

  updateTotal() {
    if (parseFloat((Number(this.stokEntryFormData.qty) * this.stokEntryFormData.sellingPrice).toFixed(2)) < 0) {
      this.toastr.error('Negetive value not allow', 'App.');
      return;
    }
    this.stokEntryFormData.totalAmount = parseFloat((Number(this.stokEntryFormData.qty) * this.stokEntryFormData.purchasePrice).toFixed(2));
  }

  onSubmit(form: NgForm ) {

    if (parseFloat((Number(this.stokEntryFormData.qty) * this.stokEntryFormData.sellingPrice).toFixed(2)) <= 0) {
      this.toastr.error('Negetive or Zero value not allow', 'Message');
      return;
    }

    const found = this.orderItems.find((element: any) => {
      return element.productCode.toLowerCase() === form.value.productCode.toLowerCase();
    });

    if (found !== undefined) {
      this.toastr.error('Already Added this item', 'Message');
      return;
    } else {
      this.orderItems.push(form.value);
      this.service.itemStock.push(form.value);
    }

    this.service.getItemStockQty(form.value.productCode).subscribe((res: any) => this.itemStockQty = res as StockEntry);


    this.stokEntryFormData.stockQty = this.itemStockQty.stockQty;

    console.log(this.stokEntryFormData.stockQty);

    this.updateTotal();
    this.stokEntryFormData.qty= 0;
  }

  onDeleteOrderItem(orderItemID: number, i: number) {
    if (orderItemID != null)
      this.orderItems.splice(i, 1);
    this.service.itemStock.splice(i, 1);
    this.updateTotal();
  }

  validateForm(formData: StockEntry) {
    this.isValid = true;
    if (formData.productCode == '')
      this.isValid = false;
    else if (Number(formData.qty) == 0)
      this.isValid = false;
    return this.isValid;
  }

  saveItemStock() {
    this.service.saveItemStock().subscribe((res:any) => {
      this.resetForm();
      this.toastr.success(JSON.stringify(res.toString()), 'Message');
      this.router.navigate(['/stock-list']);
    })
  }

}
