import { Component, OnInit } from '@angular/core';
import { PubchemService } from '../../services/pubchem.service';
import { VisualizationService } from '../../services/visualization.service';
import { Compound } from '../../models/compound';

@Component({
  selector: 'app-visualization-dashboard',
  templateUrl: './visualization-dashboard.component.html',
  styleUrls: ['./visualization-dashboard.component.scss']
})
export class VisualizationDashboardComponent implements OnInit {
  compoundIdsInput = '';
  compounds: Compound[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private pubchemService: PubchemService,
    private visualizationService: VisualizationService
  ) { }

  ngOnInit() {
    this.compoundIdsInput = '2244,2519,3672,1983';
    this.loadCompounds();
  }

  loadCompounds() {
    if (!this.compoundIdsInput.trim()) {
      this.errorMessage = 'Please enter at least one compound ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.compounds = [];

    const cidInput = this.compoundIdsInput.split(',').map(id => id.trim());
    const cids = cidInput.map(id => +id).filter(id => !isNaN(id));

    if (cids.length === 0) {
      this.errorMessage = 'Please enter valid compound IDs';
      this.isLoading = false;
      return;
    }

    this.pubchemService.getBulkCompounds(cids).subscribe({
      next: (compounds) => {
        if (compounds.length === 0) {
          this.errorMessage = 'No valid compounds found for the given IDs';
          this.isLoading = false;
          return;
        }

        const requests = compounds.map(basicCompound =>
          this.pubchemService.getCompound(basicCompound.cid)
        );

        const results: Compound[] = [];
        let completed = 0;

        requests.forEach((request, index) => {
          request.subscribe({
            next: (compound) => {
              results[index] = compound;
              completed++;

              if (completed === requests.length) {
                this.compounds = results.filter(c => c !== null);
                this.isLoading = false;

                setTimeout(() => {
                  this.renderVisualizations();
                }, 100);
              }
            },
            error: (err) => {
              console.error(`Error loading compound ${compounds[index].cid}:`, err);
              completed++;

              if (completed === requests.length) {
                this.compounds = results.filter(c => c !== null);
                this.isLoading = false;

                if (this.compounds.length > 0) {
                  setTimeout(() => {
                    this.renderVisualizations();
                  }, 100);
                } else {
                  this.errorMessage = 'Failed to load compound details';
                }
              }
            }
          });
        });
      },
      error: (err) => {
        this.errorMessage = 'Error loading compounds: ' + err.message;
        this.isLoading = false;
      }
    });
  }

  renderVisualizations() {
    if (this.compounds.length > 0) {
      this.visualizationService.createPropertyBarChart(
        'weightChart',
        this.compounds,
        'molecularWeight',
        'Molecular Weight (g/mol)'
      );

      this.visualizationService.createPropertyBarChart(
        'hBondDonorChart',
        this.compounds,
        'hBondDonorCount',
        'H-Bond Donors'
      );

      this.visualizationService.createPropertyBarChart(
        'xlogpChart',
        this.compounds,
        'xlogp',
        'XLogP (Hydrophobicity)'
      );

      this.visualizationService.createPropertyBarChart(
        'hBondAcceptorChart',
        this.compounds,
        'hBondAcceptorCount',
        'H-Bond Acceptors'
      );
    }
  }
}
