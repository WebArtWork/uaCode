import { CrudDocument } from 'wacom';

export interface Uacodequizparticipation extends CrudDocument {
	name: string;
	code: string;
	quiz: string;
	device: string;
	points: number;
}
