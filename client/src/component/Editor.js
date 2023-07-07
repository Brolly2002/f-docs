import {useEffect, useState} from 'react';

// quil library provides functionality for the text editor
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

import { Box } from '@mui/material';
import styled from "@emotion/styled";

import {io} from 'socket.io-client';

import { useParams } from 'react-router-dom';

const Component = styled.div `
    background: #f5f5f5;
`

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
];



// yha pe hm quill ki text-change API ki help lenge jo detect krta hai ki hmare edior mein kya changes hui hai
// jb pasge bar bar reload hota hai to content gaayb ho jata h usk liye hm mongodb use krenge

const Editor = () => {

    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();
    
    const {id} = useParams();

    useEffect(() => {
        // a new instance of quill editor is created
        const quillServer = new Quill('#container', {theme : 'snow', modules : {toolbar : toolbarOptions}});
        quillServer.disable();
        quillServer.setText('Loading the Document...');
        setQuill(quillServer);
    }, []);

    useEffect(() => {
        // a new socket connection is establishing 
        const socketServer = io('http://localhost:9000');
        setSocket(socketServer);
        // the returned function is a cleanup function that will be executed when the component is unmounted
        return () => {
            socketServer.disconnect();
        }
    }, []);

    // use of text-change api
    // sets up an event listener to the text-change event
    useEffect(() => {
        if(socket === null || quill === null) return;

        // source -> btata hai changes aa kha se rhe hai

        const handleChange = (delta, oldData, source) => {
            // delta represents the changes made to the editor content in quill's delta format
            // oldData represents the previous content of the editor
            if(source !== 'user') {
                return;
            }
            else {
                // sends the delta object to the server using the send-changes event
                // undefined bhi na ho
                socket && socket.emit('send-changes', delta);
            }
        }

        // undefined bhi na ho
        quill && quill.on('text-change', handleChange);

        return () => {
            // undefined bhi na ho
            quill && quill.off('text-change', handleChange);
        }

    }, [quill, socket]);


    // backend k changes ko broadcast krna hai front-end mein sbhi users ko
    // changes received from the socket connection
    useEffect(() => {
        if(socket === null || quill === null) return;
        const handleChange = (delta) => {
            // edit the quill editor content when the change is received
            quill.updateContents(delta);
        }

        // undefined bhi na ho
        socket && socket.on('receive-changes', handleChange);

        return () => {
            // undefined bhi na ho
            socket && socket.off('receive-changes', handleChange);
        }

    }, [quill, socket]);


    useEffect(() => {
        if(quill === null || socket === null) return;
        
        // document ko load krdo with empty data 
        socket && socket.once('load-document', document => {
            quill && quill.setContents(document);
            quill && quill.enable();
        });

        // send a request to the server to get the document with a specific id
        socket && socket.emit('get-document', id);


    }, [quill, socket, id]);    


    useEffect(() => {
        if(socket === null || quill === null) return;

        const interval = setInterval(() => {
            socket && socket.emit('save-document', quill.getContents());
        }, 2000);

        return () => {
            clearInterval(interval);
        }

    }, [socket, quill]);

    return(
        <Component>
            <Box className = 'container' id = 'container'> 
        
            </Box>
        </Component>
       
    )
}

export default Editor;