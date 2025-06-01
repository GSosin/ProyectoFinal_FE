export class ApiError extends Error {
    constructor(status, message, errors, code) {
        super(message);
        this.status = status;
        this.errors = errors;
        this.code = code;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
