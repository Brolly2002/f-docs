import { Server} from 'socket.io';
import Connection from './database/db.js';
import { getDocument, updateDocument } from './DocumentController.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT =  process.env.PORT || 9000;


Connection();

// creating a new instance of socket.io server
const io = new Server(PORT, {
    // bypassing  CORS (cross origin resource sharing) [take security erorrs na ae]
    // CORS (Cross-Origin Resource Sharing) is a browser mechanism that allows web pages to make requests to resources on a different domain, relaxing the same-origin policy. 
    // It involves adding specific headers to server responses to control which origins are allowed access to the resources.
    cors: {
        origin: 'https://f-doc.netlify.app',
        methods: ['GET', 'POST']
    }
});

// it sets up an event listener for the connection event which is triggered when a client connects the server
io.on('connection', (socket) => {

    socket.on('get-document', async documentID => {   
        const document = await getDocument(documentID);
        // joins a socket to a specific room or channel identified by the documentID
        // this allows broadcasting changes to only those users having same ID
        socket.join(documentID);
        socket.emit('load-document', document.data);

        socket.on('send-changes', delta => {
            // jo changes aenge vo hme broadcast krna hoga, sbhi users ko dikhana hoga jo connected hai
            // breadcast ek particular document id pe honge
            console.log("mein chal rha hu");
            socket.broadcast.to(documentID).emit('receive-changes', delta);
        });

        socket.on('save-document', async data => {
            await updateDocument(documentID, data);
        });
    });

});

