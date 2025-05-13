import {
	SimpleChanges,
	EventEmitter,
	Component,
	OnChanges,
	Output,
	Input,
} from '@angular/core';
import { SelectModule } from 'src/app/core/modules/select/select.module';
import { UacodetournamentparticipationService } from '../../services/uacodetournamentparticipation.service';
import { Uacodetournamentparticipation } from '../../interfaces/uacodetournamentparticipation.interface';

@Component({
	selector: 'uacodetournamentparticipation-selector',
	templateUrl: './uacodetournamentparticipation-selector.component.html',
	styleUrls: ['./uacodetournamentparticipation-selector.component.scss'],
	imports: [SelectModule],
})
export class UacodetournamentparticipationSelectorComponent implements OnChanges {
	@Input() value: string;

	@Output() wChange = new EventEmitter();

	get items(): Uacodetournamentparticipation[] {
		return this._uacodetournamentparticipationService.uacodetournamentparticipations;
	}

	constructor(private _uacodetournamentparticipationService: UacodetournamentparticipationService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['value'] && !changes['value'].firstChange) {
			this.value = changes['value'].currentValue;
		}
	}
}
