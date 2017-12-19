import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  private feedTitle: any;
  private feedDescription: string;
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getFeed().then(val => {
      console.log('id1: ' + val.items['0'].description);
      this.feedTitle = val.items['0'].title;
      this.feedDescription = val.items['0'].description;
    });
  }

  private getFeed(): any {
    return new Promise((resolve, reject) => {
      const url = 'https://rss2json.com/api.json?rss_url=http://feeds.idg.se/idg/vzzs';
      this.http.get(url)
        .toPromise()
        .then( res => {
          resolve(res);
        });
    });
  }
}
