import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/products/category/groceries`);
        return response.data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/products/category/groceries`);
        const products = response.data.products;

        // Extract unique tags and capitalize them
        const tags = [...new Set(products.flatMap(p => p.tags))];
        const unwantedTags = ['pet supplies', 'cat food', 'dog food', 'health supplements', 'condiments', 'cooking essentials'];

        const formattedTags = tags
            .filter(tag => !unwantedTags.includes(tag.toLowerCase()))
            .map(tag =>
                tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')
            ).sort();

        return ['All', ...formattedTags];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};
