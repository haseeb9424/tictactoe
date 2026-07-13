console.log("Hello, World!");

const consoleBtn = document.getElementById('console-btn');

    // Simple event listener that triggers the console.log
    consoleBtn.addEventListener('click', () => {
        console.count("Counter Value");
    });



    const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // 3. Test the connection by writing a test document
  async function testFirebaseConnection() {
    console.log("Attempting to connect to Firebase...");
    try {
      // Tries to create a collection called "test" and insert a timestamp document
      await setDoc(doc(db, "connection_tests", "status"), {
        connectedAt: new Date(),
        message: "Hello from my local code playground!"
      });
      
      console.log("✅ Firebase Connection Successful! Data written to the cloud.");
    } catch (error) {
      console.error("❌ Firebase Connection Failed: ", error.message);
    }
  }

  // Run the test function immediately when the page loads
  testFirebaseConnection();
