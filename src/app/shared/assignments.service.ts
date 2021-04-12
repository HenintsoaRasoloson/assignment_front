import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { Assignment } from '../assignments/assignment.model';
import { Subject } from '../subject/subject.model';
import { LoggingService } from './logging.service';
import { assignmentsGeneres } from './data';
import { SubjectService } from '../shared/subject.service'

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  assignments:Assignment[];
  subjects:Subject[];

  constructor(private loggingService:LoggingService,private SubjectService:SubjectService, private http:HttpClient) {
    this.getSubject();
   }

  // uri = "http://localhost:8010/api/assignments";
  uri = "https://assignmentmbds2021-back.herokuapp.com/api/assignments"

  getSubject(){
    this.SubjectService.getSubjects()
    .subscribe(data => {
      this.subjects = data;
      console.log("------------- Subjects'lists retrieved ----------------");
    });
  }

  getAssignments():Observable<Assignment[]> {
    console.log("Dans le service de gestion des assignments...")
    //return of(this.assignments);
    return this.http.get<Assignment[]>(this.uri);
  }

  getAssignmentsPagine(page:number, limit:number):Observable<any> {
    return this.http.get<Assignment[]>(this.uri+"?page="+page + "&limit="+limit);
  }

  // Pour votre culture, on peut aussi utiliser httpClient avec une promesse
  // et then, async, await etc. Mais ce n'est pas la norme chez les developpeurs
  // Angular
  getAssignmentsAsPromise():Promise<Assignment[]> {
    console.log("Dans le service de gestion des assignments...")
    //return of(this.assignments);
    return this.http.get<Assignment[]>(this.uri).toPromise();
  }

  getAssignment(id:number):Observable<Assignment> {
    //let assignementCherche = this.assignments.find(a => a.id === id);

    //return of(assignementCherche);

    return this.http.get<Assignment>(this.uri + "/" + id)
    .pipe(
      // traitement 1
      map(a => {
        return a;
      }),
      tap(a => {
        console.log("TRACE DANS TAP : j'ai reçu " + a.nom);
      }),
      /*
      filter(a => {
        return (a.rendu)
      })
      */
      catchError(this.handleError<any>('### catchError: getAssignments by id avec id=' + id))
    );
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + ' a échoué ' + error.message);

      return of(result as T);
    };
  }

  generateId():number {
    return Math.round(Math.random()*100000);
  }

  getRandomNumber(nbr:number):number {
    return Math.round(Math.random()*nbr);
  }

  addAssignment(assignment:Assignment):Observable<any> {
    assignment.id = this.generateId();
    //this.loggingService.log(assignment.nom, " a été ajouté");

    /*this.assignments.push(assignment);


    return of("Service: assignment ajouté !");*/

    console.log("eto le add", assignment)
    return this.http.post(this.uri, assignment);
  }

  updateAssignment(assignment:Assignment):Observable<any> {
    // besoin de ne rien faire puisque l'assignment passé en paramètre
    // est déjà un élément du tableau

    //let index = this.assignments.indexOf(assignment);

    //console.log("updateAssignment l'assignment passé en param est à la position " + index + " du tableau");
    this.loggingService.log(assignment.nom, " a été modifié");

    return this.http.put(this.uri, assignment);
  }

  deleteAssignment(assignment:Assignment):Observable<any> {
    /*
    let index = this.assignments.indexOf(assignment);

    this.assignments.splice(index, 1);
    */


    this.loggingService.log(assignment.nom, " a été supprimé");

    return this.http.delete(this.uri + "/" + assignment._id);

  }
 
  peuplerBDAvecForkJoin(): Observable<any> {
    const appelsVersAddAssignment = []; 

    assignmentsGeneres.forEach((a) => {
      const nouvelAssignment = new Assignment();
      var randomid = this.getRandomNumber(this.subjects.length-1);
    
      nouvelAssignment.id = a.id;
      nouvelAssignment.nom = a.nom;
      nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
      nouvelAssignment.rendu = a.rendu;
      nouvelAssignment.note = a.note;
      nouvelAssignment.auteur = a.auteur;
      nouvelAssignment.remarques = a.remarques;
      var ma_matiere = new Subject();
        ma_matiere.id = this.subjects[randomid].id;
        ma_matiere.nom = this.subjects[randomid].nom;
        ma_matiere.image_matiere = this.subjects[randomid].image_matiere;
        ma_matiere.image_prof = this.subjects[randomid].image_prof;
      nouvelAssignment.matiere = ma_matiere;
      console.log("nouvelAssignment ",nouvelAssignment);

      appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment));
    });
    return forkJoin(appelsVersAddAssignment); // renvoie un seul Observable pour dire que c'est fini
  }
  
}
