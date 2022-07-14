import Matrix from "../lib/Matrix";

const localStore = localStorage.getItem("store");
const mx = new Matrix({
    store: localStore !== null ? JSON.parse(localStore) : {},
});

export {mx};
