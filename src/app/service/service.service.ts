import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { BillDetail } from "../models/billdetail.mode";
import { BillHeader } from "../models/billheader.model";
import { EditBillDetail } from "../models/edit-bill.model";

@Injectable({
    providedIn: 'root'
})
export class ServiceService {

    formData!: BillHeader;
    orderItems!: BillDetail[];
    itemStock: any = [];
    errorMessage: any;
    editOrderBillItem!: BillDetail[];

    //formData: { OrderID: null; OrderNo: string; CustomerID: number; PMethod: string; GTotal: number; DeletedOrderItemIDs: string; };
    
    constructor(
        private http: HttpClient) {
    }

    public readonly baseURL = 'https://localhost:44380/';


    saveOrUpdateOrder() {
        var body = {
            ...this.formData,
            OrderItems: this.orderItems
        };
        console.log(body);
        return this.http.post(this.baseURL + 'Bill/CreateBill', body, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
    }

    saveItemStock() {
        return this.http.post(this.baseURL + 'ItemStock/CreateStock', this.itemStock, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
    }

    //edit bill/invoice items
    editBillItem(item: EditBillDetail[]) {
        return this.http.post(this.baseURL + 'Bill/UpdateBill', item, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
    }

    //Refresh after update Bill/Order Item

    _listners = new Subject<any>();
    listen(): Observable<any> {
        return this._listners.asObservable();
    }
    filter(filterBy: string) {
        this._listners.next(filterBy);
    }

    getOrderList() {
        return this.http.get<any>(this.baseURL + 'Bill/GetAllBill', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
    }

    deleteOrderList(billNo: number) {
        return this.http.delete<any>(this.baseURL + 'Bill/DeleteBill/' + billNo, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
    }

    getOrderByID(id: number): any {
        return this.http.get(this.baseURL + 'Bill/GetAllBill/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).toPromise();
    }

    deleteOrder(id: number) {
        //return this.http.delete(environment.apiURL + '/Order/'+id).toPromise();
    }

    getCustomerList() {
        return this.http.get(this.baseURL + "Customer/GetAllCustomers", {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).toPromise();
    }

    getCustomerData() {
        return this.http.get<any>(this.baseURL + "Customer/GetAllCustomers", {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
    }

    getCurrentStock() {
        return this.http.get<any>(this.baseURL + "ItemStock/GetAllCurrentStock", {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
    }

    getBillItemEdit(billNo: number) {
        return this.http.get<any>(this.baseURL + "Bill/GetAllBillDetailByBillNo/" + billNo, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
    }

    getItemStockByCode(productCode: string) {
        return this.http.get<any>(this.baseURL + "ItemStock/GetAllCurrentStockByCode/" + productCode, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        });
    }

    getItemStockByDate(fromDate: string, todate: string) {
        return this.http.get<any>(this.baseURL + "ItemStock/GetItemStockByDate/" + fromDate + '/' + todate, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
    }

    getGetAllDashboardSaleByDate() {
        return this.http.get<any>(this.baseURL + "Dashboard/GetAllSaleByDate", {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
    }
    getAllTopSaleByProduct() {
        return this.http.get<any>(this.baseURL + "Dashboard/GetAllToSaleByProduct", {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
    }

    readonly postBaseUrl = this.baseURL+'Customer/CreateCustomer';

  
    getSequenceByCode(data:any){
      return this.http.get<any>(this.baseURL+"Sequence/GetSequenceById/"+data,{
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }})
    }
  
    postCustomerDetail(data:any) {
      return this.http.post<any>(this.baseURL+"Customer/CreateCustomer",data,{
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }});
    }
  
    putCustomerData(data:any){
      return this.http.put<any>(this.baseURL+"Customer/UpdateCustomer",data,{
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }})
    }
  
    getAllItems(){
      return this.http.get<any>(this.baseURL+"Product/GetAllProducts",{
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }})
    }
  
    postProductItems(data:any) {
      return this.http.post(this.baseURL+"Product/CreateProduct",data,{
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }});
    }
  
     getItemStockQty(id:any){
      return this.http.get<any>(this.baseURL+'ItemStock/GetItemStock/'+id,{
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }});
     }
}