document.getElementById('convert-btn').addEventListener('click', async () => {
    const urlInput = document.getElementById('youtube-url').value.trim();
    const statusMsg = document.getElementById('status-message');
    const downloadBox = document.getElementById('download-box');
    const downloadLink = document.getElementById('download-link');

    // 1. Extract the unique video ID using a regular expression
    const videoIdMatch = urlInput.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    
    if (!videoIdMatch) {
        alert('Please enter a valid YouTube URL');
        return;
    }

    // Extract the raw 11-character string from the regex array match
    const videoId = videoIdMatch[1]; 

    // Reset UI view states
    statusMsg.classList.remove('hidden');
    downloadBox.classList.add('hidden');
    statusMsg.innerText = "Connecting to public conversion server...";

    // 2. Query a completely open, keyless mirror endpoint
    const apiEndpoint = `https://vexdw.com{videoId}&format=mp3`;

    try {
        // No custom 'x-rapidapi-key' headers are required here
        const response = await fetch(apiEndpoint, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        // 3. Evaluate the payload response structure
        if (data && data.downloadUrl) {
            statusMsg.classList.add('hidden');
            downloadBox.classList.remove('hidden');
            downloadLink.href = data.downloadUrl; 
            downloadLink.setAttribute('target', '_blank'); 
        } else if (data && data.status === 'processing') {
            statusMsg.innerText = "The video is spinning up. Click convert again in a few seconds...";
        } else {
            statusMsg.innerText = "Conversion failed. Please try a different video link.";
        }
    } catch (error) {
        console.error("Fetch error details:", error);
        statusMsg.innerText = "Connection failed. The public API node might be offline or rate-limiting traffic.";
    }
});
