/* 
IMPORTANT: THIS FILE DOES NOT CONTAIN ANY ISSUE TO BE SOLVED.
IMPORTANT: THIS FILE DOES NOT CONTAIN ANY ISSUE TO BE SOLVED.
IMPORTANT: THIS FILE DOES NOT CONTAIN ANY ISSUE TO BE SOLVED.
IMPORTANT: THIS FILE DOES NOT CONTAIN ANY ISSUE TO BE SOLVED.
IMPORTANT: THIS FILE DOES NOT CONTAIN ANY ISSUE TO BE SOLVED.
IMPORTANT: THIS FILE DOES NOT CONTAIN ANY ISSUE TO BE SOLVED.
IMPORTANT: THIS FILE DOES NOT CONTAIN ANY ISSUE TO BE SOLVED.
IMPORTANT: THIS FILE DOES NOT CONTAIN ANY ISSUE TO BE SOLVED.

It only emulates a backend on your local storage.
*/

import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { delay } from "rxjs/operators";
import { User, UserBackend } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private storageKey = "user";
  constructor() {
    this.initStorage();
  }
  private initStorage(): void {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData: UserBackend = {
        first_name: "John",
        last_name: "Doe",
        age: 30,
        email: "john.doe@example.com",
        skills: ["UX/UI Design", "PHP Development", "JavaScript", "Angular"],
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }
  fetchUser(): Observable<UserBackend> {
    const data = localStorage.getItem(this.storageKey);
    const user = data ? JSON.parse(data) : null;
    if (user) {
      return of(user).pipe(delay(1000)); // Simulate network delay
    } else {
      return throwError(() => new Error("No user data found"));
    }
  }
  updateUser(data: User): Observable<UserBackend> {
    if (typeof data.age !== "number" || data.age <= 0) {
      return throwError(
        () => new Error("Invalid age: Age must be a positive number.")
      );
    }
    const userData: UserBackend = {
      first_name: data.first_name,
      last_name: data.last_name,
      age: data.age,
      email: data.email,
      skills: data.skills,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(userData));
    return of(userData).pipe(delay(1000));
  }
}
