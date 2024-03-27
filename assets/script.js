// DOM
const inputCep = document.querySelector('#input-cep');
const responseArea = document.querySelectorAll('.response-address-area');
const btnSubmit = document.querySelector('#btn-submit');
const body = document.querySelector('body');

//REGEX input CEP
const handleInput = () => {
    let inputValue = inputCep.value;
    let cleanNumber = inputValue.replace(/\D/g, '');
    let constructCep = cleanNumber.replace(/(\d{5})(\d{3})/ ,'$1-$2');
    inputCep.value = constructCep;
}

//Treatment Error
const cleanInfo = () => {
    inputCep.value = '';
    responseArea.forEach((item) => {
        item.innerText = '';
    })
};

const createModalError = () => {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('container-modal-error');

    const modal = document.createElement('div');
    modal.classList.add('modal-error');

    const span = document.createElement('span');
    span.innerText = 'Cep não encontrado!';

    modal.appendChild(span);
    mainDiv.appendChild(modal);

    return mainDiv;
}

const setModalError = () => {
    const modal = createModalError();
    body.appendChild(modal);
    setInterval(()=>{
        modal.classList.add('inactive');
    }, 2000);
}

//Requisition data CEP
let addressRequisition;

const getAddress = async (cep) => {
    const cepAddress = cep.replace('-', '');
    if(cepAddress.length === 8) {
        await fetch(`https://viacep.com.br/ws/${cepAddress}/json/`)
        .then(response => response.json())
        .then(json => addressRequisition = json)
    } else {
        cleanInfo();
        setModalError();
    }
}

//Insert values in HTML
const setValuesCep = async () => {
    await getAddress(inputCep.value);
    if(!addressRequisition.erro) {
        responseArea.forEach((item) => {
            const dataKey = item.getAttribute('data-address');
            item.innerText = addressRequisition[dataKey];
        })
    } else {
        cleanInfo();
        setModalError();
    }
};

const sourceWithEnter = (e) => {
    if(e.key === 'Enter') {
        setValuesCep();
    }
}

//Events
inputCep.addEventListener('keyup', handleInput);
btnSubmit.addEventListener('click', setValuesCep);
document.addEventListener('keypress', sourceWithEnter);