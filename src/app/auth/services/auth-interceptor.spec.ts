import { TestBed } from '@angular/core/testing';

import { HttpInterceptorFn } from '@angular/common/http';
import { authInterceptorService } from './auth-interceptor.service';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => authInterceptorService(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
