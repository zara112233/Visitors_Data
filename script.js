document.addEventListener("DOMContentLoaded", loadJSON);
let jsonData = [];

// ✅ Load JSON File & Populate Table
async function loadJSON() {
    try {
        const response = await fetch("https://raw.githubusercontent.com/zara112233/Visitors_Data/main/Data_Analyst.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        jsonData = await response.json();
        console.log("✅ JSON Data Loaded Successfully:", jsonData);
        populateTable(jsonData);
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

// ✅ Populate Table
function populateTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    data.forEach(row => {
        let inTime = formatDate(row["In Time"]);
        let outTime = formatDate(row["Out Time"]);
        let missing = "N/A";

        // ✅ If Out Time year < 2024, mark as "Unreturnable Pass"
        if (row["Out Time"] && new Date(row["Out Time"]).getFullYear() < 2024) {
            missing = row["Pass No"];
        }

        const tableRow = `
            <tr>
                <td>${row.Name || "N/A"}</td>
                <td>${row["Mobile No"] || "N/A"}</td>
                <td>${row.Designation || "N/A"}</td>
                <td>${row["Gate No"] || "N/A"}</td>
                <td>${inTime}</td>
                <td>${outTime}</td>
                <td>${missing}</td>
            </tr>
        `;
        tableBody.innerHTML += tableRow;
    });
}

// ✅ Format Date (MM/DD/YYYY HH:MM:SS)
function formatDate(dateString) {
    if (!dateString || dateString === "N/A") return "N/A";
    let date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleString("en-US", { hour12: false });
}

// ✅ Search Function
function searchData() {
    let searchInput = document.getElementById("searchInput").value.toLowerCase().trim();
    if (searchInput === "") {
        populateTable(jsonData);
        return;
    }

    let filteredData = jsonData.filter(row =>
        (row["Mobile No"] && row["Mobile No"].includes(searchInput)) ||
        (row.Name && row.Name.toLowerCase().includes(searchInput)) ||
        (row.Company && row.Company.toLowerCase().includes(searchInput))
    );

    populateTable(filteredData);
}

// ✅ Reset Search
function resetSearch() {
    document.getElementById("searchInput").value = "";
    populateTable(jsonData);
}
