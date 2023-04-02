import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {HostListener} from '@angular/core';
import { RobotsService } from 'src/app/services/robots.service';
import { filter, interval, map, startWith, Subscription, switchMap } from 'rxjs';

const ROBOTS_ERROR_POOLING_INTERVAL = 5000;
const STATUS_ERROR: string = 'ERROR';
const STATUS_WARNING: string = 'WARNING';

@Component({
  selector: 'ra-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit, OnDestroy {

  iconsPath: string = "./assets/"
  navList: navItem[];
  navListBottom: navItem[];
  bottomNavListToggleClass: string = 'bottomStick';

  timeInterval!: Subscription;
  robotsError: boolean = false;
  robotsWarning: boolean = false;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private robotsService: RobotsService  // for notification icon if any robot error occured
  ) {

    this.navList = navList;
    this.navListBottom = navListBottom;

    navList.forEach((navItem) => {
      this.matIconRegistry.addSvgIcon(
        navItem.icon.split(".")[0],
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/" + navItem.icon)
      );
    });

    navListBottom.forEach((navItem) => {
      this.matIconRegistry.addSvgIcon(
        navItem.icon.split(".")[0],
        this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/" + navItem.icon)
      );
    });
  }

  @HostListener('window:resize', ['$event'])
  getScreenHeight(){
    if(window.innerHeight<=412){
      this.bottomNavListToggleClass = 'bottomRelative';
    }else{
      this.bottomNavListToggleClass = 'bottomStick';
    }
  }

  ngOnInit(): void {
    this.timeInterval = interval(ROBOTS_ERROR_POOLING_INTERVAL)
    .pipe(
      startWith(0),
      switchMap(() => this.robotsService.getAll()),
    ).subscribe({
      next: (robots) => {
        const statuses = robots.map(robot => robot.status);

        if(statuses.includes(STATUS_ERROR)) {
          this.robotsError = true;
        } else {
          this.robotsError = false;
        }

        if(statuses.includes(STATUS_WARNING)) {
          this.robotsWarning = true;
        } else {
          this.robotsWarning = false;
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.timeInterval.unsubscribe();
  }
}

export class navItem {
  itemName: string;
  icon: string;
  routerLink?: string;
  subItems?: navItem[];

  constructor(_itemName: string, _icon: string, _routerLink: string, _dropDown: boolean, _subItems: navItem[]) {
    this.itemName = _itemName;
    this.icon = _icon;
    this.routerLink = _routerLink;
    this.subItems = _subItems;
  }
}

export var navList: navItem[] = [
  {
    itemName: 'Strona główna', icon: "home_icon.svg", routerLink: ""
  },
  {
    itemName: 'Zarządzaj', icon: "manage_icon.svg",
    subItems: [
      {
        itemName: 'Trasy', icon: "", routerLink: "/routes"
      },
      {
        itemName: 'Stanowiska', icon: "", routerLink: "/stands"
      },
      {
        itemName: 'Kioski', icon: "", routerLink: "/kiosks"
      },
      {
        itemName: 'Użytkownicy', icon: "", routerLink: "/users"
      }
    ]
  },
  {
    itemName: 'Dane', icon: "data_icon.svg", routerLink: "/data"
  },
  {
    itemName: 'Zadania', icon: "tasks_icon.svg",
    subItems: [
      {
        itemName: 'Zarządzaj zadaniami', icon: "", routerLink: "/manage_tasks"
      },
      {
        itemName: 'Szablony zadań', icon: "", routerLink: "/tasks_templates"
      }
    ]
  },
  {
    itemName: 'Zarządzaj robotami', icon: "manage_robots_icon.svg", routerLink: "/manage_robots"
  }
];
export var navListBottom: navItem[] = [
  {
    itemName: 'Ustawienia', icon: "settings_icon.svg", routerLink: "/settings"
  },
  {
    itemName: 'Informacje o aplikacji', icon: "about_icon.svg", routerLink: "/about"
  }
];

