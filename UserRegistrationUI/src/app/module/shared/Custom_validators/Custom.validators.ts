import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../user.service';

export interface Data {
    username: string;
}

export class CustomValidator {

    /**
     * This custom validator will check the password containes a sysmbol(only-"!@#_")
     * a number, a uppercase letter or a lowercase letter
     * @parameter --(control: AbstractControl)
     * @returns --({passwordValidationSyError: true} | null)
     */
    static passwordValidation(control: AbstractControl): { [key: string]: any } | null {
        const pwd = control.value;
        const symbolRejectRegx = /[$%&/:?{~"^`\[\]]/g; // !@#_- required validation
        const symbolAcceptRegx = /[!@#_-]/g;
        const lowerLetters = /[a-z]+/.test(pwd);
        const upperLetters = /[A-Z]+/.test(pwd);
        const numbers = /[0-9]+/.test(pwd);
        const symbolsAccept = symbolAcceptRegx.test(pwd);
        const symbolReject = symbolRejectRegx.test(pwd);
        if (pwd === '' || upperLetters && lowerLetters && numbers && symbolsAccept) {
            if (symbolReject) {
                return { passwordValidationSyError: true };
            } else {
                return null;
            }
        } else {
            if (symbolReject) {
                return { passwordValidationSyError: true };
            } else {
                return { passwordValidationError: true }; // passwordValidationError;
            }
        }
    }

    /**
     * This custom validator use to check pwd and cofirmPwd will same or not
     * @parameter --(control: AbstractControl)
     * @returns --({matchPasswordError: true} | null)
     */
    static matchPassword(control: AbstractControl): { [key: string]: any } | null {
        // tslint:disable-next-line: triple-equals
        if (control && (control.value != null || control.value != undefined)) {
            const confirmPwdValue = control.value;
            const pwdControl = control.root.get('password');
            if (pwdControl) {
                const pwdValue = pwdControl.value;
                if (pwdValue !== confirmPwdValue) {
                    return { matchPasswordError: true };
                } else {
                    return null;
                }
            }
        }
    }

    /**
     * This custom async validator will check the email is unique or not by checking the
     * backend database. if exixts then return uniqueEmailAsyncError otherwise return null
     * @parameter --(service: UserService)
     * @returns --({uniqueClusterNameAsyncError: true} | null)
     */
    static uniqueEmailAsync(service: UserService): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> |
            Promise<ValidationErrors | null> => {
            return service.getEmail(control.value)
                .pipe(
                    map(res => {
                        console.log(res);
                        console.log(res.users);
                        return res.users ?
                            { uniqueEmailAsyncError: true } : null;
                    })
                );
        };
    }
}
