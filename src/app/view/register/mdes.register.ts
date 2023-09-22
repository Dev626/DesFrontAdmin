import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { CoreService, FirebaseAuthService, OHService, pSegusuarioRegistrarNuevo } from '@ovenfo/framework';
import { INLODESBase } from '../inlo.desbase';

declare var AesUtil: any;

@Component({
	templateUrl: './mdes.register.html'
})
export class MDESRegister extends INLODESBase {

	dateRegister: any = {};
	mode: string;

	constructor(public override ohService: OHService,
		private title: Title,
		public override cse: CoreService,
		private router: Router,
		public fbAuth: FirebaseAuthService) {

		super(ohService, cse)

		this.mode = 'register';

		this.precarga.then(() => {
			this.title.setTitle(this.cse.data.system.sistema.descripcion + " - Regístrate como cliente");
		})

	}

	ngOnInit() {
	}

	register() {
		this.ohService.getOH().getUtil().confirm("Confirma registrarse a " + this.cse.data.system.sistema.descripcion, () => {
			var passwordEncripted = new AesUtil().encrypt(this.dateRegister.password);

			this.userService.segusuarioRegistrarNuevo({
				nombre: this.dateRegister.name.toUpperCase(),
				apellido_paterno: this.dateRegister.lastName.toUpperCase(),
				apellido_materno: "",
				correo: this.dateRegister.email.toUpperCase(),
				clave: passwordEncripted,
				sistema_id: this.cse.data.system.sistema.sistema_id,
				unidad_negocio_id : this.storage.item("OVN_SYSTEM", "unidad_negocio_id")
			}, (resp: pSegusuarioRegistrarNuevo) => {
				if (resp.estado == 1) {
					this.doLogin(this.dateRegister.email.toUpperCase(), this.dateRegister.password, () => {
						this.ohService.getOH().getLoader().close();
						this.router.navigate(["/"]);
					})
				} else {
					if (resp.estado == 0) {
						this.ohService.getOH().getLoader().showError(resp.mensaje);
					} else {
						this.ohService.getOH().getAd().warning(resp.mensaje);
					}
				}
			});
		})
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
				this.router.navigate(["/"]);
			})
		} else {
			this.ohService.getOH().getAd().warning(user.message);
			//this.ohService.getOH().getAd().warning("Ha ocurrido un problema, contacte con el administrador");
		}
	}

}