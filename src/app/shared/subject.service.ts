import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, Observable, of } from "rxjs";
import { catchError, filter, map, tap } from "rxjs/operators";
import { LoggingService } from "./logging.service";
import { Subject } from "../subject/subject.model";
import { subjectGenerees } from './subject_data';

@Injectable({
  providedIn: "root",
})
export class SubjectService {
  subject: Subject[];

  constructor(
    private loggingService: LoggingService,
    private http: HttpClient
  ) {}

  uri = "http://localhost:8010/api/subjects";

  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.uri);
  }

  getSubject(id: number): Observable<Subject> {
    return this.http.get<Subject>(this.uri + "/" + id).pipe(
      // traitement 1
      map((a) => {
        a.nom += " MODIFIE PAR MAP";
        return a;
      }),
      tap((a) => {
        console.log("TRACE DANS TAP : j'ai reçu " + a.nom);
      }),
      catchError(
        this.handleError<any>("### catchError: getSubject  by id avec id=" + id)
      )
    );
  }

  private handleError<T>(operation: any, result?: T) {
    return (error: any): Observable<T> => {
      console.log(error); // pour afficher dans la console
      console.log(operation + " a échoué " + error.message);

      return of(result as T);
    };
  }

  addSubject(subject:Subject):Observable<any> {
    console.log('add subject ', subject);
    return this.http.post(this.uri, subject);
  }

  updateSubject(subject:Subject):Observable<any> {
    return this.http.put(this.uri, subject);
  }

  deleteSubject(subject:Subject):Observable<any> {
    return this.http.delete(this.uri + "/" + subject._id);
  }

  peuplerBDSubjectAvecForkJoin():Observable<any> {
    const appelsVersAddSubject = [];
    subjectGenerees.forEach((a) => {
      const subject = new Subject();
      subject.id = a.id;
      subject.nom = a.nom;
      subject.image_matiere = a.image_matiere;
      subject.image_prof = a.image_prof;

      appelsVersAddSubject.push(this.addSubject(subject));
    });
    return forkJoin(appelsVersAddSubject);
  }
}
