import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Post, BlogService } from '../blog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  private cookie = document.cookie.slice(4);
  private username = this.parseJWT(this.cookie).usr;
  posts: Post[];

  constructor(private blogService: BlogService, private router: Router) {}

  ngOnInit(): void {
    this.fetchPosts();
  }

  parseJWT(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  fetchPosts(): void {
    this.blogService.fetchPosts(this.username).subscribe((posts) => {
      this.posts = posts;
      console.log(this.posts);
    });
  }

  setCurrentDraft(post: Post): void {
    this.blogService.setCurrentDraft(post);
    this.router.navigate([`/edit/${post.postid}`]);
  }

  newPost() {
    let newPID = this.posts[this.posts.length - 1].postid + 1;
    this.blogService.newPost(this.username, newPID).subscribe();
    this.blogService.getPost(this.username, newPID).subscribe((post) => {
      this.posts.push(post);
      this.blogService.setCurrentDraft(post);
    });
    this.router.navigate([`/edit/${newPID}`]);
  }

  convertToTwoDigits(num: number): string {
    if (num < 10) {
      return `0${num}`;
    } else {
      return `${num}`;
    }
  }

  formatDate(unixEpoch: number): string {
    const date = new Date(unixEpoch);
    let month = date.getMonth();
    let day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    let minutes = this.convertToTwoDigits(date.getMinutes());
    let seconds = this.convertToTwoDigits(date.getSeconds());
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  }
}
