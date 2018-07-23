import { Component, OnInit } from '@angular/core';
import {BlogService} from '../services/blog.service';
import {BlogPost } from '../models/blog-post';

@Component({
  selector: 'app-page-blog-home',
  templateUrl: './page-blog-home.component.html',
  styleUrls: ['./page-blog-home.component.css']
})
export class PageBlogHomeComponent implements OnInit {

  blogPosts: BlogPost[];

  constructor(private blogService: BlogService) {

  }

  ngOnInit() {
    this.blogService.getBlogs().subscribe((posts) => {
      this.blogPosts = posts;
    });

  }

}
