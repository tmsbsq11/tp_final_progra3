import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req,next) => {
    const token= sessionStorage.getItem('oficiosya_token');
    if(token){
        const requestConToken = req.clone({
            setHeaders:{
                Authorization: `Bearer ${token}`
            }
        });
        return next(requestConToken);
    }
    return next(req);
            };//toma el jwt almacenado y lo agrega al header
    
