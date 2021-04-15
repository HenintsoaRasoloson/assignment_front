import { Component, OnInit } from "@angular/core";
import { Utilisateur } from "../user/utilisateur.model";
import { AuthService } from "../shared/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  user: Utilisateur;
  login = "";
  password = "";
  role="";
  btn_status:Boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    
    ) {}

  ngOnInit(): void {
    localStorage.removeItem("loggedUser")
    localStorage.removeItem("loggedUserjson")
    console.log("wawa")
    console.log(this.authService.GlobalUserList);
  }

  togglePage(){
    this.btn_status = !this.btn_status;
  }

  onSubmit($event) {
    if (!this.login || !this.password) return;
    this.user = new Utilisateur();
    this.authService.logIn(this.login, this.password);
    if (this.authService.loggedIn){
      localStorage.setItem("loggedUser",this.authService.loggedUser.login);
      localStorage.setItem("loggedUserjson",JSON.stringify(this.authService.loggedUser));
      this.router.navigate(["/home"]);
    } 
  }
  onSubmitCreation($event){
    if (!this.login || !this.password || !this.role) return;
    this.user = new Utilisateur();
    this.user.login = this.login;
    this.user.password = this.password;
    this.user.role = this.role;
    this.authService.CreateAccount(this.user);
    console.log(this.authService.GlobalUserList);
  }
}
