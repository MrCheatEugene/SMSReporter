document.addEventListener('deviceready', onDeviceReady, false);

const save = ()=>{
    localStorage.setItem('data', JSON.stringify({'numbers': numbers.value, 'passphrase': passphrase.value, 'script': document.getElementById('script').value}))
};

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    let r = JSON.parse(localStorage.getItem('data'));
    numbers.value = r['numbers'];
    passphrase.value = r['passphrase'];
    script.value = r['script'];
    
    cordova.plugins.backgroundMode.on('onSMSArrive', onSMSArrive);
    document.addEventListener('onSMSArrive', onSMSArrive);

}


const onSMSArrive = (e)=>{
    var data = e.data;
    let work = false;
    if(numbers.value.trim().length == 0 || (numbers.value.split(',').length == 1 && numbers.value == numbers.value.split(',')[0])){
        work=true;
    }else{
        numbers.value.split(',').forEach(element => {
            if(data['address']==element.trim() && work != true){
                work = true;
            }
        });
    }
    document.getElementById('lastnum').innerText = data['address'];
    if(work){
        fetch(`${script.value}?passphrase=${encodeURIComponent(passphrase.value)}&sms=${encodeURIComponent(data['body'])}&number=${data['address']}`);
    }
}