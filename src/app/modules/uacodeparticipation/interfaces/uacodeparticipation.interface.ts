import { CrudDocument } from 'wacom';

export interface Uacodeparticipation extends CrudDocument {
	tournament: string;
	method?: string;
	points: number;
	device: string;
	code: string;
	name: string;
}
