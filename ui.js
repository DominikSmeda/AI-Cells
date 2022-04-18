
let showSettings = false;
document.querySelector('#settings-switch').addEventListener('click', (e) => {
    if (showSettings)
        document.querySelector('#settings').style.visibility = "hidden";
    else
        document.querySelector('#settings').style.visibility = "visible";
    showSettings = !showSettings;
})
