import { CrudDocument } from 'wacom';

export interface Uacodequizparticipation extends CrudDocument {
	grade: string;
	name: string;
	code: string;
	quiz: string;
	device: string;
	points: number;
}
