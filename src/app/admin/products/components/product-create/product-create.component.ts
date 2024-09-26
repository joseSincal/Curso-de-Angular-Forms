import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AngularFireStorage } from "@angular/fire/storage";

import { finalize } from "rxjs/operators";

import { MyValidators } from "./../../../../utils/validators";
import { ProductsService } from "./../../../../core/services/products/products.service";
import { CategoriesService } from "./../../../../core/services/categories.service";

import { Observable } from "rxjs";
import { Category } from "src/app/core/models/category.model";

@Component({
    selector: "app-product-create",
    templateUrl: "./product-create.component.html",
    styleUrls: ["./product-create.component.scss"],
})
export class ProductCreateComponent implements OnInit {
    form: FormGroup;
    image$: Observable<any>;
    categories: Category[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private productsService: ProductsService,
        private categoriesService: CategoriesService,
        private router: Router,
        private storage: AngularFireStorage
    ) {
        this.buildForm();
    }

    ngOnInit() {
        this.getCategories();
    }

    saveProduct(event: Event) {
        event.preventDefault();
        if (this.form.valid) {
            const product = this.form.value;
            this.productsService
                .createProduct(product)
                .subscribe((newProduct) => {
                    console.log(newProduct);
                    this.router.navigate(["./admin/products"]);
                });
        }
    }

    uploadFile(event) {
        const file = event.target.files[0];
        const name = "image.png";
        const fileRef = this.storage.ref(name);
        const task = this.storage.upload(name, file);

        task.snapshotChanges()
            .pipe(
                finalize(() => {
                    this.image$ = fileRef.getDownloadURL();
                    this.image$.subscribe((url) => {
                        console.log(url);
                        this.form.get("images").setValue([url]);
                    });
                })
            )
            .subscribe();
    }

    private buildForm() {
        this.form = this.formBuilder.group({
            title: ["", [Validators.required, Validators.minLength(4)]],
            price: ["", [Validators.required, MyValidators.isPriceValid]],
            images: ["", Validators.required],
            categoryId: ["", Validators.required],
            description: ["", [Validators.required, Validators.minLength(10)]],
            stock: [100, [Validators.required]],
        });

        this.form.get("stock").valueChanges.subscribe((value) => {
            console.log(value);
        });
    }

    get priceField() {
        return this.form.get("price");
    }

    get titleField() {
        return this.form.get("title");
    }

    private getCategories() {
        this.categoriesService.getAllCategories().subscribe((categories) => {
            this.categories = categories;
        });
    }
}
