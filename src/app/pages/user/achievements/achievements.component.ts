import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	templateUrl: './achievements.component.html',
	standalone: false
})
export class AchievementsComponent {
	// title Досягнення
	readonly method =
		(this._router.url.split('/').length > 3 &&
			this._router.url.split('/')[3].split('%20').join(' ')) ||
		'';

	readonly isClass =
		this._router.url.split('/').length > 2 &&
		this._router.url.split('/')[2] === 'class';

	constructor(private _router: Router) {}
}
