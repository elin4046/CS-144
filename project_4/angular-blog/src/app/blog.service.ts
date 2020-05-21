import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  // GET request to /api/:username and retrieve blog posts by user
  fetchPosts(username: string): Observable<Post[]> {
    const url = `/api/${username}`;
    return this.http.get<Post[]>(url, this.httpOptions);
  }

  // GET request to /api/:username/:postid and retrieve particular post
  getPost(username: string, postid: number): Observable<Post> {
    const url = `/api/${username}/${postid}`;

    return this.http.get<Post>(url, this.httpOptions);
  }

  // POST request to /api/:username/:postid to save new post in server
  newPost(username: string, postid: number): Observable<void> {
    const url = `/api/${username}/${postid}`;
    const body = {
      title: '',
      body: '',
    };

    return this.http.post<void>(url, body, this.httpOptions);
  }

  // PUT request to /api/:username/:postid to update corresponding post
  updatePost(username: string, post: Post): Observable<void> {
    const url = `/api/${username}/${post.postid}`;

    return this.http.put<void>(url, post, this.httpOptions);
  }

  // DELETE request to /api/:username/:postid to delete corresponding post
  deletePost(username: string, postid: number): Observable<void> {
    const url = `/api/${username}/${postid}`;

    return this.http.delete<void>(url, this.httpOptions);
  }

  private draft: Post;

  // Save post as current "draft", so that it can be returned later when getCurrentDraft() is called
  setCurrentDraft(post: Post): void {
    this.draft = post;
  }

  // Return draft saved in setCurrentDraft(), return null if setCurrentDraft() was never called
  getCurrentDraft(): Post {
    return this.draft;
  }
}

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}
