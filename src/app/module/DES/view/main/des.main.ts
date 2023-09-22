import { Component, AfterViewInit, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { DESBase } from 'src/app/module/DES/des.base';
import { DESCoreService } from 'src/app/module/DES/des.coreService';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreService, OHService } from '@ovenfo/framework';

@Component({
  templateUrl: './des.main.html'
})
export class DESMain extends DESBase implements OnInit, AfterViewInit {

    constructor(private router : Router, private ohService : OHService, public override cse : CoreService, public override dcs : DESCoreService, private modalService: NgbModal){
        super(ohService, cse, dcs);
    }

    ngOnInit(){
        var childrens = this.cse.getTreeChild('/Be/des').filter(child => child.type == 2);
        if(childrens.length == 1){
            this.router.navigate([childrens[0].urlTree]);
        }
    }

    ngAfterViewInit(){
         this.ohService.getOH().getLoader().close();
    }

}