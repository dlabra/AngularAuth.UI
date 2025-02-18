import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const myToken = inject(AuthService).getToken();
  const toastr = inject(ToastrService);
  
  if(myToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${myToken}`
      }
    });
  }

  return next(req).pipe(
    catchError(err => {
      if( err instanceof HttpErrorResponse && err.status === 401) {
        toastr.warning('Session expired! Please login again');
        inject(AuthService).signOut();
      }
      throw err;
    })
  );
};
