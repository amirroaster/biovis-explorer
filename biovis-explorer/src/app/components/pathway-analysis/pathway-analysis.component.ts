import { Component, OnInit } from '@angular/core';

interface PathwayNode {
  id: string;
  label: string;
  x: number;
  y: number;
  isTarget: boolean;
}

interface PathwayEdge {
  source: string;
  target: string;
  label: string;
  labelX: number;
  labelY: number;
}

interface PathwayInteraction {
  pathway: string;
  type: string;
  confidence: number;
  reference: string;
  referenceUrl: string;
}

@Component({
  selector: 'app-pathway-analysis',
  templateUrl: './pathway-analysis.component.html',
  styleUrls: ['./pathway-analysis.component.scss']
})
export class PathwayAnalysisComponent implements OnInit {
  selectedCompound = '';
  isLoading = false;

  pathwayNodes: PathwayNode[] = [];
  pathwayEdges: PathwayEdge[] = [];
  pathwayInteractions: PathwayInteraction[] = [];

  constructor() { }

  ngOnInit() {
  }

  onCompoundChange() {
    if (!this.selectedCompound) return;

    this.isLoading = true;

    setTimeout(() => {
      this.generatePathwayData();
      this.isLoading = false;
    }, 1500);
  }

  generatePathwayData() {

    this.pathwayNodes = [];
    this.pathwayEdges = [];

    switch(this.selectedCompound) {
      case 'aspirin':
        this.generateAspirinPathway();
        break;
      case 'caffeine':
        this.generateCaffeinePathway();
        break;
      default:
        this.generateGenericPathway();
        break;
    }
  }

  generateAspirinPathway() {
    this.pathwayNodes = [
      { id: 'aspirin', label: 'ASA', x: 400, y: 100, isTarget: true },
      { id: 'cox1', label: 'COX-1', x: 250, y: 200, isTarget: false },
      { id: 'cox2', label: 'COX-2', x: 550, y: 200, isTarget: false },
      { id: 'pg', label: 'PGs', x: 400, y: 300, isTarget: false },
      { id: 'thromboxane', label: 'TXA', x: 200, y: 300, isTarget: false },
      { id: 'inflammation', label: 'INFL', x: 600, y: 300, isTarget: false }
    ];

    this.pathwayEdges = [
      { source: 'aspirin', target: 'cox1', label: 'Inhibits', labelX: 300, labelY: 150 },
      { source: 'aspirin', target: 'cox2', label: 'Inhibits', labelX: 500, labelY: 150 },
      { source: 'cox1', target: 'pg', label: 'Catalyzes', labelX: 325, labelY: 250 },
      { source: 'cox1', target: 'thromboxane', label: 'Produces', labelX: 225, labelY: 250 },
      { source: 'cox2', target: 'pg', label: 'Catalyzes', labelX: 475, labelY: 250 },
      { source: 'cox2', target: 'inflammation', label: 'Causes', labelX: 575, labelY: 250 }
    ];

    this.pathwayInteractions = [
      {
        pathway: 'Cyclooxygenase (COX) Pathway',
        type: 'Irreversible Inhibition',
        confidence: 98,
        reference: 'Journal of Medicinal Chemistry (2020)',
        referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/'
      },
      {
        pathway: 'Prostaglandin Synthesis',
        type: 'Downregulation',
        confidence: 95,
        reference: 'Annual Review of Pharmacology (2019)',
        referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/'
      },
      {
        pathway: 'Platelet Aggregation',
        type: 'Inhibition',
        confidence: 90,
        reference: 'Nature Reviews Cardiology (2021)',
        referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/'
      },
      {
        pathway: 'NF-κB Signaling',
        type: 'Modulation',
        confidence: 65,
        reference: 'Cell Signaling Technology (2018)',
        referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/'
      }
    ];
  }

  generateCaffeinePathway() {
    this.pathwayNodes = [
      { id: 'caffeine', label: 'CAF', x: 400, y: 100, isTarget: true },
      { id: 'adenosine', label: 'ADO', x: 300, y: 200, isTarget: false },
      { id: 'adoR', label: 'ADO-R', x: 500, y: 200, isTarget: false },
      { id: 'cAMP', label: 'cAMP', x: 600, y: 300, isTarget: false },
      { id: 'pde', label: 'PDE', x: 200, y: 300, isTarget: false },
      { id: 'dopamine', label: 'DOP', x: 400, y: 300, isTarget: false }
    ];

    this.pathwayEdges = [
      { source: 'caffeine', target: 'adoR', label: 'Antagonist', labelX: 450, labelY: 150 },
      { source: 'caffeine', target: 'pde', label: 'Inhibits', labelX: 300, labelY: 200 },
      { source: 'adenosine', target: 'adoR', label: 'Binds', labelX: 400, labelY: 200 },
      { source: 'adoR', target: 'cAMP', label: 'Signals', labelX: 550, labelY: 250 },
      { source: 'pde', target: 'cAMP', label: 'Degrades', labelX: 400, labelY: 250 },
      { source: 'adoR', target: 'dopamine', label: 'Modulates', labelX: 450, labelY: 250 }
    ];

    // Sample interactions for Caffeine
    this.pathwayInteractions = [
      {
        pathway: 'Adenosine Receptor Signaling',
        type: 'Competitive Antagonist',
        confidence: 97,
        reference: 'Journal of Pharmacology (2019)',
        referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/'
      },
      {
        pathway: 'Phosphodiesterase Inhibition',
        type: 'Weak Inhibition',
        confidence: 68,
        reference: 'Biochemical Journal (2020)',
        referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/'
      },
      {
        pathway: 'Dopamine Release',
        type: 'Indirect Stimulation',
        confidence: 82,
        reference: 'Journal of Neurochemistry (2021)',
        referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/'
      },
      {
        pathway: 'GABA Receptor Modulation',
        type: 'Antagonism',
        confidence: 55,
        reference: 'Neuroscience Letters (2018)',
        referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/'
      }
    ];
  }

  generateGenericPathway() {
    this.pathwayNodes = [
      { id: 'compound', label: 'COMP', x: 400, y: 100, isTarget: true },
      { id: 'enzyme1', label: 'ENZ1', x: 300, y: 200, isTarget: false },
      { id: 'enzyme2', label: 'ENZ2', x: 500, y: 200, isTarget: false },
      { id: 'receptor', label: 'RCPT', x: 400, y: 300, isTarget: false },
      { id: 'metabolite', label: 'META', x: 600, y: 300, isTarget: false }
    ];

    this.pathwayEdges = [
      { source: 'compound', target: 'enzyme1', label: 'Binds', labelX: 350, labelY: 150 },
      { source: 'compound', target: 'enzyme2', label: 'Inhibits', labelX: 450, labelY: 150 },
      { source: 'enzyme1', target: 'receptor', label: 'Activates', labelX: 350, labelY: 250 },
      { source: 'enzyme2', target: 'metabolite', label: 'Produces', labelX: 550, labelY: 250 },
      { source: 'receptor', target: 'metabolite', label: 'Signals', labelX: 500, labelY: 300 }
    ];

    this.pathwayInteractions = [
      {
        pathway: 'Primary Metabolic Pathway',
        type: 'Substrate/Enzyme Interaction',
        confidence: 85,
        reference: 'Journal of Medicinal Chemistry (2020)',
        referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/'
      },
      {
        pathway: 'Secondary Signaling Cascade',
        type: 'Signal Modulation',
        confidence: 72,
        reference: 'Chemical Biology (2019)',
        referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/'
      },
      {
        pathway: 'Receptor Binding',
        type: 'Allosteric Modulation',
        confidence: 64,
        reference: 'Journal of Biological Chemistry (2021)',
        referenceUrl: 'https://pubmed.ncbi.nlm.nih.gov/'
      }
    ];
  }

  createPathD(edge: PathwayEdge): string {
    const source = this.pathwayNodes.find(node => node.id === edge.source);
    const target = this.pathwayNodes.find(node => node.id === edge.target);

    if (!source || !target) return '';

    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2 - 15;

    return `M ${source.x} ${source.y} Q ${midX} ${midY}, ${target.x} ${target.y}`;
  }

  getConfidenceClass(confidence: number): string {
    if (confidence >= 80) return 'bg-success';
    if (confidence >= 60) return 'bg-info';
    if (confidence >= 40) return 'bg-warning';
    return 'bg-danger';
  }
}
