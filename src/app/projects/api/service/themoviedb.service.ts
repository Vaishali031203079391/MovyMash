import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModelPageComponent } from '../../component/model-page/model-page.component';

const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class ThemoviedbService {

  currentModel: HTMLIonModalElement[] = [];


  constructor(private http: HttpClient, private modalController: ModalController) { }

  getGenereList(type: string): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/genre/${type}/list?api_key=${apiKey}&language=en-US`;
    return this.http.get(requestURL);
  }

  getTrendingList(type: string): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/trending/${type}/day?api_key=${apiKey}`;
    return this.http.get(requestURL);
  }

  getPopularList(type: string, page: number, genres: string): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/${type}/popular?api_key=${apiKey}&language=en-US&page=${page}&with_genres=${genres}`;
    return this.http.get(requestURL);
  }

  getDetailList(type: string, id: string): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US`;
    return this.http.get(requestURL);
  }

  getCreditList(type: string, id: string): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apiKey}&language=en-US`;
    return this.http.get(requestURL);
  }

  getVideoList(type: string, id: string): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=en-US`;
    return this.http.get(requestURL);
  }

  getRecommendationList(type: string, id: string): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${apiKey}&language=en-US&page=1`;
    return this.http.get(requestURL);
  }

  async presentModal(modelItem: any, type: any){
    const modal = await this.modalController.create({
      component: ModelPageComponent,
      componentProps:{
        modelItemList: modelItem,
        modelType: type
      },
      cssClass: 'my-custom-class'
    });
    this.currentModel.push(modal as HTMLIonModalElement);
    return await modal.present();
  }

  dismissModel(){
    this.currentModel[this.currentModel.length - 1].dismiss().then(() => {
      this.currentModel.pop();
    });
  }

  getSearchList(type: string, page: number, query: string): Observable<any> {
    const requestURL = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&language=en-US&page=${page}&query=${query}`;
    return this.http.get(requestURL);
  }

}
