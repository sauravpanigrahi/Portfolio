const mongoose = require('mongoose');
const Contact = require('./models/contact.js');
require('dotenv').config();

async function checkDatabase() {
    try {
        // Get the connection string from environment variable
        let dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/portfolio";
        
        // Check if the connection string is in the format "ATLASDB_URL=mongodb+srv://..."
        if (dbUrl.startsWith('ATLASDB_URL=')) {
            dbUrl = dbUrl.substring('ATLASDB_URL='.length);
        }
        
        console.log("Connecting to MongoDB...");
        console.log("Connection string (redacted):", 
            dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
        
        // Connect to MongoDB
        await mongoose.connect(dbUrl);
        console.log("Connected to MongoDB successfully!");
        
        // Check if there are any contacts in the database
        const contacts = await Contact.find({});
        console.log(`Found ${contacts.length} contacts in the database:`);
        
        if (contacts.length > 0) {
            contacts.forEach((contact, index) => {
                console.log(`\nContact ${index + 1}:`);
                console.log(`Name: ${contact.name}`);
                console.log(`Email: ${contact.email}`);
                console.log(`Phone: ${contact.phone}`);
                console.log(`Message: ${contact.message}`);
                console.log(`Created at: ${contact.createdAt}`);
            });
        } else {
            console.log("No contacts found in the database.");
        }
        
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    } catch (error) {
        console.error("Error checking database:", error);
    }
}

// Run the check
checkDatabase(); 