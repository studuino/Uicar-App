import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';


declare var window;

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private CARPETA_IMAGENES = 'img';
  url: any;


  private galleryOptions: CameraOptions = {
    quality: 50,
    allowEdit: true,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    targetWidth: 800,
    targetHeight: 800,
    correctOrientation: true
  };
  constructor(
    public aut: AngularFireAuth,
    private rout: Router,
    private camera: Camera,
    private http: HttpClient
  ) { }

  cargarImagen(data) {
    this.camera.getPicture(this.galleryOptions).then((imagePath) => {
      return this.makeFileIntoBlob(imagePath);
    }).then((imageBlob) => {
      return this.cargarImagenesFirebase(imageBlob);
    }).then((_uploadSnapshot: any) => {
    }, (_error) => {
      alert('entro aqui ' + (_error.message || _error));
    });
  }

  makeFileIntoBlob(_imagePath) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {

        fileEntry.file((resFile) => {

          const reader = new FileReader();
          reader.onloadend = (evt: any) => {
            const imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg' });
            imgBlob.name = 'sample.jpg';
            resolve(imgBlob);
          };

          reader.onerror = (e) => {
            console.log('Failed file read: ' + e.toString());
            reject(e);
          };

          reader.readAsArrayBuffer(resFile);
        });
      });
    });
  }

  cargarImagenesFirebase(imgBlob: any) {

    const randomNumber = Math.floor(Math.random() * 256);
    console.log('Random number : ' + randomNumber);
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref(`${this.CARPETA_IMAGENES}/${randomNumber} + '.jpg'`);

      const metadata: firebase.storage.UploadMetadata = {
        contentType: 'image/jpeg',
      };

      const uploadTask = storageRef.put(imgBlob, metadata);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: firebase.storage.UploadTaskSnapshot) => {
          // upload in progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          // upload failed
          console.log(error);
          reject(error);
        },
        () => {
          // upload success
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at', downloadURL);
            const url = downloadURL;
            this.url = `${url}`;
            return this.url;
          });
        });
    });
  }


  trayectos(zonas: string) {
    return this.http.get(`http://uicar.openode.io/zonas/${zonas}/3`);
  }
  tablon(tablon: string) {
    return this.http.get(`http://uicar.openode.io/tablon/${tablon}/5`);
  }
  profile(id) {
    return this.http.get(`http://uicar.openode.io/users/${id}/info`);
  }
  profileTrayectos(zona: string) {
    return this.http.get(`http://uicar.openode.io/users/${zona}/trayectos`);
  }

  todoTrayectos(zona: string) {
    return this.http.get(`http://uicar.openode.io/zonas/${zona}/30`);
  }
}
