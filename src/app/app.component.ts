import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { UserService } from './modules/user/services/user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: false
})
export class AppComponent {
	constructor(private _router: Router, private _userService: UserService) {
		this._userService.setMode('white');

		if (Capacitor.isNativePlatform()) {
			App.addListener('appUrlOpen', ({ url }) => {
				this._router.navigateByUrl('/compiler').then(() => {
					this._router.navigateByUrl(
						'/compiler' + new URL(url).pathname
					);
				});
			});
		}
	}
}
