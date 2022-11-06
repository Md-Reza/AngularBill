import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  customerForm!: FormGroup;

  actionBtn: string = "Save"

  constructor(
    private formBuilder: FormBuilder,
    private service:ServiceService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private daialogRef: MatDialogRef<AddCustomerComponent>,
    private toastr:ToastrService) {

  }

  ngOnInit(): void {
    this.customerForm = this.formBuilder.group({
      custId: [0],
      custName: ['', Validators.required],
      address: ['', Validators.required],
      mobileNo: ['', Validators.required],
    });
    if (this.editData) {
      this.actionBtn = "Update"
      this.customerForm.controls['custId'].setValue(this.editData.custId);
      this.customerForm.controls['custName'].setValue(this.editData.custName);
      this.customerForm.controls['address'].setValue(this.editData.address);
      this.customerForm.controls['mobileNo'].setValue(this.editData.mobileNo);
    }
  }
  addCustomer() {
    console.log(this.customerForm.value)
    if (!this.editData) {
      if (this.customerForm.valid) {
        this.service.postCustomerDetail(this.customerForm.value).subscribe({
          next: (res) => {
            this.toastr.success('Suceeess', "Customer Save Successfully")
            this.customerForm.reset();
            this.daialogRef.close('save');
          },
          error: () => {
            this.toastr.error('Error', "Error While adding the customer")
          }
        })
      }
    }
    else {
      this.updateCustomerDate()
    }
  }
  updateCustomerDate() {
    this.service.putCustomerData(this.customerForm.value).subscribe({
      next: (res) => {
        alert("Customer Updated Successfully");
        this.toastr.success('Suceeess', "Customer Updated Successfully");
        this.service.filter("Register Click");
        this.customerForm.reset();
        this.daialogRef.close('update');
      },
      error: () => {
        this.toastr.error('Error', "Error While adding the customer")
      }
    })
  }
}
