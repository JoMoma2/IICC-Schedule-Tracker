// Extract the file name from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const file = urlParams.get('file');
document.getElementById('fileName').textContent = file;

// Function to check if a given serial number represents a date after the threshold
const isDate = (serial) => new Date(1899, 11, 30).getTime() + serial * 86400 * 1000 > new Date(2023, 7, 1).getTime();

// Function to create a table row from a given row of data
const createTableRow = (row, maxColumns) => {
    const tr = document.createElement('tr');
    for (let i = 0; i < maxColumns; i++) {
        const td = document.createElement('td');
        let cellValue = row[i] || "";

        // Convert Excel date serial numbers to readable dates
        if (typeof cellValue === 'number' && cellValue > 0 && isDate(cellValue)) {
            const date = new Date((cellValue - (25567 + 2)) * 86400 * 1000);
            cellValue = moment(date).format('MM/DD/YYYY');
        }

        td.textContent = cellValue;
        tr.appendChild(td);
    }
    return tr;
};

// Function to display the table content
const displayTable = (json, startRowIndex, maxColumns) => {
    const table = document.getElementById('excelTable');
    table.innerHTML = ''; // Clear previous table content
    const rowsToDisplay = json.slice(startRowIndex).filter(row => row.filter(cell => cell === "").length <= 10);

    // Append each row to the table
    rowsToDisplay.forEach(row => table.appendChild(createTableRow(row, maxColumns)));
};

// Function to create buttons for each sheet in the workbook
const createSheetButtons = (sheetNames, file) => {
    const sheetButtonsContainer = document.getElementById('sheetButtonsContainer');
    sheetButtonsContainer.innerHTML = ''; // Clear previous sheet buttons

    // Create a button for each sheet
    sheetNames.forEach(name => {
        const button = document.createElement('button');
        button.textContent = name;
        button.onclick = () => fetchData(file, name);
        sheetButtonsContainer.appendChild(button);
    });
};

// Function to fetch and display data from the Excel file
const fetchData = async (file, sheetName = null) => {
    try {
        const response = await fetch(`schedules/${file}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetNames = workbook.SheetNames;
        const selectedSheet = sheetName || sheetNames[0];
        const json = XLSX.utils.sheet_to_json(workbook.Sheets[selectedSheet], { header: 1, defval: "" });

        const maxColumns = Math.max(...json.map(row => row.length));
        const startRowIndex = selectedSheet === "Summary" ? 4 : 6;

        // Display the table content and create sheet buttons
        displayTable(json, startRowIndex, maxColumns);
        createSheetButtons(sheetNames, file);

        // Set all checkboxes to checked by default
        document.querySelectorAll('.filter-options input').forEach(checkbox => checkbox.checked = true);
        document.getElementById('onlyConti').checked = false;
    } catch (error) {
        console.error('Error fetching or parsing file:', error);
    }
};

// Initial fetch for the first sheet
fetchData(file);
