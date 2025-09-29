import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Component({
	selector: 'app-menu',
	standalone: false,
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.scss'
})
export class MenuComponent {
	isWeb = Capacitor.getPlatform() === 'web';
}
