import asyncError from "../middleware/catchAsynceroor.js";
import Product from "../models/productModels.js";
import Apifeatures from "../utils/apiFeatures.js";
import ErrorHandler from "../utils/errorhandler.js";


// Create Product --admin
const createProduct = asyncError(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product
  })
})

// get all Product -- Admin
const getAllProducts = asyncError(async (req, res) => {
  const resultperPage = 5;
  const productCount = await Product.countDocuments();
  const apifeature = new Apifeatures(Product.find(), req.query).search().filter().pagination(resultperPage)
  const products = await apifeature.query;
  res.status(200).json({
    messgae: "All Products Find",
    success: true,
    products,
    productCount
  })
})
const getProductDetails = asyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404))
  }

  res.status(200).json({
    success: true,
    message: "Product Find successfully",
    product,
  });
})
// const getProductDetails = async (req, res,next) => {
//     // const products = await Product.findById(req.params.id)

//      try {
//         let product = await Product.findById(req.params.id);
//         if (!product) {
//           return next(new ErrorHandler("Product not found",404))
//         //   res.status(404).json({
//         //     success: false,
//         //     message: "Product not found",
//         //   });
//          }      

//         res.status(200).json({
//           success: true,
//           message: "Product Find successfully",
//           product,
//         });
//       } catch (error) {
//         res.status(500).json({
//           success: false,
//           message: "Internal Server Error",
//           error: error.message,
//         });
//       }
// }

// updte  Product -- Admin
// const updateProduct = async (req, res) => {
//     let product = await Product.findById(req.params.id)
//     if (!product) {
//          res.status(500).json({
//             success: false,
//             message: "Product not Found",
//         })
//     }else{
//         product = await Product.findByIdAndUpdate(req.params.id,req.body,{
//             new:true,
//             runValidators:true,
//             useFindAndModify:false})
//         res.status(200).json({
//             success: true,
//             message: "Products Updated Successfully",
//             product
//         })
//     }

// }
const updateProduct = asyncError(
  async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  }
);

// async (req, res,next) => {
//     try {
//       let product = await Product.findById(req.params.id);
//       if (!product) {
//         return next(new ErrorHandler("Product not found",404))
//         // res.status(404).json({
//         //   success: false,
//         //   message: "Product not found",
//         // });
//       }

//       product = await Product.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         {
//           new: true,
//           runValidators: true,
//           useFindAndModify: false,
//         }
//       );

//       res.status(200).json({
//         success: true,
//         message: "Product updated successfully",
//         product,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Internal Server Error",
//         error: error.message,
//       });
//     }
//   };

// Delete product - admin
// const deleteProduct = async (req, res) => {
//     let product = await Product.findById(req.params.id)
//     if (!product) {
//         return res.status(500).json({
//             success: false,
//             messgae: "Product not Found",
//         })
//     }
//     product = await Product.findByIdAndUpdate(req.params.id,req.body,{
//         new:true,
//         runValidators:true,
//         useFindAndModify:false})
//     res.status(200).json({
//         success: true,
//         messgae: "Products Updated Successfully",
//         product
//     })
// }
const deleteProduct = asyncError(
  async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404))
    }
    product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product Deleted successfully",
      product,
    });

  }
);

// async (req, res,next) => {
//     try {
//       let product = await Product.findById(req.params.id);
//       if (!product) {
//         return next(new ErrorHandler("Product not found",404))
//         // res.status(404).json({
//         //   success: false,
//         //   message: "Product not found",
//         // });
//       }

//       product = await Product.findByIdAndDelete(req.params.id);  
//       res.status(200).json({
//         success: true,
//         message: "Product Deleted successfully",
//         product,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Internal Server Error",
//         error: error.message,
//       });
//     }
//   };


export default { getAllProducts, getProductDetails, createProduct, updateProduct, deleteProduct };