import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, SimpleChange, SimpleChanges } from '@angular/core';

import { PhotoBoardComponent } from './photo-board.component';
import { buildPhotoList } from './test/build-photo-list';

describe(PhotoBoardComponent.name, () => {
  let component: PhotoBoardComponent;
  let fixture: ComponentFixture<PhotoBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotoBoardComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Should display rows and columns when (@Input photos) has value`, () => {
    component.photos = buildPhotoList();
    fixture.detectChanges();
    const change: SimpleChanges = {
      // Tem sempre o nome da input property que mudou
      photos: new SimpleChange([], component.photos, true)
    };
    component.ngOnChanges(change);
    expect(component.rows.length)
      .withContext('Number of rows')
      .toBe(2);
    expect(component.rows[0].length)
      .withContext('Number of columns from the first row')
      .toBe(4);
    expect(component.rows[1].length)
      .withContext('Number of columns from the second row')
      .toBe(4);
  });
});
