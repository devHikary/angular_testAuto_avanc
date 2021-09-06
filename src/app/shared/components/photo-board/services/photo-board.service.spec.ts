import { flush, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PhotoBoardService } from './photo-board.service';

const mockData = {
  api:'http://localhost:3000/photos',
  data:[
    {
      id: 1,
      description: 'example 1',
    },
    {
      id: 2,
      description: 'example 2',
    }
  ]
}

describe(PhotoBoardService.name, () => {
  let service: PhotoBoardService;
  let httpController: HttpTestingController;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PhotoBoardService]
    }).compileComponents();
    service = TestBed.inject(PhotoBoardService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it(`#${PhotoBoardService.prototype.getPhotos.name}`, done => {
    service.getPhotos().subscribe(photos => {
      expect(photos[0].description).toBe('EXAMPLE 1');
      expect(photos[1].description).toBe('EXAMPLE 2');
      done();
    });
    httpController
    .expectOne(mockData.api)
    .flush(mockData.data);
  });

});
