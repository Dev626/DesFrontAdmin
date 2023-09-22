import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { DESCategoriaServiceJPO, pDescategoriaListar } from '../../../service/des.dESCategoriaService';
import { CoreService, OHService } from '@ovenfo/framework';

@Component({
	templateUrl: './des.category.html'
})
export class Category extends DESBase implements OnInit, AfterViewInit, OnDestroy {

	private dESCategoriaService : DESCategoriaServiceJPO;

	items : any = [];

  public filter: any;
	public pagin: any;

	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService){
		super(ohService, cse, dcs);
		this.dESCategoriaService = new DESCategoriaServiceJPO(ohService);

		this.filtroTab()
	}

	ngOnInit(){
	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){

	}

	descategoriaListar(){
        this.dESCategoriaService.descategoriaListar({
			page: this.pagin.page,
			size: this.pagin.size_rows
        }, (resp : pDescategoriaListar) => {
			this.pagin.total = resp.response.total
			this.items = resp.categorias
        });
	}

	filtroTab(){
        this.pagin = {
            page: 1,
            total: 0,
            size_rows: 10,
        };
        this.filter = {
            startList: false,
            field: {},
            fields: {
            }
        };
	}

}
