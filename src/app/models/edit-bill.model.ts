import { Products } from "./products.mode"

export class EditBillDetail {
    billNo: number=0
    productCode: string=''
    productName:string=''
    qty: number=0
    product!: Products
    sellingPrice: number=0
    totalAmount: number=0
    isEdit: boolean = false
  }