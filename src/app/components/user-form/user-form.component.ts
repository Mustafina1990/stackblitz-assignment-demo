// src/app/components/user-form/user-form.component.ts

import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { User } from "../../models/user.model";
import { UserService } from "../../services/user-service.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-user-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.css"],
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      full_name: [{ value: "", disabled: true }],
      age: ["", [Validators.required, Validators.min(18)]],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.userForm
      .get("first_name")
      ?.valueChanges.subscribe(() => this.updateFullName());
    this.userForm
      .get("last_name")
      ?.valueChanges.subscribe(() => this.updateFullName());
  }

  loadUserData() {
    this.loading = true;
    this.userService.getUser().subscribe({
      next: (user) => {
        this.userForm.patchValue(user);
        this.updateFullName();
        this.loading = false;
      },
      error: () => {
        this.error = "Failed to load user data";
        this.loading = false;
      },
    });
  }

  updateFullName() {
    const firstName = this.userForm.get("first_name")?.value;
    const lastName = this.userForm.get("last_name")?.value;
    this.userForm.get("full_name")?.setValue(`${firstName} ${lastName}`);
  }

  onSave() {
    if (this.userForm.valid) {
      this.userService.updateUser(this.userForm.value as User).subscribe({
        next: () => alert("User updated successfully"),
        error: () => alert("Error updating user"),
      });
    }
  }

  // Error handling methods for the form fields
  getErrorMessage(controlName: string): string | null {
    const control = this.userForm.get(controlName);
    if (control && control.errors) {
      if (control.errors["required"]) {
        return "This field is required";
      } else if (control.errors["email"]) {
        return "Enter a valid email";
      } else if (control.errors["min"]) {
        return "Age must be greater than or equal to 18";
      }
    }
    return null;
  }
}
