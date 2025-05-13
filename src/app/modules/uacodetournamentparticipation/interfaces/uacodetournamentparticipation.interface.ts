import { CrudDocument } from 'wacom';

export interface Uacodetournamentparticipation extends CrudDocument {
	points: number;
	class?: string;
	method: string;
	device: string;
	name: string;
	code: string;
}
