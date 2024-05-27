import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/core/services/utils.service';
import { AuthService } from '../auth/services/auth.service';
import { MyUser } from 'src/app/core/models/user.model';
import { QR, QRSimple } from 'src/app/core/models/QR.model';
import { DatabaseService } from '../data/database.service';
import { LookInArrayResults } from 'src/app/core/enums/lookInArrayResults';
import { enumProfile } from 'src/app/core/enums/userProperties';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { CollectionsNames } from 'src/app/core/models/collectionNames';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
})
export class PrincipalPage
{
  constructor(private utilsService : UtilsService,
    public authService : AuthService,
    private dataBaseService : DatabaseService) 
  {}

  public deleteCredit()
  {
    this.utilsService.showSweet({title:'¿Seguro que desea eliminar sus créditos?',
    showDenyButton: true, denyButtonText: 'No', denyButtonColor: '#FDF4EC',
    confirmButtonText: 'Sí', confirmButtonColor: '#30602E',
    customClass: {
      title: 'sweetTitle',
      confirmButton: 'sweetConfirm',
      denyButton: 'sweetDeny',
    }})
    .then(async (result)=>
    {
      if(result.isConfirmed)
      {
        const loading = await this.utilsService.getLoadingCtrl({spinner: 'lines-sharp'});
        const user : MyUser = this.authService.myUser;

        loading.present();

        this.dataBaseService.UpdateUserCredit(user.uid,0, [])
        .then(()=>
        {
          loading.dismiss();
          user.credit = 0;
          user.QRs = [];
        });
      } 
    })  
  }

  public analyzeQR()
  {
    CapacitorBarcodeScanner.scanBarcode({hint: 0, cameraDirection: 1,scanOrientation: 1})
    .then((value)=>
    {
      this.dataBaseService.getDocRef(CollectionsNames.QRs, value.ScanResult.replace(" ",''))
      .then((qr)=>
      {
        this.chargeCredit(this.authService.myUser, qr.data() as QR)
      })
    })
  }


  private async chargeCredit(user : MyUser, QR : QR)
  {
    let canUpdateUserCredit : boolean;
    const QRs : Array<QRSimple> = new Array<QRSimple>();
    const howManyTimesCanBeUsed : number = user.profile == enumProfile.admin? QR.howManyTimesAdmCanUse : QR.howManyTimesCanBeUsed;
    const loading = await this.utilsService.getLoadingCtrl({spinner: 'lines-sharp'});


    loading.present();

    user.QRs.forEach((qr)=>
    {
      QRs.push(qr);
    })

    canUpdateUserCredit = true;

    switch(this.canUseQR(user, QR.code, howManyTimesCanBeUsed))
    {
      case LookInArrayResults.NOT_FOUND:
        QRs.push({code: QR.code, howManyTimesWasUsed : 1});
        break;

      case LookInArrayResults.FOUND_INVALID:
        canUpdateUserCredit = false;
        loading.dismiss();
        this.utilsService.showSweet(
          {title: 'Ya usaste este QR todas las veces disponibles', position: 'bottom', timer: 3000,
          showConfirmButton: false, customClass: 'toast', toast: true, timerProgressBar: true, background: '#FDF4EC'})
        break;
    }

    if(canUpdateUserCredit)
    {
      const newCreditValue : number = user.credit + QR.value;

      this.dataBaseService.UpdateUserCredit(user.uid, newCreditValue, QRs)
      .then(()=>
      {
        loading.dismiss();
        user.credit = newCreditValue;
        user.QRs = QRs;
      })
    }
  }

  private canUseQR(user : MyUser, code : string, maxTimesCanBeUsed : number) : LookInArrayResults
  {
    let qr : QRSimple;
    let retorno : LookInArrayResults;
    
    retorno = LookInArrayResults.NOT_FOUND;

    for(let i : number = 0; i<user.QRs.length; i++)
    {
      qr = user.QRs[i];

      if(qr.code == code)
      {
        retorno = LookInArrayResults.FOUND_VALID;

        if(qr.howManyTimesWasUsed < maxTimesCanBeUsed)
        {
          qr.howManyTimesWasUsed++;
        }
        else
        {
          retorno = LookInArrayResults.FOUND_INVALID;
        }

        break;
      }
    }

    return retorno;
  }
}
