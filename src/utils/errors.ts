export class ValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ValidationError'
    }
}

export class FirestoreOperationError extends Error {
    constructor(operation: string, message: string) {
        super(`Firestore ${operation} operation failed: ${message}`)
        this.name = 'FirestoreOperationError'
    }
}