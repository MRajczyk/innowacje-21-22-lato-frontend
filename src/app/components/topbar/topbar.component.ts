import {Component, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {UserService} from 'src/app/services/user.service';
import {map} from "rxjs";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'ra-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.sass']
})
export class TopbarComponent implements OnInit {

  instanceName: string | undefined;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private userService: UserService,
    private instanceInfoService: SettingsService
  ) {
    this.matIconRegistry.addSvgIcon(
      "hetbot_logo",
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/main_hetbot_logo.svg')
    )
  }

  ngOnInit(): void {
    this.onInstanceInfoFetch();
  }

  onInstanceInfoFetch() {
    this.fetchInstanceName();
  }

  onLogOut(): void {
    this.userService.logOut();
  }

  fetchInstanceName() {
    this.instanceInfoService.getInstanceInfo().pipe(
      map(response => response.instanceName)
    )
      .subscribe((name) => {
      this.instanceName = name;
    });
  }

}
