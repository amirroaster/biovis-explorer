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


setColorByAtom() {
  if (!this.viewer) return;

  this.viewer.setStyle({}, {stick: {colorscheme: 'Jmol'}});
  this.viewer.render();
}

setColorByCharge() {
  if (!this.viewer) return;

  const chargeColors = {
    'positive': 'blue',
    'negative': 'red',
    'neutral': 'white'
  };

  this.viewer.setStyle({}, {stick: {}, sphere: {}, cartoon: {}});
  this.viewer.setStyle({elem: 'N'}, {stick: {color: 'blue'}});
  this.viewer.setStyle({elem: 'O'}, {stick: {color: 'red'}});
  this.viewer.setStyle({elem: 'S'}, {stick: {color: 'yellow'}});
  this.viewer.render();
}

toggleSurface() {
  if (!this.viewer) return;

  if (this.viewer.surfaceOn) {
    this.viewer.removeSurface();
    this.viewer.surfaceOn = false;
  } else {
    this.viewer.addSurface($3Dmol.SurfaceType.VDW, {
      opacity: 0.7,
      color: 'white'
    });
    this.viewer.surfaceOn = true;
  }
  this.viewer.render();
}

downloadStructure() {

  alert('This would download the current structure in a common chemical file format.');
}

rotateStructure() {
  if (!this.viewer) return;

  this.viewer.spin(true);

  setTimeout(() => {
    if (this.viewer) {
      this.viewer.spin(false);
    }
  }, 5000);
}
}
