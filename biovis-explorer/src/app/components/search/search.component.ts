import { Component, OnInit } from '@angular/core';
import { PubchemService } from '../../services/pubchem.service';
import { Compound } from '../../models/compound';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchType = 'name';
  searchQuery = '';
  searchResults: Compound[] = [];
  errorMessage = '';
  isLoading = false;

  constructor(private pubchemService: PubchemService) { }

  ngOnInit() {
  }

  onSearch() {
    if (!this.searchQuery) return;

    this.errorMessage = '';
    this.searchResults = [];
    this.isLoading = true;

    let searchObservable;

    if (this.searchType === 'name') {
      searchObservable = this.pubchemService.searchByName(this.searchQuery);
    } else if (this.searchType === 'formula') {
      searchObservable = this.pubchemService.searchByFormula(this.searchQuery);
    } else {
      this.errorMessage = 'Invalid search type';
      this.isLoading = false;
      return;
    }

    searchObservable.subscribe({
      next: (result) => {
        if (result.cids && result.cids.length > 0) {
          const cids = result.cids.slice(0, 20);
          this.pubchemService.getBulkCompounds(cids).subscribe({
            next: (compounds) => {
              this.searchResults = compounds;
              this.isLoading = false;
            },
            error: (err) => {
              this.errorMessage = 'Error fetching compound details: ' + err.message;
              this.isLoading = false;
            }
          });
        } else {
          this.searchResults = [];
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.errorMessage = 'Error performing search: ' + err.message;
        this.isLoading = false;
      }
    });
  }
}
