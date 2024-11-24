// src/app/components/user-form/user-form.component.ts

import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
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
  predefinedSkills: string[] = [
    "UX/UI Design",
    "PHP Development",
    "JavaScript",
    "Angular",
  ];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      full_name: [{ value: "", disabled: true }],
      age: ["", [Validators.required, Validators.min(18)]],
      email: ["", [Validators.required, Validators.email]],
      skills: this.fb.array([], Validators.required),
      newSkill: [""],
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
        this.setSkills(user.skills);
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

  setSkills(skills: string[]) {
    const skillsFormArray = this.userForm.get("skills") as FormArray;
    skills.forEach((skill) => skillsFormArray.push(this.fb.control(skill)));
  }

  get skills(): FormArray {
    return this.userForm.get("skills") as FormArray;
  }

  addSkill(skill: string = ""): void {
    if (skill && !this.skills.value.includes(skill)) {
      this.skills.push(this.fb.control(skill));
      this.userForm.get("newSkill")?.setValue("");
    }
  }

  removeSkill(index: number): void {
    this.skills.removeAt(index);
  }

  onSkillSelect(event: Event): void {
    const selectElement = (event.target as HTMLSelectElement).value;
    this.addSkill(selectElement);
  }

  addNewSkill(): void {
    const newSkill = this.userForm.get("newSkill")?.value;
    if (newSkill && !this.predefinedSkills.includes(newSkill)) {
      this.predefinedSkills.push(newSkill);
      this.addSkill(newSkill);
    }
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
        switch (controlName) {
          case "first_name":
            return "First Name is required";
          case "last_name":
            return "Last Name is required";
          case "age":
            return "Age is required";
          case "email":
            return "Email is required";
          case "skills":
            return "At least one skill is required";
          default:
            return "This field is required";
        }
      } else if (control.errors["email"]) {
        return "Enter a valid email";
      } else if (control.errors["min"]) {
        return "Age must be greater than or equal to 18";
      }
    }
    return null;
  }
}
