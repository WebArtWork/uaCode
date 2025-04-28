import {
	SimpleChanges,
	EventEmitter,
	Component,
	OnChanges,
	Output,
	Input,
} from '@angular/core';
import { SelectModule } from 'src/app/core/modules/select/select.module';
import { UacodetournamentService } from '../../services/uacodetournament.service';
import { Uacodetournament } from '../../interfaces/uacodetournament.interface';

@Component({
	selector: 'uacodetournament-selector',
	templateUrl: './uacodetournament-selector.component.html',
	styleUrls: ['./uacodetournament-selector.component.scss'],
	imports: [SelectModule],
})
export class UacodetournamentSelectorComponent implements OnChanges {
	@Input() value: string;

	@Output() wChange = new EventEmitter();

	get items(): Uacodetournament[] {
		return this._uacodetournamentService.uacodetournaments;
	}

	constructor(private _uacodetournamentService: UacodetournamentService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['value'] && !changes['value'].firstChange) {
			this.value = changes['value'].currentValue;
		}
	}
}
