const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr =  document.querySelector(".to select");
const msg = document.querySelector(".message");
for (let select of dropdowns) {
    for(currcode in countryList){
        let newoption = document.createElement("option");
        let countrycode = countryList[currcode];
        let countryname = countryNames[countrycode];
        newoption.value = currcode;
        let isSelected = false;
        if(select.name == "from" && currcode == "USD"){
            newoption.selected = "selected";
            isSelected = true;
        }else if(select.name == "to" && currcode == "PKR"){
            newoption.selected = "selected";
            isSelected = true;
        }
        // Show only code for selected, full text for others
        newoption.innerText = isSelected ? currcode : `${currcode} - ${countryname}`;
        select.append(newoption);
    }
    
    // Update text when dropdown opens/closes
    select.addEventListener("focus", () => {
        for(let opt of select.options){
            let countrycode = countryList[opt.value];
            let countryname = countryNames[countrycode];
            opt.innerText = `${opt.value} - ${countryname}`;
        }
    });
    
    select.addEventListener("blur", () => {
        let countrycode = countryList[select.value];
        let countryname = countryNames[countrycode];
        for(let opt of select.options){
            if(opt.selected){
                opt.innerText = opt.value;
            }
        }
    });
    
    select.addEventListener("change", async e => {
        updateFlag(e.target);
        await updateMessage();
    });
}
const updateFlag = (element) => {
    let currcode = element.value;
    let countrycode = countryList[currcode];
    let newSrc = `https://flagsapi.com/${countrycode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

const updateMessage = async () => {
    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();
    const URL = `${BASE_URL}/${from}.json`;
    try {
        const response = await fetch(URL);
        const data = await response.json();
        const rate = data[from]?.[to];
        if (!rate) {
            msg.innerText = "Rate not found for selected currencies.";
            return;
        }
        msg.innerText = `1 ${fromCurr.value} = ${rate} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Unable to load exchange rate.";
    }
};

updateFlag(fromCurr);
updateFlag(toCurr);
updateMessage();

btn.addEventListener("click", async (e) => {
    e.preventDefault();  
    let amount = document.querySelector(".amount input");
    let amtvalue = amount.value;
    if(amtvalue === "" || amtvalue < 1){
        amtvalue = 1;
        amount.value = "1";
    }
    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
    let response = await fetch(URL);
    let data = await response.json();
    let exchangeRate = data[fromCurr.value.toLowerCase()]?.[toCurr.value.toLowerCase()];

    if (!exchangeRate) {
        msg.innerText = "Rate not found for selected currencies.";
        return;
    }

    let finalammount = amtvalue * exchangeRate;
    msg.innerText = `${amtvalue} ${fromCurr.value} = ${finalammount} ${toCurr.value}`;
}); 