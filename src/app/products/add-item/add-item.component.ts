import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from 'src/app/service/service.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpRequest } from '@angular/common/http';
import { Products } from 'src/app/models/products.mode';

interface MOU {
  value: string;
  mouName: string;
}

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {

  itemForm!: FormGroup;
  selectedValue!: string;

  items = new Products();

  actionBtn: string = "Save"

  mous: MOU[] = [
    { value: 'PC', mouName: 'PC' },
    { value: 'KG', mouName: 'KG' },
    { value: 'BOX', mouName: 'BOX' },
  ];

  imageUrl: string = "/assets/image/default-image.png";

  fileToUpload!: File;


  progress!: number;
  message!: string;

  working = false;
  uploadFile!: File | null;
  uploadFileLabel: string | undefined = 'Choose an image to upload';
  uploadProgress!: number;
  uploadUrl!: string;


  @Output() public onUploadFinished = new EventEmitter();

  isCreate!: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private api: ServiceService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private daialogRef: MatDialogRef<AddItemComponent>,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.isCreate = true
    this.itemForm = this.formBuilder.group({
      productCode: [''],
      productName: ['', Validators.required],
      purchasePrice: ['', Validators.required],
      sellingPrice: ['', Validators.required],
      reorderLevel: ['', Validators.required],
      imageName: ['', Validators.required],
      mou: ['', Validators.required],
      file: ['', Validators.required],
    });
    if (this.editData) {
      this.actionBtn = "Update"
      this.itemForm.controls['productCode'].setValue(this.editData.productCode);
      this.itemForm.controls['productName'].setValue(this.editData.productName);
      this.itemForm.controls['purchasePrice'].setValue(this.editData.purchasePrice);
      this.itemForm.controls['sellingPrice'].setValue(this.editData.sellingPrice);
      this.itemForm.controls['reorderLevel'].setValue(this.editData.reorderLavel);
      this.itemForm.controls['mou'].setValue(this.editData.mou);
      this.itemForm.controls['imageName'].setValue(this.editData.imageName);
    }
  }

  getData() {
    return this.api.getSequenceByCode("Code");
  }


  handleFileInput(files: FileList) {
    if (files.length > 0) {
      this.uploadFile = files.item(0);
      this.uploadFileLabel = this.uploadFile?.name;
    }
  }

  upload() {
    if (!this.uploadFile) {
      alert('Choose a file to upload first');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.uploadFile, this.uploadFile.name);

    const url = `${this.api.baseURL}Product/upload/`;
    const uploadReq = new HttpRequest('POST', url, formData, {
      reportProgress: true,
    });

    this.uploadUrl = '';
    this.uploadProgress = 0;
    this.working = true;

    this.http.request(uploadReq).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round((100 * event.loaded) / event.total);
      } else if (event.type === HttpEventType.Response) {
        this.uploadUrl = event.body.url;
      }
    }, (error: any) => {
      console.error(error);
    }).add(() => {
      this.working = false;
    });

  }


  selectFile(event: any) {
    this.fileToUpload = <File>event.target.files[0];
    //Show image preview
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    console.log(this.fileToUpload);
    reader.readAsDataURL(this.fileToUpload);
  }

  onFileChanged(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.itemForm = file.name;
      this.itemForm.patchValue({
        file: file,
      });
    }
  }

  addItem(form: any) {
    if (!this.uploadFile) {
      alert('Choose a file to upload first');
      return;
    }
    if (!this.editData) {
        const formData = new FormData();
        formData.append('file', this.uploadFile, this.uploadFile.name);
        const url = `${this.api.baseURL}Product/upload`;
        const uploadReq = new HttpRequest('POST', url, formData, {
          reportProgress: true,
        });
        this.api.postProductItems(this.itemForm.value).subscribe({
          next: (res) => {
            this.toastr.success('Success', JSON.stringify(res).toString())
            this.itemForm.reset();
            this.daialogRef.close('save');
            this.getData()
          },
          error: () => {
            this.toastr.error('Error', "Error While adding the Item")
          }
        })
        this.uploadUrl = '';
        this.uploadProgress = 0;
        this.working = true;
        this.http.request(uploadReq).subscribe((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.uploadUrl = event.body.url;
          }
        }, (error: any) => {
          console.error(error);
        }).add(() => {
          this.working = false;
        });
    }
  }

}
