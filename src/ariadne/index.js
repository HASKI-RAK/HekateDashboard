document.addEventListener("DOMContentLoaded", function() {
    // Funktion zum Ã–ffnen der Tabs
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

    // Event Listener fÃ¼r die Tab-Buttons hinzufÃ¼gen
    var tabLinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].addEventListener("click", function(evt) {
            console.log(`Tab clicked: ${evt.currentTarget.getAttribute("data-tab")}`);
            openTab(evt, evt.currentTarget.getAttribute("data-tab"));
        });
    }

    // Standardtab Ã¶ffnen
    var defaultTab = document.querySelector(".tablinks.active");
    if (defaultTab) {
        defaultTab.click();
    } else {
        console.warn("Kein Standardtab gefunden.");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    let studentSelect = document.getElementById('studentSelect');
    let learningStyleElement1 = document.getElementById('learningStyle1').querySelector('span');
    let supportValueElement1 = document.getElementById('supportValue1').querySelector('span');
    let ProcessingCanvas = document.getElementById("ProcessingChartCanvas");
    let learningStyleElement2 = document.getElementById('learningStyle2').querySelector('span');
    let supportValueElement2 = document.getElementById('supportValue2').querySelector('span');
    let PerceptionCanvas = document.getElementById("PerceptionChartCanvas");
    let learningStyleElement3 = document.getElementById('learningStyle3').querySelector('span');
    let supportValueElement3 = document.getElementById('supportValue3').querySelector('span');
    let InputCanvas = document.getElementById("InputChartCanvas");
    let learningStyleElement4 = document.getElementById('learningStyle4').querySelector('span');
    let supportValueElement4 = document.getElementById('supportValue4').querySelector('span');
    let UnderstandingCanvas = document.getElementById("UnderstandingChartCanvas");

    function removeEntriesAfterFirstEmpty(array) {
        let index = array.indexOf("");
        if (index !== -1) {
            array.splice(index);
        }
        return array;
    }

    function fetch_data(lp, hs, ls, sv){
        const rows_lp = lp.split('\n');
        rows_lp.shift().split(';');
        const DataString_lp = rows_lp.map(row => row.split(';'));
        let Data_lp = []
        for (let i = 0; i< DataString_lp.length; i++){
            Data_lp[i] = []
            let DataNumbers = DataString_lp[i].map(element => element.split(','));
            for(let spalte = 0; spalte < DataNumbers.length; spalte++){
                Data_lp[i][spalte] = DataNumbers[spalte][0]
            }
        }
        
        Data_lp.forEach(array =>{
            array = removeEntriesAfterFirstEmpty(array)
        })
        console.log("Data_lp: ", Data_lp)
        const DATA = new Object();
        DATA.DataID = Data_lp;
        if(hs === -1){
            return DATA;
        }

        const rows_hs = hs.split('\n');
        rows_hs.shift().split(';');
        const DataString_hs = rows_hs.map(row => row.split(';'));
        let Data_hs = []
        for (let i = 0; i< DataString_hs.length; i++){
            Data_hs[i] = []
            let DataNumbers = DataString_hs[i].map(element => element.split(','));
            for(let spalte = 0; spalte < DataNumbers.length; spalte++){
                Data_hs[i][spalte] = DataNumbers[spalte][0]
            }
        }
        
        Data_hs.forEach(array => {
            array = removeEntriesAfterFirstEmpty(array)
        })
        console.log("Data_hs: ", Data_hs)
        DATA.DataColors = Data_hs;

        const rows_ls = ls.split('\n');
        rows_ls.shift().split(';');
        const DataString_ls = rows_ls.map(row => row.split(';'));
        let Data_ls = []
        for (let i = 0; i< DataString_ls.length; i++){
            Data_ls[i] = []
            let DataNumbers = DataString_ls[i].map(element => element.split(','));
            for(let spalte = 0; spalte < DataNumbers.length; spalte++){
                Data_ls[i][spalte] = DataNumbers[spalte][0]
            }
        }
        console.log("Data_ls: ", Data_ls)
        DATA.DataLearningStyles = Data_ls;

        const rows_sv = sv.split('\n');
        rows_sv.shift().split(';');
        const DataString_sv = rows_sv.map(row => row.split(';'));
        let Data_sv = []
        for (let i = 0; i< DataString_sv.length; i++){
            Data_sv[i] = []
            let DataNumbers = DataString_sv[i].map(element => element.split(','));
            for(let spalte = 0; spalte < DataNumbers.length; spalte++){
                Data_sv[i][spalte] = DataNumbers[spalte][0]
            }
        }
        console.log("Data_sv: ", Data_sv)
        DATA.DataSupportValues = Data_sv;
        return DATA;
    }

    fetch("../data/learning_paths.csv")
    .then(response => response.text())
    .then(csvString_lp => {
        const DATA = fetch_data(csvString_lp, -1, -1, -1); 
        DATA.DataID.forEach(row => {
            const fieldValue = row[0];
            const option = document.createElement('option');
            option.textContent = fieldValue;
            option.value = fieldValue; // Setze den Wert des Options-Elements auf den Index des Datensatzes
            studentSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching learning paths:', error));

    let ProcessingChart;
    let PerceptionChart;
    let InputChart;
    let UnderstandingChart;

    studentSelect.addEventListener('change', function () {
        let selectedStudentId = studentSelect.value;
        loadProcessingChart(selectedStudentId);
        loadPerceptionChart(selectedStudentId);
        loadInputChart(selectedStudentId);
        loadUnderstandingChart(selectedStudentId);
    });

    document.getElementById('downloadProcessingChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = ProcessingChart.toBase64Image();
            a.download = 'Processing.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadPerceptionChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = PerceptionChart.toBase64Image();
            a.download = 'Perception.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadInputChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = InputChart.toBase64Image();
            a.download = 'Input.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadUnderstandingChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = UnderstandingChart.toBase64Image();
            a.download = 'Understanding.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    function loadProcessingChart(studentId) {
        if (ProcessingChart) {
            ProcessingChart.destroy();
        }
        if (studentId === 'x') return;
        fetch("../data/learning_paths.csv")
        .then(response => response.text())
        .then(csvString_lp => {
            fetch("../data/Processing/hidden_states.csv")
            .then(response => response.text())
            .then(csvString_hs => {
                fetch("../data/Processing/learning_styles.csv")
                .then(response => response.text())
                .then(csvString_ls => {
                    fetch("../data/Processing/support_values.csv")
                    .then(response => response.text())
                    .then(csvString_sv => {
                        const DATA = fetch_data(csvString_lp, csvString_hs, csvString_ls, csvString_sv); 
                        let numbers;
                        let colors_data;

                        if (studentId == "x") {
                            numbers = [];
                            colors_data = [];
                            learningstyle_data = [];
                            supportvalue_data = [];
                        } else {
                            for (let i = 0; i < DATA.DataID.length; i++) {
                                if (DATA.DataID[i][0] == studentId) {
                                    selectedRowID = i;
                                }
                                if (DATA.DataColors[i][0] == studentId) {
                                    selectedRowColors = i;
                                }
                                if (DATA.DataLearningStyles[i][0] == studentId) {
                                    selectedRowLearingStyles = i;
                                }
                                if (DATA.DataSupportValues[i][0] == studentId) {
                                    selectedRowSupportValues = i;
                                }
                            }
                            numbers = DATA.DataID[selectedRowID].slice(1);
                            colors_data = DATA.DataColors[selectedRowColors].slice(1);
                            learningstyle_data = DATA.DataLearningStyles[selectedRowLearingStyles].slice(1);
                            supportvalue_data = DATA.DataSupportValues[selectedRowSupportValues].slice(1);
                        } 
                        const labels = [];
                        numbers.forEach((element, index)=>{
                            labels[index] = (index+1);
                        })
                        let colors = [];
                        colors_data.forEach((element, index) => {
                            if(element == "Active"){
                                colors[index] = 'green'
                            }
                            else if(element == "Reflective"){
                                colors[index] = 'red'
                            }
                            else{
                                colors[index] = 'black'
                            }
                        })

                        // Ab hier werden die benÃ¶tigten Daten aus den gesamten Daten gefiltert

                        const label = (studentId === "x") ? 'Processing Attributes' : 'Processing Attributes Student ID ' + studentId;
                        const hidden = (studentId === "x");

                        learningStyleElement1.textContent = `Learning Style: ${learningstyle_data[0]}, Strength: ${learningstyle_data[1]}`;
                        supportValueElement1.textContent = `Support Value: ${supportvalue_data[0]}`;

                        // Ab hier wird Chart erstellt
                        let ctx = ProcessingCanvas.getContext('2d');
                        ProcessingChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: label,
                                    data: numbers,
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Hintergrundfarbe fÃ¼r Datensatz 1
                                    borderColor: 'rgba(0, 0, 0, 1)', // Randfarbe fÃ¼r Datensatz 1
                                    pointRadius: 5,
                                    borderWidth: 1,
                                    hidden: hidden,
                                    pointBackgroundColor: colors
                                }]
                            },
                            options: {
                                animation: {
                                    onComplete: function () {
                                      ProcessingChart.toBase64Image();
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Learning Element Sequence No.' // Beschriftung der Y-Achse
                                        },
                                    },
                                    y: {
                                        type: 'category',
                                        title: {
                                            display: true,
                                            text: 'Learning Element Type' // Beschriftung der Y-Achse
                                        },
                                        labels: ['MS', 'LG', 'BO', 'EX', 'QU', 'SU', 'AAM', 'TAM', 'VAM'],  // Definieren Sie die benutzerdefinierten Labels
                                        ticks: {
                                            autoSkip: false, // Deaktivieren Sie das automatische Überspringen von Labels
                                            maxRotation: 0,
                                            minRotation: 0
                                        }
                                    }
                                }
                            }
                        });

                        const fabricCanvas = new fabric.Canvas('fabricCanvas');
                        ProcessingCanvas.toBlob((blob) => {
                            const url = URL.createObjectURL(blob);
                            fabric.Image.fromURL(url, (img) => {
                                img.set({ left: 0, top: 0 });
                                fabricCanvas.add(img);
                                fabricCanvas.renderAll();
                            });
                        }, 'image/png');
                    })
                    .catch(error => console.error('Error fetching support values:', error));
                })
                .catch(error => console.error('Error fetching learning styles:', error));
            })
            .catch(error => console.error('Error fetching hidden states:', error));
        })
        .catch(error => console.error('Error fetching learning paths:', error));    
    }

    function loadPerceptionChart(studentId) {
        if (PerceptionChart) {
            PerceptionChart.destroy();
        }
        if (studentId === 'x') return;
        fetch("../data/learning_paths.csv")
        .then(response => response.text())
        .then(csvString_lp => {
            fetch("../data/Perception/hidden_states.csv")
            .then(response => response.text())
            .then(csvString_hs => {
                fetch("../data/Perception/learning_styles.csv")
                .then(response => response.text())
                .then(csvString_ls => {
                    fetch("../data/Perception/support_values.csv")
                    .then(response => response.text())
                    .then(csvString_sv => {
                        const DATA = fetch_data(csvString_lp, csvString_hs, csvString_ls, csvString_sv); 
                        let numbers;
                        let colors_data;

                        if (studentId == "x") {
                            numbers = [];
                            colors_data = [];
                            learningstyle_data = [];
                            supportvalue_data = [];
                        } else {
                            for (let i = 0; i < DATA.DataID.length; i++) {
                                if (DATA.DataID[i][0] == studentId) {
                                    selectedRowID = i;
                                }
                                if (DATA.DataColors[i][0] == studentId) {
                                    selectedRowColors = i;
                                }
                                if (DATA.DataLearningStyles[i][0] == studentId) {
                                    selectedRowLearingStyles = i;
                                }
                                if (DATA.DataSupportValues[i][0] == studentId) {
                                    selectedRowSupportValues = i;
                                }
                            }
                            numbers = DATA.DataID[selectedRowID].slice(1);
                            colors_data = DATA.DataColors[selectedRowColors].slice(1);
                            learningstyle_data = DATA.DataLearningStyles[selectedRowLearingStyles].slice(1);
                            supportvalue_data = DATA.DataSupportValues[selectedRowSupportValues].slice(1);
                        } 
                        const labels = [];
                        numbers.forEach((element, index)=>{
                            labels[index] = (index+1);
                        })
                        let colors = [];
                        colors_data.forEach((element, index) => {
                            if(element == "Sensory"){
                                colors[index] = 'green'
                            }
                            else if(element == "Intuitive"){
                                colors[index] = 'red'
                            }
                            else{
                                colors[index] = 'black'
                            }
                        })

                        // Ab hier werden die benÃ¶tigten Daten aus den gesamten Daten gefiltert

                        const label = (studentId === "x") ? 'Perception Attributes' : 'Perception Attributes Student ID ' + studentId;
                        const hidden = (studentId === "x");

                        learningStyleElement2.textContent = `Learning Style: ${learningstyle_data[0]}, Strength: ${learningstyle_data[1]}`;
                        supportValueElement2.textContent = `Support Value: ${supportvalue_data[0]}`;

                        // Ab hier wird Chart erstellt
                        let ctx = PerceptionCanvas.getContext('2d');
                        PerceptionChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: label,
                                    data: numbers,
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Hintergrundfarbe fÃ¼r Datensatz 1
                                    borderColor: 'rgba(0, 0, 0, 1)', // Randfarbe fÃ¼r Datensatz 1
                                    pointRadius: 5,
                                    borderWidth: 1,
                                    hidden: hidden,
                                    pointBackgroundColor: colors
                                }]
                            },
                            options: {
                                animation: {
                                    onComplete: function () {
                                      PerceptionChart.toBase64Image();
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Learning Element Sequence No.' // Beschriftung der Y-Achse
                                        },
                                    },
                                    y: {
                                        type: 'category',
                                        title: {
                                            display: true,
                                            text: 'Learning Element Type' // Beschriftung der Y-Achse
                                        },
                                        labels: ['MS', 'LG', 'BO', 'EX', 'QU', 'SU', 'AAM', 'TAM', 'VAM'],  // Definieren Sie die benutzerdefinierten Labels
                                        ticks: {
                                            autoSkip: false, // Deaktivieren Sie das automatische Überspringen von Labels
                                            maxRotation: 0,
                                            minRotation: 0
                                        }
                                    }
                                }
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching support values:', error));
                })
                .catch(error => console.error('Error fetching learning styles:', error));
            })
            .catch(error => console.error('Error fetching hidden states:', error));
        })
        .catch(error => console.error('Error fetching learning paths:', error));    
    }

    function loadInputChart(studentId) {
        if (InputChart) {
            InputChart.destroy();
        }
        if (studentId === 'x') return;
        fetch("../data/learning_paths.csv")
        .then(response => response.text())
        .then(csvString_lp => {
            fetch("../data/Input/hidden_states.csv")
            .then(response => response.text())
            .then(csvString_hs => {
                fetch("../data/Input/learning_styles.csv")
                .then(response => response.text())
                .then(csvString_ls => {
                    fetch("../data/Input/support_values.csv")
                    .then(response => response.text())
                    .then(csvString_sv => {
                        const DATA = fetch_data(csvString_lp, csvString_hs, csvString_ls, csvString_sv); 
                        let numbers;
                        let colors_data;

                        if (studentId == "x") {
                            numbers = [];
                            colors_data = [];
                            learningstyle_data = [];
                            supportvalue_data = [];
                        } else {
                            for (let i = 0; i < DATA.DataID.length; i++) {
                                if (DATA.DataID[i][0] == studentId) {
                                    selectedRowID = i;
                                }
                                if (DATA.DataColors[i][0] == studentId) {
                                    selectedRowColors = i;
                                }
                                if (DATA.DataLearningStyles[i][0] == studentId) {
                                    selectedRowLearingStyles = i;
                                }
                                if (DATA.DataSupportValues[i][0] == studentId) {
                                    selectedRowSupportValues = i;
                                }
                            }
                            numbers = DATA.DataID[selectedRowID].slice(1);
                            colors_data = DATA.DataColors[selectedRowColors].slice(1);
                            learningstyle_data = DATA.DataLearningStyles[selectedRowLearingStyles].slice(1);
                            supportvalue_data = DATA.DataSupportValues[selectedRowSupportValues].slice(1);
                        } 
                        const labels = [];
                        numbers.forEach((element, index)=>{
                            labels[index] = (index+1);
                        })
                        let colors = [];
                        colors_data.forEach((element, index) => {
                            if(element == "Visual"){
                                colors[index] = 'green'
                            }
                            else if(element == "Verbal"){
                                colors[index] = 'red'
                            }
                            else{
                                colors[index] = 'black'
                            }
                        })

                        // Ab hier werden die benÃ¶tigten Daten aus den gesamten Daten gefiltert

                        const label = (studentId === "x") ? 'Input Attributes' : 'Input Attributes Student ID ' + studentId;
                        const hidden = (studentId === "x");

                        learningStyleElement3.textContent = `Learning Style: ${learningstyle_data[0]}, Strength: ${learningstyle_data[1]}`;
                        supportValueElement3.textContent = `Support Value: ${supportvalue_data[0]}`;

                        // Ab hier wird Chart erstellt
                        let ctx = InputCanvas.getContext('2d');
                        InputChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: label,
                                    data: numbers,
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Hintergrundfarbe fÃ¼r Datensatz 1
                                    borderColor: 'rgba(0, 0, 0, 1)', // Randfarbe fÃ¼r Datensatz 1
                                    pointRadius: 5,
                                    borderWidth: 1,
                                    hidden: hidden,
                                    pointBackgroundColor: colors
                                }]
                            },
                            options: {
                                animation: {
                                    onComplete: function () {
                                      InputChart.toBase64Image();
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Learning Element Sequence No.' // Beschriftung der Y-Achse
                                        },
                                    },
                                    y: {
                                        type: 'category',
                                        title: {
                                            display: true,
                                            text: 'Learning Element Type' // Beschriftung der Y-Achse
                                        },
                                        labels: ['MS', 'LG', 'BO', 'EX', 'QU', 'SU', 'AAM', 'TAM', 'VAM'],  // Definieren Sie die benutzerdefinierten Labels
                                        ticks: {
                                            autoSkip: false, // Deaktivieren Sie das automatische Überspringen von Labels
                                            maxRotation: 0,
                                            minRotation: 0
                                        }
                                    }
                                }
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching support values:', error));
                })
                .catch(error => console.error('Error fetching learning styles:', error));
            })
            .catch(error => console.error('Error fetching hidden states:', error));
        })
        .catch(error => console.error('Error fetching learning paths:', error));    
    }

    function loadUnderstandingChart(studentId) {
        if (UnderstandingChart) {
            UnderstandingChart.destroy();
        }
        if (studentId === 'x') return;
        fetch("../data/learning_paths.csv")
        .then(response => response.text())
        .then(csvString_lp => {
            fetch("../data/Understanding/hidden_states.csv")
            .then(response => response.text())
            .then(csvString_hs => {
                fetch("../data/Understanding/learning_styles.csv")
                .then(response => response.text())
                .then(csvString_ls => {
                    fetch("../data/Understanding/support_values.csv")
                    .then(response => response.text())
                    .then(csvString_sv => {
                        const DATA = fetch_data(csvString_lp, csvString_hs, csvString_ls, csvString_sv); 
                        let numbers;
                        let colors_data;

                        if (studentId == "x") {
                            numbers = [];
                            colors_data = [];
                            learningstyle_data = [];
                            supportvalue_data = [];
                        } else {
                            for (let i = 0; i < DATA.DataID.length; i++) {
                                if (DATA.DataID[i][0] == studentId) {
                                    selectedRowID = i;
                                }
                                if (DATA.DataColors[i][0] == studentId) {
                                    selectedRowColors = i;
                                }
                                if (DATA.DataLearningStyles[i][0] == studentId) {
                                    selectedRowLearingStyles = i;
                                }
                                if (DATA.DataSupportValues[i][0] == studentId) {
                                    selectedRowSupportValues = i;
                                }
                            }
                            numbers = DATA.DataID[selectedRowID].slice(1);
                            colors_data = DATA.DataColors[selectedRowColors].slice(1);
                            learningstyle_data = DATA.DataLearningStyles[selectedRowLearingStyles].slice(1);
                            supportvalue_data = DATA.DataSupportValues[selectedRowSupportValues].slice(1);
                        } 
                        const labels = [];
                        numbers.forEach((element, index)=>{
                            labels[index] = (index+1);
                        })
                        let colors = [];
                        colors_data.forEach((element, index) => {
                            if(element == "Sequential"){
                                colors[index] = 'green'
                            }
                            else if(element == "Global"){
                                colors[index] = 'red'
                            }
                            else{
                                colors[index] = 'black'
                            }
                        })

                        // Ab hier werden die benÃ¶tigten Daten aus den gesamten Daten gefiltert

                        const label = (studentId === "x") ? 'Understanding Attributes' : 'Understanding Attributes Student ID ' + studentId;
                        const hidden = (studentId === "x");

                        learningStyleElement4.textContent = `Learning Style: ${learningstyle_data[0]}, Strength: ${learningstyle_data[1]}`;
                        supportValueElement4.textContent = `Support Value: ${supportvalue_data[0]}`;

                        // Ab hier wird Chart erstellt
                        let ctx = UnderstandingCanvas.getContext('2d');
                        UnderstandingChart = new Chart(ctx, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: label,
                                    data: numbers,
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Hintergrundfarbe fÃ¼r Datensatz 1
                                    borderColor: 'rgba(0, 0, 0, 1)', // Randfarbe fÃ¼r Datensatz 1
                                    pointRadius: 5,
                                    borderWidth: 1,
                                    hidden: hidden,
                                    pointBackgroundColor: colors
                                }]
                            },
                            options: {
                                animation: {
                                    onComplete: function () {
                                      UnderstandingChart.toBase64Image();
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Learning Element Sequence No.' // Beschriftung der Y-Achse
                                        },
                                    },
                                    y: {
                                        type: 'category',
                                        title: {
                                            display: true,
                                            text: 'Learning Element Type' // Beschriftung der Y-Achse
                                        },
                                        labels: ['MS', 'LG', 'BO', 'EX', 'QU', 'SU', 'AAM', 'TAM', 'VAM'],  // Definieren Sie die benutzerdefinierten Labels
                                        ticks: {
                                            autoSkip: false, // Deaktivieren Sie das automatische Überspringen von Labels
                                            maxRotation: 0,
                                            minRotation: 0
                                        }
                                    }
                                }
                            }
                        });
                    })
                    .catch(error => console.error('Error fetching support values:', error));
                })
                .catch(error => console.error('Error fetching learning styles:', error));
            })
            .catch(error => console.error('Error fetching hidden states:', error));
        })
        .catch(error => console.error('Error fetching learning paths:', error));    
    }

    studentSelect.dispatchEvent(new Event('change'));
});