import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { DESBase } from 'src/app/module/DES/des.base';
import { DESCategoriaServiceJPO, pDescategoriaRegistrar, pDescategoriaObtener, pDescategoriaEditar } from 'src/app/module/DES/service/des.dESCategoriaService';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DESCategoriaProductoServiceJPO, pDescategoriaProductoRegistrar, pDescategoriaProductoListar, pDescategoriaProductoObtener, pDescategoriaProductoEditar, pDescategoriaProductoAdjuntoEliminar, pDescategoriaProductoEliminar } from 'src/app/module/DES/service/des.dESCategoriaProductoService';

import { CoreService, OHService } from '@ovenfo/framework';

@Component({
	templateUrl: './des.categoryEdit.html'
})
export class CategoryEdit extends DESBase implements OnInit, AfterViewInit, OnDestroy {

	item : any = {};
	itemProducto : any = {};	
	itemsProductos : any = []

	configFoto : any = {cantidad: 5};

	private dESCategoriaService : DESCategoriaServiceJPO;
	private dESCategoriaProductoService : DESCategoriaProductoServiceJPO;
	
	nac_activo : 1

    public filter: any;
	public pagin: any;

	constructor(private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal){
		super(ohService, cse, dcs);
		this.dESCategoriaService = new DESCategoriaServiceJPO(ohService);
		this.dESCategoriaProductoService = new DESCategoriaProductoServiceJPO(ohService);
		this.item.estado = this.cse.params.estado.activo;
		this.item.indicador_producto = true
	}

	ngOnInit(){
		this.route.params.subscribe(params => {
			if (params && params['id']) {
				this.item.categoria_id  = Number(params['id']);
				this.descategoriaObtener();
			}
		});
		this.filtroTab();
	}

	ngAfterViewInit(){

	}

	ngOnDestroy(){

	}

	grabar(){
		this.ohService.getOH().getUtil().confirm("Confirma guardar los datos", () => {
			if(this.item.categoria_id){
				this.descategoriaEditar();
			} else {
				this.descategoriaRegistrar();
			}
		});
	}

	descategoriaRegistrar(){
        this.dESCategoriaService.descategoriaRegistrar({
			nombre : this.item.nombre,
			indicador_producto : this.item.indicador_producto ? '1' : '0',
			estado : this.item.estado,
			icono : this.item.icono,
            usuario_registro_id : this.cse.data.user.data.userid
        }, (resp : pDescategoriaRegistrar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				this.router.navigate(['../'], { relativeTo: this.route });
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getAd().error(resp.resp_mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje);
				}
			}
        });
	}
	
	descategoriaObtener(){
        this.dESCategoriaService.descategoriaObtener({
            categoria_id : this.item.categoria_id
        }, (resp : pDescategoriaObtener) => {
			this.item = resp;
		});
	}
	
	descategoriaEditar(){
        this.dESCategoriaService.descategoriaEditar({
            categoria_id : this.item.categoria_id,
			nombre : this.item.nombre,
			icono : this.item.icono,
			indicador_producto : this.item.indicador_producto ? '1' : '0',
            estado : this.item.estado,
            usuario_modificacion_id : this.cse.data.user.data.userid
        }, (resp : pDescategoriaEditar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				this.router.navigate(['../../'], { relativeTo: this.route });
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getAd().error(resp.resp_mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje);
				}
			}
		});
	}

	productoBorrar(categoria_producto_id : any){
		this.ohService.getOH().getUtil().confirm("Confirma eliminar el producto", () => {
			this.dESCategoriaProductoService.descategoriaProductoEliminar({
				categoria_producto_id : categoria_producto_id
			}, (resp : pDescategoriaProductoEliminar) => {
				if (resp.resp_estado == 1) {
					this.ohService.getOH().getAd().success(resp.resp_mensaje);
					this.descategoriaProductoListar();
				} else {
					if (resp.resp_estado == 0) {
						this.ohService.getOH().getAd().error(resp.resp_mensaje);
					} else {
						this.ohService.getOH().getAd().warning(resp.resp_mensaje);
					}
				}
			});
		})
	}
	
	productoNuevo(modalProducto : any){
		this.itemProducto = {
			estado : this.dcs.config.categoria_producto_estado.activo,
			fotos : [],
			nombre : ''
		}
		this.modalService.open(modalProducto,{}).result.then((result) => {
			this.descategoriaProductoListar();
		}, (reason) => {});
	}

	productoEditar(categoria_producto_id : number, modalProducto : any){
		this.dESCategoriaProductoService.descategoriaProductoObtener({
			categoria_producto_id : categoria_producto_id
		}, (resp : pDescategoriaProductoObtener) => {
			this.itemProducto = resp
			this.modalService.open(modalProducto,{}).result.then((result) => {
				this.descategoriaProductoListar();
			}, (reason) => {});
		});
	}

	productoGrabar(modal : any){
		if(this.itemProducto.categoria_producto_id){
			this.descategoriaProductoEditar(modal)
		} else {
			this.descategoriaProductoRegistrar(modal);
		}
		
	}

	descategoriaProductoEditar(modal : any){
        this.dESCategoriaProductoService.descategoriaProductoEditar({
			categoria_producto_id : this.itemProducto.categoria_producto_id,
			adjuntos : JSON.stringify(this.itemProducto.fotos),
            nombre :  this.itemProducto.nombre,
			estado :  this.itemProducto.estado,
            usuario_modificacion_id : this.cse.data.user.data.userid,
            categoria_producto_atributo : "[]"
        }, (resp : pDescategoriaProductoEditar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				for(var i in this.itemProducto.fotos){
					if(this.itemProducto.fotos[i].accion == 'N'){
						this.itemProducto.fotos[i].adjunto_id = true;
					}
				}
				modal.close();
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getAd().error(resp.resp_mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje);
				}
			}
        });
    }

    descategoriaProductoRegistrar(modal : any){
        this.dESCategoriaProductoService.descategoriaProductoRegistrar({
			categoria_id : this.item.categoria_id,
            nombre :  this.itemProducto.nombre,
			estado :  this.itemProducto.estado,
			adjuntos : JSON.stringify(this.itemProducto.fotos),
			categoria_producto_atributo : "[]",
            usuario_registro_id : this.cse.data.user.data.userid
        }, (resp : pDescategoriaProductoRegistrar) => {
			if (resp.resp_estado == 1) {
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				for(var i in this.itemProducto.fotos){
					this.itemProducto.fotos[i].adjunto_id = true;
				}
				modal.close();
			} else {
				if (resp.resp_estado == 0) {
					this.ohService.getOH().getAd().error(resp.resp_mensaje);
				} else {
					this.ohService.getOH().getAd().warning(resp.resp_mensaje);
				}
			}
        });
    }

	descategoriaProductoListar(){
		this.dESCategoriaProductoService.descategoriaProductoListar({
			page: this.pagin.page,
			size: this.pagin.size_rows,
			categoria_id : this.item.categoria_id            
	   }, (resp : pDescategoriaProductoListar) => {
		   this.itemsProductos = resp.categoria_productos
		   this.pagin.total = resp.response.total
	   });
	}

	foto_cargando : boolean;
	eventosFoto($event){
		$event.response.cargarAntes((files : any) => {
			this.foto_cargando = true;
		})
		$event.response.cargarFinalizado((cargado : boolean) => {
			this.foto_cargando = false;
		})
		$event.response.eliminarFoto((adjunto : any) => {
			if(adjunto.adjunto_id){
				this.dESCategoriaProductoService.descategoriaProductoAdjuntoEliminar({
					categoria_producto_id : this.itemProducto.categoria_producto_id,
					usuario_id : this.cse.data.user.data.userid,
					adjunto_id : adjunto.adjunto_id
				}, (resp : pDescategoriaProductoAdjuntoEliminar) => {
				});
			}
		})
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

	productoFotos(categoria_producto_id : any){

	}

}

