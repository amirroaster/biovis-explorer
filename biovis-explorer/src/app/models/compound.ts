export interface Compound {
  cid: number;
  molecularFormula?: string;
  molecularWeight?: number;
  iupacName?: string;
  canonicalSmiles?: string;
  inchiKey?: string;
  xlogp?: number;
  charge?: number;
  hBondDonorCount?: number;
  hBondAcceptorCount?: number;
  rotatableBondCount?: number;
  exactMass?: number;
  monoisotopicMass?: number;
  complexity?: number;
  heavyAtomCount?: number;
  imageUrl?: string;
}
