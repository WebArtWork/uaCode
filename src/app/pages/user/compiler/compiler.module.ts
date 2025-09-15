import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from 'src/app/core/core.module';
import { CompilerComponent } from './compiler.component';

const routes: Routes = [
	{
		path: '',
		component: CompilerComponent
	},
	{
		path: 'command/:id',
		component: CompilerComponent
	},
	{
		path: 'question/:id',
		component: CompilerComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [CompilerComponent]
})
export class CompilerModule {}
