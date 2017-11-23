export class View {
    cells(cb) {

        let elements = document.querySelectorAll('.js-cell');

        if (!cb) {
            return elements;
        }

        elements.forEach(cb);
    }

    onCellClick(fn) {
        this.cells((el) => {
            el.addEventListener('click', (e) => {
                fn(e.currentTarget);
            });
        });
    }
}
