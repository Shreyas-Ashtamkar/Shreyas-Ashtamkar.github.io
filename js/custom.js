(function () {
    emailjs.init("user_tgi6spkLgK3ED5XLPLAjH");
})();

function sendMessage() {
    const btn = document.getElementById('contact-form-submit');
    const form = document.getElementById('contact-form');

    btn.value = 'Sending...';
    form.addEventListener('submit', function (event) {
        event.preventDefault();
    });

    const serviceID = 'service_zohomail';
    const templateID = 'template_shr_zoho';

    var fname = document.getElementById('name');
    var lname = document.getElementById('surname');
    var email = document.getElementById('email');
    var phonm = document.getElementById('phone');
    var msseg = document.getElementById('message');

    var person_name = fname.value + ' ' + lname.value;

    var templateParams = {
        from_name: person_name,
        email: email.value,
        phone_number: phonm.value,
        message: msseg.value
    };

    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            btn.value = 'Send Message';
            alert('Sent!');
        }, (err) => {
            btn.value = 'Send Message';
            alert(JSON.stringify(err));
        });
    fname.value = ''
    lname.value = ''
    email.value = ''
    phonm.value = ''
    msseg.value = ''
}