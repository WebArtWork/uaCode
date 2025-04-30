import { CrudDocument } from 'wacom';

export interface Uacodetournament extends CrudDocument {
	name: string;
	isPrivate: boolean;
	device: string;
	method: 'Rock, Paper, Scissors';
	code: number;
	description: string;
	tags: string[];
}
