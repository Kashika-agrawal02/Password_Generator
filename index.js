const inputSlider=document.querySelector("[data-lengthSlider]")
const lengthDisplay=document.querySelector("[data-lengthNumber]")

const passwordDispaly=document.querySelector("[data-passwordDisplay]")
const copyBtn=document.querySelector("[data-copy]")
const copyMsg=document.querySelector("[data-copyMsg]")
const uppercaseCheck=document.querySelector("#uppercase")
const lowercaseCheck=document.querySelector("#lowercase")
const numberCheck=document.querySelector("#numbers")
const symbolsCheck=document.querySelector("#symbols")

const indicator=document.querySelector("[data-indicator]")
const generateBtn=document.querySelector(".generateBtn")

const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
 

//initially
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set strength circle color to gray

setIndicator("#CCC");
//set paasword length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize= ( (passwordLength-min) *100 /(max-min)) + "% 100%"


}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
   return  Math.floor( Math.random()*(max-min) )+min;
}

function generateRndNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
     
    return  String.fromCharCode( getRndInteger(97,123) )

}

function generateUpperCase(){
     
    return  String.fromCharCode( getRndInteger(65,91) );

}

function genrateSymbol(){
     const randNum=getRndInteger(0,symbols.length);

     return symbols.charAt(randNum);
    
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if( hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8){
        setIndicator("#0f0");
    }

    else if(
       ( hasLower || hasUpper) &&
       (hasSym || hasNum) &&
       passwordLength >=6
    )
    {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}
 
async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDispaly.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }

    //to make copy vala span visible
    copyMsg.classList.add("active");
    
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //Fisher yates Method 
    for(let i =array.length-1;i>0;i--){
        //random j find out
        const j=Math.floor(Math.random()* (i+1));
        //swap numb. at i and at j 
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }

    let str="";
    array.forEach((el)=> ( str+=el));
    return str;

}

function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special case
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();  //sirf ui pr paswrd lentgh ko display krwata h 
    }
}
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handleCheckboxChange);
})

inputSlider.addEventListener('input',(e)=>
    {
        passwordLength=e.target.value;
        handleSlider();
    }
)

copyBtn.addEventListener('click',()=>{
    if(passwordDispaly.value){
        copyContent();
    }
});


generateBtn.addEventListener('click',()=>{
    //none of the checkbpx are selected
    if(checkCount==0) return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }//can be run without it bcz it define uppr side s

    //lets start the journey to find new password

    //remove old password
    console.log("Strating the journey");
    password="";

    //lets put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // } 
    // if(numberCheck.checked){
    //     password+=generateRndNumber();
    // } 
    // if(symbolsCheck.checked){
    //     password+=genrateSymbol();
    // }

    let funcArr=[];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numberCheck.checked){
        funcArr.push(generateRndNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(genrateSymbol);
    }

    //compulsory additon

    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    console.log("Compulsory additon fone");

    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }

    console.log("remaing additon fone");
    
    //shuffle the password

    password= shufflePassword(Array.from(password));

    //show in UI
    console.log("shufflingn fone");

    
    passwordDispaly.value=password;

    console.log("UIdone");

    //calculate strength
    calcStrength();

});