import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { VisualizationDashboardComponent } from './components/visualization-dashboard/visualization-dashboard.component';
import { CompoundDetailsComponent } from './components/compound-details/compound-details.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { StructureViewerComponent } from './components/structure-viewer/structure-viewer.component';
import { PropertyChartComponent } from './components/property-chart/property-chart.component';
import { MoleculeViewerComponent } from './components/molecule-viewer/molecule-viewer.component';
import { BioactivitySummaryComponent } from './components/bioactivity-summary/bioactivity-summary.component';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';
import { PathwayAnalysisComponent } from './components/pathway-analysis/pathway-analysis.component';
import { DockingSimulationComponent } from './components/docking-simulation/docking-simulation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    VisualizationDashboardComponent,
    CompoundDetailsComponent,
    HeaderComponent,
    FooterComponent,
    StructureViewerComponent,
    PropertyChartComponent,
    MoleculeViewerComponent,
    BioactivitySummaryComponent,
    AdvancedSearchComponent,
    PathwayAnalysisComponent,
    DockingSimulationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
