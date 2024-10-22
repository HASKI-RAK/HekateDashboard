document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('averageUsageLernelementChartToggle').checked = false;
    document.getElementById('averageTimesLernelementChartToggle').checked = false;
    document.getElementById('timeSelect1').value = 'Seconds';
    document.getElementById('timeSelect2').value = 'Seconds';
    const checkboxes = document.querySelectorAll('input[name="filter"]');           
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
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

document.addEventListener("DOMContentLoaded", function() {
    let studentSelect = document.getElementById('studentSelect');
    let usagetoggle = document.getElementById("averageUsageLernelementChartToggle");
    let timestoggle = document.getElementById("averageTimesLernelementChartToggle");
    let customLegend1 = document.getElementById("customLegend1");
    let customLegend2 = document.getElementById("customLegend2");
    let timesselect1 = document.getElementById("timeSelect1");
    let timesselect2 = document.getElementById("timeSelect2");
    let averageUsageChartCanvas = document.getElementById("averageUsageChart");
    let UsageTimeChartCanvas = document.getElementById("averageUsageLernelementChart");
    let TotalRelativeUsageTimeChartCanvas = document.getElementById("relativeAverageUsageLernelementChart");
    let RelativeUsageTimeChartCanvas= document.getElementById("relativeUserUsageLernelementChart");
    let TotalTimesChartCanvas = document.getElementById("averageTimesChart");
    let TimesChartCanvas = document.getElementById("averageTimesLernelementChart");
    let TotalHeatmapChartCanvas = document.getElementById("heatmap");
    let HeatmapChartCanvas = document.getElementById("HeatmapChart");
    let Filter1 = document.getElementById('applyFilter1');
    let CategorySelect1 = document.getElementById('CategorySelect1');
    let Filter2 = document.getElementById('applyFilter2');
    let CategorySelect2 = document.getElementById('CategorySelect2');
    let Filter3 = document.getElementById('applyFilter3');
    let CategorySelect3 = document.getElementById('CategorySelect3');
   
    function fetch_data(csvString, csvString_LE, selectedLE){
        const rows = csvString.trim().split('\n'); // Split by lines
        rows.shift().split(','); // Get headers (comma separated)

        let learning_element_category = {};
        console.log(csvString_LE)
        if (csvString_LE != -1){
            const rows_LE = csvString_LE.trim().split('\n'); // Split by lines
            rows_LE.shift().split(','); // Get headers (comma separated)
            rows_LE.forEach(row => {
                const rowData = row.split(',');
                const Learning_Element = rowData[0];
                const Learning_Element_Category = rowData[1];
                if(!learning_element_category[Learning_Element]){
                    learning_element_category[Learning_Element] = Learning_Element_Category;
                }
            })
            console.log("Learning Element Categories: ", learning_element_category)
        }
        // Todo: Berechnung der total usage time und total times und total heatmap filtern nach den lernelementen die tatsächlich übergeben werden von selectedLE
        // Todo: Die Werte die gefiltert werden müssen sind: (activityTotalByUserID, BoxplotAverageScore), (totalTimesLearned, BoxplotTimesScore), heatmapDataOverall, heatmapDataByUserID

        // Initialize data structures
        let activityTotalByUserID = {};
        let activityByLearningElement = {};
        let UserIDs = [];
        let totalTimesLearned = {};
        let totalTimesLearnedLearningElement = {};
        let heatmapDataByUserID = {};
        const heatmapData = {};        
        // Process each row
        rows.forEach(row => {
            const rowData = row.split(',');
            const userID = rowData[1];
            if(!totalTimesLearned[userID]){
                totalTimesLearned[userID] = 0;
            }
            if (!UserIDs.includes(userID)) {
                UserIDs.push(userID); // Add userID to UserIDs array if not already present
            }
            if (rowData[0] !== "Activity_total"){
                //-----------------------------------------------------------------------------------------------------------------
                const timestamps = rowData.slice(2); // Array of timestamp strings
                
                // Calculate total activity duration  for the current row
                let totalActivity = 0;
                timestamps.forEach(timestampRange => {
                    const [startTimestamp, endTimestamp] = timestampRange.split('-').map(Number);
                    totalActivity += (endTimestamp - startTimestamp);
                    const startDate = new Date(startTimestamp * 1000);
        
                    // Extrahiere die Stunde und den Wochentag aus dem Startzeitpunkt
                    const startHour = startDate.getHours();
                    const startDay = startDate.getDay();

                    // Aktualisiere die Heatmap-Daten
                    if(!heatmapData[userID]){
                        heatmapData[userID] = []
                        for (let hour = 0; hour < 24; hour++) {
                            heatmapData[userID][hour] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
                        }
                    }
                    if (selectedLE.includes(learning_element_category[rowData[0]])){
                        heatmapData[userID][startHour][startDay] += 1;
                        totalTimesLearned[userID] += 1
                    }
                });
                // Update activity total for UserID
                if (!activityTotalByUserID[userID]) {
                    activityTotalByUserID[userID] = 0;
                }
                if (selectedLE.includes(learning_element_category[rowData[0]])){
                    activityTotalByUserID[userID] += totalActivity;
                }
                if(!heatmapDataByUserID[userID]){
                    heatmapDataByUserID[userID] = 0;
                }
                heatmapDataByUserID[userID] = heatmapData[userID];
                //-----------------------------------------------------------------------------------------------------------------
                const learningElement = rowData[0].split('_')[1]

                if (!totalTimesLearnedLearningElement[learningElement]) {
                    totalTimesLearnedLearningElement[learningElement] = {};
                }
                if(!totalTimesLearnedLearningElement[learningElement][userID]){
                    totalTimesLearnedLearningElement[learningElement][userID] = 0; 
                }
                timestamps.forEach(timestampRange => {
                    totalTimesLearnedLearningElement[learningElement][userID] += 1;
                });
                // Update activity for Learning Element (assuming only one Learning Element per row)
                if (!activityByLearningElement[learningElement]) {
                    activityByLearningElement[learningElement] = {};
                }
                if (!activityByLearningElement[learningElement][userID]) {
                    activityByLearningElement[learningElement][userID] = 0;
                }
                activityByLearningElement[learningElement][userID] += totalActivity;
            }
            
        });
        const heatmapDataOverall = {};
        const heatmapDataPlaceholder = {};
        for (let hour = 0; hour < 24; hour++) {
            heatmapDataOverall[hour] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
            heatmapDataPlaceholder[hour] = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        }
        // Summiere die Aktivitäten für alle Benutzer in heatmapDataOverall
        Object.keys(heatmapDataByUserID).forEach(userID => {
            const userHeatmap = heatmapDataByUserID[userID];
            for (let hour in userHeatmap) {
                if (userHeatmap.hasOwnProperty(hour)) {
                    for (let day in userHeatmap[hour]) {
                        if (userHeatmap[hour].hasOwnProperty(day)) {
                            heatmapDataOverall[hour][day] += userHeatmap[hour][day];
                        }
                    }
                }
            }
        });

        UserIDs = Object.keys(activityTotalByUserID);

        // Output the results (you can modify how you want to output or use these results)
        console.log("Activity Total by UserID:");
        console.log(activityTotalByUserID);
        console.log("Activity by Learning Element:");
        console.log(activityByLearningElement);
        console.log("User IDs: ")
        console.log(UserIDs);
        console.log("Total Times Learned")
        console.log(totalTimesLearned)
        console.log("Total Times Learned per Learning Element")
        console.log(totalTimesLearnedLearningElement)
        console.log("Heatmap Data by User ID: ")
        console.log(heatmapDataByUserID)
        console.log("Heatmap Data Overall: ")
        console.log(heatmapDataOverall)
        

        const learningElements = Object.keys(activityByLearningElement);
        console.log("Learning Elements: ")
        console.log(learningElements)
        const totalActivities = UserIDs.reduce((total, userId) => {
            return total + activityTotalByUserID[userId];
        }, 0);
        const totalTimes = UserIDs.reduce((times, userId) => {
            return times + totalTimesLearned[userId];
        }, 0);
        const averageTotalActivity = totalActivities / UserIDs.length;
        const averageTotalTimesLearned = totalTimes / UserIDs.length;
        let averageTimesByLearningElement = {};
        let averageTimesLearnedLearningElement = {};

        // Berechnung der Durchschnittszeiten für jedes Lernelement
        Object.keys(activityByLearningElement).forEach(learningElement => {
            const userIDs = Object.keys(activityByLearningElement[learningElement]);
            let totalActivityTime = 0;
            let totalTimesLearned = 0;

            userIDs.forEach(userID => {
                totalActivityTime += activityByLearningElement[learningElement][userID];
                totalTimesLearned += totalTimesLearnedLearningElement[learningElement][userID];
            });

            const averageActivityTime = totalActivityTime / userIDs.length;
            const averageTimesLearned = totalTimesLearned / userIDs.length;
            averageTimesByLearningElement[learningElement] = averageActivityTime;
            averageTimesLearnedLearningElement[learningElement] = averageTimesLearned;
        });

        const averageScore = [averageTotalActivity];
        const averageTimesScore = [averageTotalTimesLearned];
        let averageScoresLernelement = [];
        let TimesScoresLernelement = [];
        const userIDs = Object.keys(activityByLearningElement)
        userIDs.forEach((learningElement, index) => {
            averageScoresLernelement[index] = averageTimesByLearningElement[learningElement];
            TimesScoresLernelement[index] = averageTimesLearnedLearningElement[learningElement];
        });
        console.log("Average Usage Time: ")
        console.log(averageScore)
        console.log("Average Usage Time per Learning Element:")
        console.log(averageScoresLernelement)
        console.log("Average Times Learned: ")
        console.log(averageTimesScore)
        console.log("Average Times Learned per Learning Element")
        console.log(TimesScoresLernelement)

        // Boxplot Data
        let BoxplotTotal = [];
        let BoxplotTimes = [];
        let BoxplotLearningElement = [];
        let BoxplotTimesLearningElement = [];
        UserIDs.forEach((userID, userID_index) => {
            BoxplotTotal[userID_index] = activityTotalByUserID[userID]; 
            BoxplotTimes[userID_index] = totalTimesLearned[userID]   
        });
        
        let AverageDataPlaceholder = [];
        let TimesDataPlaceholder = [];
        let AverageBoxplotPlaceholder = [];
        let TimesBoxplotPlaceholder = [];
        let AverageLabels = [];
        learningElements.forEach((learningElement, learningElement_index) => {
            AverageDataPlaceholder[learningElement_index] = 0;
            TimesDataPlaceholder[learningElement_index] = 0;
            AverageBoxplotPlaceholder[learningElement_index] = [0];
            TimesBoxplotPlaceholder[learningElement_index] = [0];
            const key = ("Lernelement_" + learningElement)
            AverageLabels[learningElement_index] = "Lernelement " + learningElement + " (" + learning_element_category[key] + ")"
            BoxplotLearningElement[learningElement_index] = []
            BoxplotTimesLearningElement[learningElement_index] = []
            UserIDs.forEach((userID, userID_index) => {
                BoxplotLearningElement[learningElement_index][userID_index] = activityByLearningElement[learningElement][userID];
                BoxplotTimesLearningElement[learningElement_index][userID_index] = totalTimesLearnedLearningElement[learningElement][userID];
            });
        });

        const BoxplotAverageScore = [BoxplotTotal];
        const BoxplotTimesScore = [BoxplotTimes];
        let BoxplotAverageScoresLernelement = [];
        let BoxplotTimesScoresLernelement = [];
        for(let i = 0; i<BoxplotLearningElement.length; i++){
            BoxplotAverageScoresLernelement[i] = BoxplotLearningElement[i];
        }
        for(let i = 0; i<BoxplotTimesLearningElement.length; i++){
            BoxplotTimesScoresLernelement[i] = BoxplotTimesLearningElement[i];
        }
        console.log("Boxplot Usage Time: ")
        console.log(BoxplotAverageScore)
        console.log("Boxplot Usage Time per Learning Element:")
        console.log(BoxplotAverageScoresLernelement)
        console.log("Boxplot Times Learned: ")
        console.log(BoxplotTimesScore)
        console.log("Boxplot Times Learned per Learning Element:")
        console.log(BoxplotTimesScoresLernelement)

        const totalDuration = averageScoresLernelement.reduce((acc, val) => acc + val, 0);
        const relativeDurations = averageScoresLernelement.map(score => (score / totalDuration * 100).toFixed(2));
        let relativeDurationsPlaceholder = []
        for(let i = 0; i<relativeDurations.length; i++){
            relativeDurationsPlaceholder[i] = "0"
        }

        const heatmapLabels = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
        const heatmapHours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

        // Beispielhafte Daten, die in die Heatmap eingefügt werden sollen
        const heatmapDataArray = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let day = 0; day < 7; day++) {
                heatmapDataArray.push({
                    x: heatmapHours[hour],
                    y: heatmapLabels[day],
                    v: heatmapDataOverall[hour][day]
                });
            }
        }
        const heatmapDataPlaceholderArray = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let day = 0; day < 7; day++) {
                heatmapDataPlaceholderArray.push({
                    x: heatmapHours[hour],
                    y: heatmapLabels[day],
                    v: heatmapDataPlaceholder[hour][day]
                });
            }
        }

        const DATA = new Object();
        DATA.ID = UserIDs;
        DATA.activityTotalByUserID = activityTotalByUserID;
        DATA.BoxplotAverageScore = BoxplotAverageScore;
        DATA.learningElements = learningElements;
        DATA.activityByLearningElement = activityByLearningElement;
        DATA.AverageLabels = AverageLabels;
        DATA.averageScoresLernelement = averageScoresLernelement;
        DATA.BoxplotAverageScoresLernelement = BoxplotAverageScoresLernelement;
        DATA.relativeDurations = relativeDurations;
        DATA.totalTimesLearned = totalTimesLearned;
        DATA.BoxplotTimesScore = BoxplotTimesScore;
        DATA.totalTimesLearnedLearningElement = totalTimesLearnedLearningElement;
        DATA.TimesScoresLernelement = TimesScoresLernelement;
        DATA.BoxplotTimesScoresLernelement = BoxplotTimesScoresLernelement;
        DATA.heatmapDataArray = heatmapDataArray;
        DATA.heatmapHours = heatmapHours;
        DATA.heatmapLabels = heatmapLabels;
        DATA.heatmapDataPlaceholderArray = heatmapDataPlaceholderArray;
        DATA.heatmapDataByUserID = heatmapDataByUserID;
        return DATA
    }

    fetch("../data/user_activity_data.csv")
    .then(response => response.text())
    .then(csvString => {
        const selectedLEC = ['MS', 'LG', 'BO', 'EX', 'QU', 'SU', 'AAM', 'TAM', 'VAM']
        const DATA = fetch_data(csvString, -1, selectedLEC);
        DATA.ID.forEach(row => {
            const fieldValue = row;
            const option = document.createElement('option');
            option.textContent = fieldValue;
            option.value = fieldValue; // Setze den Wert des Options-Elements auf den Index des Datensatzes
            studentSelect.appendChild(option);
        });
    });

    let TotalUsageTimeChart;
    let UsageTimeChart;
    let TotalRelativeUsageTimeChart;
    let RelativeUsageTimeChart;
    let TotalTimesChart;
    let TimesChart;
    let TotalHeatmapChart;
    let HeatmapChart;

    usagetoggle.addEventListener("change", function () {
        let selectedStudentId = studentSelect.value;
        let chartType = usagetoggle.checked ? 'boxplot' : 'barplot';
        customLegend1.style.display = chartType === 'boxplot' ? 'block' : 'none';
        let selectedUnit = timesselect2.value;
        loadUsageTimeChart(selectedStudentId, chartType, selectedUnit);
    });

    timestoggle.addEventListener("change", function () {
        let selectedStudentId = studentSelect.value;
        let chartType = timestoggle.checked ? 'boxplot' : 'barplot';
        customLegend2.style.display = chartType === 'boxplot' ? 'block' : 'none';
        loadTimesChart(selectedStudentId, chartType);
    });

    timesselect1.addEventListener("change", function () {
        let selectedUnit = this.value;
        let selectedStudentId = studentSelect.value;
        let formData1 = new FormData(CategorySelect1);
        let selectedFilters1 = formData1.getAll('filter');
        loadTotalUsageTimeChart(selectedStudentId, selectedUnit, selectedFilters1)
    });

    timesselect2.addEventListener("change", function () {
        let selectedUnit = this.value;
        let selectedStudentId = studentSelect.value;
        let selectedusageToggleState = usagetoggle.checked ? 'boxplot' : 'barplot';
        loadUsageTimeChart(selectedStudentId, selectedusageToggleState, selectedUnit);
    });

    studentSelect.addEventListener('change', function () {
        let selectedStudentId = studentSelect.value;
        let usageToggleState = usagetoggle.checked ? 'boxplot' : 'barplot';
        let timesToggleState = timestoggle.checked ? 'boxplot' : 'barplot';
        let selectedUnit1 = timesselect1.value;
        let selectedUnit2 = timesselect2.value;
        let formData1 = new FormData(CategorySelect1);
        let selectedFilters1 = formData1.getAll('filter');
        let formData2 = new FormData(CategorySelect2);
        let selectedFilters2 = formData2.getAll('filter');
        let formData3 = new FormData(CategorySelect3);
        let selectedFilters3 = formData3.getAll('filter');
        loadTotalUsageTimeChart(selectedStudentId, selectedUnit1, selectedFilters1);
        loadUsageTimeChart(selectedStudentId, usageToggleState, selectedUnit2);
        loadTotalRelativeUsageTimeChart(selectedStudentId);
        loadRelativeUsageTimeChart(selectedStudentId);
        loadTotalTimesChart(selectedStudentId, selectedFilters2);
        loadTimesChart(selectedStudentId, timesToggleState);
        loadTotalHeatmapChart(selectedStudentId, selectedFilters3);
        loadHeatmapChart(selectedStudentId, selectedFilters3);
    });

    document.getElementById('downloadGesamtnutzungsdauerChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = TotalUsageTimeChart.toBase64Image();
            a.download = 'Gesamtnutzungsdauer.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadNutzungsdauerChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = UsageTimeChart.toBase64Image();
            a.download = 'Nutzungsdauer.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadRelativeDurchschnittlicheNutzungsdauerChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = TotalRelativeUsageTimeChart.toBase64Image();
            a.download = 'RelativeGesamtNutzungsdauer.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadRelativeNutzungsdauerChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = RelativeUsageTimeChart.toBase64Image();
            a.download = 'RelativeNutzungsdauer.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadGesamtanzahlChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = TotalTimesChart.toBase64Image();
            a.download = 'Gesamtanzahl.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadAnzahlChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = TimesChart.toBase64Image();
            a.download = 'Anzahl.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadGesamttageszeitChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = TotalHeatmapChart.toBase64Image();
            a.download = 'Gesamttageszeit.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    document.getElementById('downloadTageszeitChart').addEventListener('click', function() {
        try {
            var a = document.createElement('a');
            a.href = HeatmapChart.toBase64Image();
            a.download = 'Tageszeit.png';
            a.click();
        } catch (error) {
            console.error('Error generating or downloading PNG:', error);
        }
    });

    Filter1.addEventListener('click', function() {
        let selectedUnit1 = timesselect1.value;
        let selectedStudentId = studentSelect.value;
        let formData = new FormData(CategorySelect1);
        let selectedFilters = formData.getAll('filter');
        loadTotalUsageTimeChart(selectedStudentId, selectedUnit1, selectedFilters);
    });

    Filter2.addEventListener('click', function() {
        let selectedStudentId = studentSelect.value;
        let formData = new FormData(CategorySelect2);
        let selectedFilters = formData.getAll('filter');
        loadTotalTimesChart(selectedStudentId, selectedFilters);
    });

    Filter3.addEventListener('click', function() {
        let selectedStudentId = studentSelect.value;
        let formData = new FormData(CategorySelect3);
        let selectedFilters = formData.getAll('filter');
        loadTotalHeatmapChart(selectedStudentId, selectedFilters);
        loadHeatmapChart(selectedStudentId, selectedFilters);
    });

    function loadTotalUsageTimeChart(studentId, selectedUnit, selectedFilters){
        if (TotalUsageTimeChart) {
            TotalUsageTimeChart.destroy();
        }
        if (studentId === 'x') return;
        fetch("../data/user_activity_data.csv")
        .then(response => response.text())
        .then(csvString1 => {
            fetch("../data/learning_element_category.csv")
            .then(response => response.text())
            .then(csvString2 => {
                const DATA = fetch_data(csvString1, csvString2, selectedFilters);
                // hier daten updaten
                let numbers = [];

                if (studentId == "x") {
                    numbers = [0];
                } else {
                    numbers = [DATA.activityTotalByUserID[studentId]];
                }

                let Data1 = [];
                let Data2 = [];
                DATA.BoxplotAverageScore[0].forEach((Element, index) => {
                    if(selectedUnit === "Minutes"){
                        Data1[index] = Element / 60;
                    } 
                    else if(selectedUnit === "Hours"){
                        Data1[index] = Element / 3600;
                    }
                    else{
                        Data1[index] = Element;
                    }
                })
                numbers.forEach((Element, index) => {
                    if(selectedUnit === "Minutes"){
                        Data2[index] = Element / 60;
                    } 
                    else if(selectedUnit === "Hours"){
                        Data2[index] = Element / 3600;
                    }
                    else{
                        Data2[index] = Element;
                    }
                })

                const borderColor = (studentId === "x") ? 'rgba(63, 191, 127, 0)' : 'rgba(63, 191, 127, 1)';      
                const label = (studentId === "x") ? 'Nutzungsaktivitaet' : 'Nutzungsaktivitaet Student ID ' + studentId;
                const hidden = (studentId === "x");

                // hier Diagramm erstellen
                let ctx = averageUsageChartCanvas.getContext('2d');
                TotalUsageTimeChart = new Chart(ctx, {
                    type: 'boxplot',
                    data: {
                        // define label tree
                        labels: ["Total Activity"],
                        datasets: [{
                                label: 'Durchschnittliche Nutzungsaktivitaet',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Hintergrundfarbe für Datensatz 2
                                borderColor: 'rgba(54, 162, 235, 1)', // Randfarbe für Datensatz 2
                                borderWidth: 1,
                                outlierColor: 'rgba(54, 162, 235, 1)',
                                outlierBackgroundColor: 'rgba(54, 162, 235, 1)',
                                meanBorderColor: 'rgba(0, 0, 0, 1)',
                                meanBackgroundColor: 'rgba(0, 0, 0, 1)',
                                padding: 10,
                                itemRadius: 0,
                                data: [Data1],          
                            },
                            {
                                label: label,
                                backgroundColor: 'rgba(63, 191, 127, 0.2)',
                                borderColor: borderColor,
                                borderWidth: 1,
                                meanRadius: 0,
                                padding: 10,
                                itemRadius: 0,
                                data: [Data2],
                                hidden: hidden          
                            }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                            TotalUsageTimeChart.toBase64Image();
                            },
                        },
                        indexAxis: 'y',
                        responsive: true, 
                        legend: {
                        position: 'top',
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: selectedUnit
                                }
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
                                        if (datasetLabel == "Durchschnittliche Nutzungsaktivitaet"){
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
            })
        })
    }

    function loadUsageTimeChart(studentId, chartType, selectedUnit){
        if (UsageTimeChart) {
            UsageTimeChart.destroy();
        }
        if (studentId === 'x') return;

        fetch("../data/user_activity_data.csv")
        .then(response => response.text())
        .then(csvString => {
            fetch("../data/learning_element_category.csv")
            .then(response => response.text())
            .then(csvString2 => {
                const selectedLEC = ['MS', 'LG', 'BO', 'EX', 'QU', 'SU', 'AAM', 'TAM', 'VAM']
                const DATA = fetch_data(csvString, csvString2, selectedLEC);
                // hier Daten updaten
                let numbers = [];           
                if (studentId == "x") {
                    DATA.learningElements.forEach((element, index) => {
                        numbers[index] = 0;
                    })
                } else {
                    DATA.learningElements.forEach((learningElement, learningElement_index) => {
                        numbers[learningElement_index] = DATA.activityByLearningElement[learningElement][studentId];
                    })
                }
                
                let numbersBoxplot = numbers.map(num => [num]);

                let Data1 = [];
                let Data2 = [];
                let Data3 = [];
                let Data4 = [];
                DATA.averageScoresLernelement.forEach((Element, index) => {
                    if(selectedUnit === "Minutes"){
                        Data1[index] = Element / 60;
                    } 
                    else if(selectedUnit === "Hours"){
                        Data1[index] = Element / 3600;
                    }
                    else{
                        Data1[index] = Element;
                    }
                })
                numbers.forEach((Element, index) => {
                    if(selectedUnit === "Minutes"){
                        Data2[index] = Element / 60;
                    } 
                    else if(selectedUnit === "Hours"){
                        Data2[index] = Element / 3600;
                    }
                    else{
                        Data2[index] = Element;
                    }
                })

                DATA.BoxplotAverageScoresLernelement.forEach((outerElement, index) => {
                    Data3[index] = [];
                    outerElement.forEach((Element, index2) => {
                        if(selectedUnit === "Minutes"){
                            Data3[index][index2] = Element / 60;
                        } 
                        else if(selectedUnit === "Hours"){
                            Data3[index][index2] = Element / 3600;
                        }
                        else{
                            Data3[index][index2] = Element;
                        }
                    })                
                })
                numbersBoxplot.forEach((outerElement, index) => {
                    Data4[index] = [];
                    outerElement.forEach((Element, index2) => {
                        if(selectedUnit === "Minutes"){
                            Data4[index][index2] = Element / 60;
                        } 
                        else if(selectedUnit === "Hours"){
                            Data4[index][index2] = Element / 3600;
                        }
                        else{
                            Data4[index][index2] = Element;
                        }
                    })
                })

                const borderColor = (studentId === "x") ? 'rgba(63, 191, 127, 0)' : 'rgba(63, 191, 127, 1)';      
                const label = (studentId === "x") ? 'Nutzungsaktivitaet' : 'Nutzungsaktivitaet Student ID ' + studentId;
                const hidden = (studentId === "x");

                // hier Diagramm erstellen
                let ctx = UsageTimeChartCanvas.getContext('2d');
                if (chartType === 'barplot') {
                    UsageTimeChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: DATA.AverageLabels,
                            datasets: [{
                                label: 'Durchschnittliche Nutzungsaktivitaet',
                                data: Data1,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                                yAxisID: 'y', // Verweist auf die linke y-Achse
                            },
                            {
                                label: label,
                                data: Data2,
                                backgroundColor: 'rgba(63, 191, 127, 0.2)',
                                borderColor: 'rgba(63, 191, 127, 1)',
                                borderWidth: 1,
                                hidden: hidden,
                                yAxisID: 'y', // Verweist auf die linke y-Achse
                            }]
                        },
                        options: {
                            animation: {
                                onComplete: function () {
                                UsageTimeChart.toBase64Image();
                                },
                            },
                            scales: {
                                y: {
                                    type: 'linear',
                                    position: 'left',
                                    title: {
                                        display: true,
                                        text: selectedUnit
                                    }
                                }
                            }
                        }
                    });
                } else {
                    UsageTimeChart = new Chart(ctx, {
                        type: 'boxplot',
                        data: {
                            // define label tree
                            labels: DATA.AverageLabels,
                            datasets: [{
                                    label: 'Durchschnittliche Nutzungsaktivitaet',
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Hintergrundfarbe für Datensatz 2
                                    borderColor: 'rgba(54, 162, 235, 1)', // Randfarbe für Datensatz 2
                                    borderWidth: 1,
                                    outlierColor: 'rgba(54, 162, 235, 1)',
                                    outlierBackgroundColor: 'rgba(54, 162, 235, 1)',
                                    meanBorderColor: 'rgba(0, 0, 0, 1)',
                                    meanBackgroundColor: 'rgba(0, 0, 0, 1)',
                                    padding: 10,
                                    itemRadius: 0,
                                    data: Data3,          
                                },
                                {
                                    label: label,
                                    backgroundColor: 'rgba(63, 191, 127, 0.2)',
                                    borderColor: borderColor,
                                    borderWidth: 1,
                                    meanRadius: 0,
                                    padding: 10,
                                    itemRadius: 0,
                                    data: Data4,
                                    hidden: hidden          
                                }]
                        },
                        options: {
                            animation: {
                                onComplete: function () {
                                UsageTimeChart.toBase64Image();
                                },
                            },
                            responsive: true,
                            legend: {
                            position: 'top',
                            },
                            scales: {
                                y: {
                                    title: {
                                        display: true,
                                        text: selectedUnit
                                    }
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
                                            if (datasetLabel == "Durchschnittliche Nutzungsaktivitaet"){
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
        })
    }

    function loadTotalRelativeUsageTimeChart(studentId){
        if (TotalRelativeUsageTimeChart) {
            TotalRelativeUsageTimeChart.destroy();
        }
        if (studentId === 'x') return;

        fetch("../data/user_activity_data.csv")
        .then(response => response.text())
        .then(csvString => {
            fetch("../data/learning_element_category.csv")
            .then(response => response.text())
            .then(csvString2 => {
                const selectedLEC = ['MS', 'LG', 'BO', 'EX', 'QU', 'SU', 'AAM', 'TAM', 'VAM']
                const DATA = fetch_data(csvString, csvString2, selectedLEC);
                // hier Chart erstellen
                let ctx = TotalRelativeUsageTimeChartCanvas.getContext('2d');
                TotalRelativeUsageTimeChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: DATA.AverageLabels, // Labels für die einzelnen Segmente
                        datasets: [{
                            label: 'Relative Dauer der Lernelemente (%)',
                            data: DATA.relativeDurations, // Relative Dauer in Prozent
                            backgroundColor: [
                                'rgba(54, 162, 235, 0.2)',   // Blau
                                'rgba(63, 191, 127, 0.2)',   // Grün
                                'rgba(255, 206, 86, 0.2)',   // Gelb
                                'rgba(75, 192, 192, 0.2)',   // Türkis
                                'rgba(153, 102, 255, 0.2)',  // Lila
                                'rgba(255, 99, 132, 0.2)',   // Rot
                                'rgba(255, 159, 64, 0.2)',   // Orange
                                'rgba(199, 199, 199, 0.2)',  // Grau
                                'rgba(255, 87, 51, 0.2)',    // Koralle
                                'rgba(0, 123, 255, 0.2)'     // Dunkelblau
                            ],
                            borderColor: [
                                'rgba(54, 162, 235, 1)',     // Blau
                                'rgba(63, 191, 127, 1)',     // Grün
                                'rgba(255, 206, 86, 1)',     // Gelb
                                'rgba(75, 192, 192, 1)',     // Türkis
                                'rgba(153, 102, 255, 1)',    // Lila
                                'rgba(255, 99, 132, 1)',     // Rot
                                'rgba(255, 159, 64, 1)',     // Orange
                                'rgba(199, 199, 199, 1)',    // Grau
                                'rgba(255, 87, 51, 1)',      // Koralle
                                'rgba(0, 123, 255, 1)'       // Dunkelblau
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                            TotalRelativeUsageTimeChart.toBase64Image();
                            },
                        },
                        legend: {
                            display: false
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                                tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        label += context.raw + '%'; // Fügt die Prozentzahl zum Tooltip hinzu
                                        return label;
                                    }
                                }
                            },
                            datalabels: {
                                color: 'rgba(0, 0, 0, 0.7)', // Farbe der Beschriftung
                                formatter: function(value, context) {
                                    return context.chart.data.labels[context.dataIndex]; // Zeigt den Label-Namen an
                                },
                                font: {
                                    weight: 'light',
                                    size: 5
                                },
                                anchor: 'end', // Verankert das Label am Ende des Segments
                                //align: 'end', // Richtet das Label außerhalb des Segments aus
                                offset: 10  
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Aktiviert das Data Labels Plugin
                })
            })
        })
    }

    function loadRelativeUsageTimeChart(studentId){
        if (RelativeUsageTimeChart) {
            RelativeUsageTimeChart.destroy();
        }
        if (studentId === 'x') return;

        fetch("../data/user_activity_data.csv")
        .then(response => response.text())
        .then(csvString => {
            fetch("../data/learning_element_category.csv")
            .then(response => response.text())
            .then(csvString2 => {
                const selectedLEC = ['MS', 'LG', 'BO', 'EX', 'QU', 'SU', 'AAM', 'TAM', 'VAM']
                const DATA = fetch_data(csvString, csvString2, selectedLEC);
                // hier Daten updaten
                let ScoresLernelement = [];
                let relativeDurationsStudent = [];
                if (studentId == "x") {
                    DATA.learningElements.forEach((element, index) => {
                        relativeDurationsStudent[index] = 0;    //relativeDurationsStudentPlaceholder
                    })
                } else {
                    DATA.learningElements.forEach((Lernelement, index) => {
                        ScoresLernelement[index] = DATA.activityByLearningElement[Lernelement][studentId]
                    })
                    const totalDurationStudent = ScoresLernelement.reduce((acc, val) => acc + val, 0);
                    relativeDurationsStudent = ScoresLernelement.map(score => (score / totalDurationStudent * 100).toFixed(2));
                }
        
                // hier Chart erstellen
                let ctx = RelativeUsageTimeChartCanvas.getContext('2d');
                RelativeUsageTimeChart = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: DATA.AverageLabels, // Labels für die einzelnen Segmente
                        datasets: [{
                            label: 'Relative Dauer der Lernelemente (%)',
                            data: relativeDurationsStudent, // Relative Dauer in Prozent
                            backgroundColor: [
                                'rgba(54, 162, 235, 0.2)',   // Blau
                                'rgba(63, 191, 127, 0.2)',   // Grün
                                'rgba(255, 206, 86, 0.2)',   // Gelb
                                'rgba(75, 192, 192, 0.2)',   // Türkis
                                'rgba(153, 102, 255, 0.2)',  // Lila
                                'rgba(255, 99, 132, 0.2)',   // Rot
                                'rgba(255, 159, 64, 0.2)',   // Orange
                                'rgba(199, 199, 199, 0.2)',  // Grau
                                'rgba(255, 87, 51, 0.2)',    // Koralle
                                'rgba(0, 123, 255, 0.2)'     // Dunkelblau
                            ],
                            borderColor: [
                                'rgba(54, 162, 235, 1)',     // Blau
                                'rgba(63, 191, 127, 1)',     // Grün
                                'rgba(255, 206, 86, 1)',     // Gelb
                                'rgba(75, 192, 192, 1)',     // Türkis
                                'rgba(153, 102, 255, 1)',    // Lila
                                'rgba(255, 99, 132, 1)',     // Rot
                                'rgba(255, 159, 64, 1)',     // Orange
                                'rgba(199, 199, 199, 1)',    // Grau
                                'rgba(255, 87, 51, 1)',      // Koralle
                                'rgba(0, 123, 255, 1)'       // Dunkelblau
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                            RelativeUsageTimeChart.toBase64Image();
                            },
                        },
                        legend: {
                            display: false
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                                tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        label += context.raw + '%'; // Fügt die Prozentzahl zum Tooltip hinzu
                                        return label;
                                    }
                                }
                            },
                            datalabels: {
                                color: 'rgba(0, 0, 0, 0.7)', // Farbe der Beschriftung
                                formatter: function(value, context) {
                                    return context.chart.data.labels[context.dataIndex]; // Zeigt den Label-Namen an
                                },
                                font: {
                                    weight: 'light',
                                    size: 5
                                },
                                anchor: 'end', // Verankert das Label am Ende des Segments
                                //align: 'end', // Richtet das Label außerhalb des Segments aus
                                offset: 10  
                            }
                        }
                    },
                    plugins: [ChartDataLabels] // Aktiviert das Data Labels Plugin
                })
            })
        })
    }

    function loadTotalTimesChart(studentId, selectedFilters){
        if (TotalTimesChart) {
            TotalTimesChart.destroy();
        }
        if (studentId === 'x') return;

        fetch("../data/user_activity_data.csv")
        .then(response => response.text())
        .then(csvString1 => {
            fetch("../data/learning_element_category.csv")
            .then(response => response.text())
            .then(csvString2 => {
                const DATA = fetch_data(csvString1, csvString2, selectedFilters);
                // hier daten updaten
                let numbers = [];
                let selectedRow = 0;

                if (studentId == "x") {
                    numbers = [0];
                } else {
                    numbers = [DATA.totalTimesLearned[studentId]];
                }

                const borderColor = (studentId === "x") ? 'rgba(63, 191, 127, 0)' : 'rgba(63, 191, 127, 1)';      
                const label = (studentId === "x") ? 'Anzahl der Lernphasen' : 'Anzahl der Lernphasen Student ID ' + studentId;
                const hidden = (studentId === "x");

                // hier Diagramm erstellen
                let ctx = TotalTimesChartCanvas.getContext('2d');
                TotalTimesChart = new Chart(ctx, {
                    type: 'boxplot',
                    data: {
                        // define label tree
                        labels: ["Total Times Learned"],
                        datasets: [{
                                label: 'Durchschnittliche Anzahl der Lernphasen',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Hintergrundfarbe für Datensatz 2
                                borderColor: 'rgba(54, 162, 235, 1)', // Randfarbe für Datensatz 2
                                borderWidth: 1,
                                outlierColor: 'rgba(54, 162, 235, 1)',
                                outlierBackgroundColor: 'rgba(54, 162, 235, 1)',
                                meanBorderColor: 'rgba(0, 0, 0, 1)',
                                meanBackgroundColor: 'rgba(0, 0, 0, 1)',
                                padding: 10,
                                itemRadius: 0,
                                data: DATA.BoxplotTimesScore,          
                            },
                            {
                                label: label,
                                backgroundColor: 'rgba(63, 191, 127, 0.2)',
                                borderColor: borderColor,
                                borderWidth: 1,
                                meanRadius: 0,
                                padding: 10,
                                itemRadius: 0,
                                data: [numbers],
                                hidden: hidden          
                            }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                            TotalTimesChart.toBase64Image();
                            },
                        },
                        indexAxis: 'y',
                        responsive: true, 
                        legend: {
                        position: 'top',
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
                                        if (datasetLabel == "Durchschnittliche Anzahl der Lernphasen"){
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
            })
        })
    }

    function loadTimesChart(studentId, chartType){
        if (TimesChart) {
            TimesChart.destroy();
        }
        if (studentId === 'x') return;

        fetch("../data/user_activity_data.csv")
        .then(response => response.text())
        .then(csvString => {
            fetch("../data/learning_element_category.csv")
            .then(response => response.text())
            .then(csvString2 => {
                const selectedLEC = ['MS', 'LG', 'BO', 'EX', 'QU', 'SU', 'AAM', 'TAM', 'VAM']
                const DATA = fetch_data(csvString, csvString2, selectedLEC);
                // hier Daten updaten
                let numbers = [];          
                if (studentId == "x") {
                    DATA.learningElements.forEach((element, index) => {
                        numbers[index] = 0; //TimesDataPlaceholder
                    })
                } else {
                    DATA.learningElements.forEach((learningElement, learningElement_index) => {
                        numbers[learningElement_index] = DATA.totalTimesLearnedLearningElement[learningElement][studentId];
                    })
                }
                
                let numbersBoxplot = numbers.map(num => [num]);

                const borderColor = (studentId === "x") ? 'rgba(63, 191, 127, 0)' : 'rgba(63, 191, 127, 1)';      
                const label = (studentId === "x") ? 'Anzahl der Lernphasen' : 'Anzahl der Lernphasen Student ID ' + studentId;
                const hidden = (studentId === "x");

                // hier Diagramm erstellen
                let ctx = TimesChartCanvas.getContext('2d');
                if (chartType === 'barplot') {
                    TimesChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: DATA.AverageLabels,
                            datasets: [{
                                label: 'Durchschnittliche Anzahl an Lernphasen',
                                data: DATA.TimesScoresLernelement,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                                yAxisID: 'y', // Verweist auf die linke y-Achse
                            },
                            {
                                label: label,
                                data: numbers,
                                backgroundColor: 'rgba(63, 191, 127, 0.2)',
                                borderColor: 'rgba(63, 191, 127, 1)',
                                borderWidth: 1,
                                hidden: hidden,
                                yAxisID: 'y', // Verweist auf die linke y-Achse
                            }]
                        },
                        options: {
                            animation: {
                                onComplete: function () {
                                TimesChart.toBase64Image();
                                },
                            },
                            scales: {
                                y: {
                                    type: 'linear',
                                    position: 'left',
                                }
                            }
                        }
                    });
                } else {
                    TimesChart = new Chart(ctx, {
                        type: 'boxplot',
                        data: {
                            // define label tree
                            labels: DATA.AverageLabels,
                            datasets: [{
                                    label: 'Durchschnittliche Anzahl an Lernphasen',
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)', // Hintergrundfarbe für Datensatz 2
                                    borderColor: 'rgba(54, 162, 235, 1)', // Randfarbe für Datensatz 2
                                    borderWidth: 1,
                                    outlierColor: 'rgba(54, 162, 235, 1)',
                                    outlierBackgroundColor: 'rgba(54, 162, 235, 1)',
                                    meanBorderColor: 'rgba(0, 0, 0, 1)',
                                    meanBackgroundColor: 'rgba(0, 0, 0, 1)',
                                    padding: 10,
                                    itemRadius: 0,
                                    data: DATA.BoxplotTimesScoresLernelement,          
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
                                TimesChart.toBase64Image();
                                },
                            },
                            responsive: true,
                            legend: {
                            position: 'top',
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
                                            if (datasetLabel == "Durchschnittliche Anzahl an Lernphasen"){
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
        })
    }

    function loadTotalHeatmapChart(studentId, selectedFilters){
        if (TotalHeatmapChart) {
            TotalHeatmapChart.destroy();
        }
        if (studentId === 'x') return;
        fetch("../data/user_activity_data.csv")
        .then(response => response.text())
        .then(csvString1 => {
            fetch("../data/learning_element_category.csv")
            .then(response => response.text())
            .then(csvString2 => {
                const DATA = fetch_data(csvString1, csvString2, selectedFilters);

                //hier Chart erstellen
                let ctx = TotalHeatmapChartCanvas.getContext('2d');
                TotalHeatmapChart = new Chart(ctx, {
                    type: 'matrix',
                    data: {
                        datasets: [{
                            label: 'Heatmap der Lernaktivitäten',
                            data: DATA.heatmapDataArray,
                            backgroundColor: function(context) {
                                const value = context.dataset.data[context.dataIndex].v;
                                const alpha = value / 10; // Passe die Alpha-Komponente basierend auf der Häufigkeit an
                                return `rgba(54, 162, 235, ${alpha})`;
                            },
                            borderWidth: 1,
                            width: ({ chart }) => (chart.chartArea || {}).width / 24 - 1,
                            height: ({ chart }) => (chart.chartArea || {}).height / 7 - 1,
                        }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                            TotalHeatmapChart.toBase64Image();
                            },
                        },
                        legend: {
                            display: false
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'category',
                                labels: DATA.heatmapHours,
                                title: {
                                    display: true,
                                    text: 'Tageszeit (Stunden)'
                                }
                            },
                            y: {
                                type: 'category',
                                labels: DATA.heatmapLabels,
                                title: {
                                    display: true,
                                    text: 'Wochentag'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const data = context.dataset.data[context.dataIndex];
                                        return `Haeufigkeit: ${data.v}`;
                                    }
                                }
                            }
                        }
                    }
                })
            })
        })
    }

    function loadHeatmapChart(studentId, selectedFilters){
        if (HeatmapChart) {
            HeatmapChart.destroy();
        }
        if (studentId === 'x') return;
        fetch("../data/user_activity_data.csv")
        .then(response => response.text())
        .then(csvString1 => {
            fetch("../data/learning_element_category.csv")
            .then(response => response.text())
            .then(csvString2 => {
                const DATA = fetch_data(csvString1, csvString2, selectedFilters);
                // hier Daten updaten
                let heatmapData = [];
                
                if (studentId == "x") {
                    numbers = DATA.heatmapDataPlaceholderArray;
                } else {
                    for (let hour = 0; hour < 24; hour++) {
                        for (let day = 0; day < 7; day++) {
                            heatmapData.push({
                                x: DATA.heatmapHours[hour],
                                y: DATA.heatmapLabels[day],
                                v: DATA.heatmapDataByUserID[studentId][hour][day]
                            });
                        }
                    }
                }

                // hier Chart erstellen
                let ctx = HeatmapChartCanvas.getContext('2d');
                HeatmapChart = new Chart(ctx, {
                    type: 'matrix',
                    data: {
                        datasets: [{
                            label: 'Heatmap der Lernaktivitäten',
                            data: heatmapData,
                            backgroundColor: function(context) {
                                const value = context.dataset.data[context.dataIndex].v;
                                const alpha = value / 10; // Passe die Alpha-Komponente basierend auf der Häufigkeit an
                                return `rgba(54, 162, 235, ${alpha})`;
                            },
                            borderWidth: 1,
                            width: ({ chart }) => (chart.chartArea || {}).width / 24 - 1,
                            height: ({ chart }) => (chart.chartArea || {}).height / 7 - 1,
                        }]
                    },
                    options: {
                        animation: {
                            onComplete: function () {
                            HeatmapChart.toBase64Image();
                            },
                        },
                        legend: {
                            display: false
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                type: 'category',
                                labels: DATA.heatmapHours,
                                title: {
                                    display: true,
                                    text: 'Tageszeit (Stunden)'
                                }
                            },
                            y: {
                                type: 'category',
                                labels: DATA.heatmapLabels,
                                title: {
                                    display: true,
                                    text: 'Wochentag'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const data = context.dataset.data[context.dataIndex];
                                        return `Haeufigkeit: ${data.v}`;
                                    }
                                }
                            }
                        }
                    }
                })
            })
        })
    }

    studentSelect.dispatchEvent(new Event('change'));
});