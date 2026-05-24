(function () {
    emailjs.init("user_tgi6spkLgK3ED5XLPLAjH");
})();

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            sendMessage();
        });
    }
});

function sendMessage() {
    const btn = document.getElementById('contact-form-submit');
    const form = document.getElementById('contact-form');
    if (!btn || !form) return;

    const originalText = btn.textContent || btn.innerText;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    const serviceID = 'service_zohomail';
    const templateID = 'template_shr_zoho';

    const fname = document.getElementById('name');
    const lname = document.getElementById('surname');
    const email = document.getElementById('email');
    const phonm = document.getElementById('phone');
    const msseg = document.getElementById('message');

    const person_name = fname.value + ' ' + lname.value;

    const templateParams = {
        from_name: person_name,
        email: email.value,
        phone_number: phonm.value,
        message: msseg.value
    };

    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            alert('Sent!');
            form.reset();
        }, (err) => {
            btn.textContent = originalText;
            btn.disabled = false;
            alert('Failed to send message: ' + (err.text || JSON.stringify(err)));
        });
}