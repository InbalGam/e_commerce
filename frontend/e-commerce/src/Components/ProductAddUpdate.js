import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';


function ProductAddUpdate(props) {
    const [productName, setProductName] = useState('');
    const [productImg, setProductImg] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');

    function handleProductNameChange(e) {
        setProductName(e.target.value);
    };

    function handleQuantityChange(e) {
        setQuantity(e.target.value);
    };

    function handlePriceChange(e) {
        setPrice(e.target.value);
    };

    function handleDiscountChange(e) {
        setDiscount(e.target.value);
    };


    async function imageLoad(e) {
        e.preventDefault();
        setProductImg(e.target.files[0]);
    };


    async function setProduct(product) {
        setProductName(product.productName);
        setPrice(product.price);
        setDiscount(product.discount);
        setQuantity(product.inventoryQuantity);
    };


    useEffect(() => {
        if (props.product) {
            setProduct(props.product);
        }
    }, []);

    function ProductSubmit(e) {
        e.preventDefault();
        const data = {
            productName: productName,
            inventoryQuantity: Number(quantity),
            price: Number(price),
            discountPercetage: Number(discount)
        };
        props.onProductSubmit(data, productImg);
    };


    return (
        <form>
            <input id='productName' type='text' name='productName' value={productName} placeholder={'Enter product name'} onChange={handleProductNameChange} />
            <input id='quantity' type='text' name='quantity' value={quantity} placeholder={'Enter quantity'} onChange={handleQuantityChange} />
            <input id='price' type='text' name='price' value={price} placeholder={'Enter price'} onChange={handlePriceChange} />
            <input id='discount' type='text' name='discount' value={discount} placeholder={'Enter discount if relevant'} onChange={handleDiscountChange} />
            <label htmlFor="productImage">Enter product image - optional</label>
            <input id="productImage" type="file" onChange={imageLoad}/>
            <button type="submit" value="Submit" className="submitButton" onClick={ProductSubmit}><SendIcon/></button>
        </form>
    );
};

export default ProductAddUpdate;