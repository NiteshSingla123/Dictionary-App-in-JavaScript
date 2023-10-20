const wrapper = document.querySelector(".wrapper"),
// document.querySelector is used to select elements from the HTML document.
// These elements are related to the user interface and will be used to display information to the user.
searchInput = wrapper.querySelector("input"),
volume = wrapper.querySelector(".word i"),
infoText = wrapper.querySelector(".info-text"),
synonyms = wrapper.querySelector(".synonyms .list"),
removeIcon = wrapper.querySelector(".search span");
let audio;
// The audio variable is declared to store an Audio object for playing the pronunciation of the searched word.


// data function  takes two parameters, result and word. This function handles the data received from the dictionary API and updates the UI accordingly. If a word's meaning is found, it populates the UI with information such as word, part of speech, meaning, example, and synonyms.
function data(result, word){
    if(result.title){
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    }else{
        wrapper.classList.add("active");
        // It adds the "active" class to the wrapper element, which likely triggers the display of the word information on the webpage.
        let definitions = result[0].meanings[0].definitions[0],
        phontetics = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
        // It updates various UI elements (e.g., word, part of speech, meaning, and example) with the extracted information.
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phontetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        document.querySelector(".example span").innerText = definitions.example;
        audio = new Audio(result[0].phonetics[0].audio);
        // It creates an Audio object (audio) to play the word's pronunciation, using the audio URL provided in the API response.

        
        
        
// It handles the display of synonyms:
// If no synonyms are available, it hides the synonyms section.
// If synonyms are available, it displays up to five synonyms and provides a clickable link to search for the synonyms.
        if(definitions.synonyms[0] == undefined){
            synonyms.parentElement.style.display = "none";
        }else{
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = "";
            for (let i = 0; i < 5; i++) {
                let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`;
                tag = i == 4 ? tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>` : tag;
                synonyms.insertAdjacentHTML("beforeend", tag);
            }
        }
    }
}



// The search function is defined, taking a word as a parameter. 
// This function is used to initiate a search for the provided word. 
// It calls the fetchApi function to fetch data from the dictionary API and updates the search input field's value.
function search(word){
    fetchApi(word);
    searchInput.value = word;
}




// The fetchApi function is responsible for making an API request to fetch the meaning of a word. 
// It updates the UI to indicate that the search is in progress and then sends a fetch request to the dictionary API. 
// If the word is found, it calls the data function with the results. 
// If the word is not found, it displays an error message.
function fetchApi(word){
    wrapper.classList.remove("active");
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(response => response.json()).then(result => data(result, word)).catch(() =>{
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
}



// An event listener is added to the search input field to listen for keyup events. 
//When the "Enter" key is pressed, it triggers a search for the word entered by the user.
searchInput.addEventListener("keyup", e =>{
    let word = e.target.value.replace(/\s+/g, ' ');
    if(e.key == "Enter" && word){
        fetchApi(word);
    }
});



// An event listener is added to the volume control icon (the speaker icon). When clicked, it changes the icon's color to blue and plays the pronunciation audio. After a delay of 800 milliseconds, it changes the icon color back to gray.
volume.addEventListener("click", ()=>{
    volume.style.color = "#4D59FB";
    audio.play();
    setTimeout(() =>{
        volume.style.color = "#999";
    }, 800);
});



//An event listener is added to the remove icon (the "X" icon) next to the search input field. When clicked, it clears the search input field, removes the active class from the wrapper, and sets the informational text back to its initial state.
removeIcon.addEventListener("click", ()=>{
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#9A9A9A";
    infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});
