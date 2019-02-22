import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.page.html',
  styleUrls: ['./profile-page.page.scss'],
})
export class ProfilePagePage implements OnInit {

  profiledata = [];
  profiletrayectos = [];

  uid: string;
  uidprofile: string;
  userprofile: boolean;

  // Mapa variablees

  ngOnInit() {
  }

  constructor(private http: HttpClient
    , private aut: AngularFireAuth, private router: Router, public active: ActivatedRoute) {


    this.userprofile = true;
    this.uid = localStorage.getItem('uid');
    console.log('entro en profile');


    this.profileload(this.uid);
  }

  async profileload(uid: string) {

    await this.http.get(`http://uicar.openode.io/users/` + uid + '/info').subscribe((data: any) => {
      this.profiledata = data;
    });

    await this.http.get(`http://uicar.openode.io/users/` + uid + '/trayectos').subscribe((data: any) => {
      this.profiletrayectos = data;
    });
  }

  gotomain() {
    this.router.navigateByUrl('/');
  }
  gotoedit() {
    this.router.navigateByUrl('/edituser/' + this.uid);
  }
  gotocreate() {
    this.router.navigateByUrl('/create');
  }

  gotowhatsapp(telf: string) {
    console.log(telf);
    const newurl = 'https://api.whatsapp.com/send?phone=' + telf;
    window.open(newurl, '_system', '_blank');

  }

}
