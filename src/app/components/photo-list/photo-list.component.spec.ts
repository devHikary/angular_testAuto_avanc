import { PhotoBoardService } from 'src/app/shared/components/photo-board/services/photo-board.service';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoListComponent } from './photo-list.component';
import { PhotoListModule } from './photo-list.module';
import { buildPhotoList } from 'src/app/shared/components/photo-board/test/build-photo-list';
import { of } from 'rxjs';

describe(PhotoListComponent.name, () => {
  let component: PhotoListComponent;
  let fixture: ComponentFixture<PhotoListComponent>;
  let service: PhotoBoardService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PhotoListModule,
        HttpClientModule
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(PhotoListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PhotoBoardService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`(D) Should display board when data arrives`, () => {
    fixture.detectChanges();
    const photos = buildPhotoList();
    spyOn(service, 'getPhotos')
      .and.returnValue(of(photos));
  });
});
