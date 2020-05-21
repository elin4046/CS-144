import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Parser, HtmlRenderer } from 'commonmark';

import { Post, BlogService } from '../blog.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
})
export class PreviewComponent implements OnInit {
  private cookie = document.cookie.slice(4);
  private username = this.parseJWT(this.cookie).usr;

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

  draft: Post;

  parseJWT(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  getCurrentDraft(): void {
    this.draft = this.blogService.getCurrentDraft();
  }

  renderMarkup(input: string): string {
    let reader = new Parser();
    let writer = new HtmlRenderer();

    return writer.render(reader.parse(input));
  }

  switchToEdit(): void {
    this.router.navigate([`/edit/${this.draft.postid}`]);
  }
}
