import { Injectable } from '@angular/core';
import { users } from './user_data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn = false;
  admin = false;

  constructor() {}

  logIn(login, password) {
    // typiquement, acceptera en paramètres un login et un password
    // vérifier qu'ils sont ok, et si oui, positionner la propriété loggedIn à true
    // si login/password non valides, positionner à false;

    users.forEach(user =>{
      if(login == user.login && password == user.password){
        this.loggedIn = true;
        if (login === "admin" && password === "admin") this.admin = true;
      }
    })
  }

  logOut() {
    this.loggedIn = false;
    this.admin = false;
  }

  // exemple d'utilisation :
  // isAdmin.then(admin => { console.log("administrateur : " + admin);})
  isAdmin() {
    return new Promise((resolve, reject) => {
      resolve(this.admin);
    });
  }
}
