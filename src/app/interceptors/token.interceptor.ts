import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TokenApiModel } from '../models/token-api.model';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);
  const token = auth.getToken();

  if(auth.getToken()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError(err => {
      if( err instanceof HttpErrorResponse && err.status === 401) {        
        let tokeApiModel = new TokenApiModel();
        tokeApiModel.accessToken = auth.getToken()!;
        tokeApiModel.refreeshToken = auth.getRefreshToken()!;
        console.log(tokeApiModel);
        return auth.renewToken(tokeApiModel)
        .pipe(
          switchMap((data:TokenApiModel)=>{
            auth.storeRefreshToken(data.refreeshToken);
            auth.storeToken(data.accessToken);
            req = req.clone({
              setHeaders: {Authorization:`Bearer ${data.accessToken}`}  // "Bearer "+ myToken
            })
            return next(req);
          }),
          catchError((err)=>{
            return throwError(()=>{
              toastr.warning("Token is expired, Please Login again");
              router.navigate(['login'])
            })
          })
        )
      }
      throw err;
    })
  );
};
