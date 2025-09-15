import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges
} from '@angular/core';
import { SelectModule } from 'src/app/core/modules/select/select.module';
import { Uacodeclass } from '../../interfaces/uacodeclass.interface';
import { UacodeclassService } from '../../services/uacodeclass.service';

@Component({
	selector: 'uacodeclass-selector',
	templateUrl: './uacodeclass-selector.component.html',
	styleUrls: ['./uacodeclass-selector.component.scss'],
	imports: [SelectModule]
})
export class UacodeclassSelectorComponent implements OnChanges {
	@Input() value: string;

	@Output() wChange = new EventEmitter();

	get items(): Uacodeclass[] {
		return this._uacodeclassService.uacodeclasss;
	}

	constructor(private _uacodeclassService: UacodeclassService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['value'] && !changes['value'].firstChange) {
			this.value = changes['value'].currentValue;
		}
	}
}
