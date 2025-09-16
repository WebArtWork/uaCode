import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { HttpService } from 'wacom';
import { Uacodeclass } from './modules/uacodeclass/interfaces/uacodeclass.interface';
import { UacodeclassService } from './modules/uacodeclass/services/uacodeclass.service';
import { UserService } from './modules/user/services/user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: false
})
export class AppComponent {
	constructor(
		private _router: Router,
		private _userService: UserService,
		public classService: UacodeclassService,
		private _http: HttpService
	) {
		this._userService.setMode('white');

		if (Capacitor.isNativePlatform()) {
			App.addListener('appUrlOpen', ({ url }) => {
				if (url.includes('join')) {
					this._http
						.post('/api/uacode/class/join', {
							_id: url.split('join/')[1]
						})
						.subscribe((classDocument: Uacodeclass) => {
							if (classDocument) {
								this.classService.classes.push(classDocument);

								this.classService.classId = classDocument._id;
							}
						});
				} else if (url.includes('device')) {
					this._userService.device = url.split('device/')[1];

					localStorage.setItem('deviceId', this._userService.device);
				} else {
					this._router.navigateByUrl('/compiler').then(() => {
						this._router.navigateByUrl(
							'/compiler' + new URL(url).pathname
						);
					});
				}
			});
		}
	}
}
