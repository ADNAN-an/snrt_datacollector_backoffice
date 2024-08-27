import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ApiService } from '../../api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-event-distribution',
  templateUrl: './event-distribution.component.html',
  styleUrls: ['./event-distribution.component.css']
})
export class EventDistributionComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      height: 310,
      backgroundColor: 'transparent',
    },
    title: {
      text: 'Event Type Distribution',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
    },
    series: [
      {
        name: 'Events',
        colorByPoint: true,
        type: 'pie', 
        data: [], 
      } as Highcharts.SeriesPieOptions,  
    ],
    credits: {
      enabled: false
    },
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadEventData();
  }

  loadEventData(): void {
    this.apiService.getAllData().pipe(
      map(donnees => this.processEventData(donnees))
    ).subscribe(
      data => {
        this.updateChartData(data);
      },
      error => {
        console.error('Error fetching data:', error);
      }
    );
  }

  processEventData(donnees: any[]): { name: string, y: number }[] {
    const eventCounts: { [key: string]: number } = {};

    donnees.forEach(item => {
      if (item.eventType) {
        eventCounts[item.eventType] = (eventCounts[item.eventType] || 0) + 1;
      }
    });

    return Object.keys(eventCounts).map(key => ({
      name: key,
      y: eventCounts[key],
    }));
  }

  updateChartData(data: { name: string, y: number }[]): void {
    (this.chartOptions.series![0] as Highcharts.SeriesPieOptions).data = data;
    Highcharts.chart('container', this.chartOptions); 
  }
}
