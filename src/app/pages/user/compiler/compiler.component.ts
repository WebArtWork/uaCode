import { Component } from '@angular/core';
import { UserService } from 'src/app/modules/user/services/user.service';
import { FormInterface } from 'src/app/core/modules/form/interfaces/form.interface';
import { FormService } from 'src/app/core/modules/form/form.service';
import { UacodeService } from 'src/app/core/services/uacode.service';
import { Router } from '@angular/router';

@Component({
	templateUrl: './compiler.component.html',
	styleUrls: ['./compiler.component.scss'],
	standalone: false,
})
export class CompilerComponent {
	formDoc: FormInterface = this._form.getForm('docForm', {
		formId: 'docForm',
		title: 'Doc form',
		components: [
			{
				name: 'Text',
				key: 'code',
				fields: [
					{
						name: 'Placeholder',
						value: 'Enter your bio',
					},
					{
						name: 'Label',
						value: 'Bio',
					},
					{
						name: 'Textarea',
						value: true,
					},
				],
			},
			{
				name: 'Button',
				fields: [
					{
						name: 'Label',
						value: "Let's go",
					},
					{
						name: 'Submit',
						value: true,
					},
				],
			},
			{
				name: 'Text',
				key: 'output',
				fields: [
					{
						name: 'Placeholder',
						value: 'Enter your bio',
					},
					{
						name: 'Label',
						value: 'Bio',
					},
					{
						name: 'Textarea',
						value: true,
					},
				],
			},
		],
	});

	submition: Record<string, string> = {
		code: '',
		output: ''
	}

	isMenuOpen = false;

	constructor(public userService: UserService, private _form: FormService, private uacodeService: UacodeService, private _router: Router) 
	{
		this.submition['code'] = this.uacodeService.getExample(Number(this._router.url.replace('/compiler/example/', '')));
	}

	back(): void {
		window.history.back();
	}
}
