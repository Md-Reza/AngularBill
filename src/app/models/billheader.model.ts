import { Customer } from "./customer.model";

export class BillHeader {
    billNo!:number;
    custId!:string;
    customer!:Customer;
    pMethod!: string;
    payAmount!:number;
    returnAmount!:number;
    totalQty!:number;
    totalAmount!:number;
}