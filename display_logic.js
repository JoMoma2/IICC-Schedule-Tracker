const urlParams = new URLSearchParams(window.location.search);
const file = urlParams.get('file');
document.getElementById('fileName').textContent = file;

const isDate = (serial) => {
    const excelEpoch = new Date(1899, 11, 30);
    const jsDate = new Date(excelEpoch.getTime() + serial * 86400 * 1000);
    const thresholdDate = new Date(2023, 7, 1); // August 1, 2023
    return jsDate > thresholdDate;
};

const setAllCheckboxesChecked = () => {
    document.getElementById('priority1').checked = true;
    document.getElementById('priority2').checked = true;
    document.getElementById('priority3').checked = true;
    document.getElementById('priority4').checked = true;
};

const fetchData = (file, sheetName = null) => {
    fetch(`schedules/${file}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });
            const sheetNames = workbook.SheetNames;

            if (!sheetName) {
                sheetName = sheetNames[0]; // Default to the first sheet if not specified
            }

            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" }); // Ensure empty cells are handled

            const table = document.getElementById('excelTable');
            table.innerHTML = ''; // Clear previous table content

            // Get the maximum number of columns
            const maxColumns = Math.max(...json.map(row => row.length));

            // Determine the starting row based on the sheet name
            const startRowIndex = sheetName === "Summary" ? 4 : 6;

            // Find the index of the PRIORITY column
            const headerRow = json[startRowIndex - 1]; // The row before the actual data starts
            const priorityColumnIndex = headerRow ? headerRow.indexOf('PRIORITY') : -1;

            // Skip the first rows based on the starting index
            const rowsToDisplay = json.slice(startRowIndex);

            rowsToDisplay.forEach(row => {
                // Count blank cells in the row
                const blankCells = row.filter(cell => cell === "").length;

                // Display the row only if it has 10 or fewer blank cells
                if (blankCells <= 10) {
                    const tr = document.createElement('tr');
                    for (let i = 0; i < maxColumns; i++) {
                        const td = document.createElement('td');
                        let cellValue = row[i] !== undefined ? row[i] : "";

                        // Check if the cellValue is a date serial number and convert it if it should be a date
                        if (typeof cellValue === 'number' && cellValue > 0 && isDate(cellValue)) {
                            const date = new Date((cellValue - (25567 + 2)) * 86400 * 1000); // Convert serial number to date
                            cellValue = date.toISOString().split('T')[0]; // Convert date to YYYY-MM-DD format
                            cellValue = moment(cellValue).format('MM/DD/YYYY'); // Reformat to MM/DD/YYYY
                        }

                        td.textContent = cellValue;
                        tr.appendChild(td);
                    }
                    table.appendChild(tr);
                }
            });

            const sheetButtonsContainer = document.getElementById('sheetButtonsContainer');
            sheetButtonsContainer.innerHTML = ''; // Clear previous sheet buttons

            sheetNames.forEach(name => {
                const button = document.createElement('button');
                button.textContent = name;
                button.onclick = () => {
                    setAllCheckboxesChecked();
                    fetchData(file, name);
                };
                sheetButtonsContainer.appendChild(button);
            });

            setAllCheckboxesChecked();
        })
        .catch(error => console.error('Error fetching or parsing file:', error));
};

fetchData(file); // Initial fetch for the first sheet
