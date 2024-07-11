const applyFilters = (priorityColumnIndex) => {
    const table = document.getElementById('excelTable');
    const rows = Array.from(table.rows).slice(1); // Skip header row
    const priority1 = document.getElementById('priority1').checked;
    const priority2 = document.getElementById('priority2').checked;
    const priority3 = document.getElementById('priority3').checked;
    const priority4 = document.getElementById('priority4').checked;
    const priorities = [];

    if (priority1) priorities.push('1');
    if (priority2) priorities.push('2');
    if (priority3) priorities.push('3');
    if (priority4) priorities.push('4');

    rows.forEach(row => {
        const priorityCell = row.cells[priorityColumnIndex];
        const priorityValue = priorityCell ? priorityCell.textContent : null;

        if (priorities.length === 0 || priorities.includes(priorityValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
};

document.querySelectorAll('.filter-options input').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const headerRow = document.getElementById('excelTable').rows[0];
        const priorityColumnIndex = Array.from(headerRow.cells).findIndex(cell => cell.textContent === 'PRIORITY');
        if (priorityColumnIndex !== -1) {
            applyFilters(priorityColumnIndex);
        }
    });
});

// Set all checkboxes to checked by default
document.querySelectorAll('.filter-options input').forEach(checkbox => {
    checkbox.checked = true;
});
