import { Component, OnInit, AfterViewInit } from '@angular/core';

declare var $3Dmol: any;
declare var jQuery: any;

interface BindingData {
  score: number;
  interactions: Interaction[];
  activeResidues: ActiveResidue[];
}

interface Interaction {
  type: string;
  residue: string;
  distance: number;
}

interface ActiveResidue {
  name: string;
  isKey: boolean;
}

@Component({
  selector: 'app-docking-simulation',
  templateUrl: './docking-simulation.component.html',
  styleUrls: ['./docking-simulation.component.scss']
})
export class DockingSimulationComponent implements OnInit, AfterViewInit {
  selectedLigand = 'aspirin';
  selectedProtein = 'cox2';
  displayMode = 'cartoon';
  colorScheme = 'element';
  isLoading = false;
  viewer: any;

  bindingData: BindingData = null;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initViewer();
    setTimeout(() => {
      this.updateDocking();
    }, 500);
  }

  initViewer() {
    // Initialize the 3DMol.js viewer
    const element = document.getElementById('docking-viewer');
    if (!element) return;

    this.viewer = $3Dmol.createViewer(element, {
      backgroundColor: 'white'
    });
  }

  updateDocking() {
    if (!this.viewer) return;

    this.isLoading = true;

    // Clear the current view
    this.viewer.clear();

    // Simulate loading the data
    setTimeout(() => {
      this.loadDockingData();
      this.updateBindingData();
      this.isLoading = false;
    }, 1500);
  }

  loadDockingData() {
    // In a real app, this would load actual molecular data from files or APIs
    // For the demo, we'll use a dummy PDB string
    const dummyPDB = `ATOM      1  N   ALA     1      -0.677  -1.230  -0.491  1.00  0.00           N
ATOM      2  CA  ALA     1       0.000   0.000   0.000  1.00  0.00           C
ATOM      3  C   ALA     1       1.540   0.000   0.000  1.00  0.00           C
ATOM      4  O   ALA     1       2.174   1.052   0.000  1.00  0.00           O
ATOM      5  CB  ALA     1      -0.527   1.260   0.683  1.00  0.00           C
ATOM      6  N   ARG     2       2.174  -1.164  -0.010  1.00  0.00           N
ATOM      7  CA  ARG     2       3.639  -1.247  -0.010  1.00  0.00           C
ATOM      8  C   ARG     2       4.134  -2.692  -0.010  1.00  0.00           C
ATOM      9  O   ARG     2       3.454  -3.638  -0.374  1.00  0.00           O
ATOM     10  CB  ARG     2       4.151  -0.537  -1.258  1.00  0.00           C
ATOM     11  CG  ARG     2       5.664  -0.527  -1.435  1.00  0.00           C
ATOM     12  CD  ARG     2       6.096   0.421  -2.532  1.00  0.00           C
ATOM     13  NE  ARG     2       5.827  -0.107  -3.877  1.00  0.00           N
ATOM     14  CZ  ARG     2       5.554   0.637  -4.943  1.00  0.00           C
ATOM     15  NH1 ARG     2       5.508   1.965  -4.883  1.00  0.00           N
ATOM     16  NH2 ARG     2       5.324   0.051  -6.121  1.00  0.00           N`;

    // Load the protein
    this.viewer.addModel(dummyPDB, 'pdb');

    // Add a dummy ligand
    this.viewer.addSphere({
      center: {x: 5.0, y: 0.0, z: 0.0},
      radius: 1.0,
      color: 'red'
    });

    // Update display based on current settings
    this.updateDisplayMode();

    // Center and zoom
    this.viewer.zoomTo();
    this.viewer.render();
  }

  updateDisplayMode() {
    if (!this.viewer) return;

    // Reset all styles
    this.viewer.setStyle({}, {});

    // Apply selected style
    switch (this.displayMode) {
      case 'cartoon':
        this.viewer.setStyle({}, {cartoon: {color: 'spectrum'}});
        this.viewer.setStyle({hetflag: true}, {stick: {colorscheme: 'greenCarbon'}});
        break;
      case 'stick':
        this.viewer.setStyle({}, {stick: {}});
        break;
      case 'sphere':
        this.viewer.setStyle({}, {sphere: {scale: 0.25}});
        break;
      case 'surface':
        this.viewer.setStyle({}, {cartoon: {color: 'spectrum'}});
        this.viewer.addSurface($3Dmol.SurfaceType.MS, {
          opacity: 0.7,
          color: 'white'
        });
        break;
    }

    this.viewer.render();
  }

  updateColorScheme() {
    if (!this.viewer) return;

    // Apply color scheme based on selection
    switch (this.colorScheme) {
      case 'element':
        this.viewer.setStyle({}, {[this.displayMode]: {colorscheme: 'Jmol'}});
        break;
      case 'chain':
        this.viewer.setStyle({}, {[this.displayMode]: {color: 'spectrum'}});
        break;
      case 'residue':
        this.viewer.setStyle({}, {[this.displayMode]: {colorscheme: 'amino'}});
        break;
      case 'bfactor':
        this.viewer.setStyle({}, {[this.displayMode]: {colorfunc: 'temperature'}});
        break;
    }

    // Make sure ligand is always visible
    if (this.displayMode === 'cartoon') {
      this.viewer.setStyle({hetflag: true}, {stick: {colorscheme: 'greenCarbon'}});
    }

    this.viewer.render();
  }

  updateBindingData() {
    // Generate mock binding data based on the selections
    const affinityScores = {
      'aspirin_cox1': -7.8,
      'aspirin_cox2': -6.2,
      'ibuprofen_cox1': -7.2,
      'ibuprofen_cox2': -8.1,
      'celecoxib_cox1': -5.9,
      'celecoxib_cox2': -9.3,
      'acetaminophen_cox1': -6.1,
      'acetaminophen_cox2': -5.8,
      'aspirin_pde5': -3.5,
      'ibuprofen_pde5': -4.2,
      'celecoxib_pde5': -6.1,
      'acetaminophen_pde5': -3.9,
      'aspirin_ace2': -4.7,
      'ibuprofen_ace2': -5.3,
      'celecoxib_ace2': -6.8,
      'acetaminophen_ace2': -4.5
    };

    const key = `${this.selectedLigand}_${this.selectedProtein}`;
    const score = affinityScores[key] || -6.0;

    // Generate mock interactions
    const interactions = [];
    const interactionTypes = ['Hydrogen Bond', 'Hydrophobic', 'π-π Stacking', 'Ionic'];
    const residues = ['ARG120', 'TYR355', 'SER530', 'VAL349', 'LEU352', 'PHE518', 'MET522', 'GLU524'];

    // Generate 3-5 random interactions
    const numInteractions = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numInteractions; i++) {
      interactions.push({
        type: interactionTypes[Math.floor(Math.random() * interactionTypes.length)],
        residue: residues[Math.floor(Math.random() * residues.length)],
        distance: (2.5 + Math.random() * 1.5).toFixed(1)
      });
    }

    // Generate active site residues
    const activeResidues = [];
    for (let i = 0; i < 8; i++) {
      activeResidues.push({
        name: residues[i],
        isKey: i < 3 // First 3 are key residues
      });
    }

    this.bindingData = {
      score: score,
      interactions: interactions,
      activeResidues: activeResidues
    };
  }

  getDialRotation(): number {
    // Convert binding affinity to a rotation for the dial
    // Assuming scores range from -10 (best) to 0 (worst)
    // Map to 0 to 180 degrees
    if (!this.bindingData) return 90;

    const score = this.bindingData.score;
    // Map -10 to 0 degrees (best) and 0 to 180 degrees (worst)
    return Math.max(0, Math.min(180, (score + 10) * 18));
  }

  playDockingAnimation() {
    if (!this.viewer) return;

    // In a real app, this would animate the docking process
    // For demo purposes, we'll just rotate the view
    this.viewer.spin(true);

    // Stop spinning after 5 seconds
    setTimeout(() => {
      if (this.viewer) {
        this.viewer.spin(false);
      }
    }, 5000);
  }

  pauseAnimation() {
    if (!this.viewer) return;
    this.viewer.spin(false);
  }

  resetViewer() {
    if (!this.viewer) return;
    this.viewer.spin(false);
    this.viewer.zoomTo();
    this.updateDisplayMode();
  }
}
