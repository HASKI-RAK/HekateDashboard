document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('ILSchartToggle').checked = false;
    document.getElementById('BFIchartToggle').checked = false;
    document.getElementById('LISTchartToggle').checked = false;
});

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

document.addEventListener("DOMContentLoaded", function() {
    let studentSelect = document.getElementById('studentSelect');
    let toggle = document.getElementById("ILSchartToggle");
    let customLegend1 = document.getElementById("customLegend1");
    let ILSchartCanvas = document.getElementById("ILSChartCanvas");
    let toggleBFI = document.getElementById("BFIchartToggle");
    let customLegend2 = document.getElementById("customLegend2");
    let BFIchartCanvas = document.getElementById("BFIChartCanvas");
    let toggleLIST = document.getElementById("LISTchartToggle");
    let customLegend3 = document.getElementById("customLegend3");
    let LISTchartCanvas = document.getElementById("LISTChartCanvas");
   
    fetch("../data/ILS-Posttest.csv")
    .then(response => response.text())
    .then(csvString => {
        const rows = csvString.split('\n');
        rows.shift().split(';');
        const ILSDataString = rows.map(row => row.split(';'));
        let ILSData = []
        for (let i = 0; i< ILSDataString.length; i++){
            ILSData[i] = []
            let j = 1
            ILSData[i][0] = parseInt(ILSDataString[i][0], 10)
        }
        ILSData.forEach(row => {
            const fieldValue = row[0];
            const option = document.createElement('option');
            option.textContent = fieldValue;
            option.value = fieldValue;
            studentSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching students:', error));

    let ILSchart;
    let BFIchart;
    let LISTchart;

    toggle.addEventListener("change", function () {
        let selectedStudentId = studentSelect.value;
        let chartType = toggle.checked ? 'boxplot' : 'barplot';
        customLegend1.style.display = chartType === 'boxplot' ? 'block' : 'none';
        loadILSChart(selectedStudentId, chartType);
    });

    toggleBFI.addEventListener("change", function () {
        let selectedStudentId = studentSelect.value;
        let chartType = toggleBFI.checked ? 'boxplot' : 'radar';
        customLegend2.style.display = chartType === 'boxplot' ? 'block' : 'none';
        loadBFIChart(selectedStudentId, chartType);
    });

    toggleLIST.addEventListener("change", function () {
        let selectedStudentId = studentSelect.value;
        let chartType = toggleLIST.checked ? 'boxplot' : 'radar';
        customLegend3.style.display = chartType === 'boxplot' ? 'block' : 'none';
        loadLISTChart(selectedStudentId, chartType);
    });

    studentSelect.addEventListener('change', function () {
        let selectedStudentId = studentSelect.value;
        let ILSToggleState = toggle.checked ? 'boxplot' : 'barplot';
        let BFIToggleState = toggleBFI.checked ? 'boxplot' : 'radar';
        let LISTToggleState = toggleLIST.checked ? 'boxplot' : 'radar';
        loadILSChart(selectedStudentId, ILSToggleState);
        loadBFIChart(selectedStudentId, BFIToggleState);
        loadLISTChart(selectedStudentId, LISTToggleState);
    });

    document.getElementById('downloadILSChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = ILSchart.toBase64Image();
            a.download = 'ILS.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadBFIChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = BFIchart.toBase64Image();
            a.download = 'BFI-10.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadLISTChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = LISTchart.toBase64Image();
            a.download = 'LIST-K.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    function loadILSChart(studentId, chartType) {
        if (ILSchart) {
            ILSchart.destroy();
        }
        if (studentId === 'x') return;

        fetch("../data/ILS-Posttest.csv")
        .then(response => response.text())
        .then(csvString => {
            const rows = csvString.split('\n');
            const headers = rows.shift().split(';');
            const filteredHeaders = headers.filter((_, index) => index % 2 !== 0);
            const ILSDataString = rows.map(row => row.split(';'));
            ILSData = []
            for (let i = 0; i< ILSDataString.length; i++){
                ILSData[i] = []
                let j = 1
                ILSData[i][0] = parseInt(ILSDataString[i][0], 10)
                for(let spalte = 1; spalte < ILSDataString[1].length; spalte = spalte + 2){
                    let zahl = parseInt(ILSDataString[i][spalte+1], 10)
                    switch (ILSDataString[i][spalte]) {
                        case "Active":
                        case "Sensory":
                        case "Sequential":
                        case "Visual":
                            ILSData[i][j] = -zahl
                            j++;
                            break;
                        case "Reflective":
                        case "Intuitive":
                        case "Global":
                        case "Verbal":
                            ILSData[i][j] = zahl
                            j++;
                        default:
                            break;
                    }
                };
            }
            let ILSSumme = [0, 0, 0, 0]
            let ILSAnzahl = 0
            for (let i = 1; i< ILSData[1].length; i++){
                for (let reihe = 0; reihe< ILSData.length; reihe++){
                    ILSSumme[i-1] = ILSSumme[i-1] + ILSData[reihe][i];
                    if (i == 1){
                        ILSAnzahl++;
                    }
                }
            }           
            const ILSDurchschnitt = ILSSumme;
            for (i=0; i<ILSDurchschnitt.length; i++){
                ILSDurchschnitt[i] = ILSDurchschnitt[i] / ILSAnzahl;
            }
            const ILSDataPlaceholder = [0, 0, 0, 0];
            const labelsleft = ["Active", "Sensory", "Sequential", "Visual"];
            const labelsright = ["Reflective", "Intuitive", "Global", "Verbal"];
        
            const ILSBoxplotData = []
            for (let i = 0; i< ILSData[0].length-1; i++){
                ILSBoxplotData[i] = []
                for(let j = 0; j < ILSData.length; j++){
                    ILSBoxplotData[i][j] = ILSData[j][i+1]                    
                };
            }

            let numbers = [];
            let selectedRow = 0;       
            if (studentId == "x") {
                numbers = [0, 0, 0, 0];
            } else {
                for (let i = 0; i < ILSData.length; i++) {
                    if (ILSData[i][0] == studentId) {
                        selectedRow = i;
                    }
                }
                numbers = ILSData[selectedRow].slice(1);
            }
            
            let numbersBoxplot = numbers.map(num => [num]);

            const borderColor = (studentId === "x") ? 'rgba(255, 99, 132, 0)' : 'rgba(255, 99, 132, 1)';           
            const label = (studentId === "x") ? 'ILS' : 'ILS Student ID ' + ILSData[selectedRow][0];
            const hidden = (studentId === "x");

            let ctx = ILSchartCanvas.getContext('2d');
            if (chartType === 'barplot') {
                ILSchart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: filteredHeaders,
                        datasets: [{
                            label: label,
                            data: numbers,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            hidden: hidden
                        }, 
                        {
                            label: 'ILS Student Average',
                            data: ILSDurchschnitt,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        animation: {
                            onComplete: function () {
                              ILSchart.toBase64Image();
                            },
                        },
                        scales: {
                            x: {
                                beginAtZero: true,
                                min: -11,
                                max: 11,
                                stepSize: 1,
                                grid: {
                                    display: true,
                                    drawOnChartArea: true,
                                    drawTicks: true,
                                    color: ctx => (ctx.tick && (Math.abs(ctx.tick.value) % 2 !== 0 || ctx.tick.value === 0)) ? 'rgba(0, 0, 0, 0.1)' : 'transparent'
                                },
                                ticks: {
                                    stepSize: 1,
                                    min: -11, 
                                    max: 11,   
                                    callback: function(value, index, values) {
                                        return value % 2 !== 0 || value === 0 ? value : '';
                                    }
                                }
                            },
                            y: {
                                position: "left",
                                beginAtZero: true,
                                labels: labelsleft
                            },
                            y1: {
                                position: 'right',
                                beginAtZero: true,
                                labels: labelsright
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    title: function(tooltipItems) {
                                        if (tooltipItems[0].raw > 0){
                                            if (tooltipItems[0].label == "Active"){
                                                return "Reflective";
                                            }
                                            else if (tooltipItems[0].label == "Sensory"){
                                                return "Intuitive"
                                            }
                                            else if (tooltipItems[0].label == "Sequential"){
                                                return "Global"
                                            }
                                            else if (tooltipItems[0].label == "Visual"){
                                                return "Verbal"
                                            }
                                        }
                                        else{
                                            return tooltipItems[0].label;
                                        }
                                        
                                        
                                    },
                                    label: function(tooltipItem) {
                                        let datasetLabel = tooltipItem.dataset.label || '';
                                        let value;
                                        if (datasetLabel == "ILS Student Average"){
                                            value = parseFloat(tooltipItem.raw.toPrecision(3));
                                        }
                                        else{
                                            value = tooltipItem.raw;
                                        }
                                        return `${datasetLabel}:    ${value}`;
                                    },
                                    footer: function(tooltipItems){
                                        if (tooltipItems[0].raw > 0){
                                            if (tooltipItems[0].label == "Active"){
                                                return "Reflective: Individual or small group interaction or people they trust, thinking about the material.";
                                            }
                                            else if (tooltipItems[0].label == "Sensory"){
                                                return "Intuitive: Theories and underlying details, theorems, meanings, definitions. Innovative and creative personality."
                                            }
                                            else if (tooltipItems[0].label == "Sequential"){
                                                return "Global: Random large steps, without connections to finish learning. Able to solve problems but fail to explain them."
                                            }
                                            else if (tooltipItems[0].label == "Visual"){
                                                return "Verbal: Remembering written and spoken words. Textual information, speaking out."
                                            }
                                        }
                                        else {
                                            if (tooltipItems[0].label == "Active"){
                                                return "Active: Interacting in a group, interacting with learning material, actively trying new things, trying something out.";
                                            }
                                            else if (tooltipItems[0].label == "Sensory"){
                                                return "Sensory: Practicing concrete materials and real-world application. Practical and details-oriented. Learners tend to be more patient with details."
                                            }
                                            else if (tooltipItems[0].label == "Sequential"){
                                                return "Sequential: Linear, logical, small steps to finish learning."
                                            }
                                            else if (tooltipItems[0].label == "Visual"){
                                                return "Visual: Remembering learning elements they see. Pictures, flowcharts, videos, charts, graphs."
                                            }
                                        }
                                    }
                                },
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                titleFont: {
                                    size: 16,
                                    weight: 'bold'
                                },
                                bodyFont: {
                                    size: 14
                                },
                                footerFont: {
                                    size: 12
                                },
                                xPadding: 10,
                                yPadding: 10,
                                borderColor: 'rgba(0,0,0,1)',
                                borderWidth: 1
                            }
                        }
                    }
                });
            } else {
                ILSchart = new Chart(ctx, {
                    type: 'boxplot',
                    data: {
                        labels: ['Active', 'Sensory', 'Sequential', 'Visual'],
                        datasets: [{
                                label: label,
                                backgroundColor: 'rgba(255, 99, 132, 0.2)', 
                                borderColor: borderColor,
                                borderWidth: 1,
                                meanRadius: 0,
                                padding: 10,
                                itemRadius: 0,
                                data: numbersBoxplot,
                                hidden: hidden          
                            },
                            {
                                label: 'ILS Student Average',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)', 
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                                outlierColor: 'rgba(54, 162, 235, 1)',
                                outlierBackgroundColor: 'rgba(54, 162, 235, 1)',
                                meanBorderColor:'rgba(0, 0, 0, 1)',
                                meanBackgroundColor:'rgba(0, 0, 0, 1)',
                                padding: 10,
                                itemRadius: 0,
                                data: ILSBoxplotData            
                            }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                              ILSchart.toBase64Image();
                            },
                        },
                        responsive: true,
                        legend: {
                        position: 'top',
                        },
                        indexAxis: 'y',
                        scales: {
                            x: {
                                beginAtZero: true,
                                min: -11,
                                max: 11,
                                stepSize: 1,
                                grid: {
                                    display: true,
                                    drawOnChartArea: true,
                                    drawTicks: true,
                                    color: ctx => (ctx.tick && (Math.abs(ctx.tick.value) % 2 !== 0 || ctx.tick.value === 0)) ? 'rgba(0, 0, 0, 0.1)' : 'transparent'
                                },
                                ticks: {
                                    stepSize: 1, 
                                    min: -11,  
                                    max: 11,  
                                    callback: function(value, index, values) {
                                        return value % 2 !== 0 || value === 0 ? value : ''; 
                                    }
                                }
                            },
                            y: {
                                position: "left",
                                beginAtZero: true,
                                labels: labelsleft
                            },
                            y1: {
                                position: 'right',
                                beginAtZero: true,
                                labels: labelsright
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    title: function(tooltipItems) {
                                        if (tooltipItems[0].label == "Active"){
                                            return "Active / Reflective";
                                        }
                                        else if (tooltipItems[0].label == "Sensory"){
                                            return "Sensory / Intuitive"
                                        }
                                        else if (tooltipItems[0].label == "Sequential"){
                                            return "Sequential / Global"
                                        }
                                        else if (tooltipItems[0].label == "Visual"){
                                            return "Visual / Verbal"
                                        }
                                    },
                                    label: function(tooltipItems) {
                                        let datasetLabel = tooltipItems.dataset.label || '';
                                        if (datasetLabel == "ILS Student Average"){
                                            return `${datasetLabel}:    max: ${tooltipItems.parsed.max}, min: ${tooltipItems.parsed.min},   median: ${tooltipItems.parsed.median}, mean: ${parseFloat(tooltipItems.parsed.mean.toPrecision(3))},   25% Percentile: ${tooltipItems.parsed.q1}, 75% Percentile: ${tooltipItems.parsed.q3}`;
                                        }
                                        else{
                                            return `${datasetLabel}:    ${tooltipItems.parsed.max}`
                                        }
                                    },
                                    footer: function(tooltipItems){
                                        if (tooltipItems[0].label == "Active"){
                                            return "Active: Interacting in a group, interacting with learning material, actively trying new things, trying something out.\nReflective: Individual or small group interaction or people they trust, thinking about the material.";
                                        }
                                        else if (tooltipItems[0].label == "Sensory"){
                                            return "Sensory: Practicing concrete materials and real-world application. Practical and details-oriented. Learners tend to be more patient with details.\nIntuitive: Theories and underlying details, theorems, meanings, definitions. Innovative and creative personality."
                                        }
                                        else if (tooltipItems[0].label == "Sequential"){
                                            return "Sequential: Linear, logical, small steps to finish learning.\nGlobal: Random large steps, without connections to finish learning. Able to solve problems but fail to explain them."
                                        }
                                        else if (tooltipItems[0].label == "Visual"){
                                            return "Visual: Remembering learning elements they see. Pictures, flowcharts, videos, charts, graphs.\nVerbal: Remembering written and spoken words. Textual information, speaking out."
                                        }
                                    }
                                }
                            }
                        }
                    } 
                });
            }
        })
        .catch(error => console.error('Error loading ILS chart:', error));
    }

    function loadBFIChart(studentId, chartType) {
        if (BFIchart) {
            BFIchart.destroy();
        }
        if (studentId === 'x') return;

        fetch("../data/bfi.csv")
        .then(response => response.text())
        .then(csvString => {
            const rows = csvString.split('\n');
            const headers = rows.shift().split(';');
            const BFIDataString = rows.map(row => row.split(';'));
            let BFIData = []
            for (let i = 0; i< BFIDataString.length; i++){
                BFIData[i] = []
                let BFIDataNumbers = BFIDataString[i][0].split(',').map(Number);
                for(let spalte = 0; spalte < BFIDataNumbers.length; spalte++){
                    BFIData[i][spalte] = BFIDataNumbers[spalte]
                }
            }
            let BFISumme = [0, 0, 0, 0, 0] 
            let BFIAnzahl = 0
            for (let i = 1; i< BFIData[1].length; i++){
                for (let reihe = 0; reihe< BFIData.length; reihe++){
                    BFISumme[i-1] = BFISumme[i-1] + BFIData[reihe][i];
                    if (i == 1){
                        BFIAnzahl++;
                    }
                }
            }        
            const BFIDataPlaceholder = [0, 0, 0, 0, 0];
            const BFIDurchschnitt = BFISumme;
            for (i=0; i< BFIDurchschnitt.length; i++){
                BFIDurchschnitt[i] = BFISumme[i] / BFIAnzahl;
            }

            const BFIBoxplotData = []
            for (let i = 0; i< BFIData[0].length-1; i++){
                BFIBoxplotData[i] = []
                for(let j = 0; j < BFIData.length; j++){
                    BFIBoxplotData[i][j] = BFIData[j][i+1]                    
                };
            }

            let numbers = 0
            let selectedRow = 0
            if (studentId == "x"){
                numbers = [0, 0, 0, 0, 0];
            }
            else{
                for (let i = 0; i < BFIData.length; i++) {
                    if (BFIData[i][0] == studentId) {
                        selectedRow = i;
                    }
                }
                numbers = BFIData[selectedRow].slice(1)
            }       
            let numbersBoxplot = numbers.map(num => [num]);

            const borderColor = (studentId === "x") ? 'rgba(255, 99, 132, 0)' : 'rgba(255, 99, 132, 1)';
            const label = (studentId === "x") ? 'BFI-10' : 'BFI-10 Student ID ' + BFIData[selectedRow][0];
            const hidden = (studentId === "x");

            let ctx = BFIchartCanvas.getContext('2d');
            if (chartType === 'radar') {
                BFIchart = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: [
                            'Extraversion',
                            'Agreeableness',
                            'Conscientiousness',
                            'Neuroticism',
                            'Openness'
                        ],
                        datasets: [{
                            label: label,
                            data: numbers,
                            fill: true,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgb(255, 99, 132)',
                            pointBackgroundColor: 'rgb(255, 99, 132)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgb(255, 99, 132)',
                            pointRadius: 10,
                            hidden: hidden
                        }, 
                        {
                            label: 'BFI-10 Student Average',
                            data: BFIDurchschnitt,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)', 
                            borderColor: 'rgba(54, 162, 235, 1)', 
                            borderWidth: 1
                        }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                              BFIchart.toBase64Image();
                            },
                        },
                        parsing: {
                            key: 'value'
                        },
                        scales: {
                            r: {
                                min: 0,
                                max: 5,
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItems) {
                                        let datasetLabel = tooltipItems.dataset.label || '';
                                        return `${datasetLabel}:    ${parseFloat(tooltipItems.parsed.r.toPrecision(3))}`              
                                    },
                                    footer: function(tooltipItems){
                                        if (tooltipItems[0].label == "Extraversion"){
                                            return "Enthusiasm. Social skills, numerous friendships, enterprising vocational interests, participation in sports, club memberships.";
                                        }
                                        else if (tooltipItems[0].label == "Neuroticism"){
                                            return "Handling negative things. Low self-esteem, irrational perfectionistic beliefs, pessimistic."
                                        }
                                        else if (tooltipItems[0].label == "Openness"){
                                            return "Interested in new things. Interested in traveling, having many hobbies, knowledge of foreign culture and cuisine, diverse vocational interests, friends who share tastes."
                                        }
                                        else if (tooltipItems[0].label == "Agreeableness"){
                                            return "Interpersonal behavior. Forgiving attitude, believes in cooperation, inoffensive language, reputation as a pushover."
                                        }
                                        else if (tooltipItems[0].label == "Conscientiousness"){
                                            return "Behavior towards obligations. Leadership skills, long-term plans, organized support network, technical expertise."
                                        }
                                    }
                                }
                            }
                        }
                    },
                });
            } else {
                BFIchart = new Chart(ctx, {
                    type: 'boxplot',
                    data: {
                        labels: [
                            'Extraversion',
                            'Agreeableness',
                            'Conscientiousness',
                            'Neuroticism',
                            'Openness'
                        ],
                        datasets: [{
                            label: label,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: borderColor, 
                            borderWidth: 1,
                            meanRadius: 0,
                            padding: 10,
                            itemRadius: 0,
                            data: numbersBoxplot,
                            hidden: hidden          
                        },
                        {
                            label: 'BFI-10 Student Average',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)', 
                            borderColor: 'rgba(54, 162, 235, 1)', 
                            borderWidth: 1,
                            outlierColor: 'rgba(54, 162, 235, 1)',
                            outlierBackgroundColor: 'rgba(54, 162, 235, 1)',
                            meanBorderColor:'rgba(0, 0, 0, 1)',
                            meanBackgroundColor:'rgba(0, 0, 0, 1)',
                            padding: 10,
                            itemRadius: 0,
                            data: BFIBoxplotData            
                        }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                              BFIchart.toBase64Image();
                            },
                        },
                        parsing: {
                            key: 'value'
                        },
                        indexAxis: 'y',
                        scales: {
                            r: {
                                min: 0,
                                max: 5,
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    title: function(tooltipItems) {
                                            return tooltipItems[0].label;
                                    },
                                    label: function(tooltipItems) {
                                        let datasetLabel = tooltipItems.dataset.label || '';
                                        if (datasetLabel == "BFI-10 Student Average"){
                                            return `${datasetLabel}:    max: ${tooltipItems.parsed.max}, min: ${tooltipItems.parsed.min},   median: ${tooltipItems.parsed.median}, mean: ${parseFloat(tooltipItems.parsed.mean.toPrecision(3))},   25% Percentile: ${tooltipItems.parsed.q1}, 75% Percentile: ${tooltipItems.parsed.q3}`;
                                        }
                                        else{
                                            return `${datasetLabel}:    ${tooltipItems.parsed.max}`
                                        }
                                    },
                                    footer: function(tooltipItems){
                                        if (tooltipItems[0].label == "Extraversion"){
                                            return "Enthusiasm. Social skills, numerous friendships, enterprising vocational interests, participation in sports, club memberships.";
                                        }
                                        else if (tooltipItems[0].label == "Agreeableness"){
                                            return "Interpersonal behavior. Forgiving attitude, believes in cooperation, inoffensive language, reputation as a pushover."
                                        }
                                        else if (tooltipItems[0].label == "Conscientiousness"){
                                            return "Behavior towards obligations. Leadership skills, long-term plans, organized support network, technical expertise."
                                        }
                                        else if (tooltipItems[0].label == "Neuroticism"){
                                            return "Handling negative things. Low self-esteem, irrational perfectionistic beliefs, pessimistic."
                                        }
                                        else if (tooltipItems[0].label == "Openness"){
                                            return "Interested in new things. Interested in traveling, having many hobbies, knowledge of foreign culture and cuisine, diverse vocational interests, friends who share tastes."
                                        }
                                    }
                                }
                            }
                        }
                    },
                });
            }
        })
        .catch(error => console.error('Error loading BFI chart:', error));
    }

    function loadLISTChart(studentId, chartType) {
        if (LISTchart) {
            LISTchart.destroy();
        }
        if (studentId === 'x') return;

        fetch("../data/list.csv")
        .then(response => response.text())
        .then(csvString => {
            const rows = csvString.split('\n');
            const headers = rows.shift().split(';');
            const LISTDataString = rows.map(row => row.split(';'));
            let LISTData = []
            for (let i = 0; i< LISTDataString.length; i++){
                LISTData[i] = []
                let LISTDataNumbers = LISTDataString[i][0].split(',').map(Number);
                for(let spalte = 0; spalte < LISTDataNumbers.length; spalte++){
                    LISTData[i][spalte] = LISTDataNumbers[spalte]
                }
            }
            let LISTSumme = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            let LISTAnzahl = 0
            for (let i = 1; i< LISTData[1].length; i++){
                for (let reihe = 0; reihe< LISTData.length; reihe++){
                    LISTSumme[i-1] = LISTSumme[i-1] + LISTData[reihe][i];
                    if (i == 1){
                        LISTAnzahl++;
                    }
                }
            }
            const LISTDataPlaceholder = [0, 0, 0, 0];
            const LISTDurchschnitt = LISTSumme 
            for (let i = 0; i< LISTDurchschnitt.length; i++){
                LISTDurchschnitt[i] = LISTSumme[i] / LISTAnzahl;
            }

            const LISTBoxplotData = []
            for (let i = 0; i< LISTData[0].length-1; i++){
                LISTBoxplotData[i] = []
                for(let j = 0; j < LISTData.length; j++){
                    LISTBoxplotData[i][j] = LISTData[j][i+1]                    
                };
            }

            let numbers = 0
            let numbers_main = 0
            let numbers_additional = 0
            let selectedRow = 0
            if (studentId == "x"){
                numbers = [0, 0, 0, 0];
            }
            else{
                for (let i = 0; i < LISTData.length; i++) {
                    if (LISTData[i][0] == studentId) {
                        selectedRow = i;
                    }
                }
                numbers = LISTData[selectedRow].slice(1)
                numbers_main = numbers.slice(0, 4)
                numbers_additional = numbers.slice(-13)
            }
            let numbersBoxplot;
            if (studentId == "x"){
                numbersBoxplot = [[0], [0], [0], [0]]
            }
            else{
                numbersBoxplot = numbers_main.map(num => [num]);
            }  
            const borderColor = (studentId === "x") ? 'rgba(255, 99, 132, 0)' : 'rgba(255, 99, 132, 1)';  
            const label = (studentId === "x") ? 'LIST-K' : 'LIST-K Student ID ' + LISTData[selectedRow][0];
            const hidden = (studentId === "x");

            let ctx = LISTchartCanvas.getContext('2d');
            if (chartType === 'radar') {
                LISTchart = new Chart(ctx, {
                    type: 'radar',
                    data: {
                        labels: [
                            'Cognitive',
                            'Meta-Cognitive',
                            'Managing internal Resources',
                            'Managing external Resources'
                        ],
                        datasets: [{
                            label: label,
                            data: [ {value:numbers_main[0], additional:{organizing: numbers_additional[0], elaborating: numbers_additional[1], critical_review: numbers_additional[2], revision: numbers_additional[3]}},
                                    {value:numbers_main[1], additional:{plans_and_targets: numbers_additional[4],inspection: numbers_additional[5], regulating: numbers_additional[6]}},
                                    {value:numbers_main[2], additional:{attention: numbers_additional[7], effort: numbers_additional[8], time: numbers_additional[9]}},
                                    {value:numbers_main[3], additional:{learning_with_fellow_students: numbers_additional[10], literature_review: numbers_additional[11], learning_environment: numbers_additional[12]}}],
                            fill: true,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgb(255, 99, 132)',
                            pointBackgroundColor: 'rgb(255, 99, 132)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgb(255, 99, 132)',
                            pointRadius: 10,
                            hidden: hidden
                        }, 
                        {
                            label: 'LIST-K Student Average',
                            data: [ {value:LISTDurchschnitt[0], additional:{organizing: LISTDurchschnitt[4], elaborating: LISTDurchschnitt[5], critical_review: LISTDurchschnitt[6], revision: LISTDurchschnitt[7]}},
                                    {value:LISTDurchschnitt[1], additional:{plans_and_targets: LISTDurchschnitt[8],inspection: LISTDurchschnitt[9], regulating: LISTDurchschnitt[10]}},
                                    {value:LISTDurchschnitt[2], additional:{attention: LISTDurchschnitt[11], effort: LISTDurchschnitt[12], time: LISTDurchschnitt[13]}},
                                    {value:LISTDurchschnitt[3], additional:{learning_with_fellow_students: LISTDurchschnitt[14], literature_review: LISTDurchschnitt[15], learning_environment: LISTDurchschnitt[16]}}],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)', 
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                              LISTchart.toBase64Image();
                            },
                        },
                        parsing: {
                            key: 'value'
                        },
                        scales: {
                            r: {
                                min: 0,
                                max: 5,
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItems) {
                                        let datasetLabel = tooltipItems.dataset.label || '';
                                        if (tooltipItems.label == "Cognitive"){
                                            let keys = [Object.keys(tooltipItems.dataset.data[0].additional)[0],
                                                        Object.keys(tooltipItems.dataset.data[0].additional)[1],
                                                        Object.keys(tooltipItems.dataset.data[0].additional)[2],
                                                        Object.keys(tooltipItems.dataset.data[0].additional)[3]]
                                            return [`${datasetLabel}: ${parseFloat(tooltipItems.parsed.r.toPrecision(3))}`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[0].additional)[0]}: ${parseFloat(tooltipItems.dataset.data[0].additional[keys[0]].toPrecision(3))}`,
                                                    `self-organizing, outline and notes preparation`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[0].additional)[1]}: ${parseFloat(tooltipItems.dataset.data[0].additional[keys[1]].toPrecision(3))}`,
                                                    `application-oriented, concrete examples, comparing with self experiences`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[0].additional)[2]}: ${parseFloat(tooltipItems.dataset.data[0].additional[keys[2]].toPrecision(3))}`,
                                                    `self-questioning, critical approach, examine critically`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[0].additional)[3]}: ${parseFloat(tooltipItems.dataset.data[0].additional[keys[3]].toPrecision(3))}`,
                                                    `memorize concepts with technical terms, by heart learn rules, technical terms, or formulas, by heart learning content from several resources as far as possible`
                                            ]  
                                        }
                                        else if (tooltipItems.label == "Meta-Cognitive"){
                                            let keys = [Object.keys(tooltipItems.dataset.data[1].additional)[0],
                                                        Object.keys(tooltipItems.dataset.data[1].additional)[1],
                                                        Object.keys(tooltipItems.dataset.data[1].additional)[2]]
                                            return [`${datasetLabel}: ${parseFloat(tooltipItems.parsed.r.toPrecision(3))}`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[1].additional)[0]}: ${parseFloat(tooltipItems.dataset.data[1].additional[keys[0]].toPrecision(3))}`,
                                                    `planning learning targets, planning the learning process`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[1].additional)[1]}: ${parseFloat(tooltipItems.dataset.data[1].additional[keys[1]].toPrecision(3))}`,
                                                    `self-assessing the learned concepts, self-examining, self-reviewing the learned concepts`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[1].additional)[2]}: ${parseFloat(tooltipItems.dataset.data[1].additional[keys[2]].toPrecision(3))}`,
                                                    `self-regulating the learning strategy based on the situation like difficulty, realization of learning process etc.`
                                            ]  
                                        }
                                        else if (tooltipItems.label == "Managing internal Resources"){
                                            let keys = [Object.keys(tooltipItems.dataset.data[2].additional)[0],
                                                        Object.keys(tooltipItems.dataset.data[2].additional)[1],
                                                        Object.keys(tooltipItems.dataset.data[2].additional)[2]]
                                            return [`${datasetLabel}: ${parseFloat(tooltipItems.parsed.r.toPrecision(3))}`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[2].additional)[0]}: ${parseFloat(tooltipItems.dataset.data[2].additional[keys[0]].toPrecision(3))}`,
                                                    `Management: the focus and concentration on learning content`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[2].additional)[1]}: ${parseFloat(tooltipItems.dataset.data[2].additional[keys[1]].toPrecision(3))}`,
                                                    `Management: not giving up or dropping out to various circumstances like difficult learning concepts, etc. spending more time or extra effort when required`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[2].additional)[2]}: ${parseFloat(tooltipItems.dataset.data[2].additional[keys[2]].toPrecision(3))}`,
                                                    `Management: dedicated time plan for studying`
                                            ]  
                                        }
                                        else if (tooltipItems.label == "Managing external Resources"){
                                            let keys = [Object.keys(tooltipItems.dataset.data[3].additional)[0],
                                                        Object.keys(tooltipItems.dataset.data[3].additional)[1],
                                                        Object.keys(tooltipItems.dataset.data[3].additional)[2]]
                                            return [`${datasetLabel}: ${parseFloat(tooltipItems.parsed.r.toPrecision(3))}`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[3].additional)[0]}: ${parseFloat(tooltipItems.dataset.data[3].additional[keys[0]].toPrecision(3))}`,
                                                    `collaborating or teamwork, discussion, asking for help`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[3].additional)[1]}: ${parseFloat(tooltipItems.dataset.data[3].additional[keys[1]].toPrecision(3))}`,
                                                    `when something is not clear, do a literature review for additional resources, but only textual sources`, ` `,
                                                    `${Object.keys(tooltipItems.dataset.data[3].additional)[2]}: ${parseFloat(tooltipItems.dataset.data[3].additional[keys[2]].toPrecision(3))}`,
                                                    `planning, organizing the learning environment to avoid possible distractions, positive mind`
                                            ]  
                                        }    
                                    },
                                }
                            }
                        }
                    },
                });
            } else {
                LISTchart = new Chart(ctx, {
                    type: 'boxplot',
                    data: {
                        labels: [
                            'Cognitive',
                            'Meta-Cognitive',
                            'Managing internal Resources',
                            'Managing external Resources'
                        ],
                        datasets: [{
                            label: label,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)', 
                            borderColor: borderColor, 
                            borderWidth: 1,
                            meanRadius: 0,
                            padding: 10,
                            itemRadius: 0,
                            data: numbersBoxplot,
                            hidden: hidden          
                        },
                        {
                            label: 'LIST-K Student Average',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)', 
                            borderWidth: 1,
                            outlierColor: 'rgba(54, 162, 235, 1)',
                            outlierBackgroundColor: 'rgba(54, 162, 235, 1)',
                            meanBorderColor:'rgba(0, 0, 0, 1)',
                            meanBackgroundColor:'rgba(0, 0, 0, 1)',
                            padding: 10,
                            itemRadius: 0,
                            data: LISTBoxplotData            
                        }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                              LISTchart.toBase64Image();
                            },
                        },
                        parsing: {
                            key: 'value'
                        },
                        indexAxis: 'y',
                        scales: {
                            r: {
                                min: 0,
                                max: 5,
                                beginAtZero: true,
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    title: function(tooltipItems) {
                                            return tooltipItems[0].label;
                                    },
                                    label: function(tooltipItems) {
                                        let datasetLabel = tooltipItems.dataset.label || '';
                                        if (datasetLabel == "LIST-K Student Average"){
                                            return `${datasetLabel}:    max: ${parseFloat(tooltipItems.parsed.max.toPrecision(3))}, min: ${parseFloat(tooltipItems.parsed.min.toPrecision(3))},   median: ${parseFloat(tooltipItems.parsed.median.toPrecision(3))}, mean: ${parseFloat(tooltipItems.parsed.mean.toPrecision(3))},   25% Percentile: ${parseFloat(tooltipItems.parsed.q1.toPrecision(3))}, 75% Percentile: ${parseFloat(tooltipItems.parsed.q3.toPrecision(3))}`;
                                        }
                                        else{
                                            return `${datasetLabel}:    ${parseFloat(tooltipItems.parsed.max.toPrecision(3))}`
                                        }
                                    },
                                    footer: function(tooltipItems){
                                        if (tooltipItems[0].label == "Cognitive"){
                                            return "Organizing (self-organizing, outline and notes preparation)\nElaborating (application-oriented, concrete examples, comparing with self experiences)\nCritical Review (self-questioning, critical approach, examine critically)\nRevision (memorize concepts with technical terms, by heart learn rules, technical terms, or formulas, by heart learning content from several resources as far as possible)";
                                        }
                                        else if (tooltipItems[0].label == "Meta-Cognitive"){
                                            return "Plans and targets (planning learning targets, planning the learning process)\nInspection (self-assessing the learned concepts, self-examining, self-reviewing the learned concepts)\nRegulating (self-regulating the learning strategy based on the situation like difficulty, realization of learning process etc.)"
                                        }
                                        else if (tooltipItems[0].label == "Managing internal Resources"){
                                            return "Attention (Management: the focus and concentration on learning content)\nEffort (Management: not giving up or dropping out to various circumstances like difficult learning concepts, etc. spending more time or extra effort when required)\nTime (Management: dedicated time plan for studying)"
                                        }
                                        else if (tooltipItems[0].label == "Managing external Resources"){
                                            return "Learning with fellow Students (collaborating or teamwork, discussion, asking for help)\nLiterature Review (when something is not clear, do a literature review for additional resources, but only textual sources)\nLearning Environment (planning, organizing the learning environment to avoid possible distractions, positive mind)"
                                        }
                                    }
                                }
                            }
                        }
                    },
                });
            }
        })
        .catch(error => console.error('Error loading LIST chart:', error));
    }

    studentSelect.dispatchEvent(new Event('change'));
});