const container = document.getElementById("templateGrid");
const searchInput = document.getElementById("searchInput");

/**
 * Simplified logic for GitHub Pages: ONLY fetch static JSON.
 */
async function fetchTemplates() {
    let templatesData = [];

    // 1. Fetch from the static JSON file
    try {
        // Double-check your filename: is it 'templete.json' or 'template.json'?
        const jsonResponse = await fetch('templete.json'); 
        
        if (!jsonResponse.ok) {
            throw new Error(`Static JSON HTTP error! status: ${jsonResponse.status}`);
        }
        templatesData = await jsonResponse.json(); 

    } catch (jsonError) {
        // Display a final error message if the JSON file fails
        console.error("Critical Fetch Error:", jsonError);
        container.innerHTML = `<p style="text-align: center; color: red; width: 100%;">
            Error loading templates. Check that **templete.json** is in the same folder.
        </p>`;
        return; 
    }

    // 2. RENDER DATA
    renderTemplates(templatesData);
    setupSearch(templatesData); // Pass the data to search setup for better optimization
}

// ... rest of the functions (renderTemplates, copyLink, setupSearch) ...
// The rest of your script.js code is fine.

fetchTemplates();
