import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PubchemService } from '../../services/pubchem.service';
import { VisualizationService } from '../../services/visualization.service';
import { Compound } from '../../models/compound';

@Component({
  selector: 'app-compound-details',
  templateUrl: './compound-details.component.html',
  styleUrls: ['./compound-details.component.scss']
})
export class CompoundDetailsComponent implements OnInit {
  compound: Compound;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private pubchemService: PubchemService,
    private visualizationService: VisualizationService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const cid = +params.get('id');
      this.loadCompound(cid);
    });
  }

  loadCompound(cid: number) {
    this.isLoading = true;
    this.errorMessage = '';

    this.pubchemService.getCompound(cid).subscribe({
      next: (compound) => {
        this.compound = compound;
        this.isLoading = false;

        setTimeout(() => {
          this.renderVisualizations();
        }, 100);
      },
      error: (err) => {
        this.errorMessage = 'Error loading compound details: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  renderVisualizations() {
    if (this.compound) {
      this.visualizationService.createMultiPropertyRadarChart('radarChart', this.compound);
    }
  }
}
