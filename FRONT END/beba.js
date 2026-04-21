// Pricing data
const pricing = {
    minivan: {
        short: 45,
        long: 150
    },
    van: {
        short: 70,
        long: 250
    },
    bus: {
        short: 150,
        long: 500
    }
};

// DOM Elements
const bookingForm = document.getElementById('bookingForm');
const paymentForm = document.getElementById('paymentForm');
const paymentModal = document.getElementById('paymentModal');
const closeBtn = document.querySelector('.close');
const calculateBtn = document.getElementById('calculateBtn');

// Set minimum date to today
document.getElementById('departureDate').min = new Date().toISOString().split('T')[0];

// Calculate booking cost
calculateBtn.addEventListener('click', () => {
    const vehicleType = document.getElementById('vehicleType').value;
    const journeyType = document.getElementById('journeyType').value;
    const passengers = parseInt(document.getElementById('passengers').value);

    if (!vehicleType || !journeyType || !passengers) {
        alert('Please fill in all required fields for cost calculation');
        return;
    }

    const baseCost = pricing[vehicleType][journeyType];
    const totalCost = baseCost * passengers;
    
document.getElementById('estimateCost').textContent = '$' + totalCost.toFixed(2);
});

// Close modal when clicking X
closeBtn.addEventListener('click', () => {
    paymentModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
});

// Format card number
document.getElementById('cardNumber').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Format expiry date
document.getElementById('expiry').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
});

// Format CVV
document.getElementById('cvv').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
});

// Handle booking form submission
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate form
    const vehicleType = document.getElementById('vehicleType').value;
    const journeyType = document.getElementById('journeyType').value;
    const estimateCost = document.getElementById('estimateCost').textContent;

    if (estimateCost === '$0.00') {
        alert('Please calculate the cost first');
        return;
    }

    // Populate booking summary
    const vehicleNames = {
        minivan: 'Minivan (6-8 passengers)',
        van: 'Van (10-14 passengers)',
        bus: 'Bus (30-50 passengers)'
    };

    document.getElementById('summaryVehicle').textContent = vehicleNames[vehicleType];
    document.getElementById('summaryFrom').textContent = document.getElementById('pickupLocation').value;
    document.getElementById('summaryTo').textContent = document.getElementById('dropoffLocation').value;
    document.getElementById('summaryDate').textContent = document.getElementById('departureDate').value;
    document.getElementById('summaryTime').textContent = document.getElementById('departureTime').value;
    document.getElementById('summaryPassengers').textContent = document.getElementById('passengers').value;
    document.getElementById('totalAmount').textContent = estimateCost.substring(1);

    // Show payment modal
    paymentModal.style.display = 'block';
});

// Handle payment form submission
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate payment details
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;

    if (cardNumber.length !== 16) {
        alert('Invalid card number. Must be 16 digits.');
        return;
    }

    if (expiry.split('/')[0] > 12 || expiry.split('/')[0] < 1) {
        alert('Invalid expiry month');
        return;
    }

    if (cvv.length !== 3) {
        alert('Invalid CVV. Must be 3 digits.');
        return;
    }

    // Success message
    alert('Payment Successful! Your ride has been booked. Confirmation details have been sent to your email.');

    // Reset forms
    bookingForm.reset();
    paymentForm.reset();
    document.getElementById('estimateCost').textContent = '$0.00';
    paymentModal.style.display = 'none';

    // Redirect to home
    setTimeout(() => {
        window.location.hash = '#home';
    }, 1000);
});
