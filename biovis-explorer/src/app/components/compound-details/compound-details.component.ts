import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PubchemService } from '../../services/pubchem.service';
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
    private pubchemService: PubchemService
  ) { }

  ngOnInit() {
    const self = this;
    this.route.params.subscribe(function(params) {
      const cid = +params['id'];
      self.loadCompound(cid);
    });
  }

  loadCompound(cid: number) {
    const self = this;
    self.isLoading = true;
    self.errorMessage = '';

    this.pubchemService.getCompound(cid).subscribe(
      function(compound) {
        self.compound = compound;
        self.isLoading = false;
      },
      function(err) {
        self.errorMessage = 'Error loading compound details: ' + err;
        self.isLoading = false;
      }
    );
  }
}
