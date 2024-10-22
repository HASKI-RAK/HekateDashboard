document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('averageScoresChartToggle').checked = false;
});

document.addEventListener("DOMContentLoaded", function() {
    // Funktion zum Öffnen der Tabs
    function openTab(evt, tabName) {
        console.log(`openTab aufgerufen mit tabName: ${tabName}`);
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tab");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("active");
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active");
        }
        document.getElementById(tabName).classList.add("active");
        evt.currentTarget.classList.add("active");
    }

    // Event Listener für die Tab-Buttons hinzufügen
    var tabLinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].addEventListener("click", function(evt) {
            console.log(`Tab clicked: ${evt.currentTarget.getAttribute("data-tab")}`);
            openTab(evt, evt.currentTarget.getAttribute("data-tab"));
        });
    }

    // Standardtab öffnen
    var defaultTab = document.querySelector(".tablinks.active");
    if (defaultTab) {
        defaultTab.click();
    } else {
        console.warn("Kein Standardtab gefunden.");
    }
});

function updateQuizData(Quiz){
    if(Quiz === "../data/x.csv"){
        return
    }
    fetch(Quiz)
    .then(response => response.text())
    .then(csvString => {
        const DATA = fetch_data(csvString); 
        updateStudentDropdown(DATA.ResultID);       
    })   
}

function updateStudentDropdown(ResultID) {
    const studentSelect = document.getElementById('studentSelect');

    // Entferne alle vorhandenen Optionen
    [...studentSelect.options].forEach(option => {
        if (option.value !== 'x') {
            studentSelect.removeChild(option);
        }
    });

    // Füge neue Optionen basierend auf dem ResultID-Array hinzu
    ResultID.forEach((row, index) => {
        const fieldValue = row[0]; // Angenommen, die ID ist das erste Element im Array
        const option = document.createElement('option');
        option.textContent = fieldValue;
        option.value = fieldValue; // Setze den Wert des Options-Elements auf die ID oder den Index des Datensatzes
        studentSelect.appendChild(option);
    });
}

function fetch_data(csvString){
    const rows = csvString.split('\n');
    const headers = rows.shift().split(';');
    const DataStringAll = rows.map(row => row.split(';'));
    const DataStringOverall = DataStringAll[DataStringAll.length-1]
    const DataString = DataStringAll.slice(0, DataStringAll.length-1)
    let TimeString = []
    let Result = []
    for (let i = 0; i < DataString.length; i++) {
        let Data = DataString[i][0].split(',');
        Data = Data.map((value, index) => {
            if (index >= 7) {
                return Number(value);
            }
            return value;
        });
        TimeString.push(Data[6]);
        Result.push(Data.slice(7));
    }
    let DataOverall = DataStringOverall[0].split(',');
    DataOverall = DataOverall.map((value, index) => {
        if (index >= 7) {
            return Number(value);
        }
        return value;
    });
    let ResultOverall = DataOverall.slice(7);
    ResultOverall[0] = ResultOverall[0] * 10;
    ResultOverall[0] = Math.round(ResultOverall[0] * 100) / 100;
    for (let i = 1; i < ResultOverall.length; i++){
        ResultOverall[i] = ResultOverall[i] / (Math.round((10 / (ResultOverall.length-1))*100) / 100) * 100;
        ResultOverall[i] = Math.round(ResultOverall[i] * 100) / 100;
    }

    function transformTimes(timeArray) {
        return timeArray.map(timeString => {
            // Entferne Anführungszeichen
            timeString = timeString.replace(/"/g, '');
    
            // Teile die Zeitangabe in ihre Bestandteile
            let parts = timeString.split(' ');
    
            let minutes = 0; // Standardmäßig auf 0 setzen, falls keine Minuten angegeben sind
            let seconds = 0;
    
            // Prüfe das Format und extrahiere Minuten und Sekunden entsprechend
            if (parts.length === 4) {
                // Format "x mins y secs"
                let [minutesPart, , secondsPart, ] = parts;
                minutes = parseInt(minutesPart);
                seconds = parseInt(secondsPart);
            } else if (parts.length === 2) {
                // Format "y secs"
                let [secondsPart, ] = parts;
                seconds = parseInt(secondsPart);
            } else {
                console.warn('Unbekanntes Zeitformat:', timeString);
            }
    
            let totalSeconds = (minutes * 60) + seconds;
            return [minutes, seconds, totalSeconds];
        });
    }
    let Time = transformTimes(TimeString);

    for (let i = 0; i < Result.length; i++){
        Result[i][0] = Result[i][0] * 10;
        Result[i][0] = Math.round(Result[i][0] * 100) / 100;
        for (let j = 1; j < Result[0].length; j++){
            Result[i][j] = Result[i][j] / (Math.round((10 / (Result[0].length-1))*100) / 100) * 100;
            Result[i][j] = Math.round(Result[i][j] * 100) / 100;
        }
    }
    console.log("Time:")
    console.log(Time)
    console.log("Results:")
    console.log(Result)

    let ResultID = []
    let TimeID = []
    for (let i = 0; i<Result.length; i++){
        ResultID[i] = []
        TimeID[i] = [];
        for (let j = 0; j<Result[0].length; j++){
            ResultID[i][j] = Result[i][j];
        }
        for (let j = 0; j<Time[0].length; j++){
            TimeID[i][j] = Time[i][j];
        }
    }
    // Iteriere über jede Zeile im Array Data
    for (let i = 0; i < ResultID.length; i++) {
        // Erhöhe den Wert um 1 und füge ihn am Anfang der Zeile ein
        ResultID[i].unshift(i + 1);
        TimeID[i].unshift(i + 1);
    }
    
    console.log("Result with ID:")
    console.log(ResultID)
    console.log("Time with ID:")
    console.log(TimeID)
    
    let ID = []
    for (let i = 0; i<ResultID.length; i++){
        ID[i] = ResultID[i][0]
    }
    console.log("IDs:")
    console.log(ID)

    

    const BoxplotData = []
    for (let i = 0; i< Result[0].length; i++){
        BoxplotData[i] = []
        for(let j = 0; j < Result.length; j++){
        BoxplotData[i][j] = Result[j][i]                    
        };
    }
    console.log("Average Scores pro Uebung:")
    console.log(ResultOverall)
    console.log("Boxplot Result Data:")
    console.log(BoxplotData)

    const BoxplotTimeData = [[]]
    for (let j = 0; j< Time.length; j++){
        BoxplotTimeData[0][j] = Time[j][2];
    }
    console.log("Boxplot Time Data:")
    console.log(BoxplotTimeData)

    let min = Result.flat().reduce((min, current) => current < min ? current : min, Result[0][0]);
    let startNumber;
    if ((Math.floor(min) - 2) <= 0){
        startNumber = 0;
    }
    else{
        startNumber = Math.floor(min) - 2;
    }

    let { minTime, maxTime } = BoxplotTimeData[0].reduce((acc, value) => ({
        minTime: Math.min(acc.minTime, value),
        maxTime: Math.max(acc.maxTime, value)
    }), { minTime: BoxplotTimeData[0][0], maxTime: BoxplotTimeData[0][0] });
    let startTime;
    let endTime = maxTime + 8;
    if ((Math.floor(minTime) - 8) <= 0){
        startTime = 0;
    }
    else{
        startTime = Math.floor(minTime) - 8;
    }
    let AverageDataPlaceholder = [];
    let AverageBoxplotPlaceholder = [];
    let LabelsAverageChart = [];
    for (let i=0; i<ResultOverall.length; i++){
        AverageDataPlaceholder[i] = 0;
        AverageBoxplotPlaceholder[i] = [0];
        if (i==0){
            LabelsAverageChart[i] = "Overall";
        }
        else{
            LabelsAverageChart[i] = "Frage " + i;
        }
    }

    const DATA = new Object();
    DATA.ResultID = ResultID;
    DATA.AverageDataPlaceholder = AverageDataPlaceholder;
    DATA.LabelsAverageChart = LabelsAverageChart;
    DATA.ResultOverall = ResultOverall;
    DATA.startNumber = startNumber;
    DATA.BoxplotData = BoxplotData;
    DATA.TimeID = TimeID;
    DATA.BoxplotTimeData = BoxplotTimeData;
    DATA.startTime = startTime;
    DATA.endTime = endTime;
    return DATA;
}

document.addEventListener("DOMContentLoaded", function() {        
    let quizSelect = document.getElementById('quizSelect');
    let studentSelect = document.getElementById('studentSelect');
    let toggle = document.getElementById("averageScoresChartToggle");
    let customLegend1 = document.getElementById("customLegend1");
    let customLegend2 = document.getElementById("customLegend2");

    const Quiz = ["SES SoSe 2024-Software Engineering Quiz-grades", "SES SoSe 2024-Anti-Pattern Grundlagen Quiz-grades"]
    
    Quiz.forEach((fieldValue, index) => {
    const option = document.createElement('option');
    option.textContent = fieldValue;
    option.value = fieldValue; // Setze den Wert des Options-Elements auf den Index des Datensatzes
    quizSelect.appendChild(option);
    });

    customLegend2.style.display = 'block';

    let averageScoresChart;
    let TimeChart;

    quizSelect.addEventListener("change", function () {
        let selectedQuiz = "../data/" + quizSelect.value + ".csv";
        updateQuizData(selectedQuiz)
        let selectedStudentId = 'x';
        let AverageToggleState = toggle.checked ? 'boxplot' : 'barplot';
        console.log("selectedIndex (should be x): ", studentSelect.value)
        loadAverageChart(selectedStudentId, AverageToggleState, selectedQuiz);
        loadTimeChart(selectedStudentId, selectedQuiz);
    });

    toggle.addEventListener("change", function () {
        let selectedQuiz = "../data/" + quizSelect.value + ".csv";
        let selectedStudentId = studentSelect.value;
        let chartType = toggle.checked ? 'boxplot' : 'barplot';
        customLegend1.style.display = chartType === 'boxplot' ? 'block' : 'none';
        loadAverageChart(selectedStudentId, chartType, selectedQuiz);
    });

    studentSelect.addEventListener('change', (event) => {   
        let selectedQuiz = "../data/" + quizSelect.value + ".csv";     
        let selectedStudentId = studentSelect.value;
        let AverageToggleState = toggle.checked ? 'boxplot' : 'barplot';
        loadAverageChart(selectedStudentId, AverageToggleState, selectedQuiz);
        loadTimeChart(selectedStudentId, selectedQuiz);
    });

    document.getElementById('downloadPunktzahlChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = averageScoresChart.toBase64Image();
            a.download = 'Punktzahl.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadBearbeitungsdauerChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = TimeChart.toBase64Image();
            a.download = 'Bearbeitungsdauer.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    function loadAverageChart(studentId, chartType, selectedQuiz) {
        if (averageScoresChart) {
            averageScoresChart.destroy();
        }
        if (studentId === 'x') return;

        fetch(selectedQuiz)
        .then(response => response.text())
        .then(csvString => {
            const DATA = fetch_data(csvString);
            
            // Hier Data Update Code
            let numbers = [];
            let selectedRow = 0;
            if (studentId == "x") {
                numbers = DATA.AverageDataPlaceholder;
            } else {
                for (let i = 0; i < DATA.ResultID.length; i++) {
                    if (DATA.ResultID[i][0] == studentId) {
                        selectedRow = i;
                    }
                }
                numbers = DATA.ResultID[selectedRow].slice(1);
            }

            let numbersBoxplot = numbers.map(num => [num]);

            const borderColor = (studentId === "x") ? 'rgba(255, 99, 132, 0)' : 'rgba(255, 99, 132, 1)';
            const label = (studentId === "x") ? 'Punktzahl' : 'Punktzahl Student ID ' + DATA.ResultID[selectedRow][0];
            const hidden = (studentId === "x");

            // Ab hier wird Chart erstellt
            let ctx = document.getElementById("averageScoresChartCanvas").getContext('2d');
            if (chartType === 'barplot') {
                averageScoresChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: DATA.LabelsAverageChart,
                        datasets: [{
                            label: 'Durchschnittliche Punktzahl',
                            data: DATA.ResultOverall,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: label,
                            data: numbers,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            hidden: hidden
                        }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                                averageScoresChart.toBase64Image();
                            },
                        },
                        scales: {
                            y: {
                                min: DATA.startNumber,
                                max: 100
                            }
                        }
                    }
                });
            } else {
                averageScoresChart = new Chart(ctx, {
                    type: 'boxplot',
                    data: {
                        // define label tree
                        labels: DATA.LabelsAverageChart,
                        datasets: [{
                                label: 'Durchschnittliche Punktzahl',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Hintergrundfarbe für Datensatz 2
                                borderColor: 'rgba(54, 162, 235, 1)', // Randfarbe für Datensatz 2
                                borderWidth: 1,
                                outlierColor: 'rgba(54, 162, 235, 1)',
                                outlierBackgroundColor: 'rgba(54, 162, 235, 0.2)',
                                meanBorderColor:'rgba(0, 0, 0, 1)',
                                meanBackgroundColor:'rgba(0, 0, 0, 1)',
                                padding: 10,
                                itemRadius: 0,
                                data: DATA.BoxplotData,          
                            },
                            {
                                label: label,
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: borderColor,
                                borderWidth: 1,
                                meanRadius: 0,
                                padding: 10,
                                itemRadius: 0,
                                data: numbersBoxplot,
                                hidden: hidden          
                            }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                                averageScoresChart.toBase64Image();
                            },
                        },
                        responsive: true,
                        legend: {
                        position: 'top',
                        },
                        scales: {
                            y: {
                                min: DATA.startNumber,
                                max: 100
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    // Customize the title of the tooltip
                                    title: function(tooltipItems) {                                   
                                        return tooltipItems[0].label;
                                    },
                                    // Customize the label of the tooltip
                                    label: function(tooltipItems) {
                                        let datasetLabel = tooltipItems.dataset.label || '';
                                        if (datasetLabel == "Durchschnittliche Punktzahl"){
                                            return `${datasetLabel}:    max: ${parseFloat(tooltipItems.parsed.max.toPrecision(3))}, min: ${parseFloat(tooltipItems.parsed.min.toPrecision(3))},   median: ${parseFloat(tooltipItems.parsed.median.toPrecision(3))}, mean: ${parseFloat(tooltipItems.parsed.mean.toPrecision(3))},   25% Percentile: ${parseFloat(tooltipItems.parsed.q1.toPrecision(3))}, 75% Percentile: ${parseFloat(tooltipItems.parsed.q3.toPrecision(3))}`;
                                        }
                                        else{
                                            return `${datasetLabel}:    ${parseFloat(tooltipItems.parsed.max.toPrecision(3))}`
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error loading averageScoresChart chart:', error));
    }

    function loadTimeChart(studentId, selectedQuiz) {
        if (TimeChart) {
            TimeChart.destroy();
        }
        if (studentId === 'x') return;

        fetch(selectedQuiz)
        .then(response => response.text())
        .then(csvString => {
            const DATA = fetch_data(csvString);

            // Ab hier werden die Daten nach relevanten Daten gefiltert
            let numbers = [];
            let selectedRow = 0;
            
            if (studentId == "x") {
                numbers = [[0]];
            } else {
                for (let i = 0; i < DATA.TimeID.length; i++) {
                    if (DATA.TimeID[i][0] == studentId) {
                        selectedRow = i;
                    }
                }
                numbers = [[DATA.BoxplotTimeData[0][selectedRow]]];
            }

            const label = (studentId === "x") ? 'durchschnittlich benoetigte Zeit' : 'benoetigte Zeit Student ID ' + DATA.TimeID[selectedRow][0];
            const hidden = (studentId === "x");

            // Ab hier wird Chart erstellt
            let ctx = document.getElementById("TimeChartCanvas").getContext('2d');
            TimeChart = new Chart(ctx, {
                type: 'boxplot',
                data: {
                    labels: [[" "]],
                    datasets: [{
                        label: 'durchschnittlich benoetigte Zeit',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Hintergrundfarbe für Datensatz 2
                        borderColor: 'rgba(54, 162, 235, 1)', // Randfarbe für Datensatz 2
                        borderWidth: 1,
                        outlierColor: 'rgba(54, 162, 235, 1)',
                        outlierBackgroundColor: 'rgba(54, 162, 235, 1)',
                        meanBorderColor:'rgba(0, 0, 0, 1)',
                        meanBackgroundColor:'rgba(0, 0, 0, 1)',
                        padding: 10,
                        itemRadius: 0,
                        data: DATA.BoxplotTimeData,          
                    },
                    {
                        label: label,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        meanRadius: 0,
                        padding: 10,
                        itemRadius: 0,
                        data: numbers,
                        hidden: hidden          
                    }]
                },
                options: {
                    animation: {
                        onComplete: function () {
                            TimeChart.toBase64Image();
                        },
                    },
                    indexAxis: 'y',
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Zeit [sec]',
                                color: '#666',
                                font: {
                                    family: 'Helvetica',
                                    size: 14,
                                    style: 'normal',
                                    lineHeight: 1.2
                                },
                                padding: {top: 20, left: 0, right: 0, bottom: 0}
                            }, 
                            min: DATA.startTime,
                            max: DATA.endTime
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                // Customize the title of the tooltip
                                title: function(tooltipItems) {                                   
                                    return tooltipItems[0].label;
                                },
                                // Customize the label of the tooltip
                                label: function(tooltipItems) {
                                    let datasetLabel = tooltipItems.dataset.label || '';
                                    if (datasetLabel == "durchschnittlich benoetigte Zeit"){
                                        return `${datasetLabel}:    max: ${parseFloat(tooltipItems.parsed.max.toPrecision(3))} sec, min: ${parseFloat(tooltipItems.parsed.min.toPrecision(3))} sec,   median: ${parseFloat(tooltipItems.parsed.median.toPrecision(3))} sec, mean: ${parseFloat(tooltipItems.parsed.mean.toPrecision(3))} sec,   25% Percentile: ${parseFloat(tooltipItems.parsed.q1.toPrecision(3))} sec, 75% Percentile: ${parseFloat(tooltipItems.parsed.q3.toPrecision(3))} sec`;
                                    }
                                    else{
                                        return `${datasetLabel}:    ${parseFloat(tooltipItems.parsed.max.toPrecision(3))} sec`
                                    }
                                }
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error loading TimeChart chart:', error));
    }
    studentSelect.dispatchEvent(new Event('change'));
})
