import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import * as xml2js from 'xml2js';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

interface TrainResponse {
  TrainAnnouncement: any;
}

class TrainInfo {
  constructor(public trainNo: string,
              public arriveTime: string,
              public information: string,
              public estimatedTime: string) {
                }
}

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})

export class TrainComponent implements OnInit {
  public trains: TrainInfo[];
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getTrains().then(val => {
      this.trains = this.getTrainInfo(val);
    });
  }

  private getTrains(): any {
    return new Promise((resolve, reject) => {
      const body: string = '<REQUEST>\n' +
                            ' <LOGIN authenticationkey="fe898a06841443beb05ea563a1ff2b8c" />\n' +
                            ' <QUERY objecttype="TrainAnnouncement" orderby="AdvertisedTimeAtLocation">\n' +
                            ' <FILTER>\n' +
                            ' <AND>\n' +
                            '   <EQ name="ActivityType" value="Avgang" />\n' +
                            '   <EQ name="LocationSignature" value="Nkv" />\n' +
                            '   <EQ name="ToLocation" value="Cst" />\n' +
                            '   <OR>\n' +
                            '     <AND>\n' +
                            '       <GT name="AdvertisedTimeAtLocation" value="$dateadd(-00:15:00)" />\n' +
                            '       <LT name="AdvertisedTimeAtLocation" value="$dateadd(15:00:00)" />\n' +
                            '     </AND>\n' +
                            '     <AND>\n' +
                            '       <LT name="AdvertisedTimeAtLocation" value="$dateadd(00:30:00)" />\n' +
                            '       <GT name="EstimatedTimeAtLocation" value="$dateadd(-00:15:00)" />\n' +
                            '     </AND>\n' +
                            '   </OR>\n' +
                            ' </AND>\n' +
                            ' </FILTER>\n' +
                            ' <INCLUDE>AdvertisedTrainIdent</INCLUDE>\n' +
                            ' <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>\n' +
                            ' <INCLUDE>EstimatedTimeAtLocation</INCLUDE>\n' +
                            ' <INCLUDE>EstimatedTimeIsPreliminary</INCLUDE>\n' +
                            ' <INCLUDE>ToLocation</INCLUDE>\n' +
                            ' <INCLUDE>Canceled</INCLUDE>\n' +
                            '</QUERY>\n' +
                            '</REQUEST>';
      const url = 'http://api.trafikinfo.trafikverket.se/v1/data.xml';
      const headers = new HttpHeaders().set('Content-Type', 'text/xml; charset=utf-8');
      const options =  {
        headers: headers,
        responseType: 'text' as 'text'
      };
      this.http.post(url, body, {headers: headers, responseType: 'text' as 'text'})
        .toPromise()
        .then( res => {
          this.xml2jsParser(res).then(val => {
            resolve(val);
          });
        });
    });
  }

  private xml2jsParser(xml: string): any {
    return new Promise(function(resolve, reject) {
          xml2js.parseString(xml, function(err, result) {
            if (!err) {
              resolve(result);
            }else {
              reject(err);
            }
        });
    });
  }

  private getTrainInfo(json: any): TrainInfo[] {
    const list: TrainInfo[] = new Array<TrainInfo>();
    json.RESPONSE.RESULT['0'].TrainAnnouncement.forEach(ta => {
        let info = '';
        let estTime = '';
        if (ta.EstimatedTimeAtLocation === 'undefined') {
          info = 'Delayed';
          estTime = ta.EstimatedTimeAtLocation;
        } else {
        }
        if (ta.EstimatedTimeAtLocation === 'true') {
          info = 'Preliminary';
        }
        if (ta.Canceled === 'true') {
          info = 'Canceled';
        }
        list.push(new TrainInfo(ta.AdvertisedTrainIdent, ta.AdvertisedTimeAtLocation, info, estTime));
    });
    return list;
  }
}
