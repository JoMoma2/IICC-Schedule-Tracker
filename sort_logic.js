// Function to apply filters based on the priority and company/added by checkboxes
const applyFilters = (priorityColumnIndex, companyOrAddedByColumnIndex) => {
    const table = document.getElementById('excelTable');
    const priorities = Array.from(document.querySelectorAll('.filter-options input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    const onlyShowConti = document.getElementById('onlyConti').checked;

    // Iterate through each row and hide/show based on the priority and company/added by filters
    Array.from(table.rows).slice(1).forEach(row => {
        const priorityValue = row.cells[priorityColumnIndex]?.textContent || '';
        const companyOrAddedByValue = row.cells[companyOrAddedByColumnIndex]?.textContent.toLowerCase() || '';

        const showByPriority = priorities.length === 0 || priorities.includes(priorityValue);
        const showByCompany = !onlyShowConti || companyOrAddedByValue.includes('conti');

        row.style.display = showByPriority && showByCompany ? '' : 'none';
    });
};

// Add event listeners to each checkbox to trigger filtering when changed
document.querySelectorAll('.filter-options input').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        // Get the header row of the table
        const headerRow = document.getElementById('excelTable').rows[0];

        // Find the index of the column that has the header text "PRIORITY"
        const priorityColumnIndex = Array.from(headerRow.cells).findIndex(cell => cell.textContent === 'PRIORITY');

        // Find the index of the column that has the header text "Company" or "ADDED BY"
        let companyOrAddedByColumnIndex = Array.from(headerRow.cells).findIndex(cell => cell.textContent === 'Company');
        let useCompanyColumn = true;

        if (companyOrAddedByColumnIndex === -1) {
            companyOrAddedByColumnIndex = Array.from(headerRow.cells).findIndex(cell => cell.textContent === 'ADDED BY');
            useCompanyColumn = false;
        }

        // Apply filters based on the selected checkboxes
        if (priorityColumnIndex !== -1 && companyOrAddedByColumnIndex !== -1) {
            applyFilters(priorityColumnIndex, companyOrAddedByColumnIndex);
        }
    });
});

// Initial fetch for the first sheet
fetchData(file);
