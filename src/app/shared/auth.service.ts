import { Injectable } from '@angular/core';
import { Utilisateur } from '../user/utilisateur.model';
import { users } from './user_data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn = false;
  admin = false;
  loggedUser:Utilisateur;
  GlobalUserList:any;

  constructor() {}

  logIn(login, password) {
    if(this.GlobalUserList == null){this.GlobalUserList = users}
    this.GlobalUserList.forEach(user =>{
      if(login == user.login && password == user.password){
        this.loggedUser = new Utilisateur();
        this.loggedIn = true;
        this.loggedUser.login = user.login;
        this.loggedUser.password = user.password;
        this.loggedUser.role = user.role;
        if (user.role == "admin") this.admin = true;
      }
    })
  }
  CreateAccount(user:Utilisateur):void{
    if(this.GlobalUserList == null){this.GlobalUserList = users}
    this.loggedIn = true;
    this.GlobalUserList.push(user);
    this.logIn(user.login, user.password)
  }

  logOut() {
    this.loggedIn = false;
    this.admin = false;
    this.loggedUser = null;
  }

  isAdmin() {
    return new Promise((resolve, reject) => {
      resolve(this.admin);
    });
  }
}
