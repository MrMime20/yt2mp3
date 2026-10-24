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

    // CRITICAL FIX: The [1] pulls the raw text string out of the regex match array
    const videoId = videoIdMatch[1]; 

    // Reset UI view states
    statusMsg.classList.remove('hidden');
    downloadBox.classList.add('hidden');
    statusMsg.innerText = "Connecting to an open conversion node...";

    // 2. Query a completely open, keyless serverless endpoint
    const apiEndpoint = 'https://cobalt.tools';

    try {
        // Cobalt requires a POST request containing the target URL configuration
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: `https://youtube.com{videoId}`,
                isAudioOnly: true,
                audioFormat: 'mp3',
                vCodec: 'h264'
            })
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }

        const data = await response.json();

        // 3. Evaluate the payload response structure
        if (data && data.url) {
            statusMsg.classList.add('hidden');
            downloadBox.classList.remove('hidden');
            downloadLink.href = data.url; 
            downloadLink.setAttribute('target', '_blank'); 
        } else {
            statusMsg.innerText = "Conversion failed. The node rejected the video stream.";
        }
    } catch (error) {
        console.error("Fetch error details:", error);
        statusMsg.innerText = "Connection failed. The endpoint might be down or blocking the origin domain.";
    }
});
