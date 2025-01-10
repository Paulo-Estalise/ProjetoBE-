const Product = require('../models/productModel');

module.exports = {
    getAllProducts: async (req, res) => {
        try {
            const { limit = 10, page = 1, sort = 'asc', query = '' } = req.query;
            const filter = query ? { category: query } : {};
            const sortOption = sort === 'desc' ? { price: -1 } : { price: 1 };

            const products = await Product.find(filter)
                .limit(Number(limit))
                .skip((page - 1) * limit)
                .sort(sortOption);

            const totalProducts = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limit);

            res.json({
                status: 'success',
                payload: products,
                totalPages,
                prevPage: page > 1 ? Number(page) - 1 : null,
                nextPage: page < totalPages ? Number(page) + 1 : null,
                page: Number(page),
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevLink: page > 1 ? `/products?page=${page - 1}&limit=${limit}` : null,
                nextLink: page < totalPages ? `/products?page=${page + 1}&limit=${limit}` : null
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    getProductById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.pid);
            if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });

            res.json({ status: 'success', payload: product });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    createProduct: async (req, res) => {
        try {
            const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
            const newProduct = new Product({ title, description, code, price, stock, category, thumbnails });
            await newProduct.save();
            res.status(201).json({ status: 'success', payload: newProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
            if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Product not found' });

            res.json({ status: 'success', payload: updatedProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
            if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Product not found' });

            res.json({ status: 'success', payload: deletedProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
};
