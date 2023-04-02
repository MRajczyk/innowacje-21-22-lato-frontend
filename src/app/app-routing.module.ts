import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { KiosksComponent } from './components/kiosks/kiosks.component';
import { SettingsComponent } from './components/settings/settings.component';
import {ManageTasksComponent} from "./components/manage-tasks/manage-tasks.component";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import { ManageRobotsComponent } from './components/manage-robots/manage-robots.component';
import { TaskTemplatesComponent } from "./components/task-templates/task-templates.component";
import { ManageRoutesComponent } from "./components/manage-routes/manage-routes.component";
import { ManageStandsComponent } from './components/manage-stands/manage-stands.component';

const routes: Routes = [
    {path: '', component: HomeComponent},

    {path: 'routes', component: ManageRoutesComponent},
    {path: 'maps', component: HomeComponent},
    {path: 'stands', component: ManageStandsComponent},
    {path: 'kiosks', component: KiosksComponent},
    {path: 'users', component: UserComponent},

    {path: 'data', component: HomeComponent},

    {path: 'manage_tasks', component: ManageTasksComponent},
    {path: 'tasks_templates', component: TaskTemplatesComponent},

    {path: 'manage_robots', component: ManageRobotsComponent},

    {path: 'settings', component: SettingsComponent},
    {path: 'about', component: HomeComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true}),
    MatListModule,
    MatIconModule,
    MatExpansionModule
  ],
  exports: [RouterModule],
  declarations: [],
  providers: []
})
export class AppRoutingModule { }
