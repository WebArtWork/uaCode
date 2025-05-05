import {
	SimpleChanges,
	EventEmitter,
	Component,
	OnChanges,
	Output,
	Input,
} from '@angular/core';
import { SelectModule } from 'src/app/core/modules/select/select.module';
import { UacodequizparticipationService } from '../../services/uacodequizparticipation.service';
import { Uacodequizparticipation } from '../../interfaces/uacodequizparticipation.interface';

@Component({
	selector: 'uacodequizparticipation-selector',
	templateUrl: './uacodequizparticipation-selector.component.html',
	styleUrls: ['./uacodequizparticipation-selector.component.scss'],
	imports: [SelectModule],
})
export class UacodequizparticipationSelectorComponent implements OnChanges {
	@Input() value: string;

	@Output() wChange = new EventEmitter();

	get items(): Uacodequizparticipation[] {
		return this._uacodequizparticipationService.uacodequizparticipations;
	}

	constructor(private _uacodequizparticipationService: UacodequizparticipationService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['value'] && !changes['value'].firstChange) {
			this.value = changes['value'].currentValue;
		}
	}
}
