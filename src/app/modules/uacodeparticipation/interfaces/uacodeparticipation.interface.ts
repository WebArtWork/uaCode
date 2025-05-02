import { CrudDocument } from 'wacom';

export interface Uacodeparticipation extends CrudDocument {
	tournament: string;
	points: number;
	device: string;
	code: string;
	name: string;
}
