import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

declare var $3Dmol: any;
declare var jQuery: any;

@Component({
  selector: 'app-molecule-viewer',
  templateUrl: './molecule-viewer.component.html',
  styleUrls: ['./molecule-viewer.component.scss']
})
export class MoleculeViewerComponent implements OnInit, OnChanges {
  @Input() cid: number;
  @Input() viewerId: string = 'molecule-viewer';

  viewer: any;
  currentStyle: string = 'stick';

  constructor() { }

  ngOnInit() {
    this.initViewer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cid && !changes.cid.firstChange) {
      this.loadMolecule();
    }
  }

  initViewer() {
    const self = this;

    setTimeout(function() {
      const element = document.getElementById(self.viewerId);
      if (!element) return;

      self.viewer = $3Dmol.createViewer(element, {
        backgroundColor: 'white'
      });

      if (self.cid) {
        self.loadMolecule();
      }
    }, 100);
  }

  loadMolecule() {
    if (!this.viewer || !this.cid) return;

    const self = this;
    const pdbUri = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/' +
                  this.cid + '/record/SDF?record_type=3d';

    this.viewer.clear();

    jQuery.ajax(pdbUri, {
      success: function(data) {
        self.viewer.addModel(data, 'sdf');
        self.setStyle(self.currentStyle);
        self.viewer.zoomTo();
        self.viewer.render();
      },
      error: function(error) {
        console.error('Error loading 3D structure:', error);
      }
    });
  }

  setStyle(style: string) {
    if (!this.viewer) return;

    this.currentStyle = style;
    this.viewer.setStyle({}, { stick: {}, sphere: {}, cartoon: {}, line: {} });

    switch (style) {
      case 'stick':
        this.viewer.setStyle({}, { stick: { radius: 0.15 } });
        break;
      case 'sphere':
        this.viewer.setStyle({}, { sphere: { scale: 0.25 } });
        break;
      case 'line':
        this.viewer.setStyle({}, { line: {} });
        break;
    }

    this.viewer.render();
  }

  reset() {
    if (!this.viewer) return;
    this.viewer.zoomTo();
    this.setStyle('stick');
  }
}
