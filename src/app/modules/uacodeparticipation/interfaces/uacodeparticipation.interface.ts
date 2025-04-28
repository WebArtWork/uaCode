import { CrudDocument } from 'wacom';

export interface Uacodeparticipation extends CrudDocument {
	tournament: string;
	device: string;
	code: string;
	name: string;
}
