import { addClass, removeClass, clearTDClasses, removeSibling, addBasicTableLayout} from './utils.js';

const table = document.querySelector('#calendar');
const btnLeft = document.querySelector('.btn-left');
const btnRight = document.querySelector('.btn-right');

const $d = new Date();
let $year = $d.getFullYear();
let $month = $d.getMonth();
let $currentDateElement = document.createElement('td');
let $selectedDates = [];
let $isMouseUpClicked = false;
let $onMouseUpRef = () => { };

const DATA_NOT_CURRENT = 'data-not-current';

document.addEventListener('click', (e) => {
    e.stopPropagation();
    const tags = ['TBODY', 'TR', 'TD', 'TH'];
    const tag = e.target.tagName;

    if (!tags.includes(tag) && $isMouseUpClicked) {
        clearTDClasses(table, 'active');
        removeSibling(table, 'next');
        addClass($currentDateElement, 'active-date');
    }

    !$isMouseUpClicked && $onMouseUpRef();
});


table.addEventListener('mousedown', () => {
    const tableCells = table.querySelectorAll(`td:not([${DATA_NOT_CURRENT}])`);
    clearTDClasses(table, 'active');

    $selectedDates = [];
    $isMouseUpClicked = false;
    let start = 0, end = 0, diff = 0, prevState = '', curState = '';

    table.addEventListener('mousemove', onMouseMove);
    table.addEventListener('mouseup', onMouseUp);

    function onMouseMove(e) {
        removeClass($currentDateElement, 'active-date');

        if (e.target.tagName === 'TD') {
            const TD = e.target;
            const TD_CONTENT = Number(TD.textContent);

            if (TD_CONTENT) {
                if (!TD.classList.contains('active')) {

                    TD.classList.toggle('active');
                    $selectedDates.push(TD.textContent);

                    start = Number($selectedDates[0]);
                    end = Number($selectedDates.at(-1));
                    diff = Math.abs(start - end);


                    if (diff !== 0) {

                        if (start > end) {
                            curState = 'left';
                        } else {
                            curState = 'right';
                        }
                        if (prevState !== curState) {
                            clearTDClasses(table, 'active');
                            prevState = curState;
                        }

                        tableCells.forEach(el => {
                            const v = Number(el.textContent);

                            if (start < end && v >= start && v <= end) {
                                addClass(el, 'active');
                            } else if (start > end && v <= start && v >= end) {
                                addClass(el, 'active');
                            }
                        })
                    }
                } else {
                    tableCells.forEach(el => {
                        const v = Number(el.textContent);

                        if (start > end && v < TD_CONTENT) {
                            removeClass(el, 'active');
                        } else if (start < end && v > TD_CONTENT) {
                            removeClass(el, 'active');
                        }
                    });
                    $selectedDates.splice(1);
                }
            }
        }
    }

    $onMouseUpRef = onMouseUp;

    function onMouseUp() {
        $isMouseUpClicked = true;

        table.removeEventListener('mousemove', onMouseMove);
        table.removeEventListener('mouseup', onMouseUp);

        $selectedDates = [];
        tableCells.forEach(el => {
            if (el.classList.contains('active')) {
                $selectedDates.push(el.textContent);
            }
        })

        removeSibling(table, 'next');

        if ($selectedDates.length) {
            table.insertAdjacentHTML('afterend', `
                <p class="selected-dates">${$selectedDates.join(', ')}</p>
            `)
        } else {
            addClass($currentDateElement, 'active-date');
        }
    }
})

btnLeft.addEventListener('click', () => {
    $month--;
    if ($month < 0) {
        $month = 11;
        $year--;
    }
    createCalendar(table, $year, $month);
});

btnRight.addEventListener('click', () => {
    $month++;
    if ($month > 11) {
        $month = 0;
        $year++;
    }
    createCalendar(table, $year, $month);
});

const createCalendar = (table, year, month) => {
    const date = new Date(year, month, 1);
    const startDay = date.getDay();
    const daysLength = new Date(year, month + 1, 0).getDate();
    const currentMonth = date.toLocaleString('default', { month: 'long' });

    const isCurrentYearAndMonth = (year === $d.getFullYear()) && (month === $d.getMonth());

    let row = 0;

    addBasicTableLayout(table, currentMonth, year);

    const tBody = table.tBodies[0];

    const notCurMonth = new Date(date);
    notCurMonth.setDate(notCurMonth.getDate() - startDay);

    for (let i = 1; i < startDay; i++) {
        notCurMonth.setDate(notCurMonth.getDate() + 1);

        tBody.rows[row].insertCell();
        const cell = tBody.rows[row].cells[i - 1];

        addClass(cell, 'not-current-month');
        cell.setAttribute(DATA_NOT_CURRENT, '');
        cell.append(notCurMonth.getDate());
    }

    for (let i = 1; i <= daysLength; i++) {

        if (tBody.rows[row].cells.length < 7) {
            tBody.rows[row].insertCell().textContent = i;
        } else {
            row++;
            tBody.insertRow().insertCell().textContent = i;
        }
        if (isCurrentYearAndMonth && $d.getDate() === i) {
            $currentDateElement = tBody.rows[row].cells[tBody.rows[row].cells.length - 1];
            addClass($currentDateElement, 'active-date');
        }
    }

    notCurMonth.setMonth(month + 1, 1);
    let cellLength = tBody.rows[row].cells.length;

    while (cellLength < 7) {
        tBody.rows[row].insertCell();

        const cell = tBody.rows[row].cells[cellLength];

        addClass(cell, 'not-current-month');
        cell.setAttribute(DATA_NOT_CURRENT, '');
        cell.append(notCurMonth.getDate());

        notCurMonth.setDate(notCurMonth.getDate() + 1);
        cellLength++;
    }
}

createCalendar(table, $year, $month);
