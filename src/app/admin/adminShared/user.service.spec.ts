import { TestBed, inject } from '@angular/core/testing';
import { AdminSharedService } from './user.service';

describe('AdminSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminSharedService]
    });
  });

  it('should ...', inject([AdminSharedService], (service: AdminSharedService) => {
    expect(service).toBeTruthy();
  }));
});
