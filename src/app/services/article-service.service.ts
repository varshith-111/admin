import {  HttpClient, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthInterceptor } from '../interceptors/auth.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ArticleServiceService {
  private apiUrl = environment.articleURL; 
  
  constructor(private http: HttpClient) { }

  createArticle(articleData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+'Admin/createaarticle', articleData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getArticleById(id: string) {
    return this.http.get<any>(`${this.apiUrl}Articles/GetbyId/${id}`);
  }

  getAllArticles(){
    return this.http.get<any>(`${this.apiUrl}Articles/GetAll`);
  }

  deteArticleById(id: string){
    return this.http.get<any>(`${this.apiUrl}Admin/deleteById/${id}`);
  }

  uplodFilesToAirtcle(id:string, formdata: FormData){
    return this.http.post<any>(`${this.apiUrl}Admin/uploadFiles/${id}`, formdata, {
    });
  }
 
  editArticleById(id: string, articleData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}Admin/updateById/${id}`, articleData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  getArticleByCategory(category: string){
    return this.http.get<any>(`${this.apiUrl}Articles/GetByCategory/${category}`);
  }

  getAllAdmin(){
    return this.http.get<any>(`${this.apiUrl}Admin/getall`);
  }

  getDataByCategory(category: string){
    return this.http.get<any>(`${this.apiUrl}Admin/getallbycategory/${category}`);
  }
}
