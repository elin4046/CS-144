import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListComponent } from '../list/list.component';

import { Post, BlogService } from '../blog.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  private cookie = document.cookie.slice(4);
  private username = this.parseJWT(this.cookie).usr;

  @ViewChild(ListComponent, { static: false }) child;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCurrentDraft();
    this.route.paramMap.subscribe(() => {
      const id = this.route.snapshot.paramMap.get('id');
      this.blogService
        .getPost(this.username, parseInt(id))
        .subscribe((post) => {
          this.draft = post;
        });
    });
  }

  parseJWT(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  draft: Post;
  titleValue: string;
  bodyValue: string;
  disabled: boolean = true;

  onTitleChange(event): void {
    this.disabled = false;
    this.titleValue = event.target.value;
  }

  onBodyChange(event): void {
    this.disabled = false;
    this.bodyValue = event.target.value;
  }

  getCurrentDraft(): void {
    let resp = this.blogService.getCurrentDraft();

    if (resp === null) {
      const id = this.route.snapshot.paramMap.get('id');
      this.blogService
        .getPost(this.username, parseInt(id))
        .subscribe((post) => {
          this.draft = post;
        });
    } else {
      this.draft = resp;
    }
  }

  deletePost(): void {
    this.blogService.deletePost(this.username, this.draft.postid).subscribe();
    this.router.navigate(['/']);
  }

  updatePost(): void {
    let modifiedPost = {
      postid: this.draft.postid,
      created: this.draft.created,
      modified: this.draft.modified,
      title: this.titleValue ? this.titleValue : this.draft.title,
      body: this.bodyValue ? this.bodyValue : this.draft.body,
    };

    this.blogService.updatePost(this.username, modifiedPost).subscribe();

    const id = this.route.snapshot.paramMap.get('id');
    this.blogService.getPost(this.username, parseInt(id)).subscribe((post) => {
      this.draft = post;
    });

    this.child.fetchPosts();

    this.disabled = true;
  }

  previewPost(): void {
    let modifiedPost = {
      postid: this.draft.postid,
      created: this.draft.created,
      modified: this.draft.modified,
      title: this.titleValue ? this.titleValue : this.draft.title,
      body: this.bodyValue ? this.bodyValue : this.draft.body,
    };

    this.blogService.setCurrentDraft(modifiedPost);

    if (this.titleValue || this.bodyValue) {
      this.blogService.updatePost(this.username, modifiedPost).subscribe();
    }

    this.router.navigate([`/preview/${this.draft.postid}`]);
  }

  convertToTwoDigits(num: number): string {
    if (num < 10) {
      return `0${num}`;
    } else {
      return `${num}`;
    }
  }

  formatDate(unixEpoch: Date): string {
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
