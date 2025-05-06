import { CrudDocument } from 'wacom';

export interface Uacodequiz extends CrudDocument {
	name: string;
	description: string;
	class: string;
}
