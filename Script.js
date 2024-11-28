// Add event listeners for buttons on load
document.addEventListener("DOMContentLoaded", () => {
    // Add event listeners to each Save Shift button for each day
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
        document.querySelector(`button[onclick="saveShift('${day}')"]`).addEventListener("click", () => saveShift(day));
    });

    // Add event listener for the Download PDF button
    document.querySelector(".btn[onclick='downloadPDF()']").addEventListener("click", downloadPDF);
});

// Function to save shift data
function saveShift(day) {
    console.log(`Saving shifts for ${day}`);
    const date = document.getElementById(`${day}Date`).value;
    const shiftTable = document.getElementById("shiftEntries");
    const rowsToRemove = Array.from(shiftTable.rows).filter(row => row.dataset.day === day);
    rowsToRemove.forEach(row => shiftTable.removeChild(row)); // Clear old rows for the same day

    const shifts = [
        { start: document.getElementById(`${day}StartTime1`).value, end: document.getElementById(`${day}EndTime1`).value, type: document.getElementById(`${day}ShiftType1`).value },
        { start: document.getElementById(`${day}StartTime2`).value, end: document.getElementById(`${day}EndTime2`).value, type: document.getElementById(`${day}ShiftType2`).value },
        { start: document.getElementById(`${day}StartTime3`).value, end: document.getElementById(`${day}EndTime3`).value, type: document.getElementById(`${day}ShiftType3`).value },
        { start: document.getElementById(`${day}StartTime4`).value, end: document.getElementById(`${day}EndTime4`).value, type: document.getElementById(`${day}ShiftType4`).value }
    ];

    shifts.forEach((shift, index) => {
        if (shift.start && shift.end) {
            const start = new Date(`1970-01-01T${shift.start}Z`);
            const end = new Date(`1970-01-01T${shift.end}Z`);
            const hours = (end - start) / (1000 * 60 * 60); // Calculate total hours
            const row = shiftTable.insertRow();
            row.dataset.day = day;
            row.innerHTML = `
                <td>${date}</td>
                <td>${shift.start}</td>
                <td>${shift.end}</td>
                <td>${hours.toFixed(2)}</td>
                <td>${shift.type}</td>
            `;
        }
    });

    updateTotals();
}

function updateTotals() {
    const rows = document.getElementById("shiftEntries").rows;
    let totalHours = 0, sleepovers = 0, annualLeave = 0, personalLeave = 0;

    Array.from(rows).forEach(row => {
        const hours = parseFloat(row.cells[3].innerText);
        const type = row.cells[4].innerText;
        totalHours += hours;

        if (type === "sleepover") sleepovers++;
        if (type === "annual leave") annualLeave++;
        if (type === "personal leave") personalLeave++;
    });

    document.getElementById("weeklyTotal").innerText = `Weekly Total: ${totalHours.toFixed(2)} hours`;
    document.getElementById("biWeeklyTotal").innerText = `Sleepovers: ${sleepovers}, Annual Leave: ${annualLeave}, Personal Leave: ${personalLeave}`;
}


// Function to calculate total hours for each shift
function calculateHours(startTime, endTime) {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diff = (end - start) / (1000 * 60 * 60); // Convert milliseconds to hours
    return diff.toFixed(2);
}

// Function to download the shift list as a PDF
function downloadPDF() {
    console.log("Attempting to download PDF");  // Debugging log
    const shiftTable = document.getElementById("shiftList");
    const options = {
        margin: 0.5,
        filename: 'Support_Worker_Timesheet.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(options).from(shiftTable).save();
}
