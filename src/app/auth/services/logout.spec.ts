import { TestBed } from '@angular/core/testing';

import { LogoutService } from '../services/logout.service';

describe('Logout', () => {
  let service: LogoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
