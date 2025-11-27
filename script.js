const container = document.getElementById("templateGrid");
const searchInput = document.getElementById("searchInput");

/**
 * The CORE LOGIC: Fetches from PHP first (for local dev), falls back to JSON (for GitHub).
 */
async function fetchTemplates() {
    let templatesData = [];
    const jsonFileName = 'templete.json'; // The name of your static JSON file

    // 1. TRY DYNAMIC PHP FILE FIRST (For XAMPP/Local Server)
    try {
        const phpResponse = await fetch('fetch_templates.php'); 
        
        if (phpResponse.ok) {
            templatesData = await phpResponse.json(); 
            // If PHP succeeds and returns valid JSON, we use it.
            
            // Check if PHP returned a database error (your PHP file returns JSON even on error)
            if (templatesData && templatesData.error) {
                 throw new Error(templatesData.error);
            }
            
            console.log("Templates loaded from the dynamic PHP/Database source.");
            
        } else {
            // PHP file was found but returned an HTTP error (e.g., 500)
            throw new Error(`PHP fetch failed with status: ${phpResponse.status}. Falling back.`);
        }

    } catch (e) {
        // This 'catch' block runs if:
        // 1. PHP file is not found (GitHub Pages 404).
        // 2. PHP file runs but returns an HTTP error.
        // 3. PHP file returns the custom database error.
        console.warn("Dynamic PHP fetch failed. Falling back to static JSON.", e);

        // --- 2. FALLBACK TO STATIC JSON FILE (For GitHub Pages) ---
        try {
            const jsonResponse = await fetch(jsonFileName); 
            
            if (!jsonResponse.ok) {
                throw new Error(`Static JSON HTTP error! status: ${jsonResponse.status}`);
            }
            templatesData = await jsonResponse.json(); 
            console.log("Templates loaded from the static JSON file.");

        } catch (jsonError) {
            // If both fail, display a final error message
            console.error("Critical Fetch Error: Failed to load from both sources.", jsonError);
            container.innerHTML = `<p style="text-align: center; color: red; width: 100%; padding: 50px;">
                Error loading templates from both dynamic and static sources. Check your **${jsonFileName}** file.
            </p>`;
            return; // Stop execution
        }
    }

    // 3. RENDER DATA (from whichever source succeeded)
    renderTemplates(templatesData);
    setupSearch();
}


/**
 * 2. Renders the template cards on the page.
 */
function renderTemplates(templates) {
    container.innerHTML = ''; // Clear previous content
    templates.forEach(t => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.display = 'flex'; // Ensure initial visibility for search

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
