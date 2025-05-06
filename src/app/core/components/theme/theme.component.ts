import { Component } from '@angular/core';
import { UserService } from 'src/app/modules/user/services/user.service';
@Component({
	selector: 'core-theme',
	templateUrl: './theme.component.html',
	styleUrls: ['./theme.component.scss'],
	standalone: false
})
export class ThemeComponent {
	constructor(public us: UserService) {}
}
