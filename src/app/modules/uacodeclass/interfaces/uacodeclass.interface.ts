import { CrudDocument } from 'wacom';

export interface Uacodeclass extends CrudDocument {
	device: string;
	name: string;
	description: string;
	code: number;
}
