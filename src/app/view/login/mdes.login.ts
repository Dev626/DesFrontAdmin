import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CoreService, FirebaseAuthService, OHService, OVCBase, pSegusuarioClaveRestaurar } from '@ovenfo/framework';
import { environment } from 'src/environments/environment';
import { shared } from 'src/environments/environmentShared';

@Component({
	selector: 'mdes-login',
	templateUrl: './mdes.login.html'
})
export class MDESLogin extends OVCBase {

	user: any;
	sizeW: number;
	sizeWidthImg: string;
	sistema_id: number;
	restaurar : any;

	@Output() onLogin: EventEmitter<any>;

	@Input() config : any

	constructor(private router: Router, public override ohService: OHService, private title: Title, private modalService: NgbModal, public override cse: CoreService, public fbAuth: FirebaseAuthService) {

		super(ohService, cse)

		this.onLogin = new EventEmitter<any>();

		this.user = {};
		this.sistema_id = environment.systemId || shared.systemId;

		this.sizeW = 2;
		this.sizeWidthImg = "100%";

		this.restaurar = {
			emailRestore : "",
			alertMsj : ""
		};

		this.cse.onUpdate();
		this.precarga.then(() => {
			this.title.setTitle(this.cse.data.system.sistema.descripcion + " - Login v" + environment.version);
		})

	}

	ngOnInit() {

		this.ohService.getOH().getLoader().close();

		var regId = "";

			regId = "OVN_CONFIRM_SUCCESS";
			if (this.storage.has(regId)) {
				this.ohService.getOH().getAd().success(this.storage.get(regId));
				this.storage.remove(regId);
			}

			regId = "OVN_CONFIRM_ALERT";
			if (this.storage.has(regId)) {
				this.ohService.getOH().getAd().warning(this.storage.get(regId));
				this.storage.remove(regId);
			}

			regId = "OVN_RESTORE_SUCCESS";
			if (this.storage.has(regId)) {
				this.ohService.getOH().getAd().success(this.storage.get(regId));
				this.storage.remove(regId);
			}

	}

	ngAfterViewInit() {
		this.afterInit_pr();
	}

	login() {
		this.doLogin(this.user.user, this.user.password, () => {
			this.ohService.getOH().getLoader().close();
			this.onLogin.emit();
		})
	}

	openRestorePassword(content) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
			if (result == "restore") {

			}
		});
	}

	gmailLogin() {
		this.fbAuth.googleSignin().then((user : any) => {
			this.externalLogin(user, this.cse.params.firebaseAccesoId.google)
		})
	}

	facebooklogin() {
		this.fbAuth.facebookSignin().then((user : any) => {
			this.externalLogin(user, this.cse.params.firebaseAccesoId.facebook)
		})
	}

	private externalLogin(user : any, type : number){
		if(user && !user.message){
			if(user.uid){
				user = this.obtenerNombre(user)
			}
			user.unidad_negocio_id = this.storage.item("OVN_SYSTEM", "unidad_negocio_id")
			this.segusuarioFirebaseAcceder(user, type, ["des_client"] , () => { // 41717 Facebook
				this.ohService.getOH().getLoader().close();
				this.onLogin.emit();
			})
		} else {
			this.ohService.getOH().getAd().warning(user.message);
			//this.ohService.getOH().getAd().warning("Ha ocurrido un problema, contacte con el administrador");
		}
	}

	anomilogin(){
		this.fbAuth.anonymousSignIn().then((user) => {
		})
	}

	abrirClave(modal){
		this.restaurar.emailRestore = this.user.user ? this.user.user : "";
		this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
		}, () => {
		});
	}

	eventoRestaurar(eventClose : any){
		this.userService.segusuarioClaveRestaurar({
			correo : this.restaurar.emailRestore,
			sistema_id : environment.systemId || shared.systemId,
			enlace : environment.protocol+"://"+environment.hostLocal+"/#/PasswordRestore"
		}, (resp : pSegusuarioClaveRestaurar)=> {
			if(resp.resp_estado == 1){
				this.ohService.getOH().getAd().success(resp.resp_mensaje);
				this.restaurar = {
					emailRestore : "",
					alertMsj : ""
				};
				eventClose();
			} else {
				if(resp.resp_estado == 0){
					this.ohService.getOH().getAd().error(resp.resp_mensaje);
				} else {
					this.restaurar.alertMsj = resp.resp_mensaje;
				}
			}
		})
	}

	restore(item : any){

	}

}