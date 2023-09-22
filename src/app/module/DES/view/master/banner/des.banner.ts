import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { OHService } from "@ovenfo/framework";
import { CoreService } from '@ovenfo/framework';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';

import { DESBannerServiceJPO, pDesbannerList } from '@service/des.dESBannerService';

@Component({
	templateUrl: './des.banner.html'
})
export class Banner extends DESBase implements OnInit, AfterViewInit, OnDestroy {

  private dESBannerService: DESBannerServiceJPO

  public items: any = [];
  public filter: any;
  public pagin: any;

	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService){
    super(ohService, cse, dcs);
    this.dESBannerService = new DESBannerServiceJPO(ohService)
    this.filtroTab();
	}

	ngOnInit(){

	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){

  }

  filtroTab() {
    this.pagin = {
      page: 1,
      total: 0,
      size_rows: 10,
    };
    this.filter = {
      startList: false,
      field: {},
      fields: {
        estado: {
          label: "Estado",
          type: "",
          closeFilter: true,
          beforeFilter: (estado: any) => {
            let un = this.dcs.data.catalogo.estado_pedido.find(it => it.id == estado.value);
            if (un) {
              estado.descValue = un.descripcion;
            }
          }
        },
        pedido_id: {
          label: "Nro pedido",
          type: "",
          closeFilter: true
        },
        tienda_nombre: {
          label: "Tienda",
          type: "",
          closeFilter: true
        },
        cliente: {
          label: "Cliente",
          type: "",
          closeFilter: true
        }
      }
    };
  }

  desbannerList() {
    this.dESBannerService.desbannerList({
      banner_id: null, // Optional
      title: null, // Optional
      subtitle: null, // Optional
      image_bg: null, // Optional
      button_text: null, // Optional
      button_link: null, // Optional
      tienda_id: null, // Optional
      active: null, // Optional
      user_registration_id: null, // Optional
      registration_date_from: null, // Optional
      registration_date_to: null, // Optional
      user_modification_id: null, // Optional
      modification_date_from: null, // Optional
      modification_date_to: null, // Optional
			pf_page: this.pagin.page,
      pf_size: this.pagin.size_rows
    }, (resp: pDesbannerList) => {
      console.log(resp)
      this.items = resp.banners;
    })
  }

}
