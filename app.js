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

    const videoId = videoIdMatch[1]; 

    // Reset UI view states
    statusMsg.classList.remove('hidden');
    downloadBox.classList.add('hidden');
    statusMsg.innerText = "Connecting to an open conversion node via CORS proxy...";

    // 2. Direct Target API Endpoint
    const targetUrl = `https://vexdw.com{videoId}&format=mp3`;
    
    // Wrap the target URL inside the AllOrigins open proxy to bypass the browser block
    const proxyUrl = `https://allorigins.win{encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`Proxy error code: ${response.status}`);
        }

        const proxyData = await response.json();
        
        // AllOrigins returns the target's response inside a text string named "contents"
        const data = JSON.parse(proxyData.contents);

        // 3. Process the payload back inside your layout
        if (data && data.downloadUrl) {
            statusMsg.classList.add('hidden');
            downloadBox.classList.remove('hidden');
            downloadLink.href = data.downloadUrl; 
            downloadLink.setAttribute('target', '_blank'); 
        } else if (data && data.status === 'processing') {
            statusMsg.innerText = "The pipeline is warming up the file. Wait 5 seconds and click Convert again!";
        } else {
            statusMsg.innerText = "Conversion node rejected the video stream. Try another link.";
        }
    } catch (error) {
        console.error("Fetch error details:", error);
        statusMsg.innerText = "Connection dropped. The public proxy node may be under heavy load.";
    }
});
