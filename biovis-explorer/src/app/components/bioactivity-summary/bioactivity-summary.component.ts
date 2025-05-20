import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { PubchemService } from '../../services/pubchem.service';

@Component({
  selector: 'app-bioactivity-summary',
  templateUrl: './bioactivity-summary.component.html',
  styleUrls: ['./bioactivity-summary.component.scss']
})
export class BioactivitySummaryComponent implements OnInit {
  @Input() cid: number;
  bioactivityData: any = null;
  summaryStats: any = {
    totalAssays: 0,
    activeCount: 0,
    inactiveCount: 0,
    targetFamilies: {},
    assayTypes: {}
  };
  loading = true;
  error = null;
  showDetailedView = false;

  displayedAssayTypes: any = {};
  assayTypesPage = 1;
  assayTypesPerPage = 5;
  hasMoreAssayTypes = false;
  allAssayTypeKeys: string[] = [];

  constructor(private pubchemService: PubchemService) { }

  ngOnInit() {
    this.loadBioactivityData();
  }

  loadBioactivityData() {
    var self = this;
    this.loading = true;

    this.pubchemService.getBioactivityData(this.cid).subscribe(
      function(data) {
        self.bioactivityData = data;
        self.processBioactivityData();
        self.loadInitialAssayTypes();
        self.loading = false;
      },
      function(err) {
        self.error = 'Error loading bioactivity data: ' + err;
        self.loading = false;
      }
    );
  }

  processBioactivityData() {
    if (!this.bioactivityData || !this.bioactivityData.Table || !this.bioactivityData.Table.Row) {
      return;
    }

    var rows = this.bioactivityData.Table.Row;
    this.summaryStats.totalAssays = rows.length;

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var outcome = row.Cell[4];

      if (outcome === 'Active') {
        this.summaryStats.activeCount++;
      } else if (outcome === 'Inactive') {
        this.summaryStats.inactiveCount++;
      }

      var assayType = row.Cell[11];
      if (assayType) {
        this.summaryStats.assayTypes[assayType] = (this.summaryStats.assayTypes[assayType] || 0) + 1;
      }

      var assayName = row.Cell[9];
      if (assayName) {
        if (assayName.includes('Kinase')) {
          this.summaryStats.targetFamilies['Kinase'] = (this.summaryStats.targetFamilies['Kinase'] || 0) + 1;
        } else if (assayName.includes('GPCR')) {
          this.summaryStats.targetFamilies['GPCR'] = (this.summaryStats.targetFamilies['GPCR'] || 0) + 1;
        } else if (assayName.includes('Ion Channel')) {
          this.summaryStats.targetFamilies['Ion Channel'] = (this.summaryStats.targetFamilies['Ion Channel'] || 0) + 1;
        } else {
          this.summaryStats.targetFamilies['Other'] = (this.summaryStats.targetFamilies['Other'] || 0) + 1;
        }
      }
    }
  }

  loadInitialAssayTypes() {
    this.displayedAssayTypes = {};
    this.assayTypesPage = 1;

    this.allAssayTypeKeys = this.objectKeys(this.summaryStats.assayTypes)
      .sort((a, b) => this.summaryStats.assayTypes[b] - this.summaryStats.assayTypes[a]);

    this.loadMoreAssayTypes();
  }

  loadMoreAssayTypes() {
    const startIndex = (this.assayTypesPage - 1) * this.assayTypesPerPage;
    const endIndex = startIndex + this.assayTypesPerPage;

    const keysToAdd = this.allAssayTypeKeys.slice(startIndex, endIndex);

    for (let i = 0; i < keysToAdd.length; i++) {
      const key = keysToAdd[i];
      this.displayedAssayTypes[key] = this.summaryStats.assayTypes[key];
    }

    this.assayTypesPage++;
    this.hasMoreAssayTypes = endIndex < this.allAssayTypeKeys.length;

    setTimeout(this.scrollAssayTypesToBottom.bind(this), 100);
  }

  scrollAssayTypesToBottom() {
    const container = document.querySelector('.assay-types-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  objectKeys(obj) {
    return Object.keys(obj || {});
  }
}
