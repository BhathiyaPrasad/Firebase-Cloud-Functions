import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, doc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAW-tl3Y5dtKWgNJG_rEb6YH7fcacs-wq0",
    authDomain: "bhathiya-cloud-functions-242d4.firebaseapp.com",
    projectId: "bhathiya-cloud-functions-242d4",
    storageBucket: "bhathiya-cloud-functions-242d4.appspot.com",
    messagingSenderId: "969048079411",
    appId: "1:969048079411:web:3c8c2439a7b966596ef746",
    measurementId: "G-7MEMK82J4G"
};
// // Initialize Firebase app
// const app = initializeApp(firebaseConfig);

// // Initialize Firestore
// const db = getFirestore(app);

// //Function to retrieve item data from the 'items' document within the 'saluni-fashion' document
// async function getItemData() {
//     try {
//         const itemDoc = collection(doc(db, "organizations", "saluni-fashion"), "items");
//         const itemSnapshot = await getDocs(itemDoc);
//         if (!itemSnapshot.empty) {
//             return itemSnapshot.docs[0].data(); // Assuming there is only one document in the 'items' collection
//         } else {
//             console.error("Item data does not exist in the 'items' document within 'saluni-fashion'.");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error retrieving item data:", error);
//         throw error; // Propagate the error for handling
//     }
// }

// // Function to retrieve product stock management data from the 'products_stock_management' document within the 'saluni-fashion' document
// async function getProductStockData() {
//     try {
//         const stockDoc = collection(doc(db, "organizations", "saluni-fashion"), "products_stock_management");
//         const stockSnapshot = await getDocs(stockDoc);
//         if (!stockSnapshot.empty) {
//             return stockSnapshot.docs[0].data(); // Assuming there is only one document in the 'products_stock_management' collection
//         } else {
//             console.error("Product stock management data does not exist in the 'products_stock_management' document within 'saluni-fashion'.");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error retrieving product stock data:", error);
//         throw error; // Propagate the error for handling
//     }
// }

// //Function to aggregate item data and product stock management data
// async function aggregateData() {
//     try {
//         const itemData = await getItemData();
//         const stockData = await getProductStockData();

//         if (!itemData || !stockData) {
//             console.error("Failed to retrieve item data or product stock management data.");
//             return null;
//         }

//         // Merge the data as needed
//         const aggregatedData = {
//             items: itemData,
//             productStockManagement: stockData
//             // Add more properties as needed
//         };

//         return aggregatedData;
//     } catch (error) {
//         console.error("Error aggregating data:", error);
//         throw error; // Propagate the error for handling
//     }
// }

// // Example usage:
// async function fetchDataAndAggregate() {
//     try {
//         const aggregatedData = await aggregateData();
//         if (aggregatedData) {
//             console.log("Aggregated data:", aggregatedData);
//         } else {
//             console.log("Failed to aggregate data.");
//         }
//     } catch (error) {
//         console.error("Error fetching and aggregating data:", error);
//         // Handle errors gracefully
//     }
// }

// // Call the function to fetch and aggregate data
// fetchDataAndAggregate();
//-------------------------------------------------------------------------------------------------------------
// var productsCollection = collection(db, "organizations", "saluni-fashion", "items");
// var otherCollection = collection(db, "organizations", "saluni-fashion", "products_stock_management");


// // Function to read data from products collection
// function readProductsData() {
//     if (productsCollection === null){console.log("null");

//     }else{
//         console.log(productsCollection);
//     }
//     productsCollection.get().then(function(querySnapshot) {
//       querySnapshot.forEach(function(doc) {
//         // Get the product ID from each document
//         var productId = doc.id;

//         // Get other data from the product document
//         var productData = doc.data();

//         // Process the data as needed
//         console.log("Product ID: ", productData.item_id);
//         console.log("Product Data: ", productData.name);

//         // Call a function to read data from other collection based on product ID
//         // readOtherCollectionData(productId);
//       });
//     }).catch(function(error) {
//       console.log("Error getting products documents: ", error);
//     });
//   }
//   readProductsData();
//   // Function to read data from other collection based on product ID
//   function readOtherCollectionData(productId) {
//     otherCollection.where("product-id", "==", productId).get().then(function(querySnapshot) {
//       querySnapshot.forEach(function(doc) {
//         // Get data from the document in the other collection
//         var otherData = doc.data();

//         // Get the quantity field from the other data
//         var quantity = otherData.quantity;

//         // Process the other data as needed
//         console.log("Quantity for Product ID", productId, ": ", quantity);
//         console.log("Other Data: ", otherData);
//       });
//     }).catch(function(error) {
//       console.log("Error getting other collection documents: ", error);
//     });
//   }
//----------------------------------------------------------------------------------------------------------------------------

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Get a Firestore reference
const firestore = getFirestore(firebaseApp);

// Collection references
const itemsCollectionRef = collection(firestore, 'organizations/saluni-fashion/items');
const stockCollectionRef = collection(firestore, 'organizations/saluni-fashion/products_stock_management');

async function getProductStockData() {
    // Retrieve data from "items" collection
    const snapItm = getDocs(itemsCollectionRef)
        .then(itemsSnapshot => {
            itemsSnapshot.forEach(async itemDoc => {
                const itemData = itemDoc.data();
                const itemId = itemData.item_id;
                //const ff = itemData.doc(itemDoc.id);

                console.log("itemData " + itemData.item_id)
                console.log("----")
                // Query to find matching stock document based on product-id
                const stockQuery = query(stockCollectionRef, where("product_id", "==", itemId));
                const stockSnapshot = await getDocs(stockQuery);

                stockSnapshot.forEach(stockDoc => {
                    const stockData = stockDoc.data();
                    const quantity = stockData.qty; // Assuming there's a field "quantity" in the stock document
                    console.log(`Item ID: ${itemId}, Quantity in Stock: ${quantity}`);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching items:', error);
        });

    //console.log(snapItm);
}

getProductStockData();


// // Retrieve data from "stock" collection
// getDocs(stockCollectionRef)
//   .then(stockSnapshot => {
//     const stockData = [];
//     stockSnapshot.forEach(stockDoc => {
//       const stock = stockDoc.data();
//       stockData.push(stock);
//     });
//     console.log('Stock Data:', stockData);
//   })
//   .catch(error => {
//     console.error('Error fetching stock:', error);
//   });