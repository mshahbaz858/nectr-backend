import { /* inject, */ BindingScope, injectable } from '@loopback/core';

@injectable({ scope: BindingScope.TRANSIENT })
export class UtilsService {

  WEEK_DAY_TO_DAYNAME_Map: any = {
    '0': 'SUNDAY',
    '1': 'MONDAY',
    '2': 'TUESDAY',
    '3': 'WEDNESDAY',
    '4': 'THURSDAY',
    '5': 'FRIDAY',
    '6': 'SATURDAY'
  }

  constructor() { }

  hasPermission(type: any, roles: any, allowedRoles: any): boolean {
    return allowedRoles.findIndex((allowedRole: any) => {
      if (allowedRole == type) {
        return true;
      }
      return roles.findIndex((userRole: any) => userRole == allowedRole) > -1 ? true : false;
    }) > -1
      ? true
      : false;
  };

  convertTimeStringToNumber(timeStr: string): number {
    let timeParts: string[] = timeStr.split(':');
    return parseFloat(timeParts[0] + '.' + timeParts[1] ? timeParts[1] : '0');
  };

  capitalize(str: string): string {
    let capitalizedStr = '';
    str.split(' ').forEach(word => {
      capitalizedStr += word[0].toUpperCase() + word.slice(1) + ' ';
    });
    return capitalizedStr.trim();
  };

  shallowChildEquality(child: any, parent: any): boolean {
    let child_cp = { ...child };

    for (const key in child_cp) {
      if (child_cp[key] != parent[key]) {
        return false;
      }
      delete child_cp[key];
    }
    if (Object.keys(child_cp).length > 0) {
      return false;
    }
    return true;
  };


  generateRandomNumber(length: number = 6): string {
    let i = 0;
    let rand: string = '';
    for (i = 0; i < length; i++) {
      rand += Math.floor(Math.random() * 10)
    }
    return rand;
  }

  convertTo24Hour(timeStr: string): { hours: number, minutes: number } {
    timeStr = timeStr.trim();
    let hours: number = parseInt(timeStr.substr(0, 2));
    let minutes = parseInt(timeStr.substr(3, 2));
    let timeOfDay = timeStr.substr(-2);
    if (timeOfDay === "PM" && hours < 12) {
      hours = 12 + hours;
    };
    if (timeOfDay === "AM" && hours === 12) {
      hours = 0;
    };
    if (hours === 24) hours = 0;
    return { hours, minutes }
  };

}
