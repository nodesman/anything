function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function fetchImageAndSendToServer(imgUrl, fileName) {
    // Fetch the image
    const response = await fetch(imgUrl);
    const blob = await response.blob();

    // Convert blob to array buffer
    const arrayBuffer = await blob.arrayBuffer();

    // Prepare data for sending
    const data = {
        fileName: fileName,
        imageData: Array.from(new Uint8Array(arrayBuffer)) // Convert buffer to array for JSON serialization
    };

    // Send data to server
    fetch('http://localhost:3000/save-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

async function findAndClickImage() {
    // Query for the feed items
    const feedItems = document.querySelectorAll('[role=feed] > [role=article]');
    console.info(`Found ${feedItems.length} feed items`);
    console.info(feedItems);

    for (let item of feedItems) {
        // Within each feed item, find the image
        const img = item.querySelector('img');

        // Scroll into view of the image
        img.scrollIntoView({ behavior: "smooth" });

        // Wait for a bit for scrolling to finish
        await delay(1000);

        // Trigger click event on the image
        img.click();

        // Find the 3rd dialog element
        await delay(1000); // Adjust delay as needed to ensure the dialog has opened
        const dialog = document.querySelectorAll('[role=dialog]')[2];

        // Find the image within the dialog
        const dialogImg = dialog.querySelector('img');
        /*
        check if this is a gallery or video or a single image
        if video, then download the video by first clicking on the video, look for the HTTP request for the image and
        download the video or just look at the attribute for the source
        if gallery then click on the image then download each consequtive image
        if single image then just download the image by clicking on the image, then opeing the dialog and then
        downloading the large image.

         */

        // Fetch the image and send it to the server
        await fetchImageAndSendToServer(dialogImg.src, `onlyfans-${Date.now()}.jpg`);

        // Close the dialog by triggering a click event on it
        dialog.click();

        // Wait 5 seconds before clicking the next image
        await delay(5000);
    }
}

(async function () {
    await delay(5000);
    findAndClickImage();
})();

