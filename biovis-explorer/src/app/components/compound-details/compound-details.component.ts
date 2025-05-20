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
    this.route.params.subscribe(params => {
      const cid = +params['id'];
      this.loadCompound(cid);
    });
  }

  loadCompound(cid: number) {
    this.isLoading = true;
    this.errorMessage = '';

    this.pubchemService.getCompound(cid).subscribe(
      (compound) => {
        this.compound = compound;
        this.isLoading = false;
      },
      (err) => {
        this.errorMessage = 'Error loading compound details: ' + err;
        this.isLoading = false;
      }
    );
  }
}
