const container = document.getElementById("templateGrid");
const searchInput = document.getElementById("searchInput");

/**
 * The CORE LOGIC: Fetches from PHP first (Dynamic/Local), falls back to JSON (Static/GitHub).
 * * - When run on XAMPP, 'fetch_templates.php' will succeed.
 * - When run on GitHub Pages (without the PHP file), the fetch will 404, 
 * and the script will fall back to 'templete.json'.
 */
async function fetchTemplates() {
    let templatesData = [];
    const phpFileName = 'fetch_templates.php'; 
    const jsonFileName = 'templete.json'; 

    // 1. TRY DYNAMIC PHP FILE FIRST (For XAMPP/Local Server)
    try {
        const phpResponse = await fetch(phpFileName); 
        
        if (phpResponse.ok) {
            templatesData = await phpResponse.json(); 
            
            // Handle internal database error message returned by PHP
            if (templatesData && templatesData.error) {
                 throw new Error(templatesData.error);
            }
            
            console.log("Templates loaded from the dynamic PHP/Database source.");
            
        } else {
            // PHP file was found but returned an HTTP error (e.g., 500)
            throw new Error(`PHP fetch failed with status: ${phpResponse.status}. Falling back.`);
        }

    } catch (e) {
        // --- 2. FALLBACK TO STATIC JSON FILE (For GitHub Pages) ---
        console.warn(`Dynamic fetch failed (File not found on server or error: ${e.message}). Falling back to static JSON.`);
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
                ERROR: Failed to load templates. Check if **${jsonFileName}** is correctly pushed to GitHub.
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
