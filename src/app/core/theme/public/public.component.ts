import { Component } from '@angular/core';
import { UserService } from 'src/app/modules/user/services/user.service';
import { Location } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';

@Component({
	selector: 'app-public',
	standalone: false,
	templateUrl: './public.component.html',
	styleUrl: './public.component.scss'
})
export class PublicComponent {
  	private hasHistory = false;
	constructor(public us: UserService, private router: Router, private location: Location) {this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.hasHistory = true;
      }
    });}
	goBack(): void {
    if (this.hasHistory) {
      this.location.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
