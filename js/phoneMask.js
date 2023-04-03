function phoneMask() {
    const inputTel = document.querySelectorAll('input[type=tel]');
    inputTel.forEach(input => {
        input.addEventListener('input', (e) => {
            e.preventDefault();
            if (input.value.length <= 2)
                input.value = (e.data != null) ? "+7" + e.data : "+7";
            if (e.data != null)
                if (e.data.match(/[0-9+-]/) == null || input.value.length > 12)
                    input.value = input.value.substring(0, input.value.length - 1);
        });
    });
}
