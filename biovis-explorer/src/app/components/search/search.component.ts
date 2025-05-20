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


  suggestions: string[] = [];
  showSuggestions = false;

  constructor(private pubchemService: PubchemService) { }

  ngOnInit() {

    console.log('Search component initialized');
  }

  onSearchInput() {
    if (this.searchQuery && this.searchQuery.length >= 2) {
      this.pubchemService.getAutocompleteSuggestions(this.searchQuery)
        .subscribe(
          function(suggestions) {
            this.suggestions = suggestions;
            this.showSuggestions = suggestions.length > 0;
          }.bind(this),
          function(error) {
            console.error('Error getting suggestions:', error);
            this.suggestions = [];
            this.showSuggestions = false;
          }.bind(this)
        );
    } else {
      this.suggestions = [];
      this.showSuggestions = false;
    }
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.onSearch();
  }

  hideSuggestions() {
    var self = this;

    setTimeout(function() {
      self.showSuggestions = false;
    }, 200);
  }

  onSearch() {
    if (!this.searchQuery) return;

    this.errorMessage = '';
    this.searchResults = [];
    this.isLoading = true;
    this.showSuggestions = false;

    var searchObservable;
    var self = this;

    if (this.searchType === 'name') {
      searchObservable = this.pubchemService.searchByName(this.searchQuery);
    } else if (this.searchType === 'formula') {
      searchObservable = this.pubchemService.searchByFormula(this.searchQuery);
    } else {
      this.errorMessage = 'Invalid search type';
      this.isLoading = false;
      return;
    }

    searchObservable.subscribe(
      function(result) {
        if (result.cids && result.cids.length > 0) {

          var cids = result.cids.slice(0, 10);
          self.pubchemService.getBulkCompounds(cids).subscribe(
            function(compounds) {
              self.searchResults = compounds;
              self.isLoading = false;
            },
            function(err) {
              self.errorMessage = 'Error fetching compound details: ' + err;
              self.isLoading = false;
            }
          );
        } else {
          self.searchResults = [];
          self.isLoading = false;
        }
      },
      function(err) {
        self.errorMessage = 'Error performing search: ' + err;
        self.isLoading = false;
      }
    );
  }
}
