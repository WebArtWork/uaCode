import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// Core
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from 'src/app/core/core.module';
import { AppComponent } from './app.component';
import { GuestComponent } from './core/theme/guest/guest.component';
import { PublicComponent } from './core/theme/public/public.component';
import { UserComponent } from './core/theme/user/user.component';
// config
import { environment } from 'src/environments/environment';
import { MetaGuard, WacomModule } from 'wacom';
// guards
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import * as io from 'socket.io-client';
import { AdminsGuard } from './core/guards/admins.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';
import { GuestGuard } from './core/guards/guest.guard';

const routes: Routes = [
	{
		path: '',
		component: PublicComponent,
		children: [
			/* user */
			{
				path: '',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Меню'
					}
				},
				loadChildren: () =>
					import('./pages/user/menu/menu.module').then(
						(m) => m.MenuModule
					)
			},
			{
				path: 'franchise',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Франшиза'
					}
				},
				loadChildren: () =>
					import('./pages/user/franchise/franchise.module').then(
						(m) => m.FranchiseModule
					)
			},
			{
				path: 'mentor',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Ментор'
					}
				},
				loadChildren: () =>
					import('./pages/user/mentor/mentor.module').then(
						(m) => m.MentorModule
					)
			},
			{
				path: 'opt',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Оптове замовлення книг'
					}
				},
				loadChildren: () =>
					import('./pages/user/opt/opt.module').then(
						(m) => m.OptModule
					)
			},
			{
				path: 'privacy',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Privacy'
					}
				},
				loadChildren: () =>
					import('./pages/user/privacy/privacy.module').then(
						(m) => m.PrivacyModule
					)
			},
			{
				path: 'achievements',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Досягнення'
					}
				},
				loadChildren: () =>
					import(
						'./pages/user/achievements/achievements.module'
					).then((m) => m.AchievementsModule)
			},
			{
				path: 'store',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Магазин'
					}
				},
				loadChildren: () =>
					import('./pages/user/store/store.module').then(
						(m) => m.StoreModule
					)
			},
			{
				path: 'quiz',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Вікторина'
					}
				},
				loadChildren: () =>
					import('./pages/user/quiz/quiz.module').then(
						(m) => m.QuizModule
					)
			},
			{
				path: 'quizzes',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Вікторини'
					}
				},
				loadChildren: () =>
					import('./pages/user/quizzes/quizzes.module').then(
						(m) => m.QuizzesModule
					)
			},
			{
				path: 'tournament',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Турнір'
					}
				},
				loadChildren: () =>
					import('./pages/user/tournament/tournament.module').then(
						(m) => m.TournamentModule
					)
			},
			{
				path: 'tournaments',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Турніри'
					}
				},
				loadChildren: () =>
					import('./pages/user/tournaments/tournaments.module').then(
						(m) => m.TournamentsModule
					)
			},
			{
				path: 'commands',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Команди'
					}
				},
				loadChildren: () =>
					import('./pages/user/commands/commands.module').then(
						(m) => m.CommandsModule
					)
			},
			{
				path: 'compiler',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Компілятор'
					}
				},
				loadChildren: () =>
					import('./pages/user/compiler/compiler.module').then(
						(m) => m.CompilerModule
					)
			},
			{
				path: 'sign',
				canActivate: [MetaGuard],
				data: {
					meta: {
						title: 'Sign'
					}
				},
				loadChildren: () =>
					import('./pages/guest/sign/sign.module').then(
						(m) => m.SignModule
					)
			}
		]
	},
	{
		path: '**',
		redirectTo: 'compiler',
		pathMatch: 'full'
	}
];

@NgModule({
	declarations: [
		AppComponent,
		GuestComponent,
		UserComponent,
		PublicComponent
	],
	imports: [
		QRCodeComponent,
		CoreModule,
		BrowserModule,
		BrowserAnimationsModule,
		WacomModule.forRoot({
			store: {},
			http: {
				url: environment.url
			},
			socket: {
				url: environment.url
			},
			io,
			meta: {
				useTitleSuffix: true,
				defaults: {
					title: environment.meta.title,
					favicon: environment.meta.favicon,
					description: environment.meta.description,
					titleSuffix: ' | ' + environment.meta.title,
					'og:image': environment.meta.image
				}
			},
			modal: {
				modals: {
					/* modals */
				}
			},
			alert: {
				alerts: {
					/* alerts */
				}
			},
			loader: {
				loaders: {
					/* loaders */
				}
			},
			popup: {
				popups: {
					/* popups */
				}
			}
		}),
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'enabled',
			preloadingStrategy: PreloadAllModules
		})
	],
	providers: [
		/* providers */
		{ provide: LocationStrategy, useClass: HashLocationStrategy },
		AuthenticatedGuard,
		GuestGuard,
		AdminsGuard
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
