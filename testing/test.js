import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, doc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLa_nr_0c0kudQSzcGV5hkwq3WH2bRGgo",
    authDomain: "freidea-pos.firebaseapp.com",
    projectId: "freidea-pos",
    storageBucket: "freidea-pos.appspot.com",
    messagingSenderId: "317401437770",
    appId: "1:317401437770:web:2657a877ea9fe88cf878b3",
    measurementId: "G-M8RF0RL2FP"
};
// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

const orgDocId = "InterithmT3";

// Reference to the 'items' collection
const itemsRef = collection(doc(db, "organizations", orgDocId), "items");

// Query to find documents in the 'items' collection where 'item_id' is not empty
const itemsQuery = query(
  itemsRef,
  where("Item_ID", "!=", "")
);

// Retrieve documents from the 'items' collection
const itemQuerySnapshot = await getDocs(itemsQuery);

// Array to store promises of queries
const promises = [];
const itemsData = [];

// Iterate over the documents in the 'items' collection
itemQuerySnapshot.forEach((itemDoc) => {
  const itemData = itemDoc.data();
  itemsData.push(itemData);

  // Reference to the 'products_stock_management' collection
  const productsStockRef = collection(doc(db, "organizations", orgDocId), "products_stock_management");

  // Query to find documents in the 'products_stock_management' collection where 'product_id' is equal to the 'item_id' from 'items' collection
  const productsStockQuery = query(
    productsStockRef,
    where("Product_ID", "==", itemData.Item_ID)
  );

  // Add the promise of the query to the array
  promises.push(getDocs(productsStockQuery));
});

// Wait for all promises to resolve
const snapshots = await Promise.all(promises);

// Array to store matching documents
const aggregatedData = [];

// Iterate over the query snapshots
snapshots.forEach((productsStockSnapshot, index) => {
  const itemData = itemsData[index];

  // Iterate over the documents in the 'products_stock_management' collection
  productsStockSnapshot.forEach((productStockDoc) => {
    const productStockData = productStockDoc.data();

    // Merge item data with product stock data
    const mergedData = {
      ...itemData,
      productStock: productStockData
    };

    // Add the merged data to the array
    aggregatedData.push(mergedData);
    console.log(mergedData.Item_ID, mergedData.productStock.Product_ID);
  });
});

// Output the aggregated data
console.log("Aggregated Data:", aggregatedData);
console.log(aggregatedData.Cat_name);
