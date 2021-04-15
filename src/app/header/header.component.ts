import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AssignmentsService } from "../shared/assignments.service";
import { SubjectService } from "../shared/subject.service";
import { AuthService } from "../shared/auth.service";
import { Utilisateur } from "../user/utilisateur.model";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  title = "Application de gestion des assignments";
  loggedUserName:string = localStorage.getItem("loggedUser");
  logged:Utilisateur;
 
  constructor(
    private authService: AuthService,
    private SubjectService: SubjectService,
    private router: Router,
    private assignmentsService: AssignmentsService
  ) {}

  ngOnInit():void {
    if(this.loggedUserName==null) this.router.navigate([""]);
    this.logged = JSON.parse(localStorage.getItem("loggedUserjson"))
  }
  Logout():void {
    this.authService.logOut();
    this.router.navigate([""]);
  }
  Home() {
    this.router.navigate(["/home"]);
  }
  peuplerBD() {
    this.assignmentsService.peuplerBDAvecForkJoin().subscribe(() => {
      console.log(
        "LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES, ON RE-AFFICHE LA LISTE"
      );
      this.router.navigate(["/home"], { replaceUrl: true });
    });
  }
  peuplerBDSubject() {
    this.SubjectService.peuplerBDSubjectAvecForkJoin().subscribe(() => {
      console.log(
        "LA BD A ETE PEUPLEE, TOUS LES SUBJECTS AJOUTES, ON RE-AFFICHE LA LISTE"
      );
      this.router.navigate(["/home"], { replaceUrl: true });
    });
  }
}
