document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('averageScoresChartToggle').checked = false;
});

document.addEventListener("DOMContentLoaded", function() {
    // Funktion zum Öffnen der Tabs
    function openTab(evt, tabName) {
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
            openTab(evt, evt.currentTarget.getAttribute("data-tab"));
        });
    }
    
    // Standardtab öffnen
    document.querySelector(".tablinks.active").click();
});

document.addEventListener("DOMContentLoaded", function() {
    let studentSelect = document.getElementById('studentSelect');
    let toggle = document.getElementById("averageScoresChartToggle");
    let customLegend1 = document.getElementById("customLegend1");
    let averageScoresChartCanvas = document.getElementById("averageScoresChart");
    let JokerChartCanvas = document.getElementById("JokerCountChart");
    let HistogramChartCanvas = document.getElementById("HistogramChart");
    let HideButton = document.getElementById('hideAllButton')
    let ShowButton = document.getElementById('showAllButton')

    function hideAllDatasets() {
        HistogramChart.data.datasets.forEach((dataset) => {
            dataset.showLine = false
            dataset.pointRadius = 0
        });
        const lineIndex = HistogramChart.data.datasets.findIndex(dataset => dataset.label === 'Line');
        if (lineIndex !== -1) {
            // Entferne den Datensatz aus dem Diagramm
            HistogramChart.data.datasets.splice(lineIndex, 1);
        }
        HistogramChart.update();
    }
    function showAllDatasets() {
        HistogramChart.data.datasets.forEach((dataset) => {
            dataset.showLine = true;
        });
        for (let i = 1; i < HistogramChart.data.datasets.length; i = i+2){
            HistogramChart.data.datasets[i].pointRadius = 5
        }
        HistogramChart.update();
    }

    function fetch_data(csvString){
        const rows = csvString.split('\n');
        const headers = rows.shift().split(';');
        const DataString = rows.map(row => row.split(';'));
        let Data = []
        for (let i = 0; i< DataString.length; i++){
            Data[i] = []
            let DataNumbers = DataString[i][0].split(',').map(Number);
            DataNumbers = DataNumbers.slice(-13)
            DataNumbers = DataNumbers.slice(0, 10)
            for(let spalte = 0; spalte < DataNumbers.length; spalte++){
                Data[i][spalte] = DataNumbers[spalte]
            }
        }
        console.log("Data:")
        console.log(Data)
        let DataID = []
        for (let i = 0; i<Data.length; i++){
            DataID[i] = []
            for (let j = 0; j<Data[0].length; j++){
                DataID[i][j] = Data[i][j];
            }
        }
        // Iteriere über jede Zeile im Array Data
        for (let i = 0; i < DataID.length; i++) {
            // Erhöhe den Wert um 1 und füge ihn am Anfang der Zeile ein
            DataID[i].unshift(i + 1);
        }
        console.log("Data with ID:")
        console.log(DataID)
        
        let ID = []
        for (let i = 0; i<DataID.length; i++){
            ID[i] = DataID[i][0]
        }
        console.log("IDs:")
        console.log(ID)

        // 1. Durchschnittliche Punktzahl pro Übung berechnen
        const averageScores = [];
        for (let i = 0; i < Data[0].length; i++) {
            let sum = 0;
            for (let j = 1; j < Data.length; j++) {
                sum += parseFloat(Data[j][i]) || 0;
            }
            averageScores.push(sum / (Data.length - 1));
        }
        const BoxplotData = []
        for (let i = 0; i< Data[0].length; i++){
            BoxplotData[i] = []
            for(let j = 0; j < Data.length; j++){
            BoxplotData[i][j] = Data[j][i]                    
            };
        }
        console.log("Average Scores pro Uebung:")
        console.log(averageScores)
        console.log("Boxplot Data:")
        console.log(BoxplotData)
        
        // 3. Häufigkeit der Joker-Nutzung zählen
        let jokerUsageCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const worstExercises = [];
        // Iteriere über jedes Scoreset der Studierenden
        for (let i = 0; i < Data.length; i++) {
            const scores = Data[i].map(score => parseFloat(score) || 0); // Extrahiere die Punktzahlen und konvertiere sie in Zahlen
            // Sortiere die Punktzahlen aufsteigend und erhalte die Indizes
            const sortedIndices = scores.map((score, index) => index).sort((a, b) => scores[a] - scores[b]);
            // Speichere die Nummern der drei schlechtesten Übungen
            worstExercises.push(sortedIndices.slice(0, 3));
        }
        for (let i = 0; i < worstExercises.length; i++){
            for (let j = 0; j < worstExercises[0].length; j++){
                jokerUsageCount[worstExercises[i][j]]++;
            }
        }
        console.log("Schlechteste Uebungen:")
        console.log(worstExercises)
        console.log("Häufigkeit Joker Nutzung:")
        console.log(jokerUsageCount)
        
        // 4. Durchschnittliche Punktzahl nach Jokereinsatz
        let DataJoker = []
        for (let i = 0; i<Data.length; i++){
            DataJoker[i] = []
            for (let j = 0; j<Data[0].length; j++){
                DataJoker[i][j] = Data[i][j];
            }
        }
        for (let i = 0; i < worstExercises.length; i++){
            for (let j = 0; j < worstExercises[0].length; j++){
                DataJoker[i][worstExercises[i][j]] = 100;
            }
        }
        const averageScoresJoker = [];
        for (let i = 0; i < DataJoker[0].length; i++) {
            let sum = 0;
            for (let j = 1; j < DataJoker.length; j++) {
                sum += parseFloat(DataJoker[j][i]) || 0;
            }
            averageScoresJoker.push(sum / (DataJoker.length - 1));
        }
        const BoxplotDataJoker = []
        for (let i = 0; i< DataJoker[0].length; i++){
            BoxplotDataJoker[i] = []
            for(let j = 0; j < DataJoker.length; j++){
            BoxplotDataJoker[i][j] = DataJoker[j][i]                    
            };
        }
        const ScoresJoker = [];
        for (let i = 0; i < worstExercises.length; i++){
            ScoresJoker[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            for(let j = 0; j < worstExercises[0].length; j++){
                ScoresJoker[i][worstExercises[i][j]] = 1;
            }
        }
        console.log("Joker Einsatz pro Student ID")
        console.log(ScoresJoker)
        console.log("Data nach Jokereinsatz:")
        console.log(DataJoker)
        console.log("Average Scores pro Uebung nach Jokereinsatz:")
        console.log(averageScoresJoker)
        console.log("Boxplot Data nach Jokereinsatz:")
        console.log(BoxplotDataJoker)
        
        // Array für die Häufigkeitsdichte der Punktzahlen für jede Übung
        const frequencyDensities = [];
        // Anzahl der Intervalle für die Histogrammberechnung (in 5-Punkte-Schritten)
        const numIntervals = 100;
        // Iteriere über jede Übung (Spalten ab Index 2)
        for (let exerciseIndex = 0; exerciseIndex < Data[0].length; exerciseIndex++) {
            const exerciseScores = Data.map(row => parseFloat(row[exerciseIndex]) || 0); // Extrahiere die Punktzahlen für diese Übung
            // Finde den maximalen und minimalen Punktwert für diese Übung
            const maxScore = 0;
            const minScore = 100;
            // Berechne die Breite jedes Intervalls
            const intervalWidth = (maxScore - minScore) / numIntervals;
            // Array für die Häufigkeitsdichte in jedem Intervall initialisieren
            const frequencyDensity = Array(numIntervals).fill(0);
            // Iteriere über alle Punktzahlen und erhöhe die Zähler für die entsprechenden Intervalle
            exerciseScores.forEach(score => {
                const intervalIndex = (numIntervals-1) - Math.floor((score - minScore) / intervalWidth); // Bestimme das Intervall für die Punktzahl
                frequencyDensity[intervalIndex]++; // Erhöhe den Zähler für das entsprechende Intervall
            });
            // Berechne die Häufigkeitsdichte für jedes Intervall
            const totalScores = exerciseScores.length;
            const density = frequencyDensity.map(count => count / totalScores); // Teile die Anzahl der Werte durch die Gesamtzahl der Werte und die Intervallbreite
            frequencyDensities.push(density);
        }
        console.log("Haeufigkeitsdichte pro Uebung");
        console.log(frequencyDensities);
        
        // Kumulierte Häufigkeitsdichte berechnen
        const cumulativeFrequencyDensities = frequencyDensities.map(densityArray => {
            const cumulativeDensity = [];
            densityArray.reduce((acc, current, index) => {
                cumulativeDensity[index] = acc + current;
                return cumulativeDensity[index];
            }, 0);
            return cumulativeDensity;
        });
        cumulativeFrequencyDensities.forEach((densityArray, index) => {
            cumulativeFrequencyDensities[index] = densityArray.map(value => value * 100);
        });
        // Ausgabe der kumulierten Häufigkeitsdichten
        console.log('Kumulierte Häufigkeitsdichten:')
        console.log(cumulativeFrequencyDensities);
        
        // Kleinste Punktzahl
        const flattenedData = Data.reduce((acc, val) => acc.concat(val), []);
        const minNumber = Math.min(...flattenedData);
        let startNumber;
        if ((Math.floor(minNumber) - 2) <= 0){
            startNumber = 0;
        }
        else{
            startNumber = Math.floor(minNumber) - 2;
        }
        const flattenedScores = Data.reduce((acc, val) => acc.concat(val), []);
        const minScore = Math.min(...flattenedScores);
        let startScore;
        if ((Math.floor(minScore) - 2) <= 0){
            startScore = 0;
        }
        else{
            startScore = Math.floor(minScore) - 5;
        }

        const DATA = new Object();
        DATA.DataID = DataID;
        DATA.averageScores = averageScores;
        DATA.averageScoresJoker = averageScoresJoker;
        DATA.startScore = startScore;
        DATA.BoxplotData = BoxplotData;
        DATA.BoxplotDataJoker = BoxplotDataJoker;
        DATA.startNumber = startNumber;
        DATA.ScoresJoker = ScoresJoker;
        DATA.jokerUsageCount = jokerUsageCount;
        DATA.cumulativeFrequencyDensities = cumulativeFrequencyDensities;
        DATA.ID = ID;
        DATA.numIntervals = numIntervals;
        return DATA;
    }

    fetch("../data/grades.csv")
    .then(response => response.text())
    .then(csvString => {
        const DATA = fetch_data(csvString); 
        DATA.DataID.forEach(row => {
            const fieldValue = row[0];
            const option = document.createElement('option');
            option.textContent = fieldValue;
            option.value = fieldValue; // Setze den Wert des Options-Elements auf den Index des Datensatzes
            studentSelect.appendChild(option);
        });
    });

    let currentAverageChart;
    let JokerChart;
    let HistogramChart;

    HideButton.addEventListener('click', hideAllDatasets);
    ShowButton.addEventListener('click', showAllDatasets);

    toggle.addEventListener("change", function () {
        let selectedStudentId = studentSelect.value;
        let chartType = toggle.checked ? 'boxplot' : 'barplot';
        customLegend1.style.display = chartType === 'boxplot' ? 'block' : 'none';
        loadcurrentAverageChart(selectedStudentId, chartType);
    });

    studentSelect.addEventListener('change', function () {
        let selectedStudentId = studentSelect.value;
        let ToggleState = toggle.checked ? 'boxplot' : 'barplot';
        loadcurrentAverageChart(selectedStudentId, ToggleState);
        loadJokerChart(selectedStudentId);
        loadHistogramChart(selectedStudentId);
    });

    document.getElementById('downloadPunktzahlChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = currentAverageChart.toBase64Image();
            a.download = 'Punktzahl.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadJokerChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = JokerChart.toBase64Image();
            a.download = 'Joker.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadHistogramChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = HistogramChart.toBase64Image();
            a.download = 'Histogram.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    function loadcurrentAverageChart(studentId, chartType) {
        if (currentAverageChart) {
            currentAverageChart.destroy();
        }
        if (studentId === 'x') return;

        fetch("../data/grades.csv")
        .then(response => response.text())
        .then(csvString => {
            const DATA = fetch_data(csvString);
            let numbers = [];
            let selectedRow = 0;
            
            if (studentId == "x") {
                numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            } else {
                for (let i = 0; i < DATA.DataID.length; i++) {
                    if (DATA.DataID[i][0] == studentId) {
                        selectedRow = i;
                    }
                }
                numbers = DATA.DataID[selectedRow].slice(1);
            }
            
            let numbersBoxplot = numbers.map(num => [num]);

            const borderColor = (studentId === "x") ? 'rgba(63, 191, 127, 0)' : 'rgba(63, 191, 127, 1)';      
            const label = (studentId === "x") ? 'Punktzahl' : 'Punktzahl Student ID ' + DATA.DataID[selectedRow][0];
            const hidden = (studentId === "x");

            let ctx = averageScoresChartCanvas.getContext('2d');
            if (chartType === 'barplot') {
                currentAverageChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Uebung 01', 'Uebung 02', 'Uebung 03', 'Uebung 04', 'Uebung 05', 'Uebung 06', 'Uebung 07', 'Uebung 08', 'Uebung 09', 'Uebung 10'],
                        datasets: [{
                            label: 'Durchschnittliche Punktzahl ohne Joker',
                            data: DATA.averageScores,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Durchschnittliche Punktzahl nach Jokereinsatz',
                            data: DATA.averageScoresJoker,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Hintergrundfarbe für Datensatz 1
                            borderColor: 'rgba(255, 99, 132, 1)', // Randfarbe für Datensatz 1
                            borderWidth: 1
                        },
                        {
                            label: label,
                            data: numbers,
                            backgroundColor: 'rgba(63, 191, 127, 0.2)',
                            borderColor: 'rgba(63, 191, 127, 1)',
                            borderWidth: 1,
                            hidden: hidden
                        }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                              currentAverageChart.toBase64Image();
                            },
                        },
                        scales: {
                            y: {
                                min: DATA.startScore,
                                max: 100
                            }
                        }
                    }
                });
            } else {
                currentAverageChart = new Chart(ctx, {
                    type: 'boxplot',
                    data: {
                        // define label tree
                        labels: ['Uebung 01', 'Uebung 02', 'Uebung 03', 'Uebung 04', 'Uebung 05', 'Uebung 06', 'Uebung 07', 'Uebung 08', 'Uebung 09', 'Uebung 10'],
                        datasets: [{
                                label: 'Punktzahl ohne Joker',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Hintergrundfarbe für Datensatz 2
                                borderColor: 'rgba(54, 162, 235, 1)', // Randfarbe für Datensatz 2
                                borderWidth: 1,
                                outlierColor: 'rgba(54, 162, 235, 1)',
                                outlierBackgroundColor: 'rgba(54, 162, 235, 1)',
                                meanBorderColor: 'rgba(0, 0, 0, 1)',
                                meanBackgroundColor: 'rgba(0, 0, 0, 1)',
                                padding: 10,
                                itemRadius: 0,
                                data: DATA.BoxplotData,          
                            },
                            {
                                label: 'Punktzahl nach Jokereinsatz',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)', // Hintergrundfarbe für Datensatz 1
                                borderColor: 'rgba(255, 99, 132, 1)', // Randfarbe für Datensatz 1
                                borderWidth: 1,
                                outlierColor: 'rgba(255, 99, 132, 1)',
                                outlierBackgroundColor: 'rgba(255, 99, 132, 1)',
                                meanBorderColor:'rgba(0, 0, 0, 1)',
                                meanBackgroundColor:'rgba(0, 0, 0, 1)',
                                padding: 10,
                                itemRadius: 0,
                                data: DATA.BoxplotDataJoker          
                            },
                            {
                                label: label,
                                backgroundColor: 'rgba(63, 191, 127, 0.2)',
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
                              currentAverageChart.toBase64Image();
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
                                        if (datasetLabel == "Punktzahl ohne Joker"){
                                            return `${datasetLabel}:    max: ${parseFloat(tooltipItems.parsed.max.toPrecision(3))}, min: ${parseFloat(tooltipItems.parsed.min.toPrecision(3))},   median: ${parseFloat(tooltipItems.parsed.median.toPrecision(3))}, mean: ${parseFloat(tooltipItems.parsed.mean.toPrecision(3))},   25% Percentile: ${parseFloat(tooltipItems.parsed.q1.toPrecision(3))}, 75% Percentile: ${parseFloat(tooltipItems.parsed.q3.toPrecision(3))}`;
                                        }
                                        else if (datasetLabel == "Punktzahl nach Jokereinsatz"){
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
                })
            }
        })
    }

    function loadJokerChart(studentId) {
        if (JokerChart) {
            JokerChart.destroy();
        }
        if (studentId === 'x') return;

        fetch("../data/grades.csv")
        .then(response => response.text())
        .then(csvString => {
            const DATA = fetch_data(csvString);
            let numbers = [];
            let selectedRow = 0;     
            if (studentId == "x") {
                numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            } else {
                for (let i = 0; i < DATA.DataID.length; i++) {
                    if (DATA.DataID[i][0] == studentId) {
                        selectedRow = i;
                    }
                }
                numbers = DATA.ScoresJoker[selectedRow];
            }
            
            const label = (studentId === "x") ? 'Anzahl' : 'Anzahl der Jokereinsaetze Student ID ' + DATA.DataID[selectedRow][0];
            const hidden = (studentId === "x");

            // Ab hier wird Chart erstellt
            let ctx = JokerChartCanvas.getContext('2d');
            JokerChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Uebung 01', 'Uebung 02', 'Uebung 03', 'Uebung 04', 'Uebung 05', 'Uebung 06', 'Uebung 07', 'Uebung 08', 'Uebung 09', 'Uebung 10'],
                    datasets: [{
                        label: 'Anzahl der Jokereinsaetze Gesamt',
                        data: DATA.jokerUsageCount,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: label,
                        data: numbers,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Hintergrundfarbe für Datensatz 1
                        borderColor: 'rgba(255, 99, 132, 1)', // Randfarbe für Datensatz 1
                        borderWidth: 1,
                        hidden: hidden
                    }]
                },
                options: {
                    animation: {
                        onComplete: function () {
                          JokerChart.toBase64Image();
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            })
        });
    }

    function generateHiddenLabelsForSpecificIDs(ids, exerciseCount) {
        const hiddenLabels = [];
    
        // Labels für allgemeine Übungen (z.B. 'Student Uebung 01' bis 'Student Uebung 10')
        for (let exercise = 1; exercise <= exerciseCount; exercise++) {
            hiddenLabels.push(`Student Uebung ${exercise.toString().padStart(2, '0')}`);
        }
    
        // Labels für spezifische Student IDs und Übungen (z.B. 'Student ID 3 Uebung 1' bis 'Student ID 3 Uebung 10')
        ids.forEach(studentID => {
            for (let exercise = 1; exercise <= exerciseCount; exercise++) {
                hiddenLabels.push(`Student ID ${studentID} Uebung ${exercise}`);
            }
        });
    
        return hiddenLabels;
    }

    function loadHistogramChart(studentId) {
        if (HistogramChart) {
            HistogramChart.destroy();
        }
        if (studentId === 'x') return;

        fetch("../data/grades.csv")
        .then(response => response.text())
        .then(csvString => {
            const DATA = fetch_data(csvString);

            let numbers = [];
            let selectedRow = 0;
            if (studentId == "x") {
                numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            } else {
                for (let i = 0; i < DATA.DataID.length; i++) {
                    if (DATA.DataID[i][0] == studentId) {
                        selectedRow = i;
                    }
                }
                numbers = DATA.DataID[selectedRow].slice(1);
            }    
            let PointData = [];
            for (let i = 0; i < numbers.length; i++){
                PointData[i] = {x: Math.floor(numbers[i]), y: DATA.cumulativeFrequencyDensities[i][Math.floor(numbers[i]-1)]}
            }

            let label = []
            for (let i = 0; i< PointData.length; i++){
                if(i >= 9){
                    label[i] = (studentId === "x") ? 'Student Uebung ' + (i+1) : 'Student ID ' + DATA.DataID[selectedRow][0] + " Uebung " + (i+1);
                }
                else{
                    label[i] = (studentId === "x") ? 'Student Uebung 0' + (i+1) : 'Student ID ' + DATA.DataID[selectedRow][0] + " Uebung " + (i+1);
                }
            }
            const hidden = (studentId === "x");

            const stepsArray = [];
            for (let i = 100/DATA.numIntervals; i <= 100; i=i+100/DATA.numIntervals) {
            stepsArray.push(i);
            }

            // Ab hier wird Chart erstellt
            let ctx = HistogramChartCanvas.getContext('2d');
            HistogramChart = new Chart(ctx, {
                type: 'line', // Kumulierte Frequenzdichten werden typischerweise als Linie dargestellt
                data: {
                    labels: stepsArray,
                    datasets: [
                        {
                            label: 'Uebung 01',
                            data: DATA.cumulativeFrequencyDensities[0],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            pointRadius: 0,
                            tension: 0.1,
                            showLine: true
                        },
                        {
                            label: label[0],
                            data: [PointData[0]], // Array mit den Datenpunkten
                            backgroundColor: 'rgba(255, 99, 132, 1)', // Farbe der Punkte
                            borderColor: 'rgba(255, 99, 132, 1)', // Farbe der Punkte
                            borderWidth: 1,
                            pointRadius: 5, // Größe der Punkte
                            showLine: false, // Linie nicht anzeigen
                            tension: 0.1,
                            hidden: hidden
                        },
                        {
                            label: 'Uebung 02',
                            data: DATA.cumulativeFrequencyDensities[1],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            pointRadius: 0,
                            tension: 0.1,
                            showLine: true
                        },
                        {
                            label: label[1],
                            data: [PointData[1]], // Array mit den Datenpunkten
                            backgroundColor: 'rgba(54, 162, 235, 1)', // Farbe der Punkte
                            borderColor: 'rgba(54, 162, 235, 1)', // Farbe der Punkte
                            borderWidth: 1,
                            pointRadius: 5, // Größe der Punkte
                            showLine: false, // Linie nicht anzeigen
                            tension: 0.1,
                            hidden: hidden
                        },
                        {
                            label: 'Uebung 03',
                            data: DATA.cumulativeFrequencyDensities[2],
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1,
                            pointRadius: 0,
                            tension: 0.1,
                            showLine: true
                        },
                        {
                            label: label[2],
                            data: [PointData[2]], // Array mit den Datenpunkten
                            backgroundColor: 'rgba(255, 206, 86, 1)', // Farbe der Punkte
                            borderColor: 'rgba(255, 206, 86, 1)', // Farbe der Punkte
                            borderWidth: 1,
                            pointRadius: 5, // Größe der Punkte
                            showLine: false, // Linie nicht anzeigen
                            tension: 0.1,
                            hidden: hidden
                        },
                        {
                            label: 'Uebung 04',
                            data: DATA.cumulativeFrequencyDensities[3],
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            pointRadius: 0,
                            tension: 0.1,
                            showLine: true
                        },
                        {
                            label: label[3],
                            data: [PointData[3]], // Array mit den Datenpunkten
                            backgroundColor: 'rgba(75, 192, 192, 1)', // Farbe der Punkte
                            borderColor: 'rgba(75, 192, 192, 1)', // Farbe der Punkte
                            borderWidth: 1,
                            pointRadius: 5, // Größe der Punkte
                            showLine: false, // Linie nicht anzeigen
                            tension: 0.1,
                            hidden: hidden
                        },
                        {
                            label: 'Uebung 05',
                            data: DATA.cumulativeFrequencyDensities[4],
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                            pointRadius: 0,
                            tension: 0.1,
                            showLine: true
                        },
                        {
                            label: label[4],
                            data: [PointData[4]], // Array mit den Datenpunkten
                            backgroundColor: 'rgba(153, 102, 255, 1)', // Farbe der Punkte
                            borderColor: 'rgba(153, 102, 255, 1)', // Farbe der Punkte
                            borderWidth: 1,
                            pointRadius: 5, // Größe der Punkte
                            showLine: false, // Linie nicht anzeigen
                            tension: 0.1,
                            hidden: hidden
                        },
                        {
                            label: 'Uebung 06',
                            data: DATA.cumulativeFrequencyDensities[5],
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1,
                            pointRadius: 0,
                            tension: 0.1,
                            showLine: true
                        },
                        {
                            label: label[5],
                            data: [PointData[5]], // Array mit den Datenpunkten
                            backgroundColor: 'rgba(255, 159, 64, 1)', // Farbe der Punkte
                            borderColor: 'rgba(255, 159, 64, 1)', // Farbe der Punkte
                            borderWidth: 1,
                            pointRadius: 5, // Größe der Punkte
                            showLine: false, // Linie nicht anzeigen
                            tension: 0.1,
                            hidden: hidden
                        },
                        {
                            label: 'Uebung 07',
                            data: DATA.cumulativeFrequencyDensities[6],
                            backgroundColor: 'rgba(199, 199, 199, 0.2)',
                            borderColor: 'rgba(199, 199, 199, 1)',
                            borderWidth: 1,
                            pointRadius: 0,
                            tension: 0.1,
                            showLine: true
                        },
                        {
                            label: label[6],
                            data: [PointData[6]], // Array mit den Datenpunkten
                            backgroundColor: 'rgba(199, 199, 199, 1)', // Farbe der Punkte
                            borderColor: 'rgba(199, 199, 199, 1)', // Farbe der Punkte
                            borderWidth: 1,
                            pointRadius: 5, // Größe der Punkte
                            showLine: false, // Linie nicht anzeigen
                            tension: 0.1,
                            hidden: hidden
                        },
                        {
                            label: 'Uebung 08',
                            data: DATA.cumulativeFrequencyDensities[7],
                            backgroundColor: 'rgba(83, 102, 255, 0.2)',
                            borderColor: 'rgba(83, 102, 255, 1)',
                            borderWidth: 1,
                            pointRadius: 0,
                            tension: 0.1,
                            showLine: true
                        },
                        {
                            label: label[7],
                            data: [PointData[7]], // Array mit den Datenpunkten
                            backgroundColor: 'rgba(83, 102, 255, 1)', // Farbe der Punkte
                            borderColor: 'rgba(83, 102, 255, 1)', // Farbe der Punkte
                            borderWidth: 1,
                            pointRadius: 5, // Größe der Punkte
                            showLine: false, // Linie nicht anzeigen
                            tension: 0.1,
                            hidden: hidden
                        },
                        {
                            label: 'Uebung 09',
                            data: DATA.cumulativeFrequencyDensities[8],
                            backgroundColor: 'rgba(255, 87, 34, 0.2)', 
                            borderColor: 'rgba(255, 87, 34, 1)', 
                            borderWidth: 1,
                            pointRadius: 0,
                            tension: 0.1,
                            showLine: true
                        },
                        {
                            label: label[8],
                            data: [PointData[8]], // Array mit den Datenpunkten
                            backgroundColor: 'rgba(255, 87, 34, 1)', // Farbe der Punkte
                            borderColor: 'rgba(255, 87, 34, 1)', // Farbe der Punkte
                            borderWidth: 1,
                            pointRadius: 5, // Größe der Punkte
                            showLine: false, // Linie nicht anzeigen
                            tension: 0.1,
                            hidden: hidden
                        },
                        {
                            label: 'Uebung 10',
                            data: DATA.cumulativeFrequencyDensities[9],
                            backgroundColor: 'rgba(63, 191, 127, 0.2)',
                            borderColor: 'rgba(63, 191, 127, 1)',
                            borderWidth: 1,
                            pointRadius: 0,
                            tension: 0.1,
                            showLine: true
                        },
                        {
                            label: label[9],
                            data: [PointData[9]], // Array mit den Datenpunkten
                            backgroundColor: 'rgba(63, 191, 127, 1)', // Farbe der Punkte
                            borderColor: 'rgba(63, 191, 127, 1)', // Farbe der Punkte
                            borderWidth: 1,
                            pointRadius: 5, // Größe der Punkte
                            showLine: false, // Linie nicht anzeigen
                            tension: 0.1,
                            hidden: hidden
                        }
                    ]
                },
                options: {
                    animation: {
                        onComplete: function () {
                          HistogramChart.toBase64Image();
                        },
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Kumulative Haeufigkeitsdichte [%]'
                            }
                        },
                        x: {
                            min: DATA.startNumber,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Punktzahlbereiche (obere Grenze)'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                filter: function(legendItem, chartData) {
                                    const hiddenLabels = generateHiddenLabelsForSpecificIDs(DATA.ID, 10);
                                    return !hiddenLabels.includes(legendItem.text);
                                }
                            },
                            onClick: function(event, legendItem) { 
                                var datasetIndex = legendItem.datasetIndex; 
                                HistogramChart.data.datasets[datasetIndex].showLine = !HistogramChart.data.datasets[datasetIndex].showLine; 
                                if (HistogramChart.data.datasets[datasetIndex+1].pointRadius == 5){ 
                                    HistogramChart.data.datasets[datasetIndex+1].pointRadius = 0; 
                                } else{ 
                                    HistogramChart.data.datasets[datasetIndex+1].pointRadius = 5; 
                                } 
                                HistogramChart.update(); 
                                console.log("Histogram Chart updated.") 
                            }
                        },
                        tooltip: {
                            callbacks: {
                                // Customize the title of the tooltip
                                title: function(tooltipItems) {                                   
                                    return tooltipItems[0].label + " Punkte";
                                },
                                // Customize the label of the tooltip
                                label: function(tooltipItems) {
                                    let datasetLabel = tooltipItems.dataset.label || '';
                                    return `${datasetLabel}: besser als ${parseFloat(tooltipItems.parsed.y.toPrecision(3))} %`
                                }
                            }
                        }
                    }
                }
            })
        })
    }
    studentSelect.dispatchEvent(new Event('change'));
});