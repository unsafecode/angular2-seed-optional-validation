import {Component} from '@angular/core';
import { FormGroup, FormControl, AbstractControl, Validators, ValidatorFn} from '@angular/forms';
import { Observable} from "rxjs/Observable";
import "rxjs/add/operator/distinctUntilChanged";

@Component({
  selector: 'home',
  styleUrls: ['./home.css'],
  templateUrl: './home.html'
})
export class Home {

  form: FormGroup;
  validation: { [key:string]: ValidatorFn | ValidatorFn[] };

  isRequired: boolean = true;
  yourName: string = '';

  ngOnInit() {
    this.form = new FormGroup({
      "isRequired": new FormControl(true),
      "yourName": new FormControl('', [
        //this.conditionalValidation(Validators.required, () => this.form.get("isRequired").valueChanges)
      ])
    });

    // this.dynamicDisable(
    //   this.form.get("yourName"), 
    //   form => form.get("isRequired"),
    //   ref => !ref);

    // this.form
    //   .get("isRequired")
    //   .valueChanges
    //   .subscribe(val => {
    //     if (val === undefined) return;

    //     if (val) {
    //       this.includeInForm(this.form, "yourName");
    //     } else {
    //       this.excludeFromForm(this.form, "yourName");
    //     }
        
    //   });
  }

  public dynamicDisable(
    ctrl: AbstractControl, 
    refControl: (form: AbstractControl) => AbstractControl,
    condition: (val:any) => boolean = x => x) {
      refControl(ctrl.root)
      .valueChanges
      .map(condition)
      .distinctUntilChanged()
      .subscribe(val => {
        if (val)
          ctrl.disable();
        else
          ctrl.enable();
      });
  }

  private conditionalValidation(
    base: ValidatorFn, 
    condition: () => Observable<boolean>) : ValidatorFn {
      let inited, active = false;
      return (control: FormControl) => {
        if(!inited) {
          condition().subscribe(val => active = !!val);
          inited = true;
        }
        
        if (active) {
          return base(control);
        }

        return Validators.nullValidator;
      };
  }

  private includeInForm(form: FormGroup, controlName: string) {
    const ctl = this.form.get("yourName");    
    this.makeOptional(ctl, true);
  }

  private excludeFromForm(form: FormGroup, controlName: string) {
    const ctl = this.form.get("yourName");    
    this.makeOptional(ctl, false);
  }

  private makeOptional(ctl: AbstractControl, isOptional: boolean) {
    if (isOptional) {
      ctl.setValidators((<any>ctl).__validator || ctl.validator);
    } else {
      (<any>ctl).__validator = ctl.validator;
      ctl.clearValidators();
    }
    ctl.updateValueAndValidity();
  }
}
