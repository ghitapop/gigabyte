import { TestBed, inject } from '@angular/core/testing';

import { ProductAdminService } from './product-admin.service';

describe('ProductAdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductAdminService]
    });
  });

  it('should be created', inject([ProductAdminService], (service: ProductAdminService) => {
    expect(service).toBeTruthy();
  }));
});
