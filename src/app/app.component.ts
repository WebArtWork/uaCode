import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	standalone: false
})
export class AppComponent {
	constructor(private _router: Router) {
		if (Capacitor.isNativePlatform()) {
			App.addListener('appUrlOpen', ({ url }) => {
				alert(JSON.stringify(url));
				alert(new URL(url).pathname);
				this._router.navigateByUrl(new URL(url).pathname);
			});
		}
	}
}
