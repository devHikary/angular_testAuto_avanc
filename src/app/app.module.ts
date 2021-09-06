import { PhotoListModule } from './components/photo-list/photo-list.module';
import { PhotoBoardModule } from './shared/components/photo-board/photo-board.module';
import { PhotoFrameModule } from './shared/components/photo-frame/photo-frame.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LikeWidgetModule } from './shared/components/like-widget/like-widget.module';
import { HttpClientModule } from '@angular/common/http';
import { PhotoListComponent } from './components/photo-list/photo-list.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PhotoListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
