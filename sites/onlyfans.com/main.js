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
function scrollToElementsWithDelay() {
    // Current index to track which element to scroll to
    let currentIndex = 0;

    // Function to scroll to an element with delay
    function scrollToElementWithDelay() {
        const elements = document.querySelectorAll('.vue-recycle-scroller__item-view');
        if (currentIndex < elements.length) {
            const element = elements[currentIndex];
            element.scrollIntoView({ behavior: 'smooth' });

            currentIndex++;  // Increment the index
            setTimeout(scrollToElementWithDelay, 5000);  // Set the next scroll
        }
    }

    // Start the first scroll
    scrollToElementWithDelay();

    // Observe for new elements being added
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // New elements have been added. Continue the scrolling sequence if paused.
                if (currentIndex < mutation.target.children.length) {
                    scrollToElementWithDelay();
                }
            }
        }
    });

    // Start observing the DOM for configured mutations
    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);  // Observing the entire body, adjust if you need to observe a specific container.
}



(async function () {
    await delay(5000);
    scrollToElementsWithDelay();
})();

