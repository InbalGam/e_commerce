import { useState } from 'react';
import { useSelector } from 'react-redux';
import {selectCategories} from '../store/categorySlice';
import {  Link } from "react-router-dom";


function SearchList(props) {
    const categories = useSelector(selectCategories);
    const categoriesList = categories.map(el => {return {id: el.id, text: el.categoryName}});
    console.log(categoriesList);

    const filteredData = categoriesList.filter((el) => {
        //if no input then return the original
        if (props.input === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.text.toLowerCase().includes(props.input)
        }
    });


    return (
        <ul>
            {filteredData.map((item) => (
                <li key={item.id}><Link to={`category/${item.id}/products`}>{item.text}</Link></li>
            ))}
        </ul>
    )
}

export default SearchList;