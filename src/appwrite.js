// Import the Appwrite SDK
import { Client, Account, Databases, Storage, ID} from "appwrite";

// Initialize the Appwrite client
const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("6461d82f63ac2b3f1097");

// Initialize the Appwrite services
const db = new Databases(client, "646465df50494559619c");
const storage = new Storage(client);
const account = new Account(client);

// Function to register a new user
const register = async (displayName, email, password, file) => {
  try {
    // Create user
    const { $id: userId } = await account.create(
      ID.unique(),
      email,
      password,
      displayName
    )

    // Upload avatar
    const avatarFile = new File([file], `${displayName}_${Date.now()}`, {
      type: file.type,
    });
    const avatarCollectionId = "6464df365e3fdd90f4c9"; // Replace with your Appwrite avatar collection ID
    const { $id: fileId } = await storage.createFile(
      avatarCollectionId,
      avatarFile
    );

    // Update profile
    await account.update(userId, { displayName, photoURL: fileId });

    // Additional steps (create user on Firestore, create empty user chats, etc.)
    // ...

    console.log("User registered successfully");
  } catch (error) {
    console.error("Failed to register user:", error);
  }
};

// Function to login a user
const login = async (email, password) => {
  try {
    await account.createEmailSession(email, password);
    console.log("User logged in successfully");
  } catch (error) {
    console.error("Failed to log in:", error);
    throw error;
  }
};

// Function to logout a user
const logout = async () => {
  try {
    await account.deleteSession("current");
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Failed to log out:", error);
    throw error;
  }
};

// Function to create a new chat room
const createChatRoom = async (name) => {
  try {
    const { $id: chatRoomId } = await db.createDocument("chatRooms", "unique()", { name });
    console.log("Chat room created successfully");
    return chatRoomId;
  } catch (error) {
    console.error("Failed to create chat room:", error);
    throw error;
  }
};

// Function to send a message to a chat room
const sendMessage = async (chatRoomId, message) => {
  try {
    await db.createDocument("messages", "unique()", { chatRoomId, message });
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};

// Function to listen for new messages in a chat room
const listenForMessages = async (chatRoomId, callback) => {
  try {
    const { $id: subscriptionId } = await db.subscribe(
      ["collections.messages"],
      [`chatRoomId=${chatRoomId}`]
    );
    console.log("Listening for new messages");

    // Listen for new messages
    account.listSubscriptions().then((response) => {
      response.subscriptions.forEach((subscription) => {
        if (subscription.id === subscriptionId) {
          subscription.subscribe((message) => {
            callback(message);
          });
        }
      });
    });
  } catch (error) {
    console.error("Failed to listen for new messages:", error);
    throw error;
  }
};
// Export the client and functions
export {
  client,
  account,
  register,
  login,
  createChatRoom,
  sendMessage,
  listenForMessages,
  db,
  storage,
  logout,
};
