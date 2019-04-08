import { Component, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements AfterViewInit {

  zones: any;
  inicio: string;
  destino: string;
  hora;
  rutina: string;
  asientos: string;
  vehiculo = 'car';
  descripcion: string;
  uid: string;

  public form = [
    { val: 'Rutina', isChecked: false },
  ];

  horas = ['00:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00',
    '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00'];




  constructor(private http: HttpClient, public router: Router, private aut: AngularFireAuth) {

  }

  ngAfterViewInit() {
    this.logueado();
    this.zonasload();
  }

  async logueado() {
    await this.aut.authState
      .subscribe(
        user => {
          if (!user) {
            this.router.navigate(['/login']);
          } else {
            console.log('logueado');
            this.uid = user.uid;
          }
        });

    return this.uid;
  }

  async zonasload() {
    await this.http.get(`http://uicar.openode.io/zonas/`).subscribe((data: any) => {
      this.zones = data;
    });
  }
  gotomain() {
    this.router.navigate(['home']);
  }

  select(vehicule: any) {
    this.vehiculo = vehicule;
    console.log(vehicule);
  }

  async makepost() {
    const fecha = Date.now();
    console.log(fecha);
    const { inicio, destino, hora, rutina, asientos, vehiculo, descripcion, uid } = this;
    await this.http.post('http://uicar.openode.io/create/', {
      inicio: inicio,
      destino: destino,
      hora: hora,
      rutina: rutina,
      uid: uid,
      asientos: asientos,
      vehiculo: vehiculo,
      zona: inicio,
      info: descripcion,
      fecha: fecha
    }).subscribe((response) => {
      console.log(response);
      this.router.navigate([`profile/${this.uid}`]);
    });

  }
}
