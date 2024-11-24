document.querySelector('.search-icon').addEventListener('click', function () {
    const navRight = document.querySelector('.nav-right');
    navRight.classList.toggle('active'); // Toggle the "active" class
});

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const indicator = document.querySelector("#active-indicator");
    
    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            // Remove active class from all tabs
            tabs.forEach((t) => {
                t.classList.remove("active");
            });
            // Add active class to the clicked tab
            this.classList.add("active");
        });
    });

    // Set the initial active tab
    const defaultTab = document.querySelector("#popular-tab");
    if (defaultTab) {
        defaultTab.click(); // Trigger click to set styles on load
    } else {
        console.log("No default tab found.");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const priceText = document.getElementById("price").textContent;
    const price = parseFloat(priceText.replace('$', '').replace(',', ''));

    const firstInput = document.getElementById("firstnumber");
    const secondInput = document.getElementById("secondnumber");

    // Update "Spend" (second input) when "Buy" (first input) changes
    firstInput.addEventListener("input", () => {
        const firstValue = parseFloat(firstInput.value) || 0;
        secondInput.value = (firstValue * price).toLocaleString();
    });

    // Update "Buy" (first input) when "Spend" (second input) changes
    secondInput.addEventListener("input", () => {
        const secondValue = parseFloat(secondInput.value.replace(',', '')) || 0;
        firstInput.value = (secondValue / price).toFixed(3); // 8 decimal places for precision
    });
});


document.querySelector('form[action="/checkout"]').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent form submission

    const nameData = document.getElementById("storeName").textContent.trim(); // Extract the text
    const storeName = nameData.split(' ')[0]; // Split the text and get the first part
    console.log("Store Name:", storeName); // Debugging
    
    const secondInput = document.getElementById("secondnumber").value; // Get input value
    const amount = parseFloat(secondInput.replace(/,/g, '')); // Convert to number
    const firstInput = document.getElementById("firstnumber").value; 
    const quantity = parseFloat(firstInput.replace(/,/g, ''));
   
    
    try {
        // Send amount to the server
        const response = await axios.post('/checkout', { amount , quantity , storeName });
        console.log(response);
        
        // Redirect to Stripe Checkout page
        if (response.data.url) {
            window.location.href = response.data.url; // Redirect to Stripe Checkout
        } else {
            console.error('No URL returned from server.');
            alert('Checkout failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Error during checkout. Check console for details.');
    }
});





