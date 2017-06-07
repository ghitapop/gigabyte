import { TestBed, inject } from '@angular/core/testing';
import { BlogAdminService } from './blog-admin.service';

describe('AdminSharedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlogAdminService]
    });
  });

  it('should ...', inject([BlogAdminService], (service: BlogAdminService) => {
    expect(service).toBeTruthy();
  }));
});
