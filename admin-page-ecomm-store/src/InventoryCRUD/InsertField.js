import { Button } from '@mui/material';
import './InsertField.css';
import Axios from 'axios';

function onlyNumbers(e){
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        return false;
    }
    // return true;
}

export default function InsertField() {
    
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
    }

    return (
        <>
        <fieldset>
            <legend>Add Product To Inventory And Present On Live Site</legend>
            <form action='/api/insert' method='post' encType="multipart/form-data" id='container'>
                
                {/* <div > */}
                    
                    <label for="name">Item Name (no "" double nor '' single quotes)</label>
                    <input required placeholder='Item Name' name='name' type="text"/>
                    
                    <label for="size">Size (format as: number" x number")</label>
                    <input required placeholder='ex: 30" x 30"' name='size' type="text"/>
                    
                    <label for="medium">Medium</label>
                    <input required name='medium' type="text"/>
                    
                    <label for="price">Price (numbers only)</label>
                    <input required placeholder='ex: 20' name='price' inputMode='numeric' pattern="\d*" onKeyDown={onlyNumbers} />
                    
                    <label for="img">Image File</label>
                    <input name='img' type="file" multiple="false" accept="image/*" />
                    {/* ADD REQUIRED FOR PHOTO */}
                    {/* <div id='img-preview'><p>Fetch image for preview</p></div> */}
                    
                    <label for="prodkey">Write a product key in all lowercase or all uppercase. <br/> Recommended to assign one alphabetic integer per inventory item.<br/> For example: "one" for item 1, "two" for item 2, "three" for item 3, etc. </label>
                    <input required name='prodkey' type="text"/>
                    <br/>
                    {/* <label for='submit'>Add Product To Inventory And Present On Live Site</label> */}
                    <Button type='submit' variant='contained' onClick={insert}>Add Product</Button>
                   
            {/* </div> */}
            </form> 
            
            {/* ? input.values.length > 0 : noInsert */}
        </fieldset>
        </>
    )
}