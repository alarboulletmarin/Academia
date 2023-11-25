import {Component, OnInit} from '@angular/core';
import {SidenavService} from '../core/services/sidenav/sidenav.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
})
export class SidenavComponent implements OnInit {
  public isOpen = false;
  public user$ = this.sidenavService.user;

  constructor(private sidenavService: SidenavService) {
    this.sidenavService.sidenavOpen$.subscribe((open) => (this.isOpen = open));
  }

  ngOnInit(): void {
    this.sidenavService.getUser();
  }
}
