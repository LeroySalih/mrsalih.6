import { FormControl} from '@angular/forms';

export function isNumberValidator (control: FormControl): {[s: string]: boolean} {
  if (isNaN(control.value)) {
    return {isNoN: true};
  }
  return null;
}

export function maxValidator (maxVal: number): (control: FormControl) => {[s: string]: boolean} {
  return (control: FormControl) => {

    if (isNaN(control.value)) {
      return null;
    }

    if (control.value > maxVal) {
      return {'maxVal': true};
    }
    return null;
  };
}

export function minValidator (minVal: number): (control: FormControl) => {[s: string]: boolean} {
  return (control: FormControl) => {

    if (isNaN(control.value)) {
      return null;
    }

    if (control.value < minVal) {
      return {'minVal': true};
    }
    return null;
  };
}

