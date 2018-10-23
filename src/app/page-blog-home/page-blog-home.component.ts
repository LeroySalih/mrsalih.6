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

  posts: BlogPost[];
  firstBlogPost: BlogPost;
  remainingBlogPosts: BlogPost[];

  tabHeaders = [];
  currentTabLabel = '';

  constructor(private blogService: BlogService) {

  }

  getSubjects(posts): string[] {
    const subjects = {};
    posts.forEach(post => {
      subjects[post.subject] = true;
    });

    return Object.keys(subjects);
  }

   filterPosts(posts: BlogPost[], filter: string): BlogPost[] {
     if (filter === '') {
      return posts;
     }

     return posts.filter((a) => a.subject === filter);
   }

   buildPosts() {

    const posts = this.filterPosts(this.posts, this.currentTabLabel);

    this.firstBlogPost = posts[0];
    this.remainingBlogPosts = posts.splice(1, posts.length);

   }

  ngOnInit() {
    this.tabHeaders = ['Computing', 'Maths'];
    this.blogService.getBlogs().subscribe((posts) => {

      this.posts = posts;
      this.tabHeaders = this.getSubjects(this.posts);
      this.currentTabLabel = this.tabHeaders[0];

      this.buildPosts();

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

  onNewTab(event)  {
    this.currentTabLabel = this.tabHeaders[event.index];
    this.buildPosts();
  }

}
