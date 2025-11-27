const container = document.getElementById("templateGrid");
const searchInput = document.getElementById("searchInput");

/**
 * 1. Fetches template data from the local PHP file (connected to MySQL).
 */
async function fetchTemplates() {
    try {
        // *** THIS IS THE ONLY LINE THAT CHANGED ***
        const response = await fetch('fetch_templates.php'); 
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const templatesData = await response.json(); 
        
        renderTemplates(templatesData);
        setupSearch();

    } catch (e) {
        console.error("Fetch Error:", e);
        // This error message appears if the file is missing or the server isn't running
        container.innerHTML = `<p style="text-align: center; color: red; width: 100%;">
            Error loading templates: ${e.message}. Please check your file names and ensure XAMPP is running.
        </p>`;
    }
}

/**
 * 2. Renders the template cards on the page.
 */
function renderTemplates(templates) {
    container.innerHTML = ''; // Clear previous content
    templates.forEach(t => {
        const card = document.createElement("div");
        card.className = "card";

        // Generates the template preview image URL
        const preview = `https://image.thum.io/get/width/600/crop/800/${t.url}`;

        card.innerHTML = `
            <img src="${preview}" alt="Preview of ${t.name}">
            <h3>${t.name}</h3>
            <button onclick="copyLink('${t.url}')">Copy Link</button>
        `;

        container.appendChild(card);
    });
}

/**
 * 3. Copy link function 
 */
function copyLink(link) {
    navigator.clipboard.writeText(link);
    alert("Template link copied!");
}

/**
 * 4. Search setup function
 */
function setupSearch() {
    searchInput.addEventListener("input", function () {
        const term = this.value.toLowerCase();
        const cards = document.querySelectorAll(".card"); 

        cards.forEach(card => {
            const templateName = card.querySelector("h3").textContent.toLowerCase();
            if (templateName.includes(term)) {
                card.style.display = "flex"; // Show the card
            } else {
                card.style.display = "none"; // Hide the card
            }
        });
    });
}

// Initial call to fetch and display templates when the script loads
fetchTemplates();