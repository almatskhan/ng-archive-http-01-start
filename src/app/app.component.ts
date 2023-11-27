import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false
  error = null
  private errorSub: Subscription

  constructor(
    private http: HttpClient,
    private poststService: PostsService
  ) {}

  ngOnInit() {
    this.isFetching = true
    this.poststService.fetchPosts()
      .subscribe({
        next: (posts) => {
        this.isFetching = false
        this.loadedPosts = posts 
        },
        error: (error) => {
          this.isFetching = false
          this.error = error.message
        }
      })
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.poststService.createAndStorePost(postData.title, postData.content)
  }

  onFetchPosts() {
    this.isFetching = true
    this.poststService.fetchPosts()
      .subscribe({
        next: (posts) => {
        this.isFetching = false
        this.loadedPosts = posts 
        },
        error: (error) => {
          this.isFetching = false
          this.error = error.message
          console.log(error);
        }
      })
  }

  onClearPosts() {
    // Send Http request
    this.poststService.deletePosts()
      .subscribe(
        () => {
          this.loadedPosts = [] 
        }
      )
  }

  onHandleError() {
    this.error = null
  }
}
