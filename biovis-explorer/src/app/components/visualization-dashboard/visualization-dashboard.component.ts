import { Component, OnInit, AfterViewInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { PubchemService } from '../../services/pubchem.service';
import { Compound } from '../../models/compound';

import * as Chart from 'chart.js';

declare var d3: any;

@Component({
  selector: 'app-visualization-dashboard',
  templateUrl: './visualization-dashboard.component.html',
  styleUrls: ['./visualization-dashboard.component.scss']
})
export class VisualizationDashboardComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('barChartCanvas') barChartCanvas: ElementRef;
  compoundIdsInput = '2244,2519,3672,1983'; // Default values: Aspirin, Caffeine, Ibuprofen, Acetaminophen
  compounds: Compound[] = [];
  isLoading = false;
  errorMessage = '';
  barChart: Chart = null;
  currentProperty = 'molecularWeight';


  propertyDisplayNames = {
    'molecularWeight': 'Molecular Weight (g/mol)',
    'hBondDonorCount': 'H-Bond Donors',
    'hBondAcceptorCount': 'H-Bond Acceptors',
    'rotatableBondCount': 'Rotatable Bonds',
    'heavyAtomCount': 'Heavy Atoms',
    'xlogp': 'XLogP (Hydrophobicity)',
    'complexity': 'Molecular Complexity'
  };

  constructor(private pubchemService: PubchemService) { }

  ngOnInit() {
    this.loadCompounds();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createRadarChart();
      this.createBarChart(this.currentProperty);
    }, 1000);
  }

  ngOnChanges() {
    this.updateBarChart(this.currentProperty);
  }

  changeBarChartProperty(property: string) {
    this.currentProperty = property;
    this.updateBarChart(property);
  }

  updateBarChart(property: string) {
    if (this.barChart) {
      this.barChart.destroy();
    }
    this.createBarChart(property);
  }

  createBarChart(property: string) {
    if (!this.compounds || this.compounds.length === 0 || !this.barChartCanvas) return;

    const ctx = this.barChartCanvas.nativeElement.getContext('2d');

    // Prepare data for the chart
    const labels = this.compounds.map(compound =>
      compound.iupacName ?
        (compound.iupacName.length > 20 ?
          compound.iupacName.substring(0, 17) + '...' :
          compound.iupacName) :
        'CID: ' + compound.cid
    );

    const data = this.compounds.map(compound => compound[property] || 0);

    // Generate unique colors for each compound
    const backgroundColor = this.generateColors(this.compounds.length, 0.7);
    const borderColor = this.generateColors(this.compounds.length, 1);

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: this.propertyDisplayNames[property] || property,
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: (tooltipItems) => {
                const index = tooltipItems[0].dataIndex;
                return this.compounds[index].iupacName || 'CID: ' + this.compounds[index].cid;
              },
              label: (context) => {
                const value = context.raw;
                return `${this.propertyDisplayNames[property]}: ${value}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: this.propertyDisplayNames[property] || property
            }
          },
          x: {
            title: {
              display: true,
              text: 'Compound'
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
        onHover: (event, elements) => {
          if (elements && elements.length) {
            // Change cursor style when hovering on a bar
            event.native.target.style.cursor = 'pointer';
          } else {
            event.native.target.style.cursor = 'default';
          }
        }
      }
    });
  }

  // Generate an array of colors with a good distribution
  generateColors(count: number, alpha: number): string[] {
    const colors = [];
    const hueStep = 360 / count;

    for (let i = 0; i < count; i++) {
      colors.push(`hsla(${i * hueStep}, 80%, 60%, ${alpha})`);
    }

    return colors;
  }

  loadCompounds() {
    if (!this.compoundIdsInput.trim()) {
      this.errorMessage = 'Please enter at least one compound ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.compounds = [];


    const cidInput = this.compoundIdsInput.split(',').map(function(id) {
      return id.trim();
    });

    const cids = cidInput.map(function(id) {
      return +id;
    }).filter(function(id) {
      return !isNaN(id);
    });

    if (cids.length === 0) {
      this.errorMessage = 'Please enter valid compound IDs';
      this.isLoading = false;
      return;
    }


    const self = this;
    this.pubchemService.getBulkCompounds(cids).subscribe(
      function(compounds) {

        const basicCompounds = compounds;


        const requests = compounds.map(function(basicCompound) {
          return self.pubchemService.getCompound(basicCompound.cid);
        });


        const results = new Array(requests.length);
        let completed = 0;

        for (let i = 0; i < requests.length; i++) {
          (function(index) {
            requests[index].subscribe({
              next: function(compound) {
                results[index] = compound;
                completed++;

                if (completed === requests.length) {
                  self.compounds = results.filter(function(c) {
                    return c !== null;
                  });
                  self.isLoading = false;


                  setTimeout(function() {
                    self.createRadarChart();
                    self.createBarChart('molecularWeight');
                  }, 100);
                }
              },
              error: function(err) {
                console.error('Error loading compound ' + basicCompounds[index].cid + ':', err);

                results[index] = basicCompounds[index];
                completed++;

                if (completed === requests.length) {
                  self.compounds = results.filter(function(c) {
                    return c !== null;
                  });
                  self.isLoading = false;

                  if (self.compounds.length > 0) {
                    setTimeout(function() {
                      self.createRadarChart();
                      self.createBarChart('molecularWeight');
                    }, 100);
                  } else {
                    self.errorMessage = 'Failed to load compound details';
                  }
                }
              }
            });
          })(i);
        }
      },
      function(err) {
        self.errorMessage = 'Error loading compounds: ' + err;
        self.isLoading = false;
      }
    );
  }

  createRadarChart() {
    if (!this.compounds || this.compounds.length === 0) return;


    const container = document.getElementById('radarChartContainer');
    if (!container) return;
    container.innerHTML = '';


    const margin = { top: 50, right: 80, bottom: 50, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;


    const svg = d3.select('#radarChartContainer')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + (width/2 + margin.left) + ',' + (height/2 + margin.top) + ')');


    const properties = [
      'molecularWeight',
      'hBondDonorCount',
      'hBondAcceptorCount',
      'rotatableBondCount',
      'heavyAtomCount'
    ];


    const maxValues = {};
    const self = this;

    for (let p = 0; p < properties.length; p++) {
      const prop = properties[p];
      let maxVal = 0;

      for (let c = 0; c < this.compounds.length; c++) {
        const value = this.compounds[c][prop] || 0;
        if (value > maxVal) {
          maxVal = value;
        }
      }

      maxValues[prop] = maxVal * 1.1;
    }


    const angleScale = d3.scaleLinear()
      .domain([0, properties.length])
      .range([0, 2 * Math.PI]);


    const axes = svg.selectAll('.axis')
      .data(properties)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axes.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', function(d, i) {
        return radius * Math.cos(angleScale(i) - Math.PI/2);
      })
      .attr('y2', function(d, i) {
        return radius * Math.sin(angleScale(i) - Math.PI/2);
      })
      .attr('stroke', '#999')
      .attr('stroke-width', 1);


    axes.append('text')
      .attr('x', function(d, i) {
        return (radius + 10) * Math.cos(angleScale(i) - Math.PI/2);
      })
      .attr('y', function(d, i) {
        return (radius + 10) * Math.sin(angleScale(i) - Math.PI/2);
      })
      .attr('text-anchor', function(d, i) {
        const angle = angleScale(i);
        if (angle < Math.PI/4 || angle > 7*Math.PI/4) return 'start';
        if (angle >= Math.PI/4 && angle <= 3*Math.PI/4) return 'start';
        if (angle >= 3*Math.PI/4 && angle <= 5*Math.PI/4) return 'end';
        return 'start';
      })
      .attr('dy', function(d, i) {
        const angle = angleScale(i);
        if (angle >= Math.PI/4 && angle <= 3*Math.PI/4) return '0.7em';
        if (angle >= 3*Math.PI/4 && angle <= 5*Math.PI/4) return '0.3em';
        return '0.3em';
      })
      .text(function(d) {
        return self.propertyDisplayNames[d] || d;
      })
      .style('font-size', '12px')
      .style('fill', '#333');


    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);


    for (let idx = 0; idx < this.compounds.length; idx++) {
      const compound = this.compounds[idx];
      let pathData = '';

      for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];

        const normalizedValue = (compound[prop] || 0) / maxValues[prop];


        const angle = angleScale(i) - Math.PI/2;
        const r = radius * normalizedValue;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);

        if (i === 0) {
          pathData += 'M ' + x + ',' + y + ' ';
        } else {
          pathData += 'L ' + x + ',' + y + ' ';
        }
      }


      pathData += 'Z';


      svg.append('path')
        .attr('d', pathData)
        .attr('stroke', colorScale(idx))
        .attr('stroke-width', 2)
        .attr('fill', colorScale(idx))
        .attr('fill-opacity', 0.2)
        .attr('stroke-opacity', 0.8);
    }


    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', 'translate(' + (radius + 20) + ',' + (-radius) + ')');

    for (let i = 0; i < this.compounds.length; i++) {
      const compound = this.compounds[i];
      const legendItem = legend.append('g')
        .attr('transform', 'translate(0,' + (i * 20) + ')');

      legendItem.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', colorScale(i));

      legendItem.append('text')
        .attr('x', 15)
        .attr('y', 9)
        .text(compound.iupacName || ('CID: ' + compound.cid))
        .style('font-size', '12px');
    }


    svg.append('text')
      .attr('x', 0)
      .attr('y', -radius - 20)
      .attr('text-anchor', 'middle')
      .text('Compound Property Comparison')
      .style('font-size', '16px')
      .style('font-weight', 'bold');
  }

}
