export class Session {
    static #sessionId = null;

    static init() {
        this.#sessionId = localStorage.getItem(`session_id`);
        if (!this.#sessionId) {
            this.#sessionId = crypto.randomUUID();
            localStorage.setItem(`session_id`, this.#sessionId);
            return true;
        }
    }

    static getId() {
        return this.#sessionId;
    }
}
