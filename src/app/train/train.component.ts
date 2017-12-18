import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import * as xml2js from 'xml2js';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

class TrainInfo {
  constructor(public trainNo: string,
              public arriveTime: string) {
                }
}

@Component({
  selector: 'app-train',
  templateUrl: './train.component.html',
  styleUrls: ['./train.component.scss']
})
export class TrainComponent implements OnInit {
  url: string;
  search: any;
  json: any;
  public trains: TrainInfo;
  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    console.log('1');
    this.trains = new TrainInfo('', '');
    this.json = '';
    this.getTrains().subscribe(data => {
      this.trains = data;
    });
    console.log('Trains: ' + this.trains);
    console.log('2');
  }

  private getTrains(): Observable<TrainInfo> {
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
                          '       </AND>\n' +
                          '     </OR>\n' +
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
      responseType: 'text'
    };

    return this.http.post<TrainResponse[]>(url, body, options)
      .flatMap((res) => {
        xml2js.parseString(res, function(err, result) {
            console.log('result: ' + result);
        });
        console.log('grus: ' + this.json);
        return new TrainInfo('abcd', '123');
    });
  }
}

interface TrainResponse {
  TrainAnnouncement: any;
}
