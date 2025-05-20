import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { VisualizationDashboardComponent } from './components/visualization-dashboard/visualization-dashboard.component';
import { CompoundDetailsComponent } from './components/compound-details/compound-details.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'dashboard', component: VisualizationDashboardComponent },
  { path: 'compound/:id', component: CompoundDetailsComponent },
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '**', redirectTo: '/search' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
