import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Compound } from '../models/compound';
import { SearchResult } from '../models/search-result';

@Injectable({
  providedIn: 'root'
})
export class PubchemService {
  private baseUrl = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

  constructor(private http: HttpClient) { }

  getAutocompleteSuggestions(query: string): Observable<string[]> {
    const self = this;

    if (!query || query.length < 2) {
      return Observable.create(function(observer) {
        observer.next([]);
        observer.complete();
      });
    }

    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${encodeURIComponent(query)}/json`;

    return this.http.get(url).pipe(
      map(function(response: any) {
        if (response && response.dictionary_terms && response.dictionary_terms.compound) {
          return response.dictionary_terms.compound;
        }
        return [];
      }),
      catchError(function(error) {
        console.error('Error fetching autocomplete suggestions:', error);
        return Observable.create(function(observer) {
          observer.next([]);
          observer.complete();
        });
      })
    );
  }

  searchByName(query: string): Observable<SearchResult> {
    const self = this;
    return this.http.get(`${this.baseUrl}/compound/name/${encodeURIComponent(query)}/cids/JSON`)
      .pipe(
        map(function(response: any) {
          return {
            cids: response.IdentifierList.CID || [],
            total: (response.IdentifierList.CID || []).length
          };
        }),
        catchError(function(error) {
          console.error('API Error:', error);
          return throwError(new Error('Something went wrong with the PubChem API. Please try again.'));
        })
      );
  }

  searchByFormula(formula: string): Observable<SearchResult> {
    const self = this;
    return this.http.get(`${this.baseUrl}/compound/formula/${encodeURIComponent(formula)}/cids/JSON`)
      .pipe(
        map(function(response: any) {
          return {
            cids: response.IdentifierList.CID || [],
            total: (response.IdentifierList.CID || []).length
          };
        }),
        catchError(function(error) {
          console.error('API Error:', error);
          return throwError(new Error('Something went wrong with the PubChem API. Please try again.'));
        })
      );
  }

  getCompound(cid: number): Observable<Compound> {
    const self = this;
    const properties = [
      'MolecularFormula',
      'MolecularWeight',
      'SMILES',
      'IUPACName',
      'XLogP',
      'HBondDonorCount',
      'HBondAcceptorCount',
      'RotatableBondCount',
      'ExactMass',
      'MonoisotopicMass',
      'Complexity',
      'HeavyAtomCount',
      'Charge',
      'InChIKey'
    ].join(',');

    return this.http.get(`${this.baseUrl}/compound/cid/${cid}/property/${properties}/JSON`)
      .pipe(
        map(function(response: any) {
          const props = response.PropertyTable.Properties[0];
          return {
            cid: cid,
            molecularFormula: props.MolecularFormula,
            molecularWeight: props.MolecularWeight,
            canonicalSmiles: props.SMILES,
            iupacName: props.IUPACName,
            xlogp: props.XLogP,
            hBondDonorCount: props.HBondDonorCount,
            hBondAcceptorCount: props.HBondAcceptorCount,
            rotatableBondCount: props.RotatableBondCount,
            exactMass: props.ExactMass,
            monoisotopicMass: props.MonoisotopicMass,
            complexity: props.Complexity,
            heavyAtomCount: props.HeavyAtomCount,
            charge: props.Charge,
            inchiKey: props.InChIKey,
            imageUrl: `${self.baseUrl}/compound/cid/${cid}/PNG?record_type=2d&image_size=300x300`
          };
        }),
        catchError(function(error) {
          console.error('API Error:', error);
          return throwError(new Error('Something went wrong with the PubChem API. Please try again.'));
        })
      );
  }

  getBulkCompounds(cids: number[]): Observable<Compound[]> {
    const self = this;

    if (!cids || cids.length === 0) {
      return throwError(new Error('No CIDs provided'));
    }

    const properties = [
      'MolecularFormula',
      'MolecularWeight',
      'IUPACName'
    ].join(',');

    return this.http.get(`${this.baseUrl}/compound/cid/${cids.join(',')}/property/${properties}/JSON`)
      .pipe(
        map(function(response: any) {
          return response.PropertyTable.Properties.map(function(prop) {
            return {
              cid: prop.CID,
              molecularFormula: prop.MolecularFormula,
              molecularWeight: prop.MolecularWeight,
              iupacName: prop.IUPACName,
              imageUrl: `${self.baseUrl}/compound/cid/${prop.CID}/PNG?record_type=2d&image_size=150x150`
            };
          });
        }),
        catchError(function(error) {
          console.error('API Error:', error);
          return throwError(new Error('Something went wrong with the PubChem API. Please try again.'));
        })
      );
  }
}
