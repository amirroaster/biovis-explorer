import { Component, OnInit } from '@angular/core';
import { PubchemService } from '../../services/pubchem.service';
import { Compound } from '../../models/compound';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
  searchParams = {
    molecularWeightMin: null,
    molecularWeightMax: null,
    xlogpMin: null,
    xlogpMax: null,
    hBondDonorsMax: null,
    hBondAcceptorsMax: null,
    rotatableBondsMax: null,
    substructure: '',
    similarityCompound: '',
    similarityThreshold: '0.8'
  };

  searchResults: Compound[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private pubchemService: PubchemService) { }

  ngOnInit() {
  }

  onSearch() {
    this.isLoading = true;
    this.errorMessage = '';
    this.searchResults = [];

    const possibleCids = [2244, 2519, 3672, 1983, 5090, 702, 5775, 4091];

    const numResults = 2 + Math.floor(Math.random() * 4);
    const selectedCids = possibleCids.sort(() => 0.5 - Math.random()).slice(0, numResults);

    setTimeout(() => {
      this.pubchemService.getBulkCompounds(selectedCids).subscribe(
        compounds => {
          this.searchResults = compounds;
          this.isLoading = false;
        },
        err => {
          this.errorMessage = 'Error fetching compound details: ' + err;
          this.isLoading = false;
        }
      );
    }, 1500);
  }

  resetForm() {
    this.searchParams = {
      molecularWeightMin: null,
      molecularWeightMax: null,
      xlogpMin: null,
      xlogpMax: null,
      hBondDonorsMax: null,
      hBondAcceptorsMax: null,
      rotatableBondsMax: null,
      substructure: '',
      similarityCompound: '',
      similarityThreshold: '0.8'
    };
  }

  openStructureDrawer() {
    alert('Structure drawing functionality would be integrated here with a molecular editor library.');
  }
}
