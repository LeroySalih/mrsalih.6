import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DbConfig } from '../db.config';
import { BlogService } from '../services/blog.service';
import { BlogPost } from '../models/blog-post';
@Component({
  selector: 'app-page-blog-post',
  templateUrl: './page-blog-post.component.html',
  styleUrls: ['./page-blog-post.component.css']
})
export class PageBlogPostComponent implements OnInit {

  blogId: string;
  blog: SafeHtml;
  blogPost: BlogPost;

  constructor(private route: ActivatedRoute,
              private http:  HttpClient,
              private blogService: BlogService,
              private sanitizer: DomSanitizer
  ) { }

  transform(v: string): SafeHtml {

    return this.sanitizer.bypassSecurityTrustHtml(v);
  }

  ngOnInit() {

    this.route.params.subscribe((data) => {

      this.blogId = data['id'];

      this.blog = 'This is my <b>blog</b>....';

      this.http.get(`${DbConfig.BLOG_BASE_URL}${this.blogId}.html`, {responseType: 'text'})
          .subscribe(
            (response) => { this.blog = this.transform (response); },
            (err) => { console.error(err); });

      this.blogService.getBlog(this.blogId).subscribe((blogPost) => {
        // console.log('BlogPost::', blogPost);
        this.blogPost = blogPost;
      });

    });
  }

}
