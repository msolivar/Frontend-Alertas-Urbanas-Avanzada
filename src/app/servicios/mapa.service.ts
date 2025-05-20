import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { consultarMapaDTO } from '../dto/consultar-mapas';


@Injectable({
  providedIn: 'root'
})
export class MapaService {


  mapa: any;
  marcadores: any[];
  posicionActual: LngLatLike;

  constructor() {
    this.marcadores = [];
    this.posicionActual = [-75.67270, 4.53252];
  }

  public crearMapa() {
    this.mapa = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoibXNyb2JpcyIsImEiOiJjbWFvbmZsZmMwOTA3MmxxM3Mxamwxa3dvIn0.khU8qCs9FSWWF07qDa7jOQ',
      container: 'mapa',
      style: 'mapbox://styles/mapbox/standard',
      center: this.posicionActual,
      pitch: 45,
      zoom: 17
    });


    this.mapa.addControl(new mapboxgl.NavigationControl());
    this.mapa.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true
      })
    );


  }

  public agregarMarcador(): Observable<any> {
    const mapaGlobal = this.mapa;
    const marcadores = this.marcadores;

    return new Observable<any>(observer => {


      mapaGlobal.on('click', function (e: any) {
        marcadores.forEach(marcador => marcador.remove());


        const marcador = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(mapaGlobal);


        marcadores.push(marcador);
        observer.next(marcador.getLngLat());
      });
    });


  }

  // "latitud":4.5322799699449945,"longitud":-75.67330891599461
  // public agregarMarcadores(lat: number, lng: number, nombre: string = '') {
  //   new mapboxgl.Marker({ color: 'red' })
  //     .setLngLat([lng, lat])
  //     .setPopup(new mapboxgl.Popup().setHTML(`<strong>${nombre}</strong>`))
  //     .addTo(this.mapa);
  // }

  public pintarMarcadores(reportes: consultarMapaDTO[]) {

   reportes.forEach(reporte => {
     new mapboxgl.Marker({color: 'red'})
       .setLngLat([reporte.ubicacion.x, reporte.ubicacion.y])
       .setPopup(new mapboxgl.Popup().setHTML(reporte.nombre))
       .addTo(this.mapa);
   });

 }

}
