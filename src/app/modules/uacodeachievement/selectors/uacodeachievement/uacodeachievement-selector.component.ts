import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges
} from '@angular/core';
import { SelectModule } from 'src/app/core/modules/select/select.module';
import { Uacodeachievement } from '../../interfaces/uacodeachievement.interface';
import { UacodeachievementService } from '../../services/uacodeachievement.service';

@Component({
	selector: 'uacodeachievement-selector',
	templateUrl: './uacodeachievement-selector.component.html',
	styleUrls: ['./uacodeachievement-selector.component.scss'],
	imports: [SelectModule]
})
export class UacodeachievementSelectorComponent implements OnChanges {
	@Input() value: string;

	@Output() wChange = new EventEmitter();

	get items(): Uacodeachievement[] {
		return this._uacodeachievementService.uacodeachievements;
	}

	constructor(private _uacodeachievementService: UacodeachievementService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['value'] && !changes['value'].firstChange) {
			this.value = changes['value'].currentValue;
		}
	}
}
