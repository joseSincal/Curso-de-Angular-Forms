import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

import { CategoriesService } from "./../../../../core/services/categories.service";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { MyValidators } from "src/app/utils/validators";
import { Observable } from "rxjs";

@Component({
    selector: "app-category-form",
    templateUrl: "./category-form.component.html",
    styleUrls: ["./category-form.component.scss"],
})
export class CategoryFormComponent implements OnInit {
    form: FormGroup;
    image$: Observable<string>;
    categoryId: number;

    constructor(
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private router: Router,
        private storage: AngularFireStorage,
        private route: ActivatedRoute
    ) {
        this.buildForm();
    }

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.categoryId = params.id;
            if (this.categoryId) {
                this.getCategory();
            }
        });
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            name: [
                "",
                [Validators.required, Validators.minLength(4)],
                MyValidators.validateCategory(this.categoriesService),
            ],
            image: ["", Validators.required],
        });
    }

    get nameField() {
        return this.form.get("name");
    }

    get imageField() {
        return this.form.get("image");
    }

    save() {
        if (this.form.valid) {
            if (this.categoryId) {
                this.updateCategory();
            } else {
                this.createCategory();
            }
        } else {
            this.form.markAllAsTouched();
        }
    }

    private createCategory() {
        const data = this.form.value;
        this.categoriesService.createCategory(data).subscribe((newCategory) => {
            console.log(newCategory);
            this.router.navigate(["./admin/categories"]);
        });
    }

    private updateCategory() {
        const data = this.form.value;
        this.categoriesService
            .updateCategory(this.categoryId, data)
            .subscribe((newCategory) => {
                console.log(newCategory);
                this.router.navigate(["./admin/categories"]);
            });
    }

    private getCategory() {
        this.categoriesService
            .getCategory(this.categoryId)
            .subscribe((category) => {
                this.form.patchValue(category);
            });
    }

    uploadFile(event) {
        const image = event.target.files[0];
        const name = "category.png";
        const ref = this.storage.ref(name);
        const task = this.storage.upload(name, image);

        task.snapshotChanges()
            .pipe(
                finalize(() => {
                    this.image$ = ref.getDownloadURL();
                    this.image$.subscribe((url) => {
                        console.log(url);
                        this.imageField.setValue(url);
                    });
                })
            )
            .subscribe();
    }
}
