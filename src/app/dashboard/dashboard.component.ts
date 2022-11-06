import { Component, OnInit } from '@angular/core';
import { Chart,registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../service/service.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public service: ServiceService,
    private toastr: ToastrService) { }

  chartdata: any;
  topSaleChartdata: any;
  labeldata: any[] = [];
  realdata: any[] = [];
  colordata: any[] = [];

  topProductlabeldata: any[] = [];
  topProductrealdata: any[] = [];
  topProductcolordata: any[] = [];


  ngOnInit(): void {
    this.getAllDashboardByDate();
    this.getAllTopSaleByProduct();
  }

  getAllDashboardByDate() {
    this.service.getGetAllDashboardSaleByDate().subscribe({
      next: (res) => {
        this.chartdata = res;
        if (this.chartdata != null) {
          for (let i = 0; i < this.chartdata.length; i++) {
            //console.log(this.chartdata[i]);
            this.labeldata.push(this.chartdata[i].billDate);
            this.realdata.push(this.chartdata[i].totalAmount);
            this.colordata.push(this.chartdata[i].colorcode);
          }
          this.RenderChart(this.labeldata, this.realdata, this.colordata, 'bar', 'barchart');
          this.RenderChart(this.labeldata, this.realdata, this.colordata, 'pie', 'piechart');
        }
      },
      error: (err) => {
        this.toastr.error('Error', "Error was found")
      }
    })
  }

  getAllTopSaleByProduct() {
    this.service.getAllTopSaleByProduct().subscribe({
      next: (res) => {
        this.topSaleChartdata = res;
        if (this.topSaleChartdata != null) {
          for (let i = 0; i < this.topSaleChartdata.length; i++) {
            this.topProductlabeldata.push(this.topSaleChartdata[i].productName);
            this.topProductrealdata.push(this.topSaleChartdata[i].noOfSales);
            this.topProductcolordata.push(this.topSaleChartdata[i].colorcode);
          }
          this.TopProductRenderChart(this.topProductlabeldata, this.topProductrealdata, this.topProductcolordata, 'bar', 'productBarchart');
          this.TopProductRenderChart(this.topProductlabeldata, this.topProductrealdata, this.topProductcolordata, 'pie', 'productPiechart');
        }
      },
      error: (err) => {
        this.toastr.error('Error', "Error was found")
      }
    })
  }

  TopProductRenderChart(labeldata: any, maindata: any, colordata: any, type: any, id: any) {
 
    const myChart = new Chart(id, {
      type: type,
      data: {
        labels: labeldata,
        datasets: [{
          label: '# Number of Sales',
          data: maindata,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          borderColor: [
            // //'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')'
             'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  RenderChart(labeldata: any, maindata: any, colordata: any, type: any, id: any) {
    const myChart = new Chart(id, {
      type: type,
      data: {
        labels: labeldata,
        datasets: [{
          label: '# Amount',
          data: maindata,
          backgroundColor: [
            //'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')'
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          borderColor: [
            //'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')'
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'

          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
