import { Component, OnInit } from '@angular/core';
import {BlogService} from '../services/blog.service';
import {BlogPost } from '../models/blog-post';
import * as moment from 'moment';

@Component({
  selector: 'app-page-blog-home',
  templateUrl: './page-blog-home.component.html',
  styleUrls: ['./page-blog-home.component.css']
})
export class PageBlogHomeComponent implements OnInit {

  firstBlogPost: BlogPost;
  remainingBlogPosts: BlogPost[];

  constructor(private blogService: BlogService) {

  }


  ngOnInit() {
    this.blogService.getBlogs().subscribe((posts) => {
      this.firstBlogPost = posts[0];
      this.remainingBlogPosts = posts.splice(1, posts.length);
    });

  }

  convertDate(date): string {
    // const dt = new Date(date);
    // console.log(`[convertDate]:: `, dt);
    // return dt.toDateString();
    // console.log(date.toDate());

    const quizDate = moment(date.toDate());
    const today = moment(new Date());

    if (Math.abs(quizDate.diff(today, 'days')) > 0) {
      return moment(date.toDate()).format('Do MMM YYYY');
    } else {
        return quizDate.fromNow();
    }
  }

}
