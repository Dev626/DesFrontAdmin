import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { NgbActiveModal, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { CoreService, FirebaseAuthService, LoginServiceJPOImpl, OHService, ohStorage, OVCMessaging } from "@ovenfo/framework";

@Component({
	selector: 'mdes-nav',
	templateUrl: './mdes.nav.html'
})
export class MDESNav {
	
	@ViewChild("modalAcceder", { static: true }) private modalAcceder: NgbModalRef;
	@ViewChild("modalTutorial", { static: true }) modalTutorial: TemplateRef<NgbActiveModal>;

	private loginService : LoginServiceJPOImpl;

	@Input() sistema_base: any
	@Input() config: any
	
	storage : ohStorage
	typeRouter : string
	videoOcultar : boolean

	@Input() doLogoutEvent: any;
	
	@Output() onLoginEvent : EventEmitter<any>;
	@Output() onLogoutEvent : EventEmitter<any>;
	
	@Output() onCountryChange : EventEmitter<any>;

	@Input() mostrarAcceso : boolean = true

	isMenuCollapsed: boolean = true

    constructor(public ohService: OHService, public cse: CoreService, private router: Router, private modalService: NgbModal, public fbAuth: FirebaseAuthService, private messagingService: OVCMessaging){
		this.storage = new ohStorage();

		this.onLoginEvent  = new EventEmitter<any>();
		this.onLogoutEvent  = new EventEmitter<any>();

		this.onCountryChange  = new EventEmitter<any>();

		this.loginService = new LoginServiceJPOImpl(ohService);
		//(this.getUserData()

		if(this.doLogoutEvent){
			this.doLogoutEvent.done = () => {
				this.doLogout(true);
			}
		}
	}

	ngOnInit() {

		if(this.router.url == '/' || this.router.url == '/Cart'){

			if(this.router.url == '/'){
				this.typeRouter = "map"
			}
			if(this.router.url == '/Cart'){
				this.typeRouter = "cart"
			}

		} else if(this.router.url.indexOf('/Store') >=0){
			this.typeRouter = "store"
		}

		let _conf = this.storage.item("OVN_SYSTEM", "configuracion")
		if(this.router.url == '/Map' && (!_conf || (_conf && !_conf.videoOcultar))){
			this.abrirTutorial()
		}

	}

	tutorial_url : string
	abrirTutorial(){
		this.videoOcultar = true
		let _conf = this.cse.data.system.sistema.configuracion
		if(_conf && _conf.tutorial){
			this.tutorial_url = '<iframe width="100%" height="350" src="'+_conf.tutorial+'" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
			
			this.modalService.open(this.modalTutorial, { size: 'lg' }).result.then(() => {
				this.eventOcultar()
			}, () => {
				this.eventOcultar()
			});

		}
	}

	eventOcultar(){
		let _conf = this.storage.item("OVN_SYSTEM", "configuracion")
		_conf.videoOcultar = this.videoOcultar
		this.storage.add("OVN_SYSTEM", "configuracion", _conf)
	}

	abrirModal(){
		this.modalService.open(this.modalAcceder);
	}

	onLogin(c){
		c()
		this.doLogoutEvent.getUserData()
		this.onLoginEvent.emit();
	}

	onCerrarSession(){
		let modalParams = {
			title : "Salir",
			btnAccept : "Cerrar",
			btnAcceptIcon : "fas fa-power-off",
			btnAcceptBack : "btn btn-danger",
			btnCancel : "Retornar",
			btnCancelIcon : "fas fa-reply",
			btnCancelBack : 'btn btn-outline-info'
		};

		this.ohService.getOH().getUtil().confirm("¿Desea salir del sistema?",() => {
			this.doLogout(true);
		},(tipomensaje) => {
			
		}, modalParams);
	}

	doLogout(desabilitar : boolean){
		this.ohService.getOH().getLoader().show();
		this.fbAuth.signOut()
		if(this.cse.ovn_main.sub_usuario_conectado){
			this.cse.ovn_main.sub_usuario_conectado.unsubscribe();
		}
		this.cse.ovn_main.usuarios_conectados.eliminar(this.cse.data.user.data.token);
		if(desabilitar){
			this.loginService.wevLogout();
		}
		this.messagingService.dessubscribirse(false, () => {
			window.setTimeout(() => {
				localStorage.removeItem("OVN_DATA")
				localStorage.removeItem("APM_FIRST")
				for(var i = 0; i < this.cse.data.user.systems.length; i++){
					localStorage.removeItem("OVN_"+this.cse.data.user.systems[i].id.trim().toUpperCase()+"_DATA")
				}
				this.ohService.getOH().getLoader().close()
				delete this.cse.data.user
				this.onLogoutEvent.emit()
				
			}, 500)
		});
	}

	cambiarPais(pais : any){
		this.ohService.getOH().getUtil().confirm("Confirmas cambiar de país?", () => {
			this.storage.remove("OVN_DES_CART")
			this.config.pais = pais
			this.onCountryChange.emit(pais.unidad_negocio_id)
			this.router.navigate(['/']);
		})
	}

}