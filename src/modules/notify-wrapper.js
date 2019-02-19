import { Notify } from 'quasar'

export  function info(message){
    Notify.create({
        message: `${message}`,
        timeout: 2000,
        type: 'info',
        position: 'bottom-right'
    });
}

export  function error(message){
    Notify.create({
        message: `${message}`,
        timeout: 2000,
        type: 'negative',
        position: 'bottom-right'
    });
}

export  function success(message){
    Notify.create({
        message: `${message}`,
        timeout: 2000,
        type: 'positive',
        position: 'bottom-right'
    });
}

