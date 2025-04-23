import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { CompilerComponent } from './compiler.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: CompilerComponent
	}, {
		path: 'command/:id',
		component: CompilerComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [CompilerComponent]
})
export class CompilerModule { }
