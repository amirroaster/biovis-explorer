import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';
import { VisualizationDashboardComponent } from './components/visualization-dashboard/visualization-dashboard.component';
import { CompoundDetailsComponent } from './components/compound-details/compound-details.component';
import { PathwayAnalysisComponent } from './components/pathway-analysis/pathway-analysis.component';
import { DockingSimulationComponent } from './components/docking-simulation/docking-simulation.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'advanced-search', component: AdvancedSearchComponent },
  { path: 'dashboard', component: VisualizationDashboardComponent },
  { path: 'compound/:id', component: CompoundDetailsComponent },
  { path: 'pathway-analysis', component: PathwayAnalysisComponent },
  { path: 'docking-simulation', component: DockingSimulationComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '**', redirectTo: '/search' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
