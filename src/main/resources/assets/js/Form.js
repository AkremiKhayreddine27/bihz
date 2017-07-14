import {Errors} from './Errors';
export class Form {
    constructor(data) {
        this.model = {};
        this.originalData = data;
        for (let field in data.model) {
            this.model[field] = data.model[field];
        }
        this.errors = new Errors();
    }

    reset() {
        for (let field in this.originalData.model) {
            this.model[field] = '';
        }
        this.errors.clear();
    }

    data() {
        let data = {};
        for (let property in this.model) {
            data[property] = this.model[property];
        }
        return data;
    }

    submit(requestType, url) {
        return new Promise((resolve, reject) => {
            axios[requestType](url, this.data())
                .then(response => {
                    this.onSuccess(response.data);
                    resolve(response.data);
                })
                .catch(error => {
                    this.onFail(error.response.data);
                    reject(error.response.data);
                })
        });
    }

    onSuccess(response) {
        this.reset();
    }

    post(url) {
        return this.submit('post', url);
    }

    delete(url) {
        return this.submit('delete', url);
    }

    patch(url) {
        return this.submit('patch', url);
    }

    onFail(errors) {
        this.errors.record(errors);
    }
}