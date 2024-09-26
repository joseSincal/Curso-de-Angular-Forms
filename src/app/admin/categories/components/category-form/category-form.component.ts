import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { FormGroup, Validators, FormBuilder } from "@angular/forms";

import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
import { MyValidators } from "src/app/utils/validators";
import { Observable } from "rxjs";

import { CategoriesService } from "./../../../../core/services/categories.service";
import { Category } from "./../../../../core/models/category.model";

@Component({
    selector: "app-category-form",
    templateUrl: "./category-form.component.html",
    styleUrls: ["./category-form.component.scss"],
})
export class CategoryFormComponent implements OnInit {
    form: FormGroup;
    image$: Observable<string>;
    isNew: boolean = true;

    @Input()
    set category(data: Category) {
        if (data) {
            this.form.patchValue(data);
            this.isNew = false;
        }
    }
    @Output() create = new EventEmitter<any>();
    @Output() update = new EventEmitter<any>();

    constructor(
        private formBuilder: FormBuilder,
        private storage: AngularFireStorage,
        private categoriesService: CategoriesService
    ) {
        this.buildForm();
    }

    ngOnInit(): void {}

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
            if (this.isNew) {
                this.create.emit(this.form.value);
            } else {
                this.update.emit(this.form.value);
            }
        } else {
            this.form.markAllAsTouched();
        }
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
