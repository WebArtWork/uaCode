import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { CommandsComponent } from './commands.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		component: CommandsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes), CoreModule],
	declarations: [CommandsComponent]
})
export class CommandsModule {}
