'use strict';
 
const textArea = document.getElementById('text');
const mainBtn = document.getElementById('mainBtn')
const notesContainer = document.querySelector('.notesContainer');
const clr = document.querySelector('.clear');
const overlay = document.querySelector('.overlay');



const obj = {
    verfication(){
        !textArea.value ? this.displayMessage('enter text first') : this.saveToLocalStorage();
    },
    
    returnNotesArray(){
        let notesArray = [];
        for(let i = 0; i<localStorage.length; i++){
            const key = localStorage.key(i);
            if (key.toString() === 'notesArray'){
                notesArray = JSON.parse(localStorage.getItem(localStorage.key(i)))
                break;
            }else continue;       
        }
        return notesArray;   
    },

    getNotes(){
        let array = this.returnNotesArray();
        notesContainer.innerHTML = null;
        for (let idx = 0; idx < array.length; idx ++){
            let element = array[idx];
            const noteContainer = document.createElement('div');
            const title = document.createElement('div');
            const shortContent = document.createElement('div');
            const btnsDiv = document.createElement('div');
            const id = document.createElement('div');
            const viewBtn = document.createElement('button');
            const deleteBtn = document.createElement('button');

            noteContainer.appendChild(title);
            noteContainer.appendChild(shortContent);
            noteContainer.appendChild(btnsDiv);
            noteContainer.appendChild(id);
            btnsDiv.appendChild(viewBtn);
            btnsDiv.appendChild(deleteBtn);
            notesContainer.appendChild(noteContainer);

            noteContainer.classList.add('noteContainer');
            title.classList.add('titleDiv')
            shortContent.classList.add('preview')
            btnsDiv.classList.add('btnsDiv')
            viewBtn.classList.add('viewBtn')
            deleteBtn.classList.add('deleteBtn')
            id.style.display = 'none'

            title.textContent = 'Note' + ' ' + (Number(idx) + 1)  ;
            viewBtn.textContent = 'View Detail';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'
            id.textContent = element.id;
            shortContent.textContent = element.short.length < 65 ? element.short : element.short + ' '+ '.....'
        }
    },

    saveToLocalStorage(){
        let array = this.returnNotesArray();
        array.push(new CreateNotes)
        textArea.value = null;
        localStorage.setItem('notesArray' , JSON.stringify(array))
        this.getNotes()
    },

    displayMessage(msg){
        console.log(msg);
    },

}

function CreateNotes(){
    this.fullText = textArea.value;
    const sliceText = () => {
        let slicedText = this.fullText;
        return slicedText.slice(0 , 70)
    }
    const returnRandLetter = () =>{
        let arr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        return arr[Math.round(Math.random() * arr.length)]
    }
    this.short = sliceText()
    this.id = returnRandLetter() + Math.floor(Math.random() * 100000) + returnRandLetter() + returnRandLetter();
}

function buttonsFunctionality(param){
    let note = param.target.parentElement.parentElement;
    if (param.target.className.includes('deleteBtn')){
        removeNoteFromLocal(note);
    }else if (param.target.className.includes('viewBtn')){
        displayPopUp(note);
    }
    
}

function removeNoteFromLocal(param){
    let array = obj.returnNotesArray()
    return new Promise((reslove , reject)=> {
        const animations = ['fallAnimation' , 'fallAnimation01', 'fallAnimation02', 'fallAnimation03', 'fallAnimation04', 'fallAnimation05'];
        const elem = animations[Math.floor(Math.random() * animations.length)]
        param.classList.add(elem) 
        setTimeout(function(){
            for (let idx = 0; idx < array.length ; idx++){
                const element = array[idx];
                if (element.id === param.lastChild.innerText){
                    const idx01 = array.indexOf(element);
                    array.splice(idx01 , 1)
                    localStorage.setItem('notesArray' , JSON.stringify(array))
                    break;
                }else continue;
    
            }   
            reslove()
        },500)

        
    } ).then(runGetNotes);
}

function runGetNotes(){
    obj.getNotes();
}

function displayPopUp(note){
    let array = obj.returnNotesArray()
    overlay.classList.add('active');
    overlay.appendChild(note)
    note.classList.add('noteAnimation')
    note.firstChild.nextSibling.nextSibling.style.display = 'none' // disable btnsDiv
    note.firstChild.nextSibling.className = 'fullText'
    note.firstChild.classList.add('centerTitle');
    
    for (let idx = 0 ; idx < array.length ; idx++){
        const element = array[idx]; // element = object 
        if (element.id === note.lastChild.innerText){
            note.classList.add('popUp')
            note.firstChild.nextSibling.textContent = element.fullText;
            overlay.addEventListener('click' , function closeOverlay(param){
                if (param.target.className.includes('overlay')){
                overlay.classList.remove('active');
                note.classList.remove('popUp')
                note.classList.add('closePopUpAnimation')
                note.firstChild.nextSibling.textContent = element.short;
                note.firstChild.nextSibling.className = 'preview'
                note.firstChild.classList.remove('centerTitle');
                note.firstChild.nextSibling.nextSibling.style.display = 'flex' //enable btnsDiv
                notesContainer.appendChild(note)
                overlay.innerHTML = null;
                obj.getNotes()
                }
            }
            )
            break
    
        }
        
        else continue;
    }
}


document.addEventListener('DOMContentLoaded' , function(){obj.getNotes()})
mainBtn.addEventListener('click' , function(){obj.verfication()})
clr.addEventListener('click' , function(){textArea.value = null})
notesContainer.addEventListener('click' , buttonsFunctionality)


//save to local storage
// add it to html instead of adding to local storage then calling getnotes

//in display popup.
//instead of taking the note to the overlay leave it but fix the z-index;

//adding note animation is bad//

//closing popup animation is bad