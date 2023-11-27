import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, mergeMap, catchError, tap } from "rxjs/operators";
import { Subject, throwError } from 'rxjs';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
    error = new Subject<string>()

    constructor(private http: HttpClient) {
        
    }

    createAndStorePost(title: string, content: string) {
        const postData: Post = {title: title, content: content}
        return this.http
            .post<{name: string}>(
              'https://ng-complete-guide-5b91d-default-rtdb.firebaseio.com/posts.json',
              postData,
              {
                observe: 'response'
              }
            )
            .subscribe({
                next: (responseData) => {
                  console.log(responseData);
                  
                },
                error: error => this.error.next(error.message)
              })
    }

    fetchPosts() {
        let searchParams = new HttpParams()
        searchParams = searchParams.append('print', 'pretty')
        searchParams = searchParams.append('custom', 'key')
        return this.http
        .get<{ [key: string]: Post }>(
            'https://ng-complete-guide-5b91d-default-rtdb.firebaseio.com/posts.json',
            {
                headers: new HttpHeaders({
                    'CustomHeader': 'hello'
                }),
                params: searchParams,
                responseType: 'json'
            })
        .pipe(
          map((responseData) => {
            const postsArray: Post[] = []
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)){
                postsArray.push({ ...responseData[key], id: key })
              }
            }
            return postsArray
          }),
          catchError((errorRes) => {
            //Generic error handling task (send to analytics server)
            return throwError(() => {
                new Error(errorRes) 
            })
          })
        )
    }

    deletePosts() {
        return this.http.delete(
            'https://ng-complete-guide-5b91d-default-rtdb.firebaseio.com/posts.json',
            {
                observe: 'events',
                responseType: 'text'
            }
        ).pipe(tap((event) => {
            console.log(event);

            if (event.type === HttpEventType.Sent) {
                // ...
            }
            if (event.type === HttpEventType.Response) {
                console.log(event.body);
            }
        }))
    }
}
