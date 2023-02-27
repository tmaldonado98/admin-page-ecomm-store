import { Button } from '@mui/material';
import './InsertField.css';
import Axios from 'axios';
import { initializeApp } from 'firebase/app';
// import firebase from 'firebase/app';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from 'react';

function onlyNumbers(e){
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        return false;
    }
    // return true;
}

const firebaseConfig = {
   // your Firebase app configuration object
   apiKey: "AIzaSyAg98s9T7TSlWTywldvgiFqUGlMZlcwy-U",
   authDomain: "vea-collections.firebaseapp.com",
   projectId: "vea-collections",
   storageBucket: "vea-collections.appspot.com",
   messagingSenderId: "616842123391",
   appId: "1:616842123391:web:60cbf95825eb5554b6074a",
   measurementId: "G-S37FFT9HJ3"
 };
const firebaseApp = initializeApp(firebaseConfig);


// // Create a reference to 'mountains.jpg'
// const mountainsRef = ref(storage, 'mountains.jpg');

// // Create a reference to 'images/mountains.jpg'
// const mountainImagesRef = ref(storage, 'images/mountains.jpg');


export default function InsertField() {

      const [keyState, setKeyState] = useState('');

    function insert(e){
        e.preventDefault();
        let inputValues = {};
        const input = document.getElementsByTagName("input");
        // console.log(input);
        let dynamicObjName = input['prodkey'].value;
        
        inputValues = {
            [dynamicObjName]: {
                name: (input['name'].value),
                size: (input['size'].value),
                medium: (input['medium'].value),
    
                price: (input['price'].value),
                blob: (input['img'].value.toString('base64')),
                prodkey: (input['prodkey'].value)
            }
        }

        console.log(inputValues)
        const dynObj = Object.keys(inputValues);
        
        Axios.post('http://localhost:3003/api/insert', inputValues, {headers: {'Content-Type': 'multipart/form-data'}})
        .catch(error => alert(error))

        // Axios.post('http://localhost:3003/img', inputValues)
        // .catch(error => alert(error))
        // // return input.value = '';
    
            // path to storage bucket
        // gs://vea-collections.appspot.com
    
    }

    function handleKeyInput (e){
        console.log(e.target.value);
        return setKeyState(e.target.value);
    }
    
    // const [status, setStatus] = useState(true)

    function handleFileUpload(event){


        // let placeholdername = ;
        const imgName =  keyState;
        const file = event.target.files[0];

        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `images/${imgName}.jpg`);


        // Create a reference to the file in Firebase Storage
        // const storageRef = storage.ref().child(`images/${file.name}`);

        uploadBytes(storageRef, file)
        .then((snapshot) => {
          
          console.log('File uploaded successfully with name: ' + imgName);
        })
        .catch((error) => {
          console.error('Error uploading file', error);
        });

    
    }

    const formInputs = document.getElementsByTagName('input');
    // if (for) {
        
        // }
        
        console.log(formInputs);

    return (
        <>
        <fieldset>
            <legend>Add Product To Inventory And Present On Live Site</legend>
            <form action='/api/insert' method='post' encType="multipart/form-data" id='container'>
                
                {/* <div > */}
                    
                    <label for="name">Item Name (no "" double nor '' single quotes)</label>
                    <input required={true} placeholder='Item Name' name='name' type="text"/>
                    
                    <label for="size">Size (format as: number" x number")</label>
                    <input required={true} placeholder='ex: 30" x 30"' name='size' type="text"/>
                    
                    <label for="medium">Medium</label>
                    <input required={true} name='medium' type="text"/>
                    
                    <label for="price">Price (numbers only)</label>
                    <input required={true} placeholder='ex: 20' name='price' inputMode='numeric' pattern="\d*" onKeyDown={onlyNumbers} />
                    
                    <label for="img">Image File</label>
                    <input required={true}  onChange={handleFileUpload} name='img' type="file" multiple="false" accept="image/*" />
                    {/* ADD REQUIRED FOR PHOTO */}
                    {/* <div id='img-preview'><p>Fetch image for preview</p></div> */}
                    
                    <label for="prodkey">Write a product key in all lowercase or all uppercase. <br/> Recommended to assign one alphabetic integer per inventory item.<br/> For example: "one" for item 1, "two" for item 2, "three" for item 3, etc. </label>
                    <input required={true} onKeyUp={handleKeyInput} name='prodkey' type="text"/>
                    <br/>
                    {/* <label for='submit'>Add Product To Inventory And Present On Live Site</label> */}
                    <Button  type='submit' variant='contained' onClick={insert}>Add Product</Button>
                   {/* disabled={status} */}
            {/* </div> */}
            </form> 
            
            {/* ? input.values.length > 0 : noInsert */}
        </fieldset>
        </>
    )
}


// export { firebaseConfig, storage } from './firebase'