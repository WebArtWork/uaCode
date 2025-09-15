import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ButtonModule } from '../button/button.module';
import { FileCropperComponent } from './file-cropper/file-cropper.component';
import { FileComponent } from './file.component';

@NgModule({
	declarations: [FileCropperComponent, FileComponent],
	exports: [FileComponent],
	imports: [ImageCropperModule, CommonModule, ButtonModule]
})
export class FileModule {}
