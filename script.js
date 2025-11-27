// Use this entire function in script.js:
async function fetchTemplates() {
    let templatesData = [];

    // 1. TRY DYNAMIC PHP FILE FIRST (For XAMPP/Local Server)
    try {
        const phpResponse = await fetch('fetch_templates.php'); 

        if (phpResponse.ok) {
            templatesData = await phpResponse.json(); 
        } else {
            throw new Error('PHP file returned an error. Falling back to JSON.');
        }

    } catch (e) {
        console.warn("PHP fetch failed. Falling back to static JSON.", e);

        // 2. FALLBACK TO STATIC JSON FILE (For GitHub Pages)
        try {
            const jsonResponse = await fetch('templete.json'); 

            if (!jsonResponse.ok) {
                throw new Error(`Static JSON HTTP error! status: ${jsonResponse.status}`);
            }
            templatesData = await jsonResponse.json(); 

        } catch (jsonError) {
            console.error("Critical Fetch Error:", jsonError);
            // Display error message if both sources fail
            container.innerHTML = `<p style="text-align: center; color: red; width: 100%;">
                Error loading templates from both dynamic and static sources. Check your files.
            </p>`;
            return; 
        }
    }

    // 3. RENDER DATA (from whichever source succeeded)
    renderTemplates(templatesData);
    setupSearch();
}