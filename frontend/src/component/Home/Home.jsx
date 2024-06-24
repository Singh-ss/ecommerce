import React, { Fragment } from 'react'
import { CgMouse } from 'react-icons/cg';
import './Home.css'
import Product from './Product.jsx';

const product = {
    name: "Blue Tshirt",
    images: [{ url: "https://5.imimg.com/data5/EE/DR/MY-33432963/mens-t-shirt.png" }],
    price: "₹3000",
    _id: "subhanshu",
}

const Home = () => {
    return (
        <Fragment>
            <div className="banner">
                <p>Welcome to Ecommerce</p>
                <h1>FIND AMAZING PRODUCTS BELOW</h1>

                <a href="#container">
                    <button>
                        Scroll <CgMouse />
                    </button>
                </a>
            </div>

            <h2 className='homeHeading'>Featured Products</h2>
            <div className="container" id='container'>
                <Product product={product} />
                <Product product={product} />
                <Product product={product} />
                <Product product={product} />

                <Product product={product} />
                <Product product={product} />
                <Product product={product} />
                <Product product={product} />

            </div>
        </Fragment>
    )
}

export default Home