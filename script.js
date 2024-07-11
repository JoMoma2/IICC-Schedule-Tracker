document.addEventListener("DOMContentLoaded", () => {
    const files = [
        "20230920.xlsx",
        "20230926.xlsx",
        "20231003.xlsx",
        "20231011.xlsx",
        "20231017.xlsx",
        "20231024.xlsx",
        "20231107.xlsx",
        "20231114.xlsx",
        "20231121.xlsx",
        "20240112.xlsx",
        "20240208.xlsx",
        "20240222.xlsx",
        "20240301.xlsx",
        "20240315.xlsx",
        "20240319.xlsx",
        "20240322.xlsx",
        "20240329.xlsx",
        "20240402.xlsx",
        "20240416.xlsx",
        "20240419.xlsx",
        "20240429.xlsx",
        "20240501.xlsx",
        "20240502.xlsx",
        "20240510.xlsx",
        "20240516.xlsx",
        "20240531.xlsx",
        "20240607.xlsx",
        "20240628.xlsx"
    ];

    const buttonsContainer = document.getElementById('buttonsContainer');

    files.forEach(file => {
        const fileNameWithoutExtension = file.split('.')[0];
        const button = document.createElement('button');
        button.textContent = fileNameWithoutExtension;
        button.onclick = () => {
            const url = `display.html?file=${encodeURIComponent(file)}`;
            window.open(url, '_blank');
        };
        buttonsContainer.appendChild(button);
    });
});
