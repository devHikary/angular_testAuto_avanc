import { PhotoBoardComponent } from './photo-board.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoFrameModule } from '../photo-frame/photo-frame.module';
import { PhotoBoardService } from './services/photo-board.service';



@NgModule({
  declarations: [PhotoBoardComponent],
  imports: [
    CommonModule,
    PhotoFrameModule
  ],
  exports:[PhotoBoardComponent],
  providers:[PhotoBoardService]
})
export class PhotoBoardModule { }
