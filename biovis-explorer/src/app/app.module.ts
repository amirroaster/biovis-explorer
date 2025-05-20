import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { CompoundDetailsComponent } from './components/compound-details/compound-details.component';
import { VisualizationDashboardComponent } from './components/visualization-dashboard/visualization-dashboard.component';
import { StructureViewerComponent } from './components/structure-viewer/structure-viewer.component';
import { PropertyChartComponent } from './components/property-chart/property-chart.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    CompoundDetailsComponent,
    VisualizationDashboardComponent,
    StructureViewerComponent,
    PropertyChartComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
