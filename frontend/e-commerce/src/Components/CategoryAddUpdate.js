import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import styles from './Styles/CategoryAddUpdate.css';


function CategoryAddUpdate(props) {
    const [categoryName, setCategoryName] = useState('');
    const [categoryImg, setCategoryImg] = useState('');

    function handleCategoryNameChange(e) {
        setCategoryName(e.target.value);
    };

    async function imageLoad(e) {
        e.preventDefault();
        setCategoryImg(e.target.files[0]);
    };


    async function setCategory(category) {
        setCategoryName(category.category_name);
    };


    useEffect(() => {
        if (props.category) {
            setCategory(props.category);
        }
    }, []);

    function CategorySubmit(e) {
        e.preventDefault();
        props.onCategorySubmit(categoryName, categoryImg);
    };


    return (
        <form className="categoryForm">
            <input id='categoryName' type='text' name='categoryName' value={categoryName} placeholder={'Enter category name'} onChange={handleCategoryNameChange} className='formParams'/>
            <label htmlFor="categoryImage" className='formParams'>Enter category image - optional</label>
            <input id="categoryImage" type="file" onChange={imageLoad} className='formParams'/>
            <button type="submit" value="Submit" className="submitButton" onClick={CategorySubmit}><SendIcon/></button>
        </form>
    );
};

export default CategoryAddUpdate;