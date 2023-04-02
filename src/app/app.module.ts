import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { AuthWallComponent } from './components/authwall/authwall.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { HomeComponent } from './components/home/home.component';
import { SettingsComponent } from './components/settings/settings.component';
import { KiosksComponent } from './components/kiosks/kiosks.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {CommonModule} from '@angular/common';
import {TopbarComponent} from './components/topbar/topbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {HttpClientModule} from "@angular/common/http";
import {FlexLayoutModule} from "@angular/flex-layout";
import {ManageTasksComponent} from './components/manage-tasks/manage-tasks.component';
import {TaskItemComponent} from './components/manage-tasks/task-item/task-item.component';
import {MapComponent} from './components/map/map.component';
import {ManageRoutesComponent} from './components/manage-routes/manage-routes.component';
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ManageRobotsComponent} from './components/manage-robots/manage-robots.component';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatFormFieldModule} from "@angular/material/form-field";
import {KioskElementComponent} from './components/kiosks/kiosk-element/kiosk-element.component';
import {KioskDialogComponent} from './components/kiosks/kiosk-dialog/kiosk-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {Ng2SearchPipeModule} from "ng2-search-filter";
import {ManageStandsComponent} from './components/manage-stands/manage-stands.component';
import {SidebarModule} from 'primeng/sidebar';
import {InputSwitchModule} from "primeng/inputswitch";
import {SelectButtonModule} from "primeng/selectbutton";
import {TabViewModule} from 'primeng/tabview';
import {ButtonModule} from 'primeng/button';
import {SettingsMapsComponent} from './components/settings/settings-maps/settings-maps.component';
import {SettingsInstancesComponent} from './components/settings/settings-instances/settings-instances.component';
import {EditBehaviourDialogComponent} from './components/edit-behaviour-dialog/edit-behaviour-dialog.component';
import {BehavioursDragAndDropComponent} from './components/behaviours-drag-and-drop/behaviours-drag-and-drop.component';
import {TaskTemplatesComponent} from './components/task-templates/task-templates.component';
import {TemplateItemComponent} from './components/task-templates/template-item/template-item.component';
import {MatTabsModule} from "@angular/material/tabs";
import {SmallTaskItemComponent} from './components/home/small-task-item/small-task-item.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {UserComponent} from "./components/user/user.component";
import {UserElementComponent} from "./components/user/user-element/user-element.component";
import {UserDialogComponent} from './components/user/user-dialog/user-dialog.component';
import {KioskUpdateDialogComponent} from './components/kiosks/kiosk-update-dialog/kiosk-update-dialog.component';
import {DialogModule} from "primeng/dialog";
import { LegendComponent } from './components/map/legend/legend.component';
import { UserUpdateDialogComponent } from './components/user/user-update-dialog/user-update-dialog.component';
import { SearchPipe } from './search.pipe';

@NgModule({
  declarations: [
    UserComponent,
    UserElementComponent,
    AppComponent,
    AuthWallComponent,
    HomeComponent,
    SettingsComponent,
    KiosksComponent,
    NavbarComponent,
    AuthFormComponent,
    TopbarComponent,
    NavbarComponent,
    ManageTasksComponent,
    TaskItemComponent,
    ManageRobotsComponent,
    SettingsMapsComponent,
    SettingsInstancesComponent,
    ManageRobotsComponent,
    MapComponent,
    ManageRoutesComponent,
    ManageStandsComponent,
    KioskElementComponent,
    KioskDialogComponent,
    EditBehaviourDialogComponent,
    BehavioursDragAndDropComponent,
    BehavioursDragAndDropComponent,
    TaskTemplatesComponent,
    TemplateItemComponent,
    SmallTaskItemComponent,
    UserDialogComponent,
    KioskUpdateDialogComponent,
    LegendComponent,
    UserUpdateDialogComponent,
    SearchPipe,
  ],
    imports: [
      RouterModule,
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      MatSidenavModule,
      MatListModule,
      MatExpansionModule,
      MatCheckboxModule,
      MatIconModule,
      CommonModule,
      MatToolbarModule,
      HttpClientModule,
      FormsModule,
      FlexLayoutModule,
      MatButtonToggleModule,
      MatFormFieldModule,
      MatInputModule,
      MatDialogModule,
      Ng2SearchPipeModule,
      ReactiveFormsModule,
      SidebarModule,
      InputSwitchModule,
      SelectButtonModule,
      TabViewModule,
      MatRippleModule,
      DragDropModule,
      ScrollingModule,
      MatSelectModule,
      MatButtonModule,
      MatChipsModule,
      DialogModule,
      ButtonModule,
      MatTabsModule,
      MatDatepickerModule,
      MatNativeDateModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {

  }
}
