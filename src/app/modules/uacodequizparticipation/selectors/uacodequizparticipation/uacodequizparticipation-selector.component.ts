import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges
} from '@angular/core';
import { SelectModule } from 'src/app/core/modules/select/select.module';
import { Uacodequizparticipation } from '../../interfaces/uacodequizparticipation.interface';
import { UacodequizparticipationService } from '../../services/uacodequizparticipation.service';

@Component({
	selector: 'uacodequizparticipation-selector',
	templateUrl: './uacodequizparticipation-selector.component.html',
	styleUrls: ['./uacodequizparticipation-selector.component.scss'],
	imports: [SelectModule]
})
export class UacodequizparticipationSelectorComponent implements OnChanges {
	@Input() value: string;

	@Output() wChange = new EventEmitter();

	get items(): Uacodequizparticipation[] {
		return this._uacodequizparticipationService.uacodequizparticipations;
	}

	constructor(
		private _uacodequizparticipationService: UacodequizparticipationService
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['value'] && !changes['value'].firstChange) {
			this.value = changes['value'].currentValue;
		}
	}
}
