import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css',
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('map') divMap?: ElementRef;

  public zoom: number = 8;
  public map?: Map;
  public currentCenter: LngLat = new LngLat(-89.88, 13.85);
  public lngc = -89.88;
  public latc = 13.85;

  ngAfterViewInit(): void {
    if (!this.divMap) throw 'HTML element not found!';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentCenter, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });
    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  //Listeners para escuchar todo el tiempo los cambios del mapa
  mapListeners() {
    if (!this.map) throw 'Map not found!';

    this.map.on('zoom', (ev) => {
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', (ev) => {
      if (this.map!.getZoom() < 18) return;
      this.map!.zoomTo(18);
    });
    this.map.on('move', () => {
      // move - moveend
      this.currentCenter = this.map!.getCenter();
      const { lng, lat } = this.currentCenter;
      this.lngc = lng;
      this.latc = lat;
    });
  }

  // Metodos para personalizar los botones
  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomChanged(value: string) {
    this.zoom = Number(value);
    this.map?.zoomTo(this.zoom);
  }
}
