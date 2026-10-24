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
    statusMsg.innerText = "Connecting to conversion pipeline...";

    // 2. Query a free, public conversion API fetch endpoint 
    // Note: RapidAPI hosts several free "Youtube MP3" endpoints you can subscribe to.
    const apiEndpoint = `https://rapidapi.com{videoId}`;
    const apiKey = 'YOUR_RAPIDAPI_KEY_HERE'; // Replace with a key from rapidapi.com

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': '://rapidapi.com'
            }
        });

        const data = await response.json();

        if (data.status === 'ok' && data.link) {
            // 3. Successful conversion: update UI and bind download URL
            statusMsg.classList.add('hidden');
            downloadBox.classList.remove('hidden');
            downloadLink.href = data.link; 
            downloadLink.setAttribute('target', '_blank'); // Opens download stream safely
        } else {
            statusMsg.innerText = `Error: ${data.msg || 'Conversion failed. Please try another link.'}`;
        }
    } catch (error) {
        console.error(error);
        statusMsg.innerText = "An explicit connection error occurred. Check network logs.";
    }
});
