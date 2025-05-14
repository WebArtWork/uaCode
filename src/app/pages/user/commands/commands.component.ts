import { Component } from '@angular/core';
import { UacodeService } from 'src/app/core/services/uacode.service';

@Component({
	templateUrl: './commands.component.html',
	styleUrls: ['./commands.component.scss'],
	standalone: false
})
export class CommandsComponent {
	isMenuOpen = false;

	constructor(public uaCodeServise: UacodeService) {}

	back(): void {
		window.history.back();
	}
}
