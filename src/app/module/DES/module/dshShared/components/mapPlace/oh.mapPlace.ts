import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms/forms';
import { MainService, OHService } from '@ovenfo/framework';

/*
    <oh-map-place
        [enable_search]="true"
        [enable_map_gps]="true"
        [placeholder]="Buscar" 
        [(latitude)]="latitude"
        [(longitude)]="longitude"
        [(address)]="address"
        (onSelect)="selectMap($event)"  a as<sdasd
    ></oh-map-place>
*/

@Component({
    selector: 'oh-map-place',
	templateUrl: './oh.mapPlace.html',
	styleUrls: ['./oh.mapPlace.css']
})

export class MapPlace implements OnInit, AfterViewInit {
    
    @Input() enable_search : boolean = true
    @Input() enable_map_gps : boolean = true
    @Input() placeholder: any = 'Buscar dirección';
    @Input() latitude : number
	@Output() latitudeChange: EventEmitter<number> = new EventEmitter<number>()
    @Input() longitude : number
    @Output() longitudeChange: EventEmitter<number> = new EventEmitter<number>()
    @Input() address : string
    @Output() addressChange: EventEmitter<string> = new EventEmitter<string>()
    @Output() onSelect: EventEmitter<any> = new EventEmitter();

    @Input() height : number = 500
    
    @Input() form: NgForm;
    @Input() disabled: any = false;
    @Input() required: any = false;

    @Input() country_prefix : any = 'PE';

    @Input() zoom : number = 13

    @ViewChild('inp_address', { static: true, read: ElementRef }) inp_address: ElementRef;
    @ViewChild('inp_address', { static: false }) inp_addressModel: NgModel;

    private ohMainService: MainService;
    
    constructor(private ohCore: OHService) {
        this.ohMainService = ohCore.getOH();
    }
    
    ngOnInit() { }

    ngAfterViewInit() {
        if (this.form) {
			this.form.addControl(this.inp_addressModel);
        }
        setTimeout(() => { this.getPlaceAutocomplete(); }, 1000)
    }

    private getPlaceAutocomplete(){

        let item : any = document.getElementById("inp_address")

        /*
        const autocomplete = new google.maps.places.Autocomplete( 
            item, {
                componentRestrictions: { country: this.country_prefix },
                types: ['geocode', 'establishment']
            }
        );

        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            let _place = autocomplete.getPlace();

            if(_place.geometry && _place.geometry.location){
                this.latitude = _place.geometry.location.lat()
                this.longitude = _place.geometry.location.lng()
                this.latitudeChange.emit(this.latitude)
                this.longitudeChange.emit(this.longitude)
                this.address = item.value
                this.onSelect.emit({
                    place_text  : item.value,
                    latitud     : this.latitude,
                    longitud    : this.longitude
                })
            }

            item.focus();
            
        });*/
    }

    gps_habilitado : boolean

    searchCurrentPosition(){
        if(navigator.geolocation) {
            var wpid = navigator.geolocation.watchPosition((position) => {
                if(position.coords){
                    this.latitude = position.coords.latitude
                    this.longitude = position.coords.longitude
                    this.latitudeChange.emit(this.latitude)
                    this.longitudeChange.emit(this.longitude)
                    this.getAddress(position.coords)
                }
                navigator.geolocation.clearWatch(wpid);
                this.gps_habilitado = true
            }, (error : any) => {
                if(error.code == 1){
                    this.gps_habilitado = false
                    this.ohMainService.getAd().warning("Debe activar su posición GPS") // User denied Geolocation
                }
            }, {
                enableHighAccuracy: true, 
                maximumAge        : 4000, 
                timeout           : 3000
            });
        }
    }

    private getAddress(coords : any){
        /*
        new google.maps.Geocoder().geocode({
            location: {
                lat : coords.latitude,
                lng : coords.longitude
            }
        }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {

                    this.address = results[0].formatted_address
                    this.addressChange.emit(results[0].formatted_address)
                    this.onSelect.emit({
                        place_text  : results[0].formatted_address,
                        latitud     : coords.latitude,
                        longitud    : coords.longitude
                    })
                    
                } else {
                    console.log("No results found");
                }
            } else {
                console.log("Geocoder failed due to: " + status);
            }
        });*/
    }

    private setAddress(place: any) {
        
    }

    mapClick($event : any) {
		this.latitude = $event.coords.lat
        this.longitude = $event.coords.lng
        this.latitudeChange.emit($event.coords.lat)
        this.longitudeChange.emit($event.coords.lng)
        this.address = ""

        this.onSelect.emit({
            place_text  : "",
            latitud     : $event.coords.lat,
            longitud    : $event.coords.lng
        })
    }
   
}