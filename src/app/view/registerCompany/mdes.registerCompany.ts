import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { CoreService, FirebaseAuthService, OHService } from '@ovenfo/framework';
import { INLODESBase } from '../inlo.desbase';

import { DESUsuarioServiceJPO, pDesusuarioRegistrarTiendaNuevo } from 'src/app/module/DES/service/des.dESUsuarioService';

declare var AesUtil: any;

@Component({
	templateUrl: './mdes.registerCompany.html'
})
export class MDESRegisterCompany extends INLODESBase {

	private dESUsuarioService : DESUsuarioServiceJPO;

	dateRegister: any = {};
	
	constructor(public override ohService: OHService, private title: Title, public override cse: CoreService, private router: Router, public fbAuth: FirebaseAuthService) {

		super(ohService, cse)

        this.dESUsuarioService = new DESUsuarioServiceJPO(ohService);

		this.precarga.then(() => {
			this.title.setTitle(this.cse.data.system.sistema.descripcion + " -  Regístrate como vendedor");
		})

		this.dateRegister.razon_social = ""

		if (localStorage.getItem("OVN_DATA")) {
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
	}

	register() {
		this.ohService.getOH().getUtil().confirm("Confirma registrarse a " + this.cse.data.system.sistema.descripcion, () => {
			var passwordEncripted = new AesUtil().encrypt(this.dateRegister.password);

			this.dESUsuarioService.desusuarioRegistrarTiendaNuevo({
				razon_social : this.dateRegister.razon_social,
				nombre: this.dateRegister.name.toUpperCase(),
				apellido_paterno: this.dateRegister.lastName.toUpperCase(),
				apellido_materno: "",
				correo: this.dateRegister.email.toUpperCase(),
				clave: passwordEncripted,
				sistema_id: this.cse.data.system.sistema.sistema_id,
				unidad_negocio_id : this.storage.item("OVN_SYSTEM", "unidad_negocio_id")
			}, (resp : pDesusuarioRegistrarTiendaNuevo) => {
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
		if(!this.dateRegister.razon_social || this.dateRegister.razon_social.length == 0){
			this.ohService.getOH().getAd().warning("Primero ingrese el nombre de su empresa");
			document.getElementById("inp_empresa").focus()
		} else {
			this.fbAuth.googleSignin().then((user : any) => {
				this.externalLogin(user, this.cse.params.firebaseAccesoId.google)
			})
		}
	}

	facebooklogin() {
		if(!this.dateRegister.razon_social || this.dateRegister.razon_social.length == 0){
			this.ohService.getOH().getAd().warning("Primero ingrese el nombre de su empresa");
			document.getElementById("inp_empresa").focus()
		} else {
			this.fbAuth.facebookSignin().then((user : any) => {
				this.externalLogin(user, this.cse.params.firebaseAccesoId.facebook)
			})
		}
	}

	private externalLogin(user : any, type : number){
		if(user && !user.message){
			if(user.uid){
				user = this.obtenerNombre(user)
			}
			user.unidad_negocio_id = this.storage.item("OVN_SYSTEM", "unidad_negocio_id")
			user.razon_social = this.dateRegister.razon_social
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