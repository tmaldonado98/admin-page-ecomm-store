import { Button } from '@mui/material';
import './InsertField.css';
import Axios from 'axios';
import { initializeApp } from 'firebase/app';
import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
  import Typography from '@mui/material/Typography';
  import Box from '@mui/material/Box';
  import Dialog from '@mui/material/Dialog';
  
  import { useState, useEffect } from 'react';
  import { display } from '@mui/system';
  import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function onlyNumbers(e){
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        return false;
    }
    // return true;
}

const firebaseConfig = {
   // your Firebase app configuration object
   apiKey: process.env.API_KEY ,
   authDomain: process.env.AUTH_DOMAIN,
   projectId: process.env.PROJECT_ID,
   storageBucket: "vea-collections.appspot.com", //process.env.STORAGE_BUCKET,
   messagingSenderId: process.env.MESSAGING_SENDER_ID,
   appId: process.env.APP_ID,
   measurementId: process.env.MEASUREMENT_ID
 };
const firebaseApp = initializeApp(firebaseConfig);

export default function InsertField() {
    const storage = getStorage(firebaseApp);

    const [keyState, setKeyState] = useState('');
    const [file, setFile] = useState(null)
    // const [imageSource, setImageSource] = useState('');   
    const [storageRef, setStorageRef] = useState(null)
    const [isUploading, setIsUploading] = useState(false);

    let imageSrc = null;

    function getFileInfo(event){
        setInputValues({ ...inputValues, img: 'ok' });
        setFile(event.target.files[0])
        // file = event.target.files[0];
        // console.log(file)
    }
    useEffect(() => {
        console.log(file);
        let imgName =  keyState;

        // const storageRef = ref(storage, `images/${imgName}`);
        setStorageRef(ref(storage, `images/${imgName}`))
        // console.log('storageRef state updated ' + storageRef)
        // console.log('name of image is '+ imgName)
    }, [file]);
    
    // function handleFileUpload(event){

    //     // let imgName =  keyState;

    //     // const storage = getStorage(firebaseApp);
    //     // const storageRef = ref(storage, `images/${imgName}`);
        
    //     // uploadBytes(storageRef, file)
    //     // .then((snapshot) => {
    //     //     // storageRef = 
    //     //     console.log('File uploaded successfully with name: ' + imgName);

    //     //     getDownloadURL(storageRef)
    //     //     .then((url) => {
    //     //         setImageSource(url);
    //     //         // const img = document.getElementById('preview');
    //     //         // img.setAttribute('src', url);
    //     //         console.log(imageSource);
    //     //     })
    //     //     setKeyState('');
    //     // })
    //     // .catch((error) => {
    //     //     console.error('Error uploading file', error);
    //     // });
        

    //     // setTimeout(() => {

    //         // await getDownloadURL(storageRef)
    //         //     .then((url) => {
    //         //         setImageSource(url);
    //         //         // const img = document.getElementById('preview');
    //         //         // img.setAttribute('src', url);
    //         //         console.log(imageSource);
    //         // })
    //     // }, 1000)

    //     // Create a reference to the file in Firebase Storage
    //     // const storageRef = storage.ref().child(`images/${file.name}`);

    // }

    async function insert(){

        setIsUploading(true);
        await uploadBytes(storageRef, file)
        setIsUploading(false)
        await getDownloadURL(storageRef)
        .then((url) => {
            console.log(url)
            imageSrc = url;
            // setImageSource(url);
            // console.log(imageSource)
            // const img = document.getElementById('preview');
            // img.setAttribute('src', url);
            setKeyState('');
        })
            
        // .then((snapshot) => {
        //     // console.log('File uploaded successfully with name: ' + keyState);           
        // })
        .then(() => {
            let inputObject = {};
            const input = document.getElementsByTagName("input");

            // let dynamicObjName = input['prodkey'].value;
            let dynamicObjName = inputValues.prodkey;
            //check: if inputObject already has inputValues.prodkey then return false
        //    if(inputObject.hasOwnProperty(`${dynamicObjName}`)){
           if(inputObject[dynamicObjName] === inputValues.prodkey){
            return false
           } else {
               inputObject = {
                   [dynamicObjName]: {
                       name: inputValues.name,
                       size: inputValues.size,
                       medium: inputValues.medium,
    
                       price: inputValues.price,
                       // image: imageSource,
                       image: imageSrc,
                       prodkey: inputValues.prodkey,
                       stripeInvData: inputValues.stripeInvData,
                       // name: (input['name'].value),
                       // size: (input['size'].value),
                       // medium: (input['medium'].value),
           
                       // price: (input['price'].value),
                       // // blob: (input['img'].value),
                       // image: imageSource,
                       // prodkey: (input['prodkey'].value)
                   }
                }
            
            }

                console.log(inputObject)
                const dynObj = Object.keys(inputObject);
                // {headers: {'Content-Type': 'multipart/form-data'}}
                Axios.post('http://localhost:3003/api/insert', inputObject)
                .then(result => alert(result))
                .catch(error => alert(error+ "  Make sure you are creating a unique product key. Duplicates are not allowed."), input.value = '')


        })
        .then(setInputValues({
            name: '',
            size: '',
            medium: '',
            price: '',
            img: '',
            prodkey: '',
            stripeInvData: null,
          })
          )
        .catch((error) => {
           alert('Error uploading file', error);
        })
    }

    function handleKeyInput (e){
        // console.log(e.target.value);
        return setKeyState(e.target.value);
    }
    
    

    
    const [status, setStatus] = useState(true)

    const [inputValues, setInputValues] = useState({
        name: '',
        size: '',
        medium: '',
        price: '',
        img: '',
        prodkey: '',
        stripeInvData: '',
      });
    
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
      };

      const sendInfinite = () => {
        setInputValues({ ...inputValues, stripeInvData: {type: 'Print to order'} });
      }
      const sendFinite = () => {
        setInputValues({ ...inputValues, stripeInvData: {type: 'Original', quantity: 1} });
      }
    
      useEffect(() => {
        const validName = inputValues.name !== '';
        const validSize = inputValues.size !== '';
        const validMedium = inputValues.medium !== '';

        const validPrice = inputValues.price !== '';
        const validImg = inputValues.img !== '';
        const validProdkey = inputValues.prodkey !== '';
        const validRadio = inputValues.stripeInvData !== null;

        setStatus(validName && validSize && validMedium && validPrice && validImg && validProdkey && validRadio ? false : true);
      }, [inputValues]);
    
    //   function handleFileInput(){
    //     // handleFileUpload(event);
    //     setInputValues({ ...inputValues, img: true });
    //   }

    //   function handleKeyChange(){
    //     handleKeyInput();
    //     handleInputChange();
    //   }
    
    function handleSubmit (){
        insert();
        // setInputValues({
        //     name: '',
        //     size: '',
        //     medium: '',
        //     price: '',
        //     img: '',
        //     prodkey: '',
        //     stripeInvData: undefined,
        //   });
          setStatus(true);
          document.querySelector('input[type=file]').value = '';
          imageSrc = null;
    }

    return (
        <>
        <fieldset>
            <legend>Add Product To Inventory And Present On Live Site</legend>
            <form encType="multipart/form-data" id='container'>
                                       
                {/* <div > */}
                    
                    <label for="name">Item Name (no "" double nor '' single quotes)</label>
                    <input onChange={handleInputChange} value={inputValues.name} required={true} placeholder='Item Name' name='name' type="text"/>
                    
                    <label for="size">Size (format as: number" x number")</label>
                    <input onChange={handleInputChange} value={inputValues.size} required={true} placeholder='ex: 30" x 30"' name='size' type="text"/>
                    
                    <label for="medium">Medium</label>
                    <input onChange={handleInputChange} value={inputValues.medium} required={true} name='medium' type="text"/>
                    
                    <label for="price">Price (numbers only)</label>
                    <input onChange={handleInputChange} value={inputValues.price} required={true} placeholder='ex: 20' name='price' inputMode='numeric' pattern="\d*" onKeyDown={onlyNumbers} />
                    
                    <label for="prodkey">Write a product key in all lowercase or all uppercase. <br/> Recommended to assign one alphabetic integer per inventory item.<br/> For example: "one" for item 1, "two" for item 2, "three" for item 3, etc. </label>
                    <input required={true} value={inputValues.prodkey} onChange={handleInputChange} onKeyUp={handleKeyInput} name='prodkey' type="text" autoComplete='false'/>

                    <label for="img">Image File</label>
                    <input required={true} on onChange={getFileInfo} name='img' type="file" multiple="false" accept="image/*" />
                    
                    <div>
                        <p>Set whether item has finite quantity or infinite</p>
                        <label for="infinite">Print to order (infinite)</label>
                        <input id='infinite' value={inputValues.stripeInvData} onClick={sendInfinite} name='stripeInvData' type="radio" required/>
                        
                        <label for="finite">Selling original (finite)</label>
                        <input id='finite' value={inputValues.stripeInvData} onClick={sendFinite} name='stripeInvData' type="radio"/>
                    </div>
{/* 
                    <div id='img-preview'>
                        <p>Image Preview (size will be bigger on store page)</p>
                        {<img id='preview' width={200} height={200} />}
                    </div>
                     */}
                    <br/>

                    <Button disabled={status} onClick={handleSubmit} variant='contained' >{isUploading == false ? 'Add Product' : 
<>
                                    <CircularProgress/>
                                        <Typography variant="caption" component="div" color="text.secondary">
                                            Uploading...
                                        </Typography>
                                        
    
</>                      }
                      </Button>
                    
            {/* </div> */}
            </form>             
        </fieldset>
        </>
    )
}
