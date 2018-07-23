import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { BlogPost } from '../models/blog-post';
import { DbConfig } from '../db.config';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private afs: AngularFirestore) { }

  public getBlogs(): Observable<BlogPost[]> {
    return this.afs.collection<BlogPost>(DbConfig.BLOG_POSTS).valueChanges();
  }

  public getBlog(id: string): Observable<BlogPost> {

    // console.log(`${DbConfig.BLOG_POSTS}/${id}`);
    return this.afs.doc<BlogPost>(`${DbConfig.BLOG_POSTS}/${id}`)
                   .valueChanges();
  }
}
