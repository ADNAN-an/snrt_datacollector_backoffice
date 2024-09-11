import { Component, OnInit } from '@angular/core';
import { ApiService, Donnees } from '../../api.service';
import * as echarts from 'echarts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-geo-map',
  templateUrl: './geo-map.component.html',
  styleUrl: './geo-map.component.css'
})
export class GeoMapComponent implements OnInit {
  private chartInstance: any;

  constructor(private apiService: ApiService,private http: HttpClient) {}
  
  ngOnInit(): void {
    this.apiService.getAllData().subscribe(data => {
      const countryData = this.processData(data);
      this.loadMapData().then(() => {
        this.initChart(countryData);
      }).catch(err => {
        console.error('Error loading map data:', err);
      });
    });
  }

  processData(data: Donnees[]): any[] {
    const countryIpMap = new Map<string, Set<string>>();

    data.forEach(item => {
      const country = item.country;
      const ipAddress = item.ipAddress;
      if (country && ipAddress) {
        if (!countryIpMap.has(country)) {
          countryIpMap.set(country, new Set());
        }
        countryIpMap.get(country)!.add(ipAddress);
      }
    });

    
    return Array.from(countryIpMap, ([name, ipSet]) => ({
      name,
      value: ipSet.size 
    }));
  }

  loadMapData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get('/assets/custom.geo.json', { responseType: 'text' })
        .subscribe(
          (geoJsonData: string) => {
            try {
              const geoJsonObject = JSON.parse(geoJsonData);
              echarts.registerMap('custom', geoJsonObject);
              resolve();
            } catch (e: any) {
              reject(new Error('Failed to parse GeoJSON: ' + e.message));
            }
          },
          (error) => {
            reject(new Error('Failed to load GeoJSON file: ' + error.message));
          }
        );
    });
  }

  initChart(countryData: any[]): void {
    const chartDom = document.getElementById('geo-chart');
    if (!chartDom) return;
  
    this.chartInstance = echarts.init(chartDom);
  
    // Define color gradient from light to dark blue
    const colorGradient = ['#b3cde0', '#005b96'];
  
    const option = {
      title: {
        text: 'Geographical Distribution of Users',
        left: 'center',
        top: '5', 
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#253162', // Updated title color
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} Users'
      },
      visualMap: {
        min: 0,
        max: Math.max(...countryData.map(d => d.value)),
        left: 'right',
        top: 'center',
        text: ['High', 'Low'],
        calculable: true,
        inRange: {
          color: colorGradient
        },
        outOfRange: {
          color: '#ddd' // Color for countries with no data
        }
      },
      geo: {
        map: 'custom',
        roam: true,
        emphasis: {
          label: {
            show: false
          }
        },
        itemStyle: {
          areaColor: '#ddd', // Default color
          borderColor: '#fff',
          borderWidth: 0.5
        },
        center: [-7.0926, 31.7917],
        zoom: 4.5
      },
      series: [
        {
          name: 'Geographical Distribution of Users',
          type: 'map',
          map: 'custom',
          geoIndex: 0,
          data: countryData,
          label: {
            show: true,
            formatter: (params: any) => {
              return params.value ? `${params.name}: ${params.value}` : '';
            }
          },
          itemStyle: {
            areaColor: '#ddd', 
            borderColor: '#fff'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#1E2A5E'
            }
          }
        }
      ]
    };
  
    this.chartInstance.setOption(option);
  }
}  