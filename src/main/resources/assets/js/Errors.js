export class Errors {
    constructor() {
        this.errors = {}
    }

    record(errors) {
        this.errors = {};
        for (let error in errors) {
            this.errors[errors[error].field] = errors[error].defaultMessage;
        }
    }

    has(field) {
        return this.errors.hasOwnProperty(field);
    }

    any() {
        return Object.keys(this.errors).length > 0;
    }

    get(field) {
        if (this.errors[field]) {
            return this.errors[field];
        }
    }

    clear(field) {
        if (field) {
            delete this.errors[field];
            return;
        }
        this.errors = {};

    }
}