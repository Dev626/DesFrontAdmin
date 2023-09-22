import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { OHService } from "@ovenfo/framework";
import { CoreService } from '@ovenfo/framework';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';

import { DESBannerServiceJPO, pDesbannerList, pDesbannerRegister, pDesbannerEdit } from '@service/des.dESBannerService';
import { DESTiendaServiceJPO, pDestiendaListar } from '@service/des.dESTiendaService';

@Component({
	templateUrl: './des.bannerNew.html'
})
export class BannerNew extends DESBase implements OnInit, AfterViewInit, OnDestroy {

  item: any = {};
  tiendas: any = [];
  configFotoBanner: any = {
    cantidad: 1
  };
  foto_cargandoBanner: boolean;

  private dESBannerService: DESBannerServiceJPO
  private dESTiendaService: DESTiendaServiceJPO;

  constructor(private ohService: OHService, public override cse: CoreService, public override dcs: DESCoreService, private route: ActivatedRoute, private router: Router) {
    super(ohService, cse, dcs);
    this.dESBannerService = new DESBannerServiceJPO(ohService)
    this.dESTiendaService = new DESTiendaServiceJPO(ohService);
    this.destiendaListar();
	}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params && params['id']) {
        this.item.banner_id = Number(params['id']);
        this.desbannerGet();
      }
    });

	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){

  }

  destiendaListar() {
    this.dESTiendaService.destiendaListar({
      usuario_id: this.cse.data.user.data.userid,
    }, (resp: pDestiendaListar) => {
      console.log(resp)
      this.tiendas = resp.tiendas;
    });
  }


  desbannerGet() {
    this.dESBannerService.desbannerList({
      banner_id: this.item.banner_id, // Optional
    }, (resp: pDesbannerList) => {
      console.log(resp)
      this.item = resp.banners[0]
    })
  }


  grabar() {
    this.ohService.getOH().getUtil().confirm("Confirma guardar los datos", () => {
      console.log(this.item)
      if (this.item.banner_id) {
        this.desbannerEdit();
      } else {
        this.desbannerRegister();
      }
    });
  }


  desbannerRegister(){
    this.dESBannerService.desbannerRegister({
      alias: this.item.alias, // optional
      title : this.item.title, // optional
      subtitle : this.item.subtitle, // optional
      image_bg : this.item.image_bg, // optional
      button_text : this.item.button_text, // optional
      button_link : this.item.button_link, // optional
      tienda_id : this.item.tienda_id, // optional
      active : this.item.active, // optional
      user_registration_id: this.cse.data.user.data.userid, // optional
      imagen: this.item.imagen ? JSON.stringify(this.item.imagen) : null // optional
    }, (resp : pDesbannerRegister) => {
      console.log(resp)
      if (resp.resp_result == 1) {
        this.ohService.getOH().getAd().success(resp.resp_message);
        this.router.navigate(['../'], { relativeTo: this.route });
      } else {
        if (resp.resp_result == 0) {
          this.ohService.getOH().getAd().error(resp.resp_message);
        } else {
          this.ohService.getOH().getAd().warning(resp.resp_message);
        }
      }
    })
  }

  desbannerEdit(){
    this.dESBannerService.desbannerEdit({
      alias: this.item.alias, // optional
      banner_id: this.item.banner_id, // Optional
      title: this.item.title, // optional
      subtitle: this.item.subtitle, // optional
      image_bg: this.item.image_bg, // optional
      button_text: this.item.button_text, // optional
      button_link: this.item.button_link, // optional
      tienda_id: this.item.tienda_id, // optional
      active: this.item.active, // optional
      user_modification_id: this.cse.data.user.data.userid, // optional
      imagen: this.item.imagen ? JSON.stringify(this.item.imagen) : null // optional
    }, (resp : pDesbannerEdit) => {
      console.log(resp)
      if (resp.resp_result == 1) {
        this.ohService.getOH().getAd().success(resp.resp_message);
        this.router.navigate(['../../'], { relativeTo: this.route });
      } else {
        if (resp.resp_result == 0) {
          this.ohService.getOH().getAd().error(resp.resp_message);
        } else {
          this.ohService.getOH().getAd().warning(resp.resp_message);
        }
      }
    })
  }

  eventoImagenBanner($event) {
    $event.response.cargarAntes((files: any) => {
      this.foto_cargandoBanner = true;
    })
    $event.response.cargarFinalizado((cargado: boolean) => {
      this.foto_cargandoBanner = false;
    })
    $event.response.eliminarFoto((adjunto: any) => {
      if (adjunto.adjunto_id) {
        // this.dESTiendaProductoService.destiendaProductoAdjuntoEliminar({
        //   tienda_producto_id: this.itemProducto.tienda_producto_id,
        //   usuario_id: this.cse.data.user.data.userid,
        //   adjunto_id: adjunto.adjunto_id
        // }, (resp: pDestiendaProductoAdjuntoEliminar) => {
        // });
      }
    })
  }

}
