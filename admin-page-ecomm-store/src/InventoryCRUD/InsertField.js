import { Button } from '@mui/material';
import './InsertField.css';
import './EditDeleteField.css';
import Axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL, getMetadata, deleteObject } from "firebase/storage";
// import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import firebaseConfig from '../fbconfig';

const app = initializeApp(firebaseConfig);

export function InsertField() {
    const storage = getStorage(app);
    console.log(storage);

    const [keyState, setKeyState] = useState('');
    const [file, setFile] = useState(null)
    // const [imageSource, setImageSource] = useState('');   
    const [storageRef, setStorageRef] = useState(null)
    const [isUploading, setIsUploading] = useState(false);

    const [invalidStatus, setInvalidStatus] = useState(true); //SHOW MESSAGE FOR NUMBERS ONLY

    const [inputValues, setInputValues] = useState({
      name: '',
      size: '',
      medium: '',
      price: '',
      img: '',
      prodkey: '',
      stripeInvData: {type: 'Print to order'},
      author: '',
    });

    const [savedStatus, setSavedStatus] = useState(false);

    let imageSrc = null;


    //////////////////////



    function getFileInfo(event){
        setInputValues({ ...inputValues, img: 'ok' });
        console.log(event.target.files[0], event.target.files)
        setFile(event.target.files[0])
        // setFile(event.target.files)
        console.log(file)
    }

    let imgName = null;
    useEffect(() => {
        console.log(file);
        imgName =  keyState;
        // console.log(imgName)
        // const storageRef = ref(storage, `images/${imgName}`);
        setStorageRef(ref(storage, `images/${imgName}`))
        // console.log('storageRef state updated ' + storageRef)
        // console.log('name of image is '+ imgName)
    }, [file]);
    
    let inputObject = {};


    async function insert() {
      const pattern = /^[0-9]*$/;
      if(pattern.test(inputValues.price)){
        const fileRef = storageRef.path_; ////test out tomorrow
        // ref(storage, `images/${inputValues.prodkey}`);
        console.log(fileRef)
        const fileExists = await getMetadata(fileRef)
        .then(metadata => {
          if (metadata) {
            return true;
          } else {
            return false;
          }
        })
        .catch(error => {
          console.log(error + ' - storage/object-not-found');
          return error;
        });
      
        if (fileExists) {
          alert('Make sure you are creating a unique product key. Duplicates are not allowed.');
          return false;
        } else {
          // proceed with uploading the file
          setIsUploading(true);
          console.log(storageRef, file);
          await uploadBytes(storageRef, file);
          setIsUploading(false);
          const url = await getDownloadURL(storageRef)
            
          console.log(url);
          imageSrc = url;
          setKeyState('');

          // Insert the data into the database
          const dynamicObjName = inputValues.prodkey;
          inputObject = {
            [dynamicObjName]: {
              name: inputValues.name,
              size: inputValues.size,
              medium: inputValues.medium,
              price: inputValues.price,
              image: imageSrc,
              prodkey: inputValues.prodkey,
              stripeInvData: inputValues.stripeInvData,
              author: inputValues.author,
            }
          };

          try {
            // console.log(inputObject);
            const insertRes = await Axios.post('https://us-central1-admin-page-vea-collections.cloudfunctions.net/admApp/insert', inputObject)
            if(insertRes.status === 200){
              alert('Your item has been added to your inventory!')
              setSavedStatus(!savedStatus); //this line refreshes the rows in the table
            }
            else if (insertRes.status == 500){
              alert("Make sure you are creating a unique product key. Duplicates are not allowed.")
            }
                 
            setInputValues({
              name: '',
              size: '',
              medium: '',
              price: '',
              img: '',
              prodkey: '',
              stripeInvData: '',
              author: '',
            });
            
          } catch (error) {
            console.error(error);
            return false;
          }
        
        }

      } else {  //condition for if input text fails regex pattern
        setInvalidStatus(false);
        setInputValues({
          name: '',
          size: '',
          medium: '',
          // price: '',
          img: '',
          prodkey: '',
          stripeInvData: null,
          author: null,
        });
        return false;
      }
    }
    
    useEffect(() => {
      const pattern = /^[0-9]*$/;
      if (pattern.test(inputValues.price)) {
        setInvalidStatus(true);
      }
    }, [inputValues.price])

    
    function handleKeyInput (e){
        // console.log(e.target.value);
        return setKeyState(e.target.value);
    }
    
    const [status, setStatus] = useState(true)

    
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
    
      const veaWolf = () => {
        setInputValues({ ...inputValues, author: {name: 'Vea Wolf'} });
      }
      const tmVea = () => {
        setInputValues({ ...inputValues, author: {name: 'T.M. Vea'} });
      }

      useEffect(() => {
        const validName = inputValues.name !== '';
        const validSize = inputValues.size !== '';
        const validMedium = inputValues.medium !== '';

        const validPrice = inputValues.price !== '';
        const validImg = inputValues.img !== '';
        const validProdkey = inputValues.prodkey !== '';
        const validRadio = inputValues.stripeInvData !== '';
        const validAuthor = inputValues.author !== '';

        setStatus(validName && validSize && validMedium && validPrice && validImg && validProdkey && validRadio && validAuthor ? false : true);
        
      }, [inputValues]);
    
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
                    <input onChange={handleInputChange} value={inputValues.price} required={true} placeholder='ex: 20' name='price' inputMode='numeric' />
                    
                    <label for="prodkey">Write a product key in all lowercase or all uppercase. <br/> Recommended to assign one alphabetic integer per inventory item.<br/> For example: "one" for item 1, "two" for item 2, "three" for item 3, etc. </label>
                    <input required={true} value={inputValues.prodkey} onChange={handleInputChange} onKeyUp={handleKeyInput} name='prodkey' type="text" autoComplete='false'/>

                    <label for="img">Image File</label>
                    <input required={true} onChange={getFileInfo} name='img' type="file" multiple="false" accept="image/*" />
                    
                    <div>
                        <p>Set whether item has finite quantity or infinite</p>
                        <label for="infinite">Print to order (infinite)</label>
                        <input id='infinite' value={inputValues.stripeInvData} onClick={sendInfinite} name='stripeInvData' type="radio" required/>
                        
                        <label for="finite">Selling original (finite)</label>
                        <input id='finite' value={inputValues.stripeInvData} onClick={sendFinite} name='stripeInvData' type="radio"/>
                    </div>
                    <br/>

                    <div>
                        <p>Creator of artwork:</p>
                        <label for="veaWolf">Vea Wolf</label>
                        <input id='veaWolf' value={inputValues.author} onClick={veaWolf} name='author' type="radio" required/>
                        
                        <label for="tmVea">T.M. Vea</label>
                        <input id='tmVea' value={inputValues.author} onClick={tmVea} name='author' type="radio"/>
                    </div>
                    <br/>

                    <Button disabled={status} onClick={handleSubmit} variant='contained' >{isUploading == false ? 'Add Product' 
                    : 
                    <>
                      <CircularProgress/>
                          <Typography variant="caption" component="div" color="text.secondary">
                              Uploading...
                          </Typography>        
                    </>}
                    </Button>
                    <p hidden={invalidStatus} id='regex-msg'>Make sure that the price field is filled with numbers only.</p>
                    
            </form>             
        </fieldset>
        </>
    )
}


export function EditDeleteField(){
  const storage = getStorage(app);
  
  const [rows, setRows] = useState(null);
  
  const [editable, setEditable] = useState(true);
  
  const [editingRow, setEditingRow] = useState(null);
  
  const [stateEditObj, setStateEditObj] = useState({
    name: '',
    size: '',
    medium: '',
    price: '',
    prodkey: '',
    invtype: '',
    author: '',
  });
     
  const [savedStatus, setSavedStatus] = useState(false);


    useEffect(()=> {
      Axios.get('https://us-central1-admin-page-vea-collections.cloudfunctions.net/admApp/getRows')
      .then(result => setRows(result.data))
      .catch(error => alert(error))
  
    }, [savedStatus]);
  
    function handleEdit (prodkey){
      setEditingRow(prodkey)
  
      // console.log(prodkey)
      const theRow = rows.find(curIt => curIt.prodkey === prodkey)
      // console.log(theRow)
        setStateEditObj({
          name: theRow.name,
          size: theRow.size,
          medium: theRow.medium,
          price: theRow.price,
          prodkey: theRow.prodkey,
          invtype: theRow.invtype,
          author: theRow.author,
        })
      
  
      // console.log(stateEditObj)
  
    }
  
    function handleSave (){
      const pattern = /^[0-9]*$/;
      let editObj = stateEditObj;
      
      if(pattern.test(stateEditObj.price)){
        // console.log(editObj)
        Axios.post('https://us-central1-admin-page-vea-collections.cloudfunctions.net/admApp/edit', editObj) 
        .then(setEditingRow(null))
        .then(alert('Your modifications have been saved.'))
    
        setSavedStatus(!savedStatus)
      }
      else {
        alert('Price input field can take numbers only.')
      }
    }
  
  
    function handleRemove(prodkey) {
  
      // console.log(prodkey)
  
      const fileRef = ref(storage, `images/${prodkey}`);
  
      const key = prodkey;
      const confirm = window.confirm('Are you sure?'); 
      if(confirm){
        deleteObject(fileRef)
        Axios.post('https://us-central1-admin-page-vea-collections.cloudfunctions.net/admApp/deleteRow', key) 
        .then(setSavedStatus(!savedStatus))
        .then(alert('Your item has been removed from the store inventory.'))
        .catch(error => alert(error))
      }
  
    }
  
    function refreshRows(){
      setSavedStatus(!savedStatus)
    }
  
    return(
      <Paper
      sx={{
        p: 2,
        display: 'flex',
          flexDirection: 'column',
          height: 'auto',
          backgroundColor: 'darkred',
        }}
        >
        <Button onClick={refreshRows} variant='contained' style={{width: '50%', margin: 'auto'}}>Refresh Rows</Button>
          {/* {console.log(rows)} */}
              <table>
                  <thead>
                      <tr>
                          <th>ID</th><th>Name</th><th>Size</th><th>Medium</th><th>Price</th><th>Image Source</th><th>Unique Key</th><th>Inv. Type</th><th>Author</th><th>Edit/Delete</th>
                      </tr>
                  </thead>
                  <tbody>
                  {rows ? ( 
                      
                      <>
                          {rows.map(item=> (
                              <tr key={item.prodkey}>
                                  <td>{item.id}</td>
                                  <td>{editingRow === item.prodkey ? (<input type='text' name='name' disabled={false} defaultValue={item.name} onChange={e => setStateEditObj({...stateEditObj, name: e.target.value})}/>) : (item.name)}</td>
                                  {/* <td>{item.size}</td>  */}
                                  <td>{editingRow === item.prodkey ? (<input type='text' name='size' disabled={false} defaultValue={item.size} onChange={e => setStateEditObj({...stateEditObj, size: e.target.value})}/>) : (item.size)}</td>
                                  {/* <td>{item.medium}</td> */}
                                  <td>{editingRow === item.prodkey ? (<input type='text' name='medium' disabled={false} defaultValue={item.medium} onChange={e => setStateEditObj({...stateEditObj, medium: e.target.value})}/>) : (item.medium)}</td>
                                  {/* <td>{item.price}</td> */}
                                  <td>{editingRow === item.prodkey ? (<input type='text' inputMode='numeric' name='price' disabled={false} defaultValue={item.price} onChange={e => setStateEditObj({...stateEditObj, price: e.target.value})}/>) : ('$' + item.price + ' USD')}</td>
                                  <td>{item.imgsrc}</td>
                                  <td>{editingRow === item.prodkey ? (<input type='text' name='prodkey' disabled={false} defaultValue={item.prodkey} onChange={e => setStateEditObj({...stateEditObj, prodkey: e.target.value})}/>) : (item.prodkey)}</td>
  
                                  {/* <td>{item.prodkey}</td> */}
                                  {/* <td>{item.invtype}</td> */}
                                  <td>{editingRow === item.prodkey ? (<div>
                                      <label for="infinite">Print to order (infinite)</label>
                                      <input id='infinite'  onClick={e => setStateEditObj({...stateEditObj, invtype: 'Print to order'})} name='stripeInvData' type="radio"/>
                                      <label for="finite">Original (finite)</label>
                                      <input id='finite' onClick={e => setStateEditObj({...stateEditObj, invtype: 'Original'})} name='stripeInvData' type="radio"/>                                    
                                    </div>
                                  ) : (item.invtype)}</td>
  
                                  <td id='authorTd'>{editingRow === item.prodkey ? (<div>
                                    <label for="veaWolf">Vea Wolf</label>
                                    <input id='veaWolf'  onClick={e => setStateEditObj({...stateEditObj, author: 'Vea Wolf'})} name='author' type="radio"/> <br/><br/>
                                    <label for="tmVea">T.M. Vea</label>
                                    <input id='tmVea' onClick={e => setStateEditObj({...stateEditObj, author: 'T.M. Vea'})} name='author' type="radio"/>                                    
                                  </div>
                                ) : (item.author)}</td>
  
                                <td> {editingRow === item.prodkey ? (<div>
                                  <Button onClick={handleSave}>Save</Button> <Button onClick={() => handleRemove(item.prodkey)}>Remove</Button></div>)
                                 
                                : 
                                <div>{<Button onClick={()=> handleEdit(item.prodkey)}>Edit</Button>} <Button onClick={() => handleRemove(item.prodkey)}>Remove</Button></div>}
                                </td>
                              </tr>
                          ))}
                      </>)
                 : (<div><p id='loading'>Loading...</p></div>)
                }
                  </tbody>
              </table>
  
  
  
      </Paper>
  
  
    )
    
  }