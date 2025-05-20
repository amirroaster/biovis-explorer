import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { Compound } from '../models/compound';

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {

  constructor() { }

  createPropertyBarChart(containerId: string, compounds: Compound[], property: string, title: string) {

    d3.select(`#${containerId}`).html('');

    const validCompounds = compounds.filter(c => c[property] !== undefined);
    if (validCompounds.length === 0) return;

    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(title);

    const maxValue = d3.max(validCompounds, d => d[property]) || 0;

    const x = d3.scaleBand()
      .range([0, width])
      .domain(validCompounds.map(d => d.cid.toString()))
      .padding(0.2);

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, maxValue * 1.1]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'translate(-10,0)rotate(-45)')
      .style('text-anchor', 'end');

    svg.append('g')
      .call(d3.axisLeft(y));

    validCompounds.forEach(d => {
      svg.append('rect')
        .attr('x', x(d.cid.toString()))
        .attr('y', y(d[property]))
        .attr('width', x.bandwidth())
        .attr('height', height - y(d[property]))
        .attr('fill', '#4e79a7');
    });

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .text(property);

    svg.append('text')
      .attr('y', height + margin.bottom - 10)
      .attr('x', width / 2)
      .attr('text-anchor', 'middle')
      .text('Compound ID');
  }

  createMultiPropertyRadarChart(containerId: string, compound: Compound) {

    interface RadarPoint {
      name: string;
      value: number;
      maxValue: number;
    }

    const properties: RadarPoint[] = [
      { name: 'MW', value: compound.molecularWeight || 0, maxValue: 500 },
      { name: 'XLogP', value: compound.xlogp || 0, maxValue: 5 },
      { name: 'H-Donors', value: compound.hBondDonorCount || 0, maxValue: 5 },
      { name: 'H-Acceptors', value: compound.hBondAcceptorCount || 0, maxValue: 10 },
      { name: 'Rot. Bonds', value: compound.rotatableBondCount || 0, maxValue: 10 },
      { name: 'Complexity', value: compound.complexity || 0, maxValue: 1000 }
    ].filter(p => p.value !== undefined && p.value !== 0);

    if (properties.length === 0) return;

    d3.select(`#${containerId}`).html('');


    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${(width / 2) + margin.left},${(height / 2) + margin.top})`);

    const angleScale = d3.scaleLinear()
      .domain([0, properties.length])
      .range([0, 2 * Math.PI]);

    const radiusScale = d3.scaleLinear()
      .domain([0, 1])
      .range([0, radius]);

    const axes = svg.selectAll('.axis')
      .data(properties)
      .enter()
      .append('g')
      .attr('class', 'axis');

    axes.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => radius * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('y2', (d, i) => radius * Math.sin(angleScale(i) - Math.PI / 2))
      .attr('stroke', '#999')
      .attr('stroke-width', 1);

    axes.append('text')
      .attr('x', (d, i) => (radius + 10) * Math.cos(angleScale(i) - Math.PI / 2))
      .attr('y', (d, i) => (radius + 10) * Math.sin(angleScale(i) - Math.PI / 2))
      .attr('text-anchor', (d, i) => {
        const angle = angleScale(i);
        if (angle < Math.PI / 4 || angle > 7 * Math.PI / 4) return 'start';
        if (angle >= Math.PI / 4 && angle <= 3 * Math.PI / 4) return 'start';
        if (angle >= 3 * Math.PI / 4 && angle <= 5 * Math.PI / 4) return 'middle';
        return 'end';
      })
      .attr('dy', (d, i) => {
        const angle = angleScale(i);
        if (angle >= Math.PI / 4 && angle <= 3 * Math.PI / 4) return '1em';
        if (angle >= 3 * Math.PI / 4 && angle <= 5 * Math.PI / 4) return '0.5em';
        return '0.3em';
      })
      .text(d => d.name);

    let pathData = '';

    properties.forEach((d, i) => {
      const angle = angleScale(i) - Math.PI / 2;
      const r = radiusScale(d.value / d.maxValue);
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);

      if (i === 0) {
        pathData += `M ${x},${y} `;
      } else {
        pathData += `L ${x},${y} `;
      }
    });

    pathData += 'Z';

    svg.append('path')
      .attr('d', pathData)
      .attr('stroke', '#4e79a7')
      .attr('stroke-width', 2)
      .attr('fill', '#4e79a7')
      .attr('fill-opacity', 0.3);

    svg.append('text')
      .attr('x', 0)
      .attr('y', -radius - 20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(`Property Profile: CID ${compound.cid}`);
  }
}
