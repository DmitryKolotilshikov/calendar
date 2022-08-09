export function addBasicTableLayout(table, month, year) {
    table.innerHTML = '';

    table.insertAdjacentHTML('afterbegin', `
        <thead>
            <tr>
                <th>пн</th>
                <th>вт</th>
                <th>ср</th>
                <th>чт</th>
                <th>пт</th>
                <th>сб</th>
                <th>вс</th>
            </tr>
        </thead>
        <tbody>
            <tr></tr>
        </tbody>
        <tfoot>
            <tr>
                <th colspan="7">${month} ${year}</th>
            </tr>
        </tfoot>
    `);
}

export function addClass(el, cl = '') {
    el.classList.add(cl);
}

export function removeClass(el, cl = '') {
    el.classList.remove(cl);
}

export function clearTDClasses(table, cl = '') {
    table.querySelectorAll('td').forEach(el => {
        el.classList.remove(cl)
    })
}

export function removeSibling(el, pos = 'next') {
    if (pos === 'next' && el.nextElementSibling) {
        el.nextElementSibling.remove();
    } else if (pos === 'prev' && el.previousElementSibling) {
        el.previousElementSibling.remove();
    }
}
